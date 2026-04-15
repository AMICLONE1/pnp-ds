import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/users/[id]
 * Returns unified user profile: their allocations across plants, the hosts behind
 * those plants, credits earned/applied, bills, payments, and activity summary.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdmin();
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const adminClient = createAdminClient();
    const userId = params.id;

    const { data: user, error: userError } = await adminClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch allocations, credits, bills, payments in parallel
    const [allocationsRes, creditsRes, billsRes, paymentsRes] = await Promise.all([
      adminClient
        .from("allocations")
        .select("id, capacity_block_id, capacity_kw, payment_id, created_at")
        .eq("user_id", userId),
      adminClient
        .from("credit_ledgers")
        .select("*")
        .eq("user_id", userId)
        .order("year", { ascending: false })
        .order("month", { ascending: false }),
      adminClient
        .from("bills")
        .select("*")
        .eq("user_id", userId)
        .order("due_date", { ascending: false }),
      adminClient
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    const allocations = allocationsRes.data || [];
    const credits = creditsRes.data || [];
    const bills = billsRes.data || [];
    const payments = paymentsRes.data || [];

    // Resolve each allocation → block → project → host
    const blockIds = allocations.map((a) => a.capacity_block_id);
    const { data: blocks } = blockIds.length
      ? await adminClient
          .from("capacity_blocks")
          .select("id, project_id, kw, status")
          .in("id", blockIds)
      : { data: [] as any[] };

    const projectIds = Array.from(
      new Set((blocks || []).map((b: any) => b.project_id))
    );
    const { data: projects } = projectIds.length
      ? await adminClient
          .from("projects")
          .select("id, name, spv_id, host_id, rate_per_kwh, status, location, state")
          .in("id", projectIds)
      : { data: [] as any[] };

    const hostIds = Array.from(
      new Set(
        (projects || [])
          .map((p: any) => p.host_id)
          .filter(Boolean)
      )
    );
    const { data: hosts } = hostIds.length
      ? await adminClient
          .from("users")
          .select("id, name, email")
          .in("id", hostIds)
      : { data: [] as any[] };

    const blockMap = new Map((blocks || []).map((b: any) => [b.id, b]));
    const projectMap = new Map((projects || []).map((p: any) => [p.id, p]));
    const hostMap = new Map((hosts || []).map((h: any) => [h.id, h]));

    const enrichedAllocations = allocations.map((a) => {
      const block = blockMap.get(a.capacity_block_id);
      const project = block ? projectMap.get((block as any).project_id) : null;
      const host = project ? hostMap.get((project as any).host_id) : null;
      return {
        id: a.id,
        capacity_kw: Number(a.capacity_kw),
        allocated_at: a.created_at,
        project: project
          ? {
              id: (project as any).id,
              name: (project as any).name,
              spv_id: (project as any).spv_id,
              location: (project as any).location,
              state: (project as any).state,
              status: (project as any).status,
            }
          : null,
        host: host
          ? { id: (host as any).id, name: (host as any).name, email: (host as any).email }
          : null,
      };
    });

    // Aggregates
    const totalAllocatedKw = allocations.reduce(
      (s, a) => s + Number(a.capacity_kw),
      0
    );
    const creditsEarned = credits
      .filter((c) => c.type === "GENERATION")
      .reduce((s, c) => s + Number(c.amount || 0), 0);
    const creditsApplied = credits
      .filter((c) => c.status === "APPLIED")
      .reduce((s, c) => s + Number(c.amount || 0), 0);
    const creditsPending = credits
      .filter((c) => c.status === "PENDING")
      .reduce((s, c) => s + Number(c.amount || 0), 0);
    const totalBilled = bills.reduce((s, b) => s + Number(b.amount || 0), 0);
    const billsPaid = bills.filter((b) => b.status === "PAID").length;
    const billsPending = bills.filter((b) => b.status === "PENDING").length;
    const totalPaid = payments
      .filter((p) => p.status === "COMPLETED")
      .reduce((s, p) => s + Number(p.amount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        user,
        summary: {
          plantsUsing: projectIds.length,
          hostsConnected: hostIds.length,
          totalAllocatedKw,
          creditsEarned,
          creditsApplied,
          creditsPending,
          totalBilled,
          billsPaid,
          billsPending,
          totalPaid,
        },
        allocations: enrichedAllocations,
        credits,
        bills,
        payments,
      },
    });
  } catch (error) {
    console.error("Admin user detail error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}
