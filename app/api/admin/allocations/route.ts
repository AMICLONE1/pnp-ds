import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSearchTerm } from "@/lib/security/inputSanitizer";

/**
 * GET /api/admin/allocations
 * Cross-entity view: every row = one allocation, linking user → capacity_block → project → host.
 * This is the single page where admins can see "who booked credits from which plant".
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
    const projectFilter = searchParams.get("project_id") || "all";
    const hostFilter = searchParams.get("host_id") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = (page - 1) * limit;

    // Fetch allocations first — they're the grain of this view
    let allocationsQuery = adminClient
      .from("allocations")
      .select("id, user_id, capacity_block_id, capacity_kw, payment_id, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: allocationsRaw, error: allocationsError, count } = await allocationsQuery;

    if (allocationsError) {
      console.error("Error fetching allocations:", allocationsError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch allocations" },
        { status: 500 }
      );
    }

    const allocations = allocationsRaw || [];

    if (allocations.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          allocations: [],
          stats: {
            totalAllocations: 0,
            totalCapacityKw: 0,
            uniqueUsers: 0,
            uniquePlants: 0,
          },
          pagination: { page, limit, total: 0, totalPages: 0 },
        },
      });
    }

    const userIds = Array.from(new Set(allocations.map((a) => a.user_id)));
    const blockIds = Array.from(new Set(allocations.map((a) => a.capacity_block_id)));

    const [usersRes, blocksRes] = await Promise.all([
      adminClient
        .from("users")
        .select("id, name, email, phone, kyc_status")
        .in("id", userIds),
      adminClient
        .from("capacity_blocks")
        .select("id, project_id, kw, status")
        .in("id", blockIds),
    ]);

    const blocks = blocksRes.data || [];
    const projectIds = Array.from(
      new Set(blocks.map((b: any) => b.project_id))
    );

    const { data: projects } = projectIds.length
      ? await adminClient
          .from("projects")
          .select("id, name, spv_id, host_id, location, state, rate_per_kwh")
          .in("id", projectIds)
      : { data: [] as any[] };

    const hostIds = Array.from(
      new Set((projects || []).map((p: any) => p.host_id).filter(Boolean))
    );

    const { data: hosts } = hostIds.length
      ? await adminClient
          .from("users")
          .select("id, name, email")
          .in("id", hostIds)
      : { data: [] as any[] };

    const userMap = new Map((usersRes.data || []).map((u: any) => [u.id, u]));
    const blockMap = new Map(blocks.map((b: any) => [b.id, b]));
    const projectMap = new Map((projects || []).map((p: any) => [p.id, p]));
    const hostMap = new Map((hosts || []).map((h: any) => [h.id, h]));

    let enriched = allocations.map((a) => {
      const block = blockMap.get(a.capacity_block_id);
      const project = block ? projectMap.get((block as any).project_id) : null;
      const host = project ? hostMap.get((project as any).host_id) : null;
      const user = userMap.get(a.user_id);
      return {
        id: a.id,
        capacity_kw: Number(a.capacity_kw),
        allocated_at: a.created_at,
        user: user || { id: a.user_id, name: "Unknown", email: null },
        project: project
          ? {
              id: (project as any).id,
              name: (project as any).name,
              spv_id: (project as any).spv_id,
              location: (project as any).location,
              state: (project as any).state,
              rate_per_kwh: (project as any).rate_per_kwh,
            }
          : null,
        host: host
          ? { id: (host as any).id, name: (host as any).name, email: (host as any).email }
          : null,
        block_status: block ? (block as any).status : null,
      };
    });

    // Apply post-join filters
    if (projectFilter !== "all") {
      enriched = enriched.filter((e) => e.project?.id === projectFilter);
    }
    if (hostFilter !== "all") {
      enriched = enriched.filter((e) => e.host?.id === hostFilter);
    }
    if (search) {
      const lower = search.toLowerCase();
      enriched = enriched.filter(
        (e) =>
          (e.user?.name || "").toLowerCase().includes(lower) ||
          (e.user?.email || "").toLowerCase().includes(lower) ||
          (e.project?.name || "").toLowerCase().includes(lower) ||
          (e.host?.name || "").toLowerCase().includes(lower)
      );
    }

    const totalCapacityKw = enriched.reduce((s, e) => s + e.capacity_kw, 0);
    const uniqueUsers = new Set(enriched.map((e) => e.user?.id)).size;
    const uniquePlants = new Set(enriched.map((e) => e.project?.id)).size;

    return NextResponse.json({
      success: true,
      data: {
        allocations: enriched,
        stats: {
          totalAllocations: enriched.length,
          totalCapacityKw,
          uniqueUsers,
          uniquePlants,
        },
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin allocations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch allocations" },
      { status: 500 }
    );
  }
}
