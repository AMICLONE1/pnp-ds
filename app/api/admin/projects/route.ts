import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { buildAgreementNumber, createCapacityBlocks, provisionHostAccount, seedGenerationSnapshots } from "@/lib/admin/provisioning";
import type { ProvisionedHostAccount } from "@/lib/admin/provisioning";
import { calculatePpaBilling } from "@/lib/host/billing";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSearchTerm } from "@/lib/security/inputSanitizer";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";
import { uploadProjectDocument } from "@/lib/admin/projectDocuments";
import type { SupabaseClient } from "@supabase/supabase-js";

type ProjectStatus = "DRAFT" | "ACTIVE" | "MAINTENANCE" | "RETIRED";

interface ProjectHost {
    id: string;
    business_name: string | null;
    contact_name: string | null;
    contact_email: string | null;
}

interface PpaSummary {
    id: string;
    agreement_number: string;
    status: string;
}

/**
 * Normalise trillectric_site_ids input into a deduped TEXT[] of non-empty
 * trimmed strings. Accepts: an array, a JSON-encoded array string, or a
 * comma-separated string — all of which the admin form might send.
 */
function parseSiteIds(input: unknown): string[] {
    const collect = (val: unknown): string[] => {
        if (val == null) return [];
        if (Array.isArray(val)) return val.flatMap(collect);
        const s = String(val).trim();
        if (!s) return [];
        if (s.startsWith("[")) {
            try {
                const parsed = JSON.parse(s);
                if (Array.isArray(parsed)) return parsed.flatMap(collect);
            } catch {
                // fall through — treat as CSV
            }
        }
        return s.split(",").map((p) => p.trim()).filter(Boolean);
    };
    return Array.from(new Set(collect(input)));
}

async function supportsProjectLoggerSerial(adminClient: any) {
    const { error } = await adminClient.from("projects").select("data_logger_serial_id").limit(1);

    if (!error) {
        return true;
    }

    if (error.code === "42703") {
        return false;
    }

    throw error;
}

// PPA + insurance uploads now live in @/lib/admin/projectDocuments. Both are
// PDF / Word, max 10 MB; PPA goes to ppa-documents bucket, insurance goes
// to project-documents.

