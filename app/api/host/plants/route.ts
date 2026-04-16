import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTrillectricClient, TrillectricError } from "@/lib/trillectric/client";
import type { TrillectricReading } from "@/lib/trillectric/types";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

// ============================================
// GET /api/host/plants
//
// Returns every project owned by the authenticated host, merged with:
//   - capacity_blocks-derived allocated/available capacity
//   - generations rollup (lifetime + current month)
//   - daily_generations (today)
//   - latest host_alerts per plant
//   - live Trillectric readings fanned out over trillectric_site_ids[]
//
// Shape matches the PlantCard/FleetOverview expectations so the UI can
// drop MOCK_PLANTS and render directly.
// ============================================

export const dynamic = "force-dynamic";

type PlantStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

interface HostPlant {
  id: string;
  name: string;
  location: string;
  state: string;
  capacityKw: number;
  status: PlantStatus;
  todayKwh: number;
  monthlyKwh: number;
  lifetimeKwh: number;
  efficiency: number;
  ppaRate: number;
  monthlyRevenue: number;
  todayTrend: number;
  co2OffsetTons: number;
  trillectricSiteIds: string[];
  live: {
    acPowerW: number;
    energyTodayKwh: number;
    inverterTempC: number | null;
    lastReadingAt: string | null;
    onlineSites: number;
    totalSites: number;
    isStale: boolean;
  } | null;
  alerts: {
    id: string;
    title: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
    time: string;
  }[];
  commissionedDate: string;
  // Placeholder fields the detail view reads — filled in a later pass.
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  panelCount: number;
  inverterCount: number;
  panelType: string;
  tiltAngle: number;
  areaAcres: number;
  weather: {
    temp: number;
    condition: string;
    irradiance: number;
    humidity: number;
    windSpeed: number;
  };
  dailyGeneration: { hour: string; kwh: number }[];
  monthlyGeneration: { month: string; kwh: number; expected: number }[];
}

interface HostPlantsResponse {
  plants: HostPlant[];
  fleet: {
    totalCapacityKw: number;
    todayKwh: number;
    monthlyKwh: number;
    lifetimeKwh: number;
    avgEfficiency: number;
    co2OffsetTons: number;
    activePlants: number;
    totalPlants: number;
    onlinePlants: number;
  };
}

function projectStatusToUi(status: string | null): PlantStatus {
  if (status === "ACTIVE") return "ACTIVE";
  if (status === "MAINTENANCE") return "MAINTENANCE";
  return "INACTIVE";
}

