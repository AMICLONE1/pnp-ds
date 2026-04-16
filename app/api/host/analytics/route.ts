import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

// ============================================
// GET /api/host/analytics
//
// Pulls 30 days of daily_generations + 6 months of generations for every
// plant owned by the authenticated host, then shapes the data to match
// what the analytics page components expect (KPI, per-plant table,
// weekly pattern, monthly breakdown, 24h irradiance curve).
//
// Intraday irradiance/generation comes from inverter_readings (today).
// If the cron hasn't run yet for a plant, those series will be empty —
// the UI handles that with empty-state styling.
// ============================================

export const dynamic = "force-dynamic";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function GET() {
  try {
    const auth = await verifyHost();
    if (!auth.authorized || !auth.host) {
      return hostUnauthorizedResponse(auth.error || "UNAUTHORIZED");
    }
    const hostId = auth.host.id;
    const admin = createAdminClient();

    const { data: projects, error: projectsErr } = await admin
      .from("projects")
      .select("id, name, location, total_kw, status")
      .eq("host_id", hostId)
      .is("deleted_at", null);

    if (projectsErr) {
      return NextResponse.json(
        { success: false, error: `projects: ${projectsErr.message}` },
        { status: 500 }
      );
    }
    if (!projects || projects.length === 0) {
      return NextResponse.json({
        success: true,
        data: emptyBundle(),
      });
    }

    const projectIds = projects.map((p: { id: string }) => p.id);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    const todayIso = now.toISOString().slice(0, 10);
    const startIso = thirtyDaysAgo.toISOString().slice(0, 10);

    const [dailyRes, monthlyRes, readingsRes] = await Promise.all([
      admin
        .from("daily_generations")
        .select("project_id, date, kwh, peak_power_w")
        .in("project_id", projectIds)
        .gte("date", startIso)
        .order("date", { ascending: true }),
      admin
        .from("generations")
        .select("project_id, month, year, kwh")
        .in("project_id", projectIds)
        .order("year", { ascending: true })
        .order("month", { ascending: true }),
      admin
        .from("inverter_readings")
        .select("project_id, reading_timestamp, ac_power, energy_today")
        .in("project_id", projectIds)
        .gte("reading_timestamp", `${todayIso}T00:00:00Z`)
        .order("reading_timestamp", { ascending: true }),
    ]);

    const dailyRows = dailyRes.data || [];
    const monthlyRows = monthlyRes.data || [];
    const readings = readingsRes.data || [];

    // Per-plant aggregates
    const plants = projects.map(
      (p: {
        id: string;
        name: string;
        location: string;
        total_kw: number;
      }) => {
        const totalKw = Number(p.total_kw || 0);
        const pDaily = dailyRows.filter(
          (d: { project_id: string }) => d.project_id === p.id
        );
        const kwhSum = pDaily.reduce(
          (s: number, d: { kwh: number }) => s + Number(d.kwh || 0),
          0
        );
        const avgDailyGen =
          pDaily.length > 0 ? Math.round(kwhSum / pDaily.length) : 0;
        const peakGen = pDaily.reduce(
          (m: number, d: { peak_power_w: number | null }) =>
            Math.max(m, Number(d.peak_power_w || 0) / 1000),
          0
        );
        const expectedDaily = totalKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay;
        const prRatio =
          expectedDaily > 0
            ? Math.min(100, Math.round((avgDailyGen / expectedDaily) * 1000) / 10)
            : 0;
        const efficiency = prRatio; // Use PR as efficiency proxy
        const activeDays = pDaily.filter(
          (d: { kwh: number }) => Number(d.kwh || 0) > 0
        ).length;
        const availability =
          pDaily.length > 0
            ? Math.round((activeDays / pDaily.length) * 1000) / 10
            : 0;

        return {
          id: p.id,
          name: p.name,
          location: p.location,
          capacityKw: totalKw,
          efficiency,
          prRatio,
          availability,
          avgDailyGen,
          peakGen: Math.round(peakGen),
        };
      }
    );

    // KPI totals
    const totalKw = plants.reduce(
      (s: number, p: { capacityKw: number }) => s + p.capacityKw,
      0
    );
    const totalGeneration30d = dailyRows.reduce(
      (s: number, d: { kwh: number }) => s + Number(d.kwh || 0),
      0
    );
    const avgEfficiency =
      plants.length > 0
        ? Math.round(
            (plants.reduce(
              (s: number, p: { efficiency: number }) => s + p.efficiency,
              0
            ) /
              plants.length) *
              10
          ) / 10
        : 0;
    const performanceRatio = avgEfficiency;
    const expected30d = totalKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay * 30;
    const carbonOffset =
      Math.round(totalGeneration30d * SOLAR_CONSTANTS.co2PerKwh * 0.001 * 10) /
      10;

    // Trend: compare current 30-day window vs previous 30-day window
    const sixtyDaysAgoIso = new Date(
      now.getTime() - 59 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 10);
    const { data: prevRows } = await admin
      .from("daily_generations")
      .select("date, kwh")
      .in("project_id", projectIds)
      .gte("date", sixtyDaysAgoIso)
      .lt("date", startIso);

    const prev30 = (prevRows || []).reduce(
      (s: number, d: { kwh: number }) => s + Number(d.kwh || 0),
      0
    );
    const genTrend =
      prev30 > 0
        ? Math.round(((totalGeneration30d - prev30) / prev30) * 1000) / 10
        : 0;

    // Daily generation: last 30 days, plant-summed
    const dailyMap = new Map<string, number>();
    dailyRows.forEach((d: { date: string; kwh: number }) => {
      dailyMap.set(d.date, (dailyMap.get(d.date) || 0) + Number(d.kwh || 0));
    });
    const expectedDailyAll = totalKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay;
    const dailyGeneration = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      return {
        day: i + 1,
        actual: Math.round(dailyMap.get(key) || 0),
        expected: Math.round(expectedDailyAll),
      };
    });

    // Weekly pattern: average per weekday
    const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
    dailyRows.forEach((d: { date: string; kwh: number }) => {
      const dt = new Date(d.date);
      const wd = dt.getUTCDay();
      weekdayTotals[wd] += Number(d.kwh || 0);
      weekdayCounts[wd] += 1;
    });
    const weeklyPattern = WEEKDAY_LABELS.slice(1)
      .concat(WEEKDAY_LABELS[0])
      .map((label) => {
        const wd = WEEKDAY_LABELS.indexOf(label);
        const count = weekdayCounts[wd];
        return {
          day: label,
          avg: count > 0 ? Math.round(weekdayTotals[wd] / count) : 0,
        };
      });

    // Monthly breakdown: last 6 months from generations
    const monthMap = new Map<string, number>();
    monthlyRows.forEach((g: { month: number; year: number; kwh: number }) => {
      const key = `${g.year}-${g.month}`;
      monthMap.set(key, (monthMap.get(key) || 0) + Number(g.kwh || 0));
    });
    const monthlyBreakdown = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      return {
        month: d.toLocaleDateString("en-IN", { month: "short" }),
        actual: Math.round(monthMap.get(key) || 0),
        expected: Math.round(
          totalKw *
            SOLAR_CONSTANTS.avgGenerationPerKwPerDay *
            SOLAR_CONSTANTS.daysPerMonth
        ),
      };
    });

    // 24h generation curve (irradiance proxy = ACPower summed by hour)
    const hourBuckets = Array.from({ length: 24 }, () => ({
      power: 0,
      count: 0,
    }));
    readings.forEach(
      (r: { reading_timestamp: string; ac_power: number }) => {
        const hr = new Date(r.reading_timestamp).getUTCHours();
        if (hr < 0 || hr >= 24) return;
        hourBuckets[hr].power += Number(r.ac_power || 0);
        hourBuckets[hr].count += 1;
      }
    );
    const irradiance = hourBuckets.map((b, hr) => {
      const avgPowerW = b.count > 0 ? b.power / b.count : 0;
      const generationKwh = Math.round(avgPowerW / 1000);
      // Rough irradiance proxy: W/m² implied by AC power vs installed kW
      const rated = totalKw * 1000;
      const irr =
        rated > 0 ? Math.round((avgPowerW / rated) * 1000) : 0;
      return {
        hour: `${String(hr).padStart(2, "0")}:00`,
        irradiance: irr,
        generation: generationKwh,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        plants,
        kpi: {
          totalGeneration: Math.round(totalGeneration30d),
          avgEfficiency,
          performanceRatio,
          carbonOffset,
          genTrend,
          effTrend: 0,
          prTrend: 0,
          co2Trend: genTrend,
        },
        envImpact: {
          co2Tons: carbonOffset,
          treesEquivalent: Math.round(carbonOffset * 46),
          homesPowered: Math.round(totalGeneration30d / 900),
        },
        dailyGeneration,
        weeklyPattern,
        monthlyBreakdown,
        irradiance,
        expected30d: Math.round(expected30d),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[host/analytics] fatal:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

function emptyBundle() {
  return {
    plants: [],
    kpi: {
      totalGeneration: 0,
      avgEfficiency: 0,
      performanceRatio: 0,
      carbonOffset: 0,
      genTrend: 0,
      effTrend: 0,
      prTrend: 0,
      co2Trend: 0,
    },
    envImpact: { co2Tons: 0, treesEquivalent: 0, homesPowered: 0 },
    dailyGeneration: [],
    weeklyPattern: [],
    monthlyBreakdown: [],
    irradiance: [],
  };
}