/**
 * GET /api/admin/projects
 * Returns all projects with host, agreement, and capacity data for admin management
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyAdmin();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const adminClient = createAdminClient();

        const { searchParams } = new URL(request.url);
        const search = sanitizeSearchTerm(searchParams.get("search") || "");
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const offset = (page - 1) * limit;
        const loggerSerialSupported = await supportsProjectLoggerSerial(adminClient);

        if (!["all", "DRAFT", "ACTIVE", "MAINTENANCE", "RETIRED"].includes(status)) {
            return NextResponse.json(
                { success: false, error: "Invalid status filter" },
                { status: 400 }
            );
        }

        // Try to include logger_api_key in select; will be handled gracefully if column doesn't exist yet
        const projectSelectColumns = loggerSerialSupported
            ? "id, spv_id, name, total_kw, rate_per_kwh, location, state, status, description, created_at, updated_at, deleted_at, host_id, data_logger_serial_id, logger_api_key, trillectric_site_ids"
            : "id, spv_id, name, total_kw, rate_per_kwh, location, state, status, description, created_at, updated_at, deleted_at, host_id, logger_api_key, trillectric_site_ids";

        let query = adminClient
            .from("projects")
            .select(projectSelectColumns, { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (search) {
            const searchConditions = loggerSerialSupported
                ? `name.ilike.%${search}%,location.ilike.%${search}%,spv_id.ilike.%${search}%,state.ilike.%${search}%,data_logger_serial_id.ilike.%${search}%,logger_api_key.ilike.%${search}%`
                : `name.ilike.%${search}%,location.ilike.%${search}%,spv_id.ilike.%${search}%,state.ilike.%${search}%,logger_api_key.ilike.%${search}%`;

            query = query.or(searchConditions);
        }

        if (status !== "all") {
            query = query.eq("status", status);
        }

        query = query.is("deleted_at", null);

        const { data: projectsRaw, error, count } = await query as any;
        const projects = (projectsRaw || []) as Array<Record<string, any>>;

        if (error) {
            console.error("Error fetching projects:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch projects" },
                { status: 500 }
            );
        }

        const projectIds = (projects || []).map((project) => project.id);
        const hostIds = Array.from(new Set((projects || []).map((project) => project.host_id).filter(Boolean)));

        // Build queries conditionally to avoid invalid UUID errors
        let capacityQuery = adminClient.from("capacity_blocks").select("id, project_id, kw, status");
        // Query both users and hosts tables since host_id may reference either
        let hostsQuery = adminClient.from("hosts").select("id, user_id, business_name, contact_name, contact_email");
        let agreementsQuery = adminClient.from("ppa_agreements").select("id, project_id, agreement_number, status");

        // Only add filters if we have IDs
        if (projectIds.length > 0) {
            capacityQuery = capacityQuery.in("project_id", projectIds);
        } else {
            // Return empty result if no projects
            capacityQuery = capacityQuery.eq("project_id", "00000000-0000-0000-0000-000000000000");
        }

        if (hostIds.length > 0) {
            // host_id in projects may be either hosts.id or hosts.user_id
            hostsQuery = hostsQuery.or(
                hostIds.map((hid) => `id.eq.${hid},user_id.eq.${hid}`).join(",")
            );
        } else {
            // Return empty result if no hosts
            hostsQuery = hostsQuery.eq("id", "00000000-0000-0000-0000-000000000000");
        }

        if (projectIds.length > 0) {
            agreementsQuery = agreementsQuery.in("project_id", projectIds);
        } else {
            // Return empty result if no projects
            agreementsQuery = agreementsQuery.eq("project_id", "00000000-0000-0000-0000-000000000000");
        }

        const [capacityResult, hostsResult, agreementsResult] = await Promise.all([
            capacityQuery,
            hostsQuery,
            agreementsQuery,
        ]);

        if (capacityResult.error) {
            console.error("Capacity blocks error:", capacityResult.error);
            throw new Error(`Failed to fetch capacity blocks: ${capacityResult.error.message}`);
        }
        if (hostsResult.error) {
            console.error("Hosts query error:", hostsResult.error);
            throw new Error(`Failed to fetch hosts: ${hostsResult.error.message}`);
        }
        if (agreementsResult.error) {
            console.error("Agreements query error:", agreementsResult.error);
            throw new Error(`Failed to fetch agreements: ${agreementsResult.error.message}`);
        }

        const capacityMap = new Map<string, { allocated: number; available: number; total: number }>();
        (capacityResult.data || []).forEach((block) => {
            const existing = capacityMap.get(block.project_id) || {
                allocated: 0,
                available: 0,
                total: 0,
            };
            const kw = Number(block.kw) || 0;
            capacityMap.set(block.project_id, {
                allocated: existing.allocated + (block.status === "ALLOCATED" ? kw : 0),
                available: existing.available + (block.status === "AVAILABLE" ? kw : 0),
                total: existing.total + kw,
            });
        });

        // Build host map indexed by both hosts.id and hosts.user_id
        // so we can resolve project.host_id regardless of which ID was stored
        const hostMap = new Map<string, ProjectHost>();
        (hostsResult.data || []).forEach((host: any) => {
            const entry: ProjectHost = {
                id: host.id,
                business_name: host.business_name,
                contact_name: host.contact_name,
                contact_email: host.contact_email,
            };
            hostMap.set(host.id, entry);
            if (host.user_id) hostMap.set(host.user_id, entry);
        });

        const agreementMap = new Map<string, PpaSummary>();
        (agreementsResult.data || []).forEach((agreement) => {
            agreementMap.set(agreement.project_id, agreement as PpaSummary);
        });

        const projectsWithStats = (projects || []).map((project) => {
            const capacity = capacityMap.get(project.id) || {
                allocated: 0,
                available: 0,
                total: 0,
            };
            const utilizationPercent =
                project.total_kw > 0
                    ? Math.round((capacity.allocated / project.total_kw) * 100)
                    : 0;

            return {
                ...project,
                host: project.host_id ? hostMap.get(project.host_id) || null : null,
                agreement: agreementMap.get(project.id) || null,
                capacity: {
                    allocated: capacity.allocated,
                    available: capacity.available,
                    utilization: utilizationPercent,
                },
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                projects: projectsWithStats,
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                },
            },
        });
    } catch (error) {
        console.error("Admin projects error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/projects
 * Create a new project, host, PPA agreement, capacity blocks, and seed generation history.
 * Accepts multipart/form-data with optional PPA PDF file.
 */
