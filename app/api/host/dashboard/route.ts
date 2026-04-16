import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTrillectricClient, TrillectricError } from "@/lib/trillectric/client";
import type { TrillectricReading } from "@/lib/trillectric/types";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

// ============================================
// GET /api/host/dashboard
//
// Fleet-wide host snapshot: aggregated across every plant owned by the
// host (not just the first active PPA). Live Trillectric data is pulled
// per-plant and rolled up into the stats block.
// ============================================

export const dynamic = "force-dynamic";

interface DashboardPlant {
  id: string;
  name: string;
  location: string;
  state: string;
  capacityKw: number;
  status: "active" | "maintenance" | "offline";
  todayKwh: number;
  monthlyKwh: number;
  lifetimeKwh: number;
  efficiency: number;
  ppaRate: number;
  dataLoggerSerialId: string | null;
}

interface LiveInverterData {
  currentPowerW: number;
  energyTodayKwh: number;
  inverterStatus: string | null;
  inverterTemperature: number | null;
  fault: string | null;
  lastReadingAt: string;
  isStale: boolean;
}

function uiStatus(s: string | null): "active" | "maintenance" | "offline" {
  if (s === "ACTIVE") return "active";
  if (s === "MAINTENANCE") return "maintenance";
  return "offline";
}

function monthLabel(m: number): string {
  return new Intl.DateTimeFormat("en-IN", { month: "short" }).format(
    new Date(2024, m - 1, 1)
  );
}

function pickLatest(readings: TrillectricReading[]): TrillectricReading | null {
  if (!readings.length) return null;
  return readings.reduce((best, r) =>
    !best || r.ReadingTimeStamp > best.ReadingTimeStamp ? r : best
  );
}

