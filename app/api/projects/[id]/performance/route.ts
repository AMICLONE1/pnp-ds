import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/projects/[id]/performance
 *
 * Returns the plant's recent generation history and a few headline stats so
 * the dashboard and /reserve can render a small performance view for the
 * user's own allocation. Auth is required (so we can scope "your share" to
 * the caller's reserved capacity), but the generation data itself is
 * already publicly readable under RLS.
 */
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
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

    // Before reading plant data, require that the caller has a paid
    // allocation in this plant. We resolve allocation → capacity_block via
    // the admin client because RLS on capacity_blocks only exposes rows
    // whose status is AVAILABLE — once a block is allocated/sold it would
    // otherwise be invisible to the anon client and the join would return
    // zero rows even for legitimate owners.
    const admin = createAdminClient();

    const { data: ownerAllocs, error: ownerErr } = await admin
      .from("allocations")
      .select("id, capacity_kw, capacity_block_id")
      .eq("user_id", user.id);

    if (ownerErr) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: ownerErr.message } },
        { status: 500 }
      );
    }

    const blockIds = (ownerAllocs || []).map((a: any) => a.capacity_block_id).filter(Boolean);
    const { data: ownerBlocks } = blockIds.length
      ? await admin
          .from("capacity_blocks")
          .select("id, project_id")
          .in("id", blockIds)
          .eq("project_id", id)
      : { data: [] as any[] };

    const allowedBlockIds = new Set((ownerBlocks || []).map((b: any) => b.id));
    const callerAllocs = (ownerAllocs || []).filter((a: any) =>
      allowedBlockIds.has(a.capacity_block_id)
    );

    if (callerAllocs.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "No allocation in this project" } },
        { status: 403 }
      );
    }

    const { data: project, error: projectErr } = await admin
      .from("projects")
      .select("id, name, location, total_kw, rate_per_kwh, status")
      .eq("id", id)
      .maybeSingle();

    if (projectErr || !project) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: projectErr?.message || "Project not found",
          },
        },
        { status: 404 }
      );
    }

    // Last 12 months of generation rows (month is 1-12, year is int).
    const { data: gens } = await admin
      .from("generations")
      .select("month, year, kwh, validated")
      .eq("project_id", id)
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .limit(12);

    const history = (gens || [])
      .slice()
      .reverse()
      .map((g: any) => ({
        month: Number(g.month),
        year: Number(g.year),
        kwh: Number(g.kwh || 0),
        validated: !!g.validated,
      }));

    const userKw = callerAllocs.reduce(
      (s: number, a: any) => s + Number(a.capacity_kw || 0),
      0
    );
    const totalKw = Number(project.total_kw || 0) || 1;
    const shareRatio = userKw / totalKw;

    // Headline stats.
    const last12TotalKwh = history.reduce((s, h) => s + h.kwh, 0);
    const lastMonth = history[history.length - 1];
    const prevMonth = history[history.length - 2];
    const monthOverMonth =
      lastMonth && prevMonth && prevMonth.kwh > 0
        ? ((lastMonth.kwh - prevMonth.kwh) / prevMonth.kwh) * 100
        : null;

    // Plant CUF over the history window, capped at 100 %.
    // CUF = actual / (total_kw * 24 * days_in_month).
    const daysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();
    const cufSamples = history
      .map((h) => {
        const theoretical = totalKw * 24 * daysInMonth(h.month, h.year);
        return theoretical > 0 ? (h.kwh / theoretical) * 100 : 0;
      })
      .filter((v) => v > 0);
    const avgCuf =
      cufSamples.length > 0
        ? Math.min(100, cufSamples.reduce((s, v) => s + v, 0) / cufSamples.length)
        : null;

    // User's share of last month (kWh + ₹).
    const userLastMonthKwh = lastMonth ? lastMonth.kwh * shareRatio : 0;
    const userLastMonthInr = userLastMonthKwh * Number(project.rate_per_kwh || 7);

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project.id,
          name: project.name,
          location: project.location,
          total_kw: totalKw,
          rate_per_kwh: Number(project.rate_per_kwh || 7),
          status: project.status,
        },
        user: {
          reserved_kw: userKw,
          share_ratio: shareRatio,
        },
        history,
        stats: {
          last12_total_kwh: Math.round(last12TotalKwh),
          last_month_kwh: lastMonth ? Math.round(lastMonth.kwh) : 0,
          month_over_month_pct: monthOverMonth,
          avg_cuf_pct: avgCuf,
          user_last_month_kwh: Math.round(userLastMonthKwh),
          user_last_month_inr: Math.round(userLastMonthInr),
        },
      },
    });
  } catch (error: any) {
    console.error("project performance error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
