import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/projects/[id]
 * Returns unified plant view: project, host, bookers (users with allocations),
 * generation history, credits earned by bookers from this plant, PPA info.
 * This is the "single place to see everything about a plant".
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
    const projectId = params.id;

    const { data: project, error: projectError } = await adminClient
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Fetch host, capacity blocks, PPA, generations in parallel
    const [hostRes, blocksRes, ppaRes, generationsRes] = await Promise.all([
      project.host_id
        ? adminClient
            .from("users")
            .select("id, name, email, phone, kyc_status, state, created_at")
            .eq("id", project.host_id)
            .single()
        : Promise.resolve({ data: null }),
      adminClient
        .from("capacity_blocks")
        .select("id, kw, status, allocated_at, created_at")
        .eq("project_id", projectId),
      adminClient
        .from("ppa_agreements")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false }),
      adminClient
        .from("generations")
        .select("*")
        .eq("project_id", projectId)
        .order("year", { ascending: false })
        .order("month", { ascending: false }),
    ]);

    const host = hostRes.data;
    const blocks = blocksRes.data || [];
    const agreements = ppaRes.data || [];
    const generations = generationsRes.data || [];

    // Fetch allocations linked to this plant's blocks
    const blockIds = blocks.map((b: any) => b.id);
    const { data: allocations } = blockIds.length
      ? await adminClient
          .from("allocations")
          .select("id, user_id, capacity_block_id, capacity_kw, created_at, payment_id")
          .in("capacity_block_id", blockIds)
      : { data: [] as any[] };

    const bookerIds = Array.from(
      new Set((allocations || []).map((a: any) => a.user_id))
    );

    const { data: bookerUsers } = bookerIds.length
      ? await adminClient
          .from("users")
          .select("id, name, email, phone, kyc_status, state")
          .in("id", bookerIds)
      : { data: [] as any[] };

    // Credits earned by bookers (from GENERATION entries ref to this project)
    // ref_type='project' / ref_id=projectId is one convention; also check user_id IN bookers
    const { data: credits } = bookerIds.length
      ? await adminClient
          .from("credit_ledgers")
          .select("*")
          .in("user_id", bookerIds)
      : { data: [] as any[] };

    // Payments by bookers tied to this project's allocations
    const paymentIds = (allocations || [])
      .map((a: any) => a.payment_id)
      .filter(Boolean);
    const { data: payments } = paymentIds.length
      ? await adminClient
          .from("payments")
          .select("id, user_id, amount, type, status, created_at")
          .in("id", paymentIds)
      : { data: [] as any[] };

    const bookerMap = new Map((bookerUsers || []).map((u: any) => [u.id, u]));
    const paymentMap = new Map((payments || []).map((p: any) => [p.id, p]));

    const creditsByUser = new Map<string, number>();
    (credits || []).forEach((c: any) => {
      creditsByUser.set(
        c.user_id,
        (creditsByUser.get(c.user_id) || 0) + Number(c.amount || 0)
      );
    });

    const enrichedBookers = (allocations || []).map((a: any) => {
      const user = bookerMap.get(a.user_id);
      const payment = a.payment_id ? paymentMap.get(a.payment_id) : null;
      return {
        allocation_id: a.id,
        capacity_kw: Number(a.capacity_kw),
        allocated_at: a.created_at,
        user: user || { id: a.user_id, name: "Unknown", email: null },
        payment: payment || null,
        credits_earned: creditsByUser.get(a.user_id) || 0,
      };
    });

    // Capacity derivation
    const totalCapacity = Number(project.total_kw || 0);
    const allocated = blocks
      .filter((b: any) => b.status === "ALLOCATED")
      .reduce((s: number, b: any) => s + Number(b.kw), 0);
    const available = blocks
      .filter((b: any) => b.status === "AVAILABLE")
      .reduce((s: number, b: any) => s + Number(b.kw), 0);
    const suspended = blocks
      .filter((b: any) => b.status === "SUSPENDED")
      .reduce((s: number, b: any) => s + Number(b.kw), 0);

    // Generation totals
    const lifetimeKwh = generations.reduce(
      (s: number, g: any) => s + Number(g.kwh || 0),
      0
    );
    const validatedKwh = generations
      .filter((g: any) => g.validated)
      .reduce((s: number, g: any) => s + Number(g.kwh || 0), 0);

    // Revenue estimate
    const revenueEstimate = lifetimeKwh * Number(project.rate_per_kwh || 0);

    return NextResponse.json({
      success: true,
      data: {
        project,
        host,
        capacity: {
          total: totalCapacity,
          allocated,
          available,
          suspended,
          utilization_percent:
            totalCapacity > 0 ? Math.round((allocated / totalCapacity) * 100) : 0,
        },
        ppa_agreements: agreements,
        bookers: enrichedBookers,
        booker_count: bookerIds.length,
        generation: {
          entries: generations,
          lifetime_kwh: Math.round(lifetimeKwh),
          validated_kwh: Math.round(validatedKwh),
          validation_percent:
            lifetimeKwh > 0 ? Math.round((validatedKwh / lifetimeKwh) * 100) : 0,
        },
        revenue_estimate: Math.round(revenueEstimate),
      },
    });
  } catch (error) {
    console.error("Admin project detail error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}
