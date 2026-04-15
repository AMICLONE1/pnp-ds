// ============================================
// Host Inverter Detail Endpoint
//
// Returns time-series inverter data for the
// authenticated host's project. Used by the
// host dashboard to render live readings,
// MPPT data, and string-level monitoring.
//
// Query params:
//   ?period=today    (default — last 24h)
//   ?period=yesterday
//   ?period=week     (last 7 days)
//   ?period=month    (last 30 days)
// ============================================

import { NextResponse } from "next/server";
import { verifyHost } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Period = "today" | "yesterday" | "week" | "month";

function parsePeriod(value: string | null): Period {
  if (value === "yesterday" || value === "week" || value === "month") {
    return value;
  }
  return "today";
}

function periodRange(period: Period): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case "yesterday":
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case "week":
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    case "month":
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      break;
    case "today":
    default:
      start.setHours(0, 0, 0, 0);
      break;
  }

  return { start, end };
}

export async function GET(request: Request) {
  const hostResult = await verifyHost();
  if (!hostResult.authorized || !hostResult.hostId) {
    return NextResponse.json(
      { success: false, error: hostResult.error ?? "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const period = parsePeriod(url.searchParams.get("period"));
  const { start, end } = periodRange(period);

  try {
    const adminClient = createAdminClient();

    // Find the host's active project(s)
    const { data: projects, error: projError } = await adminClient
      .from("projects")
      .select("id, name, data_logger_serial_id, total_kw")
      .eq("host_id", hostResult.hostId)
      .eq("status", "ACTIVE")
      .is("deleted_at", null);

    if (projError) {
      return NextResponse.json(
        { success: false, error: projError.message },
        { status: 500 }
      );
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json({
        success: true,
        period,
        projects: [],
        latest: null,
        readings: [],
      });
    }

    const projectIds = projects.map((p) => p.id as string);

    // Fetch readings in the period (cap at 500 points for chart performance)
    const { data: readings, error: readingsError } = await adminClient
      .from("inverter_readings")
      .select(
        "id, project_id, reading_timestamp, ac_power, energy_today, energy_lifetime, frequency, power_factor, inverter_temperature, mppt_currents, mppt_voltages, mppt_powers, ac_currents, ac_voltages, string_voltages, string_currents, string_powers, inverter_status, fault, runtime_today, apparent_power, reactive_power"
      )
      .in("project_id", projectIds)
      .gte("reading_timestamp", start.toISOString())
      .lte("reading_timestamp", end.toISOString())
      .order("reading_timestamp", { ascending: true })
      .limit(500);

    if (readingsError) {
      return NextResponse.json(
        { success: false, error: readingsError.message },
        { status: 500 }
      );
    }

    // Latest reading per project (for live stats)
    const latestByProject = new Map<string, (typeof readings)[number]>();
    for (const r of readings ?? []) {
      const existing = latestByProject.get(r.project_id as string);
      if (
        !existing ||
        new Date(r.reading_timestamp as string) >
          new Date(existing.reading_timestamp as string)
      ) {
        latestByProject.set(r.project_id as string, r);
      }
    }

    // Daily generations for chart data
    const dailyStart = new Date(start);
    dailyStart.setDate(dailyStart.getDate() - 1);
    const { data: daily } = await adminClient
      .from("daily_generations")
      .select("project_id, date, kwh, peak_power_w, avg_temperature")
      .in("project_id", projectIds)
      .gte("date", dailyStart.toISOString().slice(0, 10))
      .order("date", { ascending: true });

    return NextResponse.json({
      success: true,
      period,
      range: { start: start.toISOString(), end: end.toISOString() },
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        dataLoggerSerialId: p.data_logger_serial_id,
        totalKw: Number(p.total_kw),
        latest: latestByProject.get(p.id as string) ?? null,
      })),
      readings: readings ?? [],
      dailyGenerations: daily ?? [],
    });
  } catch (err) {
    console.error("[host/inverter] error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
