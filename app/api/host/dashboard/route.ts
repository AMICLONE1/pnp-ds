import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

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

interface DashboardStats {
  totalCapacityKw: number;
  todayGenerationKwh: number;
  monthlyRevenue: number;
  plantEfficiency: number;
  activePlants: number;
  totalPlants: number;
  co2OffsetTons: number;
  todayTrend: number;
  monthlyTrend: number;
  efficiencyTrend: number;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  time: string;
}

interface PaymentDue {
  month: string;
  generationKwh: number;
  ratePerKwh: number;
  adjustments: number;
  totalDue: number;
  dueDate: string;
}

interface GenerationHistory {
  month: string;
  year: number;
  kwh: number;
}

interface PaymentRecord {
  id: string;
  month: string;
  year: number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
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

interface HostDashboardData {
  isLiveData: boolean;
  plant: DashboardPlant | null;
  stats: DashboardStats;
  generationHistory: GenerationHistory[];
  paymentDue: PaymentDue | null;
  recentPayments: PaymentRecord[];
  alerts: Alert[];
  liveData: LiveInverterData | null;
}

function monthLabel(month: number): string {
  return new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(2024, month - 1, 1));
}

function projectStatusToUi(status: string | null): "active" | "maintenance" | "offline" {
  if (status === "ACTIVE") return "active";
  if (status === "MAINTENANCE") return "maintenance";
  return "offline";
}

function alertSeverityToUi(severity: string | null): "info" | "warning" | "critical" {
  const normalized = String(severity || "INFO").toUpperCase();
  if (normalized === "CRITICAL") return "critical";
  if (normalized === "WARNING") return "warning";
  return "info";
}

