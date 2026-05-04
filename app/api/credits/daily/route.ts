import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/credits/daily
 *
 * Returns the caller's solar credits per day, summed across every plant
 * they have a paid allocation in. For each day:
 *   amount = Σ_plant (plant_kwh_that_day × user_share_in_plant × ppa_rate)
 *   kwh    = Σ_plant (plant_kwh_that_day × user_share_in_plant)
 *
 * The window is the last 30 days (today inclusive). Days with no plant
 * readings are omitted; the client renders an empty state when there are
 * no rows.
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

    const admin = createAdminClient();

    const { data: allocs, error: allocErr } = await admin
      .from("allocations")
      .select("capacity_kw, capacity_block_id")
      .eq("user_id", user.id);

    if (allocErr) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: allocErr.message } },
        { status: 500 }
      );
    }

    if (!allocs || allocs.length === 0) {
      return NextResponse.json({
        success: true,
        data: { days: [], hasAllocations: false },
      });
    }

    const blockIds = allocs.map((a: any) => a.capacity_block_id).filter(Boolean);
    const { data: blocks } = await admin
      .from("capacity_blocks")
      .select("id, project_id")
      .in("id", blockIds);

    const blockToProject = new Map<string, string>();
    for (const b of blocks || []) {
      blockToProject.set(b.id, b.project_id);
    }

    // Sum the user's reserved kW per project (a user may hold several
    // blocks in the same plant).
    const userKwByProject = new Map<string, number>();
    for (const a of allocs) {
      const pid = blockToProject.get(a.capacity_block_id);
      if (!pid) continue;
      userKwByProject.set(
        pid,
        (userKwByProject.get(pid) || 0) + Number(a.capacity_kw || 0)
      );
    }

    const projectIds = [...userKwByProject.keys()];
    if (projectIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: { days: [], hasAllocations: true },
      });
    }

    const { data: projects } = await admin
      .from("projects")
      .select("id, total_kw, rate_per_kwh")
      .in("id", projectIds);

    const projectMeta = new Map<string, { totalKw: number; rate: number }>();
    for (const p of projects || []) {
      projectMeta.set(p.id, {
        totalKw: Number(p.total_kw || 0),
        rate: Number(p.rate_per_kwh || 7),
      });
    }

    // 30-day window, today inclusive.
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 29);
    const startIso = startDate.toISOString().slice(0, 10);
    const endIso = today.toISOString().slice(0, 10);

    const { data: gens, error: genErr } = await admin
      .from("daily_generations")
      .select("project_id, date, kwh")
      .in("project_id", projectIds)
      .gte("date", startIso)
      .lte("date", endIso)
      .order("date", { ascending: true });

    if (genErr) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: genErr.message } },
        { status: 500 }
      );
    }

    const byDay = new Map<string, { kwh: number; amount: number }>();
    for (const g of gens || []) {
      const meta = projectMeta.get(g.project_id);
      const userKw = userKwByProject.get(g.project_id) || 0;
      if (!meta || meta.totalKw <= 0 || userKw <= 0) continue;

      const share = userKw / meta.totalKw;
      const userKwh = Number(g.kwh || 0) * share;
      const userInr = userKwh * meta.rate;

      const prev = byDay.get(g.date) || { kwh: 0, amount: 0 };
      byDay.set(g.date, {
        kwh: prev.kwh + userKwh,
        amount: prev.amount + userInr,
      });
    }

    const days = [...byDay.entries()]
      .map(([date, v]) => ({
        date,
        kwh: Math.round(v.kwh * 100) / 100,
        amount: Math.round(v.amount * 100) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      success: true,
      data: { days, hasAllocations: true },
    });
  } catch (error: any) {
    console.error("credits daily error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
