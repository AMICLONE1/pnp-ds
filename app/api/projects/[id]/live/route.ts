import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTrillectricClient, TrillectricError } from "@/lib/trillectric/client";
import type { TrillectricReading } from "@/lib/trillectric/types";

/**
 * GET /api/projects/[id]/live
 *
 * Returns the plant's latest Trillectric readings aggregated across all
 * bound site IDs. Authorization: caller must have an allocation in the
 * plant (or be an admin — future). We bypass RLS on projects via the
 * service-role client because the caller's allocation is the auth check.
 *
 * Response shape:
 * {
 *   success: true,
 *   data: {
 *     project: { id, name, total_kw, status },
 *     summary: {
 *       ac_power_w, energy_today_kwh, energy_lifetime_kwh,
 *       avg_power_factor, avg_temperature_c, latest_timestamp,
 *       inverter_count, online_count
 *     },
 *     sites: [{ site_id, latest, status }]
 *   }
 * }
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

    // Authorize: caller must have a paid allocation in this plant.
    const { data: callerAllocs } = await supabase
      .from("allocations")
      .select("id, capacity_block:capacity_blocks!inner(project_id)")
      .eq("user_id", user.id)
      .eq("capacity_block.project_id", id);

    if (!callerAllocs || callerAllocs.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "No allocation in this project" } },
        { status: 403 }
      );
    }

    const admin = createAdminClient();
    const { data: project, error: projectErr } = await admin
      .from("projects")
      .select("id, name, total_kw, status, trillectric_site_ids")
      .eq("id", id)
      .maybeSingle();

    if (projectErr || !project) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    const siteIds: string[] = Array.isArray(project.trillectric_site_ids)
      ? project.trillectric_site_ids.filter((s: unknown) => typeof s === "string" && s.length > 0)
      : [];

    if (siteIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          project: {
            id: project.id,
            name: project.name,
            total_kw: Number(project.total_kw || 0),
            status: project.status,
          },
          summary: null,
          sites: [],
          message: "No Trillectric site IDs bound to this plant yet.",
        },
      });
    }

    const client = getTrillectricClient();

    // Fan out in parallel, tolerate per-site failures.
    const siteResults = await Promise.all(
      siteIds.map(async (siteId) => {
        try {
          const readings = await client.fetchData(siteId, "today");
          const latest = pickLatest(readings);
          return { site_id: siteId, latest, status: "OK" as const, error: null };
        } catch (err) {
          const msg =
            err instanceof TrillectricError
              ? err.message
              : err instanceof Error
              ? err.message
              : "Unknown error";
          return { site_id: siteId, latest: null, status: "ERROR" as const, error: msg };
        }
      })
    );

    const okSites = siteResults.filter((s) => s.latest);

    const summary =
      okSites.length === 0
        ? null
        : {
            ac_power_w: sum(okSites.map((s) => s.latest!.ACPower)),
            energy_today_kwh: sum(okSites.map((s) => s.latest!.EnergyToday)),
            energy_lifetime_kwh: sum(okSites.map((s) => s.latest!.EnergyLifeTime)),
            avg_power_factor: avg(okSites.map((s) => s.latest!.PowerFactor)),
            avg_temperature_c: avg(okSites.map((s) => s.latest!.InverterTemperature1)),
            latest_timestamp: okSites
              .map((s) => s.latest!.ReadingTimeStamp)
              .sort()
              .slice(-1)[0],
            inverter_count: siteResults.length,
            online_count: okSites.filter((s) => (s.latest!.ACPower ?? 0) > 0).length,
          };

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project.id,
          name: project.name,
          total_kw: Number(project.total_kw || 0),
          status: project.status,
        },
        summary,
        sites: siteResults,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("project live error:", msg);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

function pickLatest(readings: TrillectricReading[]): TrillectricReading | null {
  if (!readings.length) return null;
  return readings.reduce((best, r) =>
    !best || r.ReadingTimeStamp > best.ReadingTimeStamp ? r : best
  );
}

function sum(nums: (number | null | undefined)[]): number {
  return nums.reduce<number>((s, n) => s + (Number(n) || 0), 0);
}

function avg(nums: (number | null | undefined)[]): number | null {
  const clean = nums.map((n) => Number(n)).filter((n) => !Number.isNaN(n));
  if (!clean.length) return null;
  return clean.reduce((s, n) => s + n, 0) / clean.length;
}
