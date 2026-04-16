import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/hosts/[id]
 * [id] can be the hosts.id OR users.id — we resolve both.
 * Returns host profile from `hosts` table + user + projects + PPAs + bookers + generation.
 *
 * PUT /api/admin/hosts/[id]
 * Update host profile fields (business_name, contact info, etc.)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdmin();
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const adminClient = createAdminClient();
    const { id } = await params;

    // Try to find host by hosts.id first, then by hosts.user_id
    let { data: hostRow } = await adminClient
      .from("hosts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!hostRow) {
      const { data: byUser } = await adminClient
        .from("hosts")
        .select("*")
        .eq("user_id", id)
        .maybeSingle();
      hostRow = byUser;
    }

    if (!hostRow) {
      return NextResponse.json({ success: false, error: "Host not found" }, { status: 404 });
    }

    // Get the linked user record
    const { data: user } = await adminClient
      .from("users")
      .select("*")
      .eq("id", hostRow.user_id)
      .single();

    const userId = hostRow.user_id;

    // Projects owned by this host
    // Query by both users.id and hosts.id to handle legacy data where host_id was set to hosts.id
    const hostTableId = hostRow.id;
    const [projectsByUser, projectsByHost] = await Promise.all([
      adminClient
        .from("projects")
        .select("id, spv_id, name, total_kw, rate_per_kwh, location, state, status, description, created_at, data_logger_serial_id")
        .eq("host_id", userId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
      userId !== hostTableId
        ? adminClient
            .from("projects")
            .select("id, spv_id, name, total_kw, rate_per_kwh, location, state, status, description, created_at, data_logger_serial_id")
            .eq("host_id", hostTableId)
            .is("deleted_at", null)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] as any[] }),
    ]);

    // Merge and deduplicate projects
    const seenProjectIds = new Set<string>();
    const projects = [...(projectsByUser.data || []), ...(projectsByHost.data || [])].filter((p) => {
      if (seenProjectIds.has(p.id)) return false;
      seenProjectIds.add(p.id);
      return true;
    });

    const projectIds = projects.map((p) => p.id);

    // Also query agreements by both IDs
    const allHostIds = Array.from(new Set([userId, hostTableId]));
    const [agreementsRes, blocksRes, generationsRes] = await Promise.all([
      adminClient
        .from("ppa_agreements")
        .select("*")
        .in("host_id", allHostIds)
        .order("created_at", { ascending: false }),
      projectIds.length
        ? adminClient.from("capacity_blocks").select("id, project_id, kw, status").in("project_id", projectIds)
        : Promise.resolve({ data: [] as any[] }),
      projectIds.length
        ? adminClient.from("generations").select("project_id, year, month, kwh, validated").in("project_id", projectIds).order("year", { ascending: false }).order("month", { ascending: false })
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const agreements = agreementsRes.data || [];
    const blocks = blocksRes.data || [];
    const generations = generationsRes.data || [];

    // Find bookers from allocations on this host's blocks
    const blockIds = blocks.map((b: any) => b.id);
    const { data: allAllocations } = blockIds.length
      ? await adminClient.from("allocations").select("id, user_id, capacity_block_id, capacity_kw, created_at").in("capacity_block_id", blockIds)
      : { data: [] as any[] };

    const hostAllocations = allAllocations || [];
    const bookerIds = Array.from(new Set(hostAllocations.map((a: any) => a.user_id)));

    const { data: bookers } = bookerIds.length
      ? await adminClient.from("users").select("id, name, email, phone, kyc_status").in("id", bookerIds)
      : { data: [] as any[] };

    const bookerMap = new Map((bookers || []).map((u: any) => [u.id, u]));
    const blockToProject = new Map(blocks.map((b: any) => [b.id, b.project_id]));
    const projectMap = new Map((projects || []).map((p) => [p.id, p]));

    const enrichedAllocations = hostAllocations.map((a: any) => {
      const pid = blockToProject.get(a.capacity_block_id);
      const proj = pid ? projectMap.get(pid) : null;
      return {
        id: a.id,
        user: bookerMap.get(a.user_id) || { id: a.user_id, name: "Unknown", email: null },
        project: proj ? { id: proj.id, name: proj.name, spv_id: proj.spv_id } : null,
        capacity_kw: Number(a.capacity_kw),
        allocated_at: a.created_at,
      };
    });

    // Compute summaries
    let totalCapacity = 0, allocatedCapacity = 0, lifetimeKwh = 0;
    (projects || []).forEach((p) => { totalCapacity += Number(p.total_kw || 0); });
    blocks.forEach((b: any) => { if (b.status === "ALLOCATED") allocatedCapacity += Number(b.kw); });
    generations.forEach((g: any) => { lifetimeKwh += Number(g.kwh || 0); });

    const projectSummaries = (projects || []).map((p) => {
      const pBlocks = blocks.filter((b: any) => b.project_id === p.id);
      const alloc = pBlocks.filter((b: any) => b.status === "ALLOCATED").reduce((s: number, b: any) => s + Number(b.kw), 0);
      const pKwh = generations.filter((g: any) => g.project_id === p.id).reduce((s: number, g: any) => s + Number(g.kwh), 0);
      const bc = hostAllocations.filter((a: any) => blockToProject.get(a.capacity_block_id) === p.id).length;
      return {
        ...p,
        allocated_kw: alloc,
        available_kw: Number(p.total_kw) - alloc,
        utilization_percent: Number(p.total_kw) > 0 ? Math.round((alloc / Number(p.total_kw)) * 100) : 0,
        lifetime_kwh: Math.round(pKwh),
        booker_count: bc,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        host: {
          ...hostRow,
          // Merge user-level fields
          name: user?.name || hostRow.contact_name,
          email: user?.email || hostRow.contact_email,
          phone: user?.phone || hostRow.contact_phone,
          kyc_status: user?.kyc_status,
          user_state: user?.state,
          user_created_at: user?.created_at,
          deleted_at: user?.deleted_at,
        },
        summary: {
          totalPlants: (projects || []).length,
          activePlants: (projects || []).filter((p) => p.status === "ACTIVE").length,
          totalCapacityKw: totalCapacity,
          allocatedCapacityKw: allocatedCapacity,
          utilizationPercent: totalCapacity > 0 ? Math.round((allocatedCapacity / totalCapacity) * 100) : 0,
          lifetimeKwh: Math.round(lifetimeKwh),
          totalBookers: bookerIds.length,
          activeAgreements: agreements.filter((a: any) => a.status === "ACTIVE").length,
          totalAgreements: agreements.length,
        },
        projects: projectSummaries,
        agreements,
        allocations: enrichedAllocations,
        generations,
      },
    });
  } catch (error) {
    console.error("Admin host detail error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch host details" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/hosts/[id]
 * Update host profile fields in both `hosts` and `users` tables.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdmin();
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const adminClient = createAdminClient();
    const { id } = await params;
    const body = await request.json();

    // Find host record
    let { data: hostRow } = await adminClient.from("hosts").select("*").eq("id", id).maybeSingle();
    if (!hostRow) {
      const { data: byUser } = await adminClient.from("hosts").select("*").eq("user_id", id).maybeSingle();
      hostRow = byUser;
    }
    if (!hostRow) {
      return NextResponse.json({ success: false, error: "Host not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Update hosts table fields
    const hostUpdates: Record<string, any> = { updated_at: now };
    const hostFields = ["business_name", "contact_name", "contact_email", "contact_phone", "status"];
    hostFields.forEach((f) => { if (body[f] !== undefined) hostUpdates[f] = body[f]; });

    const { error: hostUpdateErr } = await adminClient
      .from("hosts")
      .update(hostUpdates)
      .eq("id", hostRow.id);

    if (hostUpdateErr) {
      console.error("Host update error:", hostUpdateErr);
      return NextResponse.json({ success: false, error: "Failed to update host" }, { status: 500 });
    }

    // Also update user-level fields if provided
    const userUpdates: Record<string, any> = { updated_at: now };
    const userFields = ["name", "phone", "state", "kyc_status"];
    userFields.forEach((f) => { if (body[f] !== undefined) userUpdates[f] = body[f]; });

    if (Object.keys(userUpdates).length > 1) {
      await adminClient.from("users").update(userUpdates).eq("id", hostRow.user_id);
    }

    return NextResponse.json({ success: true, message: "Host updated" });
  } catch (error) {
    console.error("Admin host update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update host" }, { status: 500 });
  }
}