function alertSeverity(s: string | null): "CRITICAL" | "WARNING" | "INFO" {
  const n = String(s || "INFO").toUpperCase();
  if (n === "CRITICAL") return "CRITICAL";
  if (n === "WARNING") return "WARNING";
  return "INFO";
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

function pickLatest(readings: TrillectricReading[]): TrillectricReading | null {
  if (!readings.length) return null;
  return readings.reduce((best, r) =>
    !best || r.ReadingTimeStamp > best.ReadingTimeStamp ? r : best
  );
}

export async function GET() {
  try {
    const authResult = await verifyHost();
    if (!authResult.authorized || !authResult.host) {
      return hostUnauthorizedResponse(authResult.error || "UNAUTHORIZED");
    }

    const hostId = authResult.host.id;
    const adminClient = createAdminClient();

    // 1. Plants for this host
    const { data: projects, error: projectsErr } = await adminClient
      .from("projects")
      .select(
        "id, name, location, state, total_kw, rate_per_kwh, status, trillectric_site_ids, created_at"
      )
      .eq("host_id", hostId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (projectsErr) {
      console.error("[host/plants] projects fetch error:", projectsErr);
      return NextResponse.json(
        { success: false, error: "Failed to load plants" },
        { status: 500 }
      );
    }

    if (!projects || projects.length === 0) {
      const empty: HostPlantsResponse = {
        plants: [],
        fleet: {
          totalCapacityKw: 0,
          todayKwh: 0,
          monthlyKwh: 0,
          lifetimeKwh: 0,
          avgEfficiency: 0,
          co2OffsetTons: 0,
          activePlants: 0,
          totalPlants: 0,
          onlinePlants: 0,
        },
      };
      return NextResponse.json({ success: true, data: empty });
    }

    const projectIds = projects.map((p: { id: string }) => p.id);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const todayIso = now.toISOString().slice(0, 10);

    // 2. Parallel lookups: generations, daily_generations (recent), alerts, active PPAs
    const [genRes, dailyRes, alertsRes, ppaRes] = await Promise.all([
      adminClient
        .from("generations")
        .select("project_id, month, year, kwh")
        .in("project_id", projectIds),
      adminClient
        .from("daily_generations")
        .select("project_id, date, kwh")
        .in("project_id", projectIds)
        .gte("date", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`),
      adminClient
        .from("host_alerts")
        .select("id, project_id, title, severity, created_at, status")
        .in("project_id", projectIds)
        .eq("status", "ACTIVE")
        .order("created_at", { ascending: false }),
      adminClient
        .from("ppa_agreements")
        .select("project_id, rate_per_kwh, status")
        .eq("host_id", hostId)
        .eq("status", "ACTIVE"),
    ]);

    const generations = genRes.data || [];
    const dailies = dailyRes.data || [];
    const alerts = alertsRes.data || [];
    const ppas = ppaRes.data || [];

    const ppaRateByProject = new Map<string, number>();
    ppas.forEach((p: { project_id: string; rate_per_kwh: number }) => {
      ppaRateByProject.set(p.project_id, Number(p.rate_per_kwh || 0));
    });

    // 3. Live Trillectric fan-out, one project at a time (each project's
    //    site IDs run in parallel inside). Per-site errors are swallowed so
    //    one bad inverter doesn't blank the whole fleet.
    const client = getTrillectricClient();
    const liveByProject = new Map<
      string,
      HostPlant["live"]
    >();

    await Promise.all(
      projects.map(async (p: { id: string; trillectric_site_ids: string[] | null }) => {
        const siteIds = Array.isArray(p.trillectric_site_ids)
          ? p.trillectric_site_ids.filter(
              (s: unknown) => typeof s === "string" && s.length > 0
            )
          : [];
        if (siteIds.length === 0) {
          liveByProject.set(p.id, null);
          return;
        }

        const siteResults = await Promise.all(
          siteIds.map(async (siteId) => {
            try {
              const readings = await client.fetchData(siteId, "today");
              return pickLatest(readings);
            } catch (err) {
              const msg =
                err instanceof TrillectricError
                  ? err.message
                  : err instanceof Error
                  ? err.message
                  : "Unknown error";
              console.warn(
                `[host/plants] site ${siteId} fetch failed: ${msg}`
              );
              return null;
            }
          })
        );

        const okLatest = siteResults.filter(
          (r): r is TrillectricReading => r !== null
        );

        if (okLatest.length === 0) {
          liveByProject.set(p.id, {
            acPowerW: 0,
            energyTodayKwh: 0,
            inverterTempC: null,
            lastReadingAt: null,
            onlineSites: 0,
            totalSites: siteIds.length,
            isStale: true,
          });
          return;
        }

        const acPowerW = okLatest.reduce(
          (s, r) => s + (Number(r.ACPower) || 0),
          0
        );
        const energyTodayKwh = okLatest.reduce(
          (s, r) => s + (Number(r.EnergyToday) || 0),
          0
        );
        const temps = okLatest
          .map((r) => Number(r.InverterTemperature1))
          .filter((n) => !Number.isNaN(n));
        const avgTemp =
          temps.length > 0 ? temps.reduce((s, n) => s + n, 0) / temps.length : null;
        const latestTs = okLatest
          .map((r) => r.ReadingTimeStamp)
          .sort()
          .slice(-1)[0];
        const latestMs = new Date(latestTs).getTime();
        const isStale = Number.isNaN(latestMs)
          ? true
          : Date.now() - latestMs > 30 * 60 * 1000; // 30m

        liveByProject.set(p.id, {
          acPowerW: Math.round(acPowerW),
          energyTodayKwh: Math.round(energyTodayKwh * 100) / 100,
          inverterTempC: avgTemp != null ? Math.round(avgTemp * 10) / 10 : null,
          lastReadingAt: latestTs,
          onlineSites: okLatest.filter((r) => (Number(r.ACPower) || 0) > 0).length,
          totalSites: siteIds.length,
          isStale,
        });
      })
    );

    // 4. Build plant objects
    const plants: HostPlant[] = projects.map(
      (p: {
        id: string;
        name: string;
        location: string;
        state: string;
        total_kw: number;
        rate_per_kwh: number;
        status: string;
        trillectric_site_ids: string[] | null;
        created_at: string;
      }) => {
        const totalKw = Number(p.total_kw || 0);
        const ppaRate =
          ppaRateByProject.get(p.id) ?? Number(p.rate_per_kwh || 0);

        // Generation rollups
        const lifetimeKwh = generations
          .filter((g: { project_id: string; kwh: number }) => g.project_id === p.id)
          .reduce((s: number, g: { kwh: number }) => s + Number(g.kwh || 0), 0);
        const monthlyKwh = generations
          .filter(
            (g: { project_id: string; month: number; year: number; kwh: number }) =>
              g.project_id === p.id &&
              g.month === currentMonth &&
              g.year === currentYear
          )
          .reduce((s: number, g: { kwh: number }) => s + Number(g.kwh || 0), 0);

        const todayRow = dailies.find(
          (d: { project_id: string; date: string }) =>
            d.project_id === p.id && d.date === todayIso
        );
        const todayKwhFromDaily = todayRow ? Number(todayRow.kwh || 0) : 0;

        // Prefer live today value if we have it
        const live = liveByProject.get(p.id) ?? null;
        const todayKwh = live?.energyTodayKwh ?? todayKwhFromDaily;

        // Yesterday trend
        const yesterdayIso = new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        const yRow = dailies.find(
          (d: { project_id: string; date: string }) =>
            d.project_id === p.id && d.date === yesterdayIso
        );
        const yesterdayKwh = yRow ? Number(yRow.kwh || 0) : 0;
        const todayTrend =
          yesterdayKwh > 0
            ? Math.round(((todayKwh - yesterdayKwh) / yesterdayKwh) * 100)
            : 0;

        // Efficiency: actual monthly / expected monthly
        const expectedMonthly =
          totalKw *
          SOLAR_CONSTANTS.avgGenerationPerKwPerDay *
          SOLAR_CONSTANTS.daysPerMonth;
        const efficiency =
          expectedMonthly > 0
            ? Math.min(100, Math.round((monthlyKwh / expectedMonthly) * 100))
            : 0;

        const monthlyRevenue = Math.round(monthlyKwh * ppaRate);
        const co2OffsetTons =
          Math.round(lifetimeKwh * SOLAR_CONSTANTS.co2PerKwh * 0.001 * 10) / 10;

        const plantAlerts = alerts
          .filter(
            (a: { project_id: string }) => a.project_id === p.id
          )
          .slice(0, 5)
          .map(
            (a: {
              id: string;
              title: string;
              severity: string;
              created_at: string;
            }) => ({
              id: a.id,
              title: a.title,
              severity: alertSeverity(a.severity),
              time: timeAgo(a.created_at),
            })
          );

        // Daily generation (hours) — use today's inverter readings if live
        // data is cached here, otherwise empty. Detail view handles empty.
        const dailyGeneration: { hour: string; kwh: number }[] = [];

        // Monthly generation — last 6 months from generations
        const monthlyGeneration = Array.from({ length: 6 }).map((_, i) => {
          const d = new Date(currentYear, currentMonth - 1 - (5 - i), 1);
          const m = d.getMonth() + 1;
          const y = d.getFullYear();
          const row = generations.find(
            (g: {
              project_id: string;
              month: number;
              year: number;
              kwh: number;
            }) => g.project_id === p.id && g.month === m && g.year === y
          );
          return {
            month: d.toLocaleDateString("en-IN", { month: "short" }),
            kwh: row ? Number(row.kwh || 0) : 0,
            expected: Math.round(expectedMonthly),
          };
        });

        return {
          id: p.id,
          name: p.name,
          location: p.location,
          state: p.state,
          capacityKw: totalKw,
          status: projectStatusToUi(p.status),
          todayKwh: Math.round(todayKwh * 10) / 10,
          monthlyKwh: Math.round(monthlyKwh),
          lifetimeKwh: Math.round(lifetimeKwh),
          efficiency,
          ppaRate,
          monthlyRevenue,
          todayTrend,
          co2OffsetTons,
          trillectricSiteIds: Array.isArray(p.trillectric_site_ids)
            ? p.trillectric_site_ids.filter(
                (s): s is string => typeof s === "string" && s.length > 0
              )
            : [],
          live,
          alerts: plantAlerts,
          commissionedDate: p.created_at,
          lastMaintenanceDate: "",
          nextMaintenanceDate: "",
          panelCount: 0,
          inverterCount: live?.totalSites ?? 0,
          panelType: "",
          tiltAngle: 0,
          areaAcres: 0,
          weather: {
            temp: 0,
            condition: "",
            irradiance: 0,
            humidity: 0,
            windSpeed: 0,
          },
          dailyGeneration,
          monthlyGeneration,
        };
      }
    );

    // 5. Fleet aggregates
    const totalCapacityKw = plants.reduce((s, p) => s + p.capacityKw, 0);
    const todayKwh = plants.reduce((s, p) => s + p.todayKwh, 0);
    const monthlyKwh = plants.reduce((s, p) => s + p.monthlyKwh, 0);
    const lifetimeKwh = plants.reduce((s, p) => s + p.lifetimeKwh, 0);
    const avgEfficiency =
      plants.length > 0
        ? Math.round(
            plants.reduce((s, p) => s + p.efficiency, 0) / plants.length
          )
        : 0;
    const co2OffsetTons =
      Math.round(plants.reduce((s, p) => s + p.co2OffsetTons, 0) * 10) / 10;
    const activePlants = plants.filter((p) => p.status === "ACTIVE").length;
    const onlinePlants = plants.filter(
      (p) => p.live && p.live.onlineSites > 0
    ).length;

    const payload: HostPlantsResponse = {
      plants,
      fleet: {
        totalCapacityKw,
        todayKwh: Math.round(todayKwh * 10) / 10,
        monthlyKwh,
        lifetimeKwh,
        avgEfficiency,
        co2OffsetTons,
        activePlants,
        totalPlants: plants.length,
        onlinePlants,
      },
    };

    return NextResponse.json({ success: true, data: payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[host/plants] fatal:", msg);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
