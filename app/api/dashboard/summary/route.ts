import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Dashboard summary endpoint. Returns per-user totals for the cards at the
 * top of /dashboard plus the most-recent projects the user has allocations in
 * so we can render the "Your reserved capacity" panel with real data.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Allocations + their capacity_block + project (for project-level stats).
    const { data: allocations } = await supabase
      .from("allocations")
      .select(
        `id, capacity_kw, created_at,
         capacity_block:capacity_blocks(id, kw, status,
           project:projects(id, name, location, rate_per_kwh, total_kw))`
      )
      .eq("user_id", user.id);

    const totalCapacity =
      allocations?.reduce((sum, a: any) => sum + Number(a.capacity_kw || 0), 0) || 0;

    // Credits the user has actually received (APPLIED against a bill) = savings.
    const { data: appliedCredits } = await supabase
      .from("credit_ledgers")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "APPLIED");

    const totalSavings =
      appliedCredits?.reduce((sum, c: any) => sum + Number(c.amount || 0), 0) || 0;

    // Pending credits — generated but not yet used to offset a bill.
    const { data: pendingCredits } = await supabase
      .from("credit_ledgers")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "PENDING");

    const availableCreditBalance =
      pendingCredits?.reduce((sum, c: any) => sum + Number(c.amount || 0), 0) || 0;

    // Rough environmental impact. 1 kW rooftop solar in India offsets ~0.8 t
    // CO₂/year at national grid mix. Use 0.8 so the number doesn't look fake.
    const co2Offset = (totalCapacity * 0.8).toFixed(2);

    // Monthly generation estimate for the headline projects the user is in:
    // ~120 kWh/kW/month average (CUF ~17%). We display the per-user share.
    const estimatedMonthlyKwh = Math.round(totalCapacity * 120);

    // Recent credit activity for the activity feed.
    const { data: recentCredits } = await supabase
      .from("credit_ledgers")
      .select("id, amount, status, created_at, description")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Last unpaid bill (so dashboard can nudge the user).
    const { data: pendingBill } = await supabase
      .from("bills")
      .select("id, amount, credits_applied, due_date, status, review_status")
      .eq("user_id", user.id)
      .neq("status", "PAID")
      .order("due_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      data: {
        totalCapacity,
        totalSavings,
        availableCreditBalance,
        co2Offset,
        estimatedMonthlyKwh,
        allocationCount: allocations?.length || 0,
        recentActivity: recentCredits || [],
        pendingBill: pendingBill || null,
      },
    });
  } catch (error: any) {
    console.error("dashboard/summary error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
