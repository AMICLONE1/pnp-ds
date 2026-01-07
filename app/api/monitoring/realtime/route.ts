import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/monitoring/realtime
 * Get real-time solar generation data for user's allocations
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
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Not authenticated" },
        },
        { status: 401 }
      );
    }

    // Get user's active allocations
    const { data: allocations } = await supabase
      .from("allocations")
      .select("id, capacity_kw, project_id")
      .eq("user_id", user.id)
      .eq("status", "ACTIVE");

    if (!allocations || allocations.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          currentGeneration: 0,
          todayGeneration: 0,
          monthlyGeneration: 0,
          creditsGenerated: 0,
          efficiency: 0,
        },
      });
    }

    const totalCapacity = allocations.reduce(
      (sum, a) => sum + Number(a.capacity_kw),
      0
    );

    // Get today's generation (mock for now - replace with real data)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Calculate mock real-time generation (based on time of day)
    const hour = now.getHours();
    // Solar generation peaks around noon (12 PM)
    const solarEfficiency = Math.max(
      0,
      Math.sin((hour - 6) * (Math.PI / 12)) * 0.8
    );
    const currentGeneration = totalCapacity * solarEfficiency;

    // Get this month's generation from database
    const { data: monthlyGen } = await supabase
      .from("generations")
      .select("kwh")
      .in(
        "project_id",
        allocations.map((a) => a.project_id)
      )
      .eq("month", now.getMonth() + 1)
      .eq("year", now.getFullYear());

    const monthlyGeneration =
      monthlyGen?.reduce((sum, g) => sum + Number(g.kwh), 0) || 0;

    // Estimate today's generation (rough calculation)
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const avgDailyGeneration = monthlyGeneration / daysInMonth;
    const todayGeneration = avgDailyGeneration * (hour / 24); // Estimate based on time of day

    // Calculate credits (assuming ₹6.05 per kWh like SundayGrids)
    const creditsGenerated = todayGeneration * 6.05;

    // Calculate efficiency (actual vs expected)
    const expectedMonthly = totalCapacity * 120; // ~120 kWh per kW per month
    const efficiency = expectedMonthly > 0 
      ? (monthlyGeneration / expectedMonthly) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        currentGeneration: Math.max(0, currentGeneration),
        todayGeneration: Math.max(0, todayGeneration),
        monthlyGeneration: Math.max(0, monthlyGeneration),
        creditsGenerated: Math.max(0, creditsGenerated),
        efficiency: Math.min(100, Math.max(0, efficiency)),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to fetch real-time data",
        },
      },
      { status: 500 }
    );
  }
}