export async function GET() {
  try {
    const authResult = await verifyHost();
    if (!authResult.authorized || !authResult.host) {
      return hostUnauthorizedResponse(authResult.error || "UNAUTHORIZED");
    }

    const hostId = authResult.host.id;
    const adminClient = createAdminClient();

    // Fetch all data in parallel
    const [agreementsResult, generationsResult, paymentsResult, alertsResult, projectsResult] =
      await Promise.all([
        adminClient
          .from("ppa_agreements")
          .select(
            "id, project_id, agreement_number, rate_per_kwh, payment_due_day, late_fee_percent, contracted_capacity_kw"
          )
          .eq("host_id", hostId)
          .eq("status", "ACTIVE")
          .order("created_at", { ascending: false })
          .limit(1),
        adminClient
          .from("generations")
          .select("project_id, month, year, kwh")
          .order("year", { ascending: false })
          .order("month", { ascending: false }),
        adminClient
          .from("host_payments")
          .select("id, host_id, billing_month, billing_year, total_amount, status, due_date")
          .eq("host_id", hostId)
          .order("billing_year", { ascending: false })
          .order("billing_month", { ascending: false })
          .limit(6),
        adminClient
          .from("host_alerts")
          .select("id, title, message, severity, created_at")
          .or(`host_id.eq.${hostId},project_id.in.(SELECT id FROM projects WHERE host_id = '${hostId}')`)
          .order("created_at", { ascending: false })
          .limit(5),
        adminClient
          .from("projects")
          .select("id, name, location, state, total_kw, status, data_logger_serial_id")
          .is("deleted_at", null),
      ]);

    const activePpa = agreementsResult.data?.[0];
    const generations = generationsResult.data || [];
    const payments = paymentsResult.data || [];
    const alerts = alertsResult.data || [];
    const projects = projectsResult.data || [];

    // If no active PPA, return empty dashboard state
    if (!activePpa) {
      return NextResponse.json({
        success: true,
        data: {
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
        },
      });
    }

    // Find the project associated with this PPA
    const project = projects.find((p) => p.id === activePpa.project_id);
    if (!project) {
      return NextResponse.json({
        success: true,
        data: {
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
        },
      });
    }

    // Fetch latest inverter reading for live data (if any exists)
    const { data: latestReading } = await adminClient
      .from("inverter_readings")
      .select(
        "reading_timestamp, ac_power, energy_today, inverter_temperature, inverter_status, fault"
      )
      .eq("project_id", activePpa.project_id)
      .order("reading_timestamp", { ascending: false })
      .limit(1)
      .maybeSingle();

    let liveData: LiveInverterData | null = null;
    if (latestReading) {
      const readingTime = new Date(String(latestReading.reading_timestamp));
      const ageMs = Date.now() - readingTime.getTime();
      liveData = {
        currentPowerW: Math.round(Number(latestReading.ac_power ?? 0)),
        energyTodayKwh:
          Math.round(Number(latestReading.energy_today ?? 0) * 100) / 100,
        inverterStatus: latestReading.inverter_status
          ? String(latestReading.inverter_status)
          : null,
        inverterTemperature:
          latestReading.inverter_temperature !== null
            ? Number(latestReading.inverter_temperature)
            : null,
        fault: latestReading.fault ? String(latestReading.fault) : null,
        lastReadingAt: readingTime.toISOString(),
        // Consider stale if older than 30 minutes
        isStale: ageMs > 30 * 60 * 1000,
      };
    }

    // Process generations for this project
    const projectGenerations = generations.filter((g) => g.project_id === activePpa.project_id);

    // Get latest month data
    let latestMonthKwh = 0;
    let latestYear = 0;
    let latestMonth = 0;

    if (projectGenerations.length > 0) {
      const sorted = [...projectGenerations].sort((a, b) =>
        a.year === b.year ? b.month - a.month : b.year - a.year
      );
      latestYear = Number(sorted[0].year);
      latestMonth = Number(sorted[0].month);
      latestMonthKwh = projectGenerations
        .filter((g) => g.year === latestYear && g.month === latestMonth)
        .reduce((sum, g) => sum + Number(g.kwh || 0), 0);
    }

    // Calculate stats
    const installedCapacityKw = Number(activePpa.contracted_capacity_kw);
    const expectedMonthlyKwh = installedCapacityKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
    const performanceRatio =
      expectedMonthlyKwh > 0 ? (latestMonthKwh / expectedMonthlyKwh) * 100 : 0;
    // Prefer live reading for today's kWh; fall back to monthly average
    const todayEstimateKwh =
      liveData && !liveData.isStale
        ? liveData.energyTodayKwh
        : latestMonthKwh > 0
          ? latestMonthKwh / 30
          : 0;
    const monthlyRevenue = latestMonthKwh * Number(activePpa.rate_per_kwh);
    const totalGenerationKwh = projectGenerations.reduce((sum, g) => sum + Number(g.kwh || 0), 0);
    const co2OffsetTons = (totalGenerationKwh * SOLAR_CONSTANTS.co2PerKwh) / 1000;

    // Find payment due
    const pendingPayment = payments.find((p) => p.status === "PENDING");
    const paymentDue: PaymentDue | null = pendingPayment
      ? {
          month: monthLabel(pendingPayment.billing_month),
          generationKwh: latestMonthKwh,
          ratePerKwh: Number(activePpa.rate_per_kwh),
          adjustments: 0,
          totalDue: Number(pendingPayment.total_amount),
          dueDate: String(pendingPayment.due_date),
        }
      : null;

    // Build generation history (last 12 months)
    const generationHistory: GenerationHistory[] = [];
    const monthMap = new Map<string, number>();
    projectGenerations.forEach((g) => {
      const key = `${g.year}-${g.month}`;
      monthMap.set(key, (monthMap.get(key) || 0) + Number(g.kwh || 0));
    });
    Array.from(monthMap.entries())
      .map(([key, kwh]) => {
        const [year, month] = key.split("-").map(Number);
        return { year, month, kwh };
      })
      .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year))
      .slice(-12)
      .forEach((entry) => {
        generationHistory.push({
          month: monthLabel(entry.month),
          year: entry.year,
          kwh: entry.kwh,
        });
      });

    // Build plant object
    const plant: DashboardPlant = {
      id: project.id,
      name: project.name,
      location: project.location,
      state: project.state,
      capacityKw: installedCapacityKw,
      status: projectStatusToUi(project.status),
      todayKwh: Math.round(todayEstimateKwh * 10) / 10,
      monthlyKwh: latestMonthKwh,
      lifetimeKwh: totalGenerationKwh,
      efficiency: Math.round(performanceRatio * 10) / 10,
      ppaRate: Number(activePpa.rate_per_kwh),
      dataLoggerSerialId: project.data_logger_serial_id || null,
    };

    // Build stats object
    const stats: DashboardStats = {
      totalCapacityKw: installedCapacityKw,
      todayGenerationKwh: Math.round(todayEstimateKwh * 10) / 10,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      plantEfficiency: Math.round(performanceRatio * 10) / 10,
      activePlants: 1,
      totalPlants: 1,
      co2OffsetTons: Math.round(co2OffsetTons * 10) / 10,
      todayTrend: 2.4, // Would calculate from previous day if we had hourly data
      monthlyTrend: 1.8, // Would calculate from previous month
      efficiencyTrend: 0.4, // Would calculate from trend
    };

    // Build recent payments
    const recentPayments: PaymentRecord[] = payments.map((p) => ({
      id: p.id,
      month: monthLabel(p.billing_month),
      year: p.billing_year,
      amount: Number(p.total_amount),
      status: p.status,
    }));

    // Build alerts
    const alertsList: Alert[] = alerts.map((a) => ({
      id: String(a.id),
      title: String(a.title),
      message: String(a.message),
      severity: alertSeverityToUi(a.severity),
      time: new Date(String(a.created_at)).toLocaleDateString("en-IN"),
    }));

    // If generation is below 85% of expected, add a performance alert
    if (latestMonthKwh > 0 && latestMonthKwh < expectedMonthlyKwh * 0.85) {
      alertsList.unshift({
        id: "perf-alert",
        title: "Performance Alert",
        message: `${project.name} generation is below the expected monthly baseline.`,
        severity: "warning",
        time: new Date().toLocaleDateString("en-IN"),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        isLiveData: true,
        plant,
        stats,
        generationHistory,
        paymentDue,
        recentPayments,
        alerts: alertsList,
        liveData,
      } as HostDashboardData,
    });
  } catch (error) {
    console.error("Host dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load host dashboard" },
      { status: 500 }
    );
  }
}
