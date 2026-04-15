import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/reconciliation
 * End-to-end financial reconciliation:
 * generation (kWh) → host PPA amounts → user credits → credits applied to bills
 * Helps admin trace discrepancies between the host-side and user-side billing.
 */
export async function GET(_request: NextRequest) {
  try {
    const authResult = await verifyAdmin();
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const adminClient = createAdminClient();

    const [generationsRes, projectsRes, creditsRes, billsRes, paymentsRes] =
      await Promise.all([
        adminClient.from("generations").select("project_id, kwh, validated"),
        adminClient.from("projects").select("id, name, rate_per_kwh").is("deleted_at", null),
        adminClient.from("credit_ledgers").select("amount, type, status"),
        adminClient.from("bills").select("amount, credits_applied, status"),
        adminClient
          .from("payments")
          .select("amount, type, status")
          .eq("status", "COMPLETED"),
      ]);

    const generations = generationsRes.data || [];
    const projects = projectsRes.data || [];
    const credits = creditsRes.data || [];
    const bills = billsRes.data || [];
    const payments = paymentsRes.data || [];

    // Project rate map
    const rateMap = new Map(projects.map((p: any) => [p.id, Number(p.rate_per_kwh || 0)]));

    // Host-side: generation kWh × rate = expected host owed
    let totalKwh = 0;
    let validatedKwh = 0;
    let hostSideValue = 0;

    generations.forEach((g: any) => {
      const kwh = Number(g.kwh || 0);
      totalKwh += kwh;
      if (g.validated) validatedKwh += kwh;
      hostSideValue += kwh * (rateMap.get(g.project_id) || 0);
    });

    // User-side: credits earned vs applied
    const creditsEarned = credits
      .filter((c: any) => c.type === "GENERATION")
      .reduce((s: number, c: any) => s + Number(c.amount || 0), 0);
    const creditsApplied = credits
      .filter((c: any) => c.status === "APPLIED")
      .reduce((s: number, c: any) => s + Number(c.amount || 0), 0);
    const creditsPending = credits
      .filter((c: any) => c.status === "PENDING")
      .reduce((s: number, c: any) => s + Number(c.amount || 0), 0);

    const totalBilled = bills.reduce((s: number, b: any) => s + Number(b.amount || 0), 0);
    const totalCreditsOnBills = bills.reduce(
      (s: number, b: any) => s + Number(b.credits_applied || 0),
      0
    );

    const totalPaymentsByType: Record<string, number> = {};
    payments.forEach((p: any) => {
      totalPaymentsByType[p.type] =
        (totalPaymentsByType[p.type] || 0) + Number(p.amount || 0);
    });

    // Reconciliation deltas
    const hostVsCreditsDelta = hostSideValue - creditsEarned;
    const creditsEarnedVsAppliedDelta = creditsEarned - creditsApplied;

    return NextResponse.json({
      success: true,
      data: {
        generation: {
          totalKwh: Math.round(totalKwh),
          validatedKwh: Math.round(validatedKwh),
          validationPercent:
            totalKwh > 0 ? Math.round((validatedKwh / totalKwh) * 100) : 0,
          hostSideValue: Math.round(hostSideValue),
        },
        credits: {
          earned: Math.round(creditsEarned),
          applied: Math.round(creditsApplied),
          pending: Math.round(creditsPending),
        },
        bills: {
          totalBilled: Math.round(totalBilled),
          creditsUsed: Math.round(totalCreditsOnBills),
          count: bills.length,
        },
        payments: {
          byType: totalPaymentsByType,
          total: Object.values(totalPaymentsByType).reduce((a, b) => a + b, 0),
        },
        reconciliation: {
          hostVsCreditsDelta: Math.round(hostVsCreditsDelta),
          creditsEarnedVsAppliedDelta: Math.round(creditsEarnedVsAppliedDelta),
          isBalanced: Math.abs(hostVsCreditsDelta) < 1,
        },
      },
    });
  } catch (error) {
    console.error("Reconciliation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compute reconciliation" },
      { status: 500 }
    );
  }
}