export async function GET() {
  try {
    const auth = await verifyHost();
    if (!auth.authorized || !auth.host) {
      return hostUnauthorizedResponse(auth.error || "UNAUTHORIZED");
    }
    const hostId = auth.host.id;
    const admin = createAdminClient();

    const [projectsRes, ppasRes, paymentsRes, alertsRes, genRes] =
      await Promise.all([
        admin
          .from("projects")
          .select(
            "id, name, location, state, total_kw, rate_per_kwh, status, trillectric_site_ids, created_at"
          )
          .eq("host_id", hostId)
          .is("deleted_at", null),
        admin
          .from("ppa_agreements")
          .select("project_id, rate_per_kwh, status")
          .eq("host_id", hostId)
          .eq("status", "ACTIVE"),
        admin
          .from("host_payments")
          .select("id, billing_month, billing_year, total_amount, status, due_date")
          .eq("host_id", hostId)
          .order("billing_year", { ascending: false })
          .order("billing_month", { ascending: false })
          .limit(6),
        admin
          .from("host_alerts")
          .select("id, title, message, severity, created_at, status, project_id")
          .eq("host_id", hostId)
          .eq("status", "ACTIVE")
          .order("created_at", { ascending: false })
          .limit(10),
        admin
          .from("generations")
          .select("project_id, month, year, kwh"),
      ]);

    const projects = projectsRes.data || [];
    const ppas = ppasRes.data || [];
    const payments = paymentsRes.data || [];
    const alerts = alertsRes.data || [];
    const allGenerations = genRes.data || [];

    if (projects.length === 0) {
      return NextResponse.json({
        success: true,
        data: emptyPayload(),
      });
    }

    const projectIds = projects.map((p: { id: string }) => p.id);
    const generations = allGenerations.filter(
      (g: { project_id: string }) => projectIds.includes(g.project_id)
    );

    const ppaRateByProject = new Map<string, number>();
    ppas.forEach((p: { project_id: string; rate_per_kwh: number }) => {
      ppaRateByProject.set(p.project_id, Number(p.rate_per_kwh || 0));
    });

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Fetch live Trillectric data per plant
    const client = getTrillectricClient();
    const liveByProject = new Map<string, LiveInverterData | null>();

    await Promise.all(
      projects.map(
        async (p: { id: string; trillectric_site_ids: string[] | null }) => {
          const siteIds = Array.isArray(p.trillectric_site_ids)
            ? p.trillectric_site_ids.filter(
                (s): s is string => typeof s === "string" && s.length > 0
              )
            : [];
          if (siteIds.length === 0) {
            liveByProject.set(p.id, null);
            return;
          }

          const latestPerSite = await Promise.all(
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
                    : String(err);
                console.warn(`[host/dashboard] site ${siteId}: ${msg}`);
                return null;
              }
            })
          );

          const ok = latestPerSite.filter(
            (r): r is TrillectricReading => r !== null
          );
          if (ok.length === 0) {
            liveByProject.set(p.id, null);
            return;
          }

          const acPower = ok.reduce((s, r) => s + (Number(r.ACPower) || 0), 0);
          const energyToday = ok.reduce(
            (s, r) => s + (Number(r.EnergyToday) || 0),
            0
          );
          const temps = ok
            .map((r) => Number(r.InverterTemperature1))
            .filter((n) => !Number.isNaN(n));
          const avgTemp =
            temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
          const latestTs = ok
            .map((r) => r.ReadingTimeStamp)
            .sort()
            .slice(-1)[0];
          const ageMs = Date.now() - new Date(latestTs).getTime();

          liveByProject.set(p.id, {
            currentPowerW: Math.round(acPower),
            energyTodayKwh: Math.round(energyToday * 100) / 100,
            inverterStatus: ok[0].InverterStatus ? String(ok[0].InverterStatus) : null,
            inverterTemperature: avgTemp != null ? Math.round(avgTemp * 10) / 10 : null,
            fault: ok[0].fault ?? null,
            lastReadingAt: latestTs,
            isStale: ageMs > 30 * 60 * 1000,
          });
        }
      )
    );

    // Build per-plant stats
    const plantStats = projects.map(
      (p: {
        id: string;
        name: string;
        location: string;
        state: string;
        total_kw: number;
        rate_per_kwh: number;
        status: string;
      }) => {
        const totalKw = Number(p.total_kw || 0);
        const ppaRate = ppaRateByProject.get(p.id) ?? Number(p.rate_per_kwh || 0);
        const lifetimeKwh = generations
          .filter((g: { project_id: string }) => g.project_id === p.id)
          .reduce(
            (s: number, g: { kwh: number }) => s + Number(g.kwh || 0),
            0
          );
        const monthlyKwh = generations
          .filter(
            (g: {
              project_id: string;
              month: number;
              year: number;
            }) =>
              g.project_id === p.id &&
              g.month === currentMonth &&
              g.year === currentYear
          )
          .reduce(
            (s: number, g: { kwh: number }) => s + Number(g.kwh || 0),
            0
          );
        const live = liveByProject.get(p.id) ?? null;
        const todayKwh = live?.energyTodayKwh ?? 0;
        const expectedMonthly =
          totalKw *
          SOLAR_CONSTANTS.avgGenerationPerKwPerDay *
          SOLAR_CONSTANTS.daysPerMonth;
        const efficiency =
          expectedMonthly > 0
            ? Math.min(
                100,
                Math.round((monthlyKwh / expectedMonthly) * 1000) / 10
              )
            : 0;

        return {
          plant: {
            id: p.id,
            name: p.name,
            location: p.location,
            state: p.state,
            capacityKw: totalKw,
            status: uiStatus(p.status),
            todayKwh,
            monthlyKwh,
            lifetimeKwh,
            efficiency,
            ppaRate,
            dataLoggerSerialId: null,
          } as DashboardPlant,
          live,
          expectedMonthly,
        };
      }
    );

    // Fleet aggregates
    const totalCapacityKw = plantStats.reduce(
      (s: number, x: { plant: DashboardPlant }) => s + x.plant.capacityKw,
      0
    );
    const todayGenerationKwh =
      Math.round(
        plantStats.reduce(
          (s: number, x: { plant: DashboardPlant }) => s + x.plant.todayKwh,
          0
        ) * 10
      ) / 10;
    const monthlyKwhTotal = plantStats.reduce(
      (s: number, x: { plant: DashboardPlant }) => s + x.plant.monthlyKwh,
      0
    );
    const lifetimeKwhTotal = plantStats.reduce(
      (s: number, x: { plant: DashboardPlant }) => s + x.plant.lifetimeKwh,
      0
    );
    const monthlyRevenue = plantStats.reduce(
      (s: number, x: { plant: DashboardPlant }) =>
        s + x.plant.monthlyKwh * x.plant.ppaRate,
      0
    );
    const plantEfficiency =
      plantStats.length > 0
        ? Math.round(
            (plantStats.reduce(
              (s: number, x: { plant: DashboardPlant }) => s + x.plant.efficiency,
              0
            ) /
              plantStats.length) *
              10
          ) / 10
        : 0;
    const co2OffsetTons =
      Math.round(lifetimeKwhTotal * SOLAR_CONSTANTS.co2PerKwh * 0.001 * 10) / 10;
    const activePlants = plantStats.filter(
      (x: { plant: DashboardPlant }) => x.plant.status === "active"
    ).length;

    // Pick a representative plant for PlantOverviewCards (largest)
    const representative = plantStats.sort(
      (a: { plant: DashboardPlant }, b: { plant: DashboardPlant }) =>
        b.plant.capacityKw - a.plant.capacityKw
    )[0];

    // Generation history last 12 months (fleet-wide)
    const monthMap = new Map<string, number>();
    generations.forEach((g: { month: number; year: number; kwh: number }) => {
      const key = `${g.year}-${g.month}`;
      monthMap.set(key, (monthMap.get(key) || 0) + Number(g.kwh || 0));
    });
    const generationHistory = Array.from(monthMap.entries())
      .map(([key, kwh]) => {
        const [year, month] = key.split("-").map(Number);
        return { year, month, kwh };
      })
      .sort((a, b) =>
        a.year === b.year ? a.month - b.month : a.year - b.year
      )
      .slice(-12)
      .map((e) => ({
        month: monthLabel(e.month),
        year: e.year,
        kwh: Math.round(e.kwh),
      }));

    // Payment due — first PENDING
    const pending = payments.find(
      (p: { status: string }) => p.status === "PENDING"
    );
    const paymentDue = pending
      ? {
          month: monthLabel(pending.billing_month),
          generationKwh: monthlyKwhTotal,
          ratePerKwh: plantStats[0]?.plant.ppaRate ?? 0,
          adjustments: 0,
          totalDue: Number(pending.total_amount),
          dueDate: String(pending.due_date),
          paymentId: pending.id,
        }
      : null;

    const recentPayments = payments.map(
      (p: {
        id: string;
        billing_month: number;
        billing_year: number;
        total_amount: number;
        status: "PENDING" | "COMPLETED" | "FAILED";
      }) => ({
        id: p.id,
        month: monthLabel(p.billing_month),
        year: p.billing_year,
        amount: Number(p.total_amount),
        status: p.status,
      })
    );

    const alertsList = alerts.map(
      (a: {
        id: string;
        title: string;
        message: string;
        severity: string | null;
        created_at: string;
      }) => ({
        id: String(a.id),
        title: String(a.title),
        message: String(a.message),
        severity:
          String(a.severity || "INFO").toUpperCase() === "CRITICAL"
            ? "critical"
            : String(a.severity || "INFO").toUpperCase() === "WARNING"
            ? "warning"
            : "info",
        time: new Date(a.created_at).toLocaleDateString("en-IN"),
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        isLiveData: true,
        plant: representative?.plant ?? null,
        stats: {
          totalCapacityKw,
          todayGenerationKwh,
          monthlyRevenue: Math.round(monthlyRevenue),
          plantEfficiency,
          activePlants,
          totalPlants: plantStats.length,
          co2OffsetTons,
          todayTrend: 0,
          monthlyTrend: 0,
          efficiencyTrend: 0,
        },
        generationHistory,
        paymentDue,
        recentPayments,
        alerts: alertsList,
        liveData: representative?.live ?? null,
      },
    });
  } catch (error) {
    console.error("[host/dashboard] fatal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load host dashboard" },
      { status: 500 }
    );
  }
}

function emptyPayload() {
  return {
    isLiveData: false,
    plant: null,
    stats: {
      totalCapacityKw: 0,
      todayGenerationKwh: 0,
      monthlyRevenue: 0,
      plantEfficiency: 0,
      activePlants: 0,
      totalPlants: 0,
      co2OffsetTons: 0,
      todayTrend: 0,
      monthlyTrend: 0,
      efficiencyTrend: 0,
    },
    generationHistory: [],
    paymentDue: null,
    recentPayments: [],
    alerts: [],
    liveData: null,
  };
}
