import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/users
 * Returns all users with their allocation data for admin management
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
    const role = searchParams.get("role") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    let query = adminClient
      .from("users")
      .select(
        "id, name, email, phone, role, kyc_status, state, discom, created_at, updated_at, deleted_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply search filter
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    // Apply status filter
    if (status === "active") {
      query = query.is("deleted_at", null);
    } else if (status === "deleted") {
      query = query.not("deleted_at", "is", null);
    }

    // Apply role filter
    if (role === "ADMIN") {
      query = query.eq("role", "ADMIN");
    } else if (role === "USER") {
      query = query.eq("role", "USER");
    }

    const { data: users, error, count } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    // Get allocation counts for each user
    const userIds = (users || []).map((u) => u.id);
    const { data: allocations } = await adminClient
      .from("allocations")
      .select("user_id, capacity_kw")
      .in("user_id", userIds.length > 0 ? userIds : ["none"]);

    // Aggregate allocations per user
    const allocationMap = new Map<
      string,
      { count: number; totalCapacity: number }
    >();
    (allocations || []).forEach((a) => {
      const existing = allocationMap.get(a.user_id) || {
        count: 0,
        totalCapacity: 0,
      };
      allocationMap.set(a.user_id, {
        count: existing.count + 1,
        totalCapacity: existing.totalCapacity + Number(a.capacity_kw),
      });
    });

    const usersWithAllocations = (users || []).map((user) => ({
      ...user,
      allocations: allocationMap.get(user.id) || {
        count: 0,
        totalCapacity: 0,
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithAllocations,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users
 * Update a user's profile (name, email, phone, role, kyc_status)
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
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Whitelist allowed fields
    const allowedFields = [
      "name",
      "email",
      "phone",
      "role",
      "kyc_status",
      "state",
      "discom",
    ];
    const sanitizedUpdates: Record<string, string> = {};
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

    sanitizedUpdates["updated_at"] = new Date().toISOString();

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("users")
      .update(sanitizedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Soft-delete a user by setting deleted_at
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
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (authResult.user && id === authResult.user.id) {
      return NextResponse.json(
        { success: false, error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("users")
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
