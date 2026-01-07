import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Not authenticated" },
        },
        { status: 401 }
      );
    }

    // Get allocations
    const { data: allocations } = await supabase
      .from("allocations")
      .select("capacity_kw, monthly_fee, status")
      .eq("user_id", user.id)
      .eq("status", "active");

    const totalCapacity =
      allocations?.reduce((sum, a) => sum + Number(a.capacity_kw), 0) || 0;

    // Get credits
    const { data: credits } = await supabase
      .from("credit_ledgers")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "APPLIED");

    const totalSavings =
      credits?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

    // Calculate CO2 offset (rough estimate: 0.5 tons per kW per year)
    const co2Offset = (totalCapacity * 0.5).toFixed(1);

    // Get recent activity
    const { data: recentCredits } = await supabase
      .from("credit_ledgers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        totalCapacity,
        totalSavings,
        co2Offset,
        recentActivity: recentCredits || [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