export async function POST(request: NextRequest) {
    let createdProjectId: string | null = null;
    let createdHostAccount: ProvisionedHostAccount | null = null;
    let uploadedPdfPath: string | null = null;
    let uploadedInsurancePath: string | null = null;

    try {
        const authResult = await verifyAdmin();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const formData = await request.formData();
        const spv_id = formData.get("spv_id") as string;
        const name = formData.get("name") as string;
        const total_kw = formData.get("total_kw") as string;
        const rate_per_kwh = formData.get("rate_per_kwh") as string;
        const location = formData.get("location") as string;
        const state = formData.get("state") as string;
        const description = formData.get("description") as string || null;
        const status = formData.get("status") as string || "DRAFT";
        const logger_api_key = formData.get("logger_api_key") as string || null;
        // Trillectric site IDs are the single source of truth for telemetry.
        // Accept CSV, JSON array, or repeated form fields.
        const rawSiteIds = formData.getAll("trillectric_site_ids");
        const trillectric_site_ids: string[] = parseSiteIds(rawSiteIds);
        const host_business_name = formData.get("host_business_name") as string;
        const host_contact_name = formData.get("host_contact_name") as string;
        const host_contact_email = formData.get("host_contact_email") as string;
        const host_contact_phone = formData.get("host_contact_phone") as string;
        const host_password = formData.get("host_password") as string;
        const ppaDocument = formData.get("ppa_document") as File | null;
        const insuranceDocument = formData.get("insurance_document") as File | null;

        if (
            !spv_id ||
            !name ||
            !total_kw ||
            !rate_per_kwh ||
            !location ||
            !state ||
            trillectric_site_ids.length === 0 ||
            !host_business_name ||
            !host_contact_name ||
            !host_contact_email ||
            !host_contact_phone ||
            !host_password
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "spv_id, name, total_kw, rate_per_kwh, location, state, trillectric_site_ids (at least one), host_business_name, host_contact_name, host_contact_email, host_contact_phone, and host_password are required",
                },
                { status: 400 }
            );
        }

        if (String(host_password).trim().length < 12) {
            return NextResponse.json(
                { success: false, error: "Initial host password must contain at least 12 characters" },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();
        const normalizedSpvId = String(spv_id).trim();
        // Legacy data_logger_serial_id is derived from the first site ID so the
        // column (still NOT NULL in older migrations) stays populated and the
        // legacy unique-index check continues to catch duplicates across plants.
        const normalizedLoggerSerial = trillectric_site_ids[0];
        const loggerSerialSupported = await supportsProjectLoggerSerial(adminClient);

        const { data: existingProject } = await adminClient
            .from("projects")
            .select("id")
            .eq("spv_id", normalizedSpvId)
            .limit(1)
            .maybeSingle();

        if (existingProject) {
            return NextResponse.json(
                { success: false, error: "A project with this SPV ID already exists" },
                { status: 400 }
            );
        }

        if (loggerSerialSupported) {
            const { data: existingLogger } = await adminClient
                .from("projects")
                .select("id")
                .eq("data_logger_serial_id", normalizedLoggerSerial)
                .limit(1)
                .maybeSingle();

            if (existingLogger) {
                return NextResponse.json(
                    { success: false, error: "This data logger serial ID is already linked to another project" },
                    { status: 400 }
                );
            }
        }

        createdHostAccount = await provisionHostAccount(
            adminClient,
            {
                businessName: String(host_business_name),
                contactName: String(host_contact_name),
                contactEmail: String(host_contact_email),
                contactPhone: String(host_contact_phone),
                password: String(host_password),
            },
            authResult.user?.id
        );

        // Upload PPA + insurance documents if provided. Both are optional —
        // admin can backfill them later via the project edit page.
        if (ppaDocument) {
            try {
                uploadedPdfPath = await uploadProjectDocument(adminClient, {
                    kind: "ppa",
                    file: ppaDocument,
                    hostId: createdHostAccount.hostId,
                    spvId: normalizedSpvId,
                });
            } catch (uploadErr) {
                throw new Error(uploadErr instanceof Error ? uploadErr.message : "PPA upload failed");
            }
        }

        if (insuranceDocument) {
            try {
                uploadedInsurancePath = await uploadProjectDocument(adminClient, {
                    kind: "insurance",
                    file: insuranceDocument,
                    hostId: createdHostAccount.hostId,
                    spvId: normalizedSpvId,
                });
            } catch (uploadErr) {
                throw new Error(uploadErr instanceof Error ? uploadErr.message : "Insurance upload failed");
            }
        }

        const now = new Date().toISOString();
        const projectInsert: Record<string, any> = {
                spv_id: normalizedSpvId,
                name: String(name).trim(),
                total_kw: Number(total_kw),
                rate_per_kwh: Number(rate_per_kwh),
                location: String(location).trim(),
                state: String(state).trim(),
                description: description ? String(description).trim() : null,
                status: status || "DRAFT",
                host_id: createdHostAccount.hostId,
                created_at: now,
                updated_at: now,
                logger_api_key: logger_api_key ? String(logger_api_key).trim() : null,
                trillectric_site_ids,
                insurance_document_path: uploadedInsurancePath,
                insurance_uploaded_at: uploadedInsurancePath ? now : null,
        };

        if (loggerSerialSupported) {
            projectInsert.data_logger_serial_id = normalizedLoggerSerial;
        }

        const projectCreateSelectColumns = loggerSerialSupported
            ? "id, spv_id, name, total_kw, rate_per_kwh, location, state, status, description, host_id, data_logger_serial_id, trillectric_site_ids, created_at, updated_at"
            : "id, spv_id, name, total_kw, rate_per_kwh, location, state, status, description, host_id, trillectric_site_ids, created_at, updated_at";

        const { data: projectRaw, error: projectError } = await adminClient
            .from("projects")
            .insert(projectInsert)
            .select(projectCreateSelectColumns)
            .single();

        const project = projectRaw as Record<string, any> | null;

        if (projectError || !project) {
            throw new Error(projectError?.message || "Failed to create project");
        }

        createdProjectId = project.id;

        await createCapacityBlocks(adminClient, project.id, Number(total_kw));
        const seededGenerations = await seedGenerationSnapshots(
            adminClient,
            project.id,
            Number(total_kw),
            authResult.user?.id,
            normalizedLoggerSerial
        );

        const startDate = new Date();
        const ppaEndDate = new Date(startDate);
        ppaEndDate.setFullYear(ppaEndDate.getFullYear() + 10);

        const { data: agreement, error: agreementError } = await adminClient
            .from("ppa_agreements")
            .insert({
                host_id: createdHostAccount.hostId,
                project_id: project.id,
                agreement_number: buildAgreementNumber(normalizedSpvId, String(name).trim()),
                start_date: startDate.toISOString().split('T')[0],
                end_date: ppaEndDate.toISOString().split('T')[0],
                duration_years: 10,
                rate_per_kwh: Number(rate_per_kwh),
                rate_escalation_percent: 3.0,
                contracted_capacity_kw: Number(total_kw),
                payment_due_day: 10,
                status: "ACTIVE",
                agreement_document_path: uploadedPdfPath,
                agreement_document_uploaded_at: uploadedPdfPath ? now : null,
            })
            .select("id, agreement_number, status")
            .single();

        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 12);

        if (agreementError || !agreement) {
            throw new Error(agreementError?.message || "Failed to create PPA agreement");
        }

        const seededBillingPeriod = seededGenerations.at(-1) || null;
        let seededPayment: Record<string, any> | null = null;

        if (seededBillingPeriod) {
            const billing = calculatePpaBilling({
                generationKwh: Number(seededBillingPeriod.kwh),
                ratePerKwh: Number(rate_per_kwh),
                billingMonth: Number(seededBillingPeriod.month),
                billingYear: Number(seededBillingPeriod.year),
                hostId: createdHostAccount.hostId,
                sequence: 1,
            });

            const dueDate = new Date(
                Number(seededBillingPeriod.year),
                Number(seededBillingPeriod.month) - 1,
                10,
                18,
                0,
                0,
                0
            );

            const { data: hostPaymentRow, error: hostPaymentError } = await adminClient
                .from("host_payments")
                .insert({
                    host_id: createdHostAccount.hostId,
                    ppa_agreement_id: agreement.id,
                    invoice_id: null,
                    billing_month: Number(seededBillingPeriod.month),
                    billing_year: Number(seededBillingPeriod.year),
                    generation_kwh: Number(seededBillingPeriod.kwh),
                    rate_per_kwh: Number(rate_per_kwh),
                    base_amount: billing.baseAmount,
                    adjustments: billing.adjustments,
                    late_fee: billing.lateFee,
                    total_amount: billing.totalDue,
                    status: "PENDING",
                    due_date: dueDate.toISOString().slice(0, 10),
                    payment_method: null,
                    payment_reference: null,
                    notes: `Seeded from ${normalizedLoggerSerial}`,
                })
                .select("id, billing_month, billing_year, generation_kwh, total_amount, status")
                .single();

            if (!hostPaymentError && hostPaymentRow) {
                seededPayment = hostPaymentRow;
            }
        }

        // Auto-connect: fire-and-forget initial Trillectric sync for the new project.
        // Any failure here does not block project creation — the next scheduled cron
        // run will pick up this project automatically since the sync endpoint queries
        // all active projects with data_logger_serial_id.
        if (normalizedLoggerSerial) {
            const appUrl =
                process.env.NEXT_PUBLIC_APP_URL ||
                process.env.VERCEL_URL ||
                "http://localhost:3000";
            const baseUrl = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`;
            const cronSecret = process.env.CRON_SECRET || "";
            fetch(`${baseUrl}/api/cron/trillectric-sync?projectId=${project.id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${cronSecret}` },
            }).catch((err) => {
                console.warn(
                    `[admin/projects] initial sync trigger failed for ${project.id}:`,
                    err instanceof Error ? err.message : err
                );
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                project,
                host: {
                    id: createdHostAccount.hostId,
                    auth_user_id: createdHostAccount.authUserId,
                    business_name: createdHostAccount.businessName,
                    contact_name: createdHostAccount.contactName,
                    contact_email: createdHostAccount.contactEmail,
                    contact_phone: createdHostAccount.contactPhone,
                },
                agreement,
                temporary_password: createdHostAccount.temporaryPassword,
                seeded_payment: seededPayment,
            },
        });
    } catch (error) {
        console.error("Admin project create error:", error);

        // Clean up uploaded PDF if it exists
        if (uploadedPdfPath) {
            const cleanupClient = createAdminClient();
            await cleanupClient.storage.from("ppa-documents").remove([uploadedPdfPath]);
        }

        if (createdProjectId) {
            const cleanupClient = createAdminClient();
            await cleanupClient.from("ppa_agreements").delete().eq("project_id", createdProjectId);
            await cleanupClient.from("generations").delete().eq("project_id", createdProjectId);
            await cleanupClient.from("capacity_blocks").delete().eq("project_id", createdProjectId);
            await cleanupClient.from("projects").delete().eq("id", createdProjectId);
        }

        if (createdHostAccount) {
            const cleanupClient = createAdminClient();
            await cleanupClient.from("users").delete().eq("id", createdHostAccount.authUserId);
            await cleanupClient.auth.admin.deleteUser(createdHostAccount.authUserId);
        }

        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to create project" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/admin/projects
 * Update a project's details
 */
export async function PUT(request: NextRequest) {
    try {
        const authResult = await verifyAdmin();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Project ID is required" },
                { status: 400 }
            );
        }

        const allowedFields = [
            "name",
            "description",
            "location",
            "state",
            "total_kw",
            "rate_per_kwh",
            "status",
            "host_id",
            "data_logger_serial_id",
            "logger_api_key",
            "trillectric_site_ids",
        ];
        const sanitizedUpdates: Record<string, any> = {};
        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                sanitizedUpdates[key] = updates[key];
            }
        }

        if (Object.keys(sanitizedUpdates).length === 0) {
            return NextResponse.json(
                { success: false, error: "No valid fields to update" },
                { status: 400 }
            );
        }

        if (sanitizedUpdates.total_kw !== undefined) {
            sanitizedUpdates.total_kw = Number(sanitizedUpdates.total_kw);
        }
        if (sanitizedUpdates.rate_per_kwh !== undefined) {
            sanitizedUpdates.rate_per_kwh = Number(sanitizedUpdates.rate_per_kwh);
        }
        if (sanitizedUpdates.data_logger_serial_id !== undefined) {
            sanitizedUpdates.data_logger_serial_id = String(sanitizedUpdates.data_logger_serial_id).trim().toUpperCase();
        }
        if (sanitizedUpdates.trillectric_site_ids !== undefined) {
            sanitizedUpdates.trillectric_site_ids = parseSiteIds(sanitizedUpdates.trillectric_site_ids);
        }

        const adminClient = createAdminClient();
        const loggerSerialSupported = await supportsProjectLoggerSerial(adminClient);

        if (!loggerSerialSupported) {
            delete sanitizedUpdates.data_logger_serial_id;
        }

        sanitizedUpdates.updated_at = new Date().toISOString();

        const { data, error } = await adminClient
            .from("projects")
            .update(sanitizedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating project:", error);
            return NextResponse.json(
                { success: false, message: "Failed to update project" },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Admin project update error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to update project" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/projects
 * Soft-delete a project by setting deleted_at
 */
export async function DELETE(request: NextRequest) {
    try {
        const authResult = await verifyAdmin();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Project ID is required" },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();

        const { data: capacityBlocks } = await adminClient
            .from("capacity_blocks")
            .select("id, status")
            .eq("project_id", id)
            .eq("status", "ALLOCATED");

        if (capacityBlocks && capacityBlocks.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Cannot delete project with active allocations. Please transfer or remove allocations first."
                },
                { status: 400 }
            );
        }

        const { data, error } = await adminClient
            .from("projects")
            .update({
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                status: "RETIRED",
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error deleting project:", error);
            return NextResponse.json(
                { success: false, error: error.message || "Failed to delete project" },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Project deleted" });
    } catch (error) {
        console.error("Admin project delete error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
