import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSearchTerm } from "@/lib/security/inputSanitizer";

/**
 * GET /api/admin/hosts
 * Reads from the `hosts` table (not users WHERE role=HOST) and joins
 * user info, projects, PPAs, capacity, and generation data.
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
    const statusFilter = searchParams.get("status") || "all";

    // 1. Fetch all host rows from the hosts table
    const { data: hostRows, error: hostErr } = await adminClient
      .from("hosts")
      .select("*")
      .order("created_at", { ascending: false });

    if (hostErr) {
      console.error("Error fetching hosts:", hostErr);
      return NextResponse.json({ success: false, error: "Failed to fetch hosts" }, { status: 500 });
    }

    if (!hostRows || hostRows.length === 0) {
      return NextResponse.json({
        success: true,
        data: { hosts: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } },
      });
    }

    // 2. Fetch linked users for each host
    const userIds = hostRows.map((h: any) => h.user_id).filter(Boolean);
    const { data: users } = userIds.length
      ? await adminClient
          .from("users")
          .select("id, name, email, phone, kyc_status, state, role, created_at, deleted_at")
          .in("id", userIds)
      : { data: [] as any[] };

    const userMap = new Map((users || []).map((u: any) => [u.id, u]));

    // 3. Fetch projects where host_id = host's user_id OR host_id = hosts.id
    //    (handles both correct FK references and legacy data where host_id was set to hosts.id)
    const hostTableIds = hostRows.map((h: any) => h.id).filter(Boolean);
    const allPossibleHostIds = Array.from(new Set([...userIds, ...hostTableIds]));

    const [projectsRes, agreementsRes, blocksRes, generationsRes] = await Promise.all([
      adminClient
        .from("projects")
        .select("id, name, spv_id, host_id, total_kw, rate_per_kwh, status, location, state")
        .in("host_id", allPossibleHostIds.length > 0 ? allPossibleHostIds : ["none"])
        .is("deleted_at", null),
      adminClient
        .from("ppa_agreements")
        .select("id, host_id, project_id, status, start_date, end_date")
        .in("host_id", allPossibleHostIds.length > 0 ? allPossibleHostIds : ["none"]),
      adminClient.from("capacity_blocks").select("id, project_id, kw, status"),
      adminClient.from("generations").select("project_id, kwh"),
    ]);

    const projects = projectsRes.data || [];
    const agreements = agreementsRes.data || [];
    const blocks = blocksRes.data || [];
    const generations = generationsRes.data || [];

    // Index by project/host
    const projectsByUser = new Map<string, typeof projects>();
    projects.forEach((p) => {
      if (!p.host_id) return;
      const arr = projectsByUser.get(p.host_id) || [];
      arr.push(p);
      projectsByUser.set(p.host_id, arr);
    });

    const agreementsByUser = new Map<string, typeof agreements>();
    agreements.forEach((a) => {
      const arr = agreementsByUser.get(a.host_id) || [];
      arr.push(a);
      agreementsByUser.set(a.host_id, arr);
    });

    const blocksByProject = new Map<string, { total: number; allocated: number }>();
    blocks.forEach((b) => {
      const e = blocksByProject.get(b.project_id) || { total: 0, allocated: 0 };
      e.total += Number(b.kw);
      if (b.status === "ALLOCATED") e.allocated += Number(b.kw);
      blocksByProject.set(b.project_id, e);
    });

    const genByProject = new Map<string, number>();
    generations.forEach((g) => {
      genByProject.set(g.project_id, (genByProject.get(g.project_id) || 0) + Number(g.kwh));
    });

    // 4. Build enriched host objects
    //    Look up projects by both user_id and hosts.id to handle legacy data
    let enriched = hostRows.map((h: any) => {
      const user = userMap.get(h.user_id);
      const byUserId = projectsByUser.get(h.user_id) || [];
      const byHostId = projectsByUser.get(h.id) || [];
      // Merge and deduplicate
      const seen = new Set<string>();
      const hostProjects = [...byUserId, ...byHostId].filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      const agreementsByUserId = agreementsByUser.get(h.user_id) || [];
      const agreementsByHostId = agreementsByUser.get(h.id) || [];
      const seenA = new Set<string>();
      const hostAgreements = [...agreementsByUserId, ...agreementsByHostId].filter((a) => {
        if (seenA.has(a.id)) return false;
        seenA.add(a.id);
        return true;
      });

      let totalCapacity = 0, allocatedCapacity = 0, lifetimeKwh = 0, activePlants = 0;
      hostProjects.forEach((p) => {
        totalCapacity += Number(p.total_kw || 0);
        const bi = blocksByProject.get(p.id);
        if (bi) allocatedCapacity += bi.allocated;
        lifetimeKwh += genByProject.get(p.id) || 0;
        if (p.status === "ACTIVE") activePlants++;
      });

      return {
        id: h.id,
        user_id: h.user_id,
        business_name: h.business_name,
        contact_name: h.contact_name,
        contact_email: h.contact_email,
        contact_phone: h.contact_phone,
        host_status: h.status,
        verified_at: h.verified_at,
        created_at: h.created_at,
        // User-level fields
        name: user?.name || h.contact_name,
        email: user?.email || h.contact_email,
        phone: user?.phone || h.contact_phone,
        kyc_status: user?.kyc_status || "PENDING",
        state: user?.state,
        user_created_at: user?.created_at,
        deleted_at: user?.deleted_at,
        summary: {
          totalPlants: hostProjects.length,
          activePlants,
          totalCapacityKw: totalCapacity,
          allocatedCapacityKw: allocatedCapacity,
          utilizationPercent: totalCapacity > 0 ? Math.round((allocatedCapacity / totalCapacity) * 100) : 0,
          lifetimeKwh: Math.round(lifetimeKwh),
          totalAgreements: hostAgreements.length,
          activeAgreements: hostAgreements.filter((a) => a.status === "ACTIVE").length,
        },
        plants: hostProjects.map((p) => ({
          id: p.id, name: p.name, spv_id: p.spv_id,
          total_kw: p.total_kw, status: p.status, location: p.location, state: p.state,
        })),
      };
    });

    // Apply filters
    if (statusFilter === "active") {
      enriched = enriched.filter((h: any) => !h.deleted_at && h.host_status === "ACTIVE");
    } else if (statusFilter === "banned") {
      enriched = enriched.filter((h: any) => h.deleted_at);
    }

    if (search) {
      const q = search.toLowerCase();
      enriched = enriched.filter(
        (h: any) =>
          (h.business_name || "").toLowerCase().includes(q) ||
          (h.contact_name || "").toLowerCase().includes(q) ||
          (h.email || "").toLowerCase().includes(q) ||
          (h.contact_phone || "").toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        hosts: enriched,
        pagination: { page: 1, limit: enriched.length, total: enriched.length, totalPages: 1 },
      },
    });
  } catch (error) {
    console.error("Admin hosts error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch hosts" }, { status: 500 });
  }
}
