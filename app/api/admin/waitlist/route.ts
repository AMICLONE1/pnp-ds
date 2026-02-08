import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

type WaitlistStatus = "pending" | "invited" | "converted";

/**
 * GET /api/admin/waitlist
 * Returns all waitlist entries with pagination, search, and filtering
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
            .from("waitlist")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply search filter
        if (search) {
            query = query.or(
                `email.ilike.%${search}%,name.ilike.%${search}%,phone.ilike.%${search}%`
            );
        }

        // Apply status filter
        if (status !== "all") {
            query = query.eq("status", status);
        }

        const { data: entries, error, count } = await query;

        if (error) {
            console.error("Error fetching waitlist:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch waitlist" },
                { status: 500 }
            );
        }

        // Get stats
        const { data: allEntries } = await adminClient
            .from("waitlist")
            .select("status");

        const stats = {
            total: allEntries?.length || 0,
            pending: allEntries?.filter((e) => e.status === "pending").length || 0,
            invited: allEntries?.filter((e) => e.status === "invited").length || 0,
            converted: allEntries?.filter((e) => e.status === "converted").length || 0,
        };

        return NextResponse.json({
            success: true,
            data: {
                entries: entries || [],
                stats,
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                },
            },
        });
    } catch (error) {
        console.error("Admin waitlist error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch waitlist" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/admin/waitlist
 * Update a waitlist entry's details or status
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
                { success: false, error: "Waitlist entry ID is required" },
                { status: 400 }
            );
        }

        // Whitelist allowed fields
        const allowedFields = ["name", "phone", "notes", "status", "source"];
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

        // Handle status changes
        if (sanitizedUpdates.status === "invited") {
            sanitizedUpdates["invited_at"] = new Date().toISOString();
        } else if (sanitizedUpdates.status === "converted") {
            sanitizedUpdates["converted_at"] = new Date().toISOString();
        }

        sanitizedUpdates["updated_at"] = new Date().toISOString();

        const adminClient = createAdminClient();
        const { data, error } = await adminClient
            .from("waitlist")
            .update(sanitizedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating waitlist entry:", error);
            return NextResponse.json(
                { success: false, error: "Failed to update waitlist entry" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Admin waitlist update error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update waitlist entry" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/waitlist
 * Delete a waitlist entry
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
                { success: false, error: "Waitlist entry ID is required" },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();
        const { error } = await adminClient.from("waitlist").delete().eq("id", id);

        if (error) {
            console.error("Error deleting waitlist entry:", error);
            return NextResponse.json(
                { success: false, error: "Failed to delete waitlist entry" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "Entry deleted" });
    } catch (error) {
        console.error("Admin waitlist delete error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete waitlist entry" },
            { status: 500 }
        );
    }
}
