import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/stats/live
 * Get live aggregate statistics for homepage
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get total capacity from active allocations
    const { data: allocations } = await supabase
      .from("allocations")
      .select("capacity_kw")
      .eq("status", "ACTIVE");

    const totalCapacity =
      allocations?.reduce((sum, a) => sum + Number(a.capacity_kw || 0), 0) || 0;

    // Get total energy generated (from generations table)
    const { data: generations } = await supabase
      .from("generations")
      .select("kwh")
      .eq("validated", true);

    const totalEnergy =
      generations?.reduce((sum, g) => sum + Number(g.kwh || 0), 0) || 0;

    // Get total credits generated (from credit_ledgers)
    const { data: credits } = await supabase
      .from("credit_ledgers")
      .select("amount")
      .in("status", ["APPLIED", "PENDING"]);

    const totalCredits =
      credits?.reduce((sum, c) => sum + Number(c.amount || 0), 0) || 0;

    // Calculate carbon offset (assuming 0.5 kg CO2 per kWh)
    const carbonOffset = totalEnergy * 0.5;

    return NextResponse.json({
      success: true,
      data: {
        totalCapacity,
        totalEnergy,
        totalCredits,
        carbonOffset,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to fetch live stats",
        },
      },
      { status: 500 }
    );
  }
}

