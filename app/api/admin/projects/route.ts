import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

type ProjectStatus = "DRAFT" | "ACTIVE" | "MAINTENANCE" | "RETIRED";

interface ProjectFilters {
    search?: string;
    status?: ProjectStatus | "all";
    page?: number;
    limit?: number;
}

/**
 * GET /api/admin/projects
 * Returns all projects with capacity allocation data for admin management
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyAdmin();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const adminClient = createAdminClient();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const offset = (page - 1) * limit;

        let query = adminClient
            .from("projects")
            .select(
                "id, spv_id, name, total_kw, rate_per_kwh, location, state, status, description, created_at, updated_at, deleted_at",
                { count: "exact" }
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply search filter
        if (search) {
            query = query.or(
                `name.ilike.%${search}%,location.ilike.%${search}%,spv_id.ilike.%${search}%,state.ilike.%${search}%`
            );
        }

        // Apply status filter
        if (status !== "all") {
            query = query.eq("status", status);
        }

        // Exclude soft-deleted projects by default
        query = query.is("deleted_at", null);

        const { data: projects, error, count } = await query;

        if (error) {
            console.error("Error fetching projects:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch projects" },
                { status: 500 }
            );
        }

        // Get capacity block statistics for each project
        const projectIds = (projects || []).map((p) => p.id);

        // Get allocated and available capacity for each project
        const { data: capacityBlocks } = await adminClient
            .from("capacity_blocks")
            .select("id, project_id, kw, status")
            .in("project_id", projectIds.length > 0 ? projectIds : ["none"]);

        // Aggregate capacity per project
        const capacityMap = new Map<
            string,
            { allocated: number; available: number; total: number }
        >();

        (capacityBlocks || []).forEach((block) => {
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

        // Get allocation count per project
        const { data: allocations } = await adminClient
            .from("allocations")
            .select("capacity_block_id")
            .in(
                "capacity_block_id",
                (capacityBlocks || []).map((b) => b.id).filter(Boolean)
            );

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
 * Create a new project
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyAdmin();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const body = await request.json();
        const { spv_id, name, total_kw, rate_per_kwh, location, state, description, status } = body;

        // Validate required fields
        if (!spv_id || !name || !total_kw || !rate_per_kwh || !location || !state) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: spv_id, name, total_kw, rate_per_kwh, location, state" },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();

        // Check if SPV ID already exists
        const { data: existingProject } = await adminClient
            .from("projects")
            .select("id")
            .eq("spv_id", spv_id)
            .single();

        if (existingProject) {
            return NextResponse.json(
                { success: false, error: "A project with this SPV ID already exists" },
                { status: 400 }
            );
        }

        const { data, error } = await adminClient
            .from("projects")
            .insert({
                spv_id,
                name,
                total_kw: Number(total_kw),
                rate_per_kwh: Number(rate_per_kwh),
                location,
                state,
                description: description || null,
                status: status || "DRAFT",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating project:", error);
            return NextResponse.json(
                { success: false, error: "Failed to create project" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Admin project create error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create project" },
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

        // Whitelist allowed fields
        const allowedFields = [
            "name",
            "description",
            "location",
            "state",
            "total_kw",
            "rate_per_kwh",
            "status",
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

        // Convert numeric fields
        if (sanitizedUpdates.total_kw) {
            sanitizedUpdates.total_kw = Number(sanitizedUpdates.total_kw);
        }
        if (sanitizedUpdates.rate_per_kwh) {
            sanitizedUpdates.rate_per_kwh = Number(sanitizedUpdates.rate_per_kwh);
        }

        sanitizedUpdates["updated_at"] = new Date().toISOString();

        const adminClient = createAdminClient();
        const { data, error } = await adminClient
            .from("projects")
            .update(sanitizedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating project:", error);
            return NextResponse.json(
                { success: false, error: "Failed to update project" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Admin project update error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update project" },
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

        // Check if project has active allocations
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

        const { error } = await adminClient
            .from("projects")
            .update({
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                status: "RETIRED",
            })
            .eq("id", id);

        if (error) {
            console.error("Error deleting project:", error);
            return NextResponse.json(
                { success: false, error: "Failed to delete project" },
                { status: 500 }
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
