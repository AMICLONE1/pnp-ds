// ============================================
// Trillectric Sync Cron Endpoint
//
// Called periodically by Vercel Cron (or manually
// with a CRON_SECRET bearer header) to fetch fresh
// inverter data from Trillectric for every active
// project with a data_logger_serial_id.
//
// Pipeline per project:
//   1. Fetch today's readings from Trillectric
//   2. Upsert into inverter_readings (idempotent)
//   3. Aggregate daily → daily_generations
//   4. Roll up month → generations table
//   5. Detect faults → host_alerts
//   6. Distribute credits to allocated users
//
// Usage:
//   GET /api/cron/trillectric-sync                -> syncs all projects
//   GET /api/cron/trillectric-sync?projectId=...  -> syncs one project
// ============================================

import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTrillectricClient, TrillectricError } from "@/lib/trillectric/client";
import {
  aggregateDaily,
  detectFault,
  mapReadingToRow,
} from "@/lib/trillectric/mapper";
import { distributeCredits } from "@/lib/trillectric/credits";
import type {
  ProjectSyncResult,
  TrillectricReading,
} from "@/lib/trillectric/types";

// Never cache — always run fresh
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ProjectRow {
  id: string;
  name: string;
  total_kw: number;
  host_id: string | null;
  data_logger_serial_id: string | null;
  logger_api_key: string | null;
  trillectric_site_ids: string[] | null;
  status: string;
}

/**
 * Resolve the effective Trillectric site IDs for a project. Prefers the
 * new TEXT[] column; falls back to the legacy single serial so plants
 * predating the migration still sync.
 */
function resolveSiteIds(project: ProjectRow): string[] {
  const fromArray = Array.isArray(project.trillectric_site_ids)
    ? project.trillectric_site_ids.filter(
        (s): s is string => typeof s === "string" && s.length > 0
      )
    : [];
  if (fromArray.length > 0) return fromArray;
  return project.data_logger_serial_id ? [project.data_logger_serial_id] : [];
}

function verifyCronAuth(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // If not configured, allow in dev but log loudly
    console.warn("[trillectric-sync] CRON_SECRET not set — allowing request");
    return true;
  }
  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const projectIdFilter = url.searchParams.get("projectId");

  try {
    const adminClient = createAdminClient();

    // Fetch syncable projects
    let query = adminClient
      .from("projects")
      .select(
        "id, name, total_kw, host_id, data_logger_serial_id, logger_api_key, trillectric_site_ids, status"
      )
      .eq("status", "ACTIVE")
      .is("deleted_at", null);

    if (projectIdFilter) {
      query = query.eq("id", projectIdFilter);
    }

    const { data: projects, error: projectsError } = await query;

    if (projectsError) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch projects: ${projectsError.message}`,
        },
        { status: 500 }
      );
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No syncable projects found",
        results: [],
      });
    }

    const results: ProjectSyncResult[] = [];

    // Sequential processing to respect API rate limits
    for (const project of projects as ProjectRow[]) {
      const siteIds = resolveSiteIds(project);
      if (siteIds.length === 0) continue;
      const result = await syncProject(adminClient, project, siteIds);
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      projectCount: results.length,
      results,
    });
  } catch (err) {
    console.error("[trillectric-sync] fatal error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function syncProject(
  adminClient: SupabaseClient,
  project: ProjectRow,
  siteIds: string[]
): Promise<ProjectSyncResult> {
  const result: ProjectSyncResult = {
    projectId: project.id,
    projectName: project.name,
    siteId: siteIds.join(","),
    status: "SUCCESS",
    readingsFetched: 0,
    readingsInserted: 0,
    dailyKwh: null,
    monthlyKwh: null,
    creditsDistributed: 0,
  };

  // Create sync_logs entry
  const { data: syncLog } = await adminClient
    .from("sync_logs")
    .insert({
      project_id: project.id,
      sync_type: "TRILLECTRIC_FETCH",
      status: "STARTED",
      metadata: { siteIds },
    })
    .select("id")
    .single();

  const syncLogId = syncLog?.id as string | undefined;

  try {
    // 1. Fetch from Trillectric for every bound site ID. We fan out in
    //    parallel and tolerate per-site failures so one bad inverter
    //    doesn't block the whole plant's sync. Readings are then
    //    concatenated — aggregateDaily and the rollup are already
    //    correct for multi-inverter input because EnergyToday is
    //    cumulative per-site and we sum across sites below.
    const client = getTrillectricClient();
    const siteErrors: string[] = [];
    const siteReadings = await Promise.all(
      siteIds.map(async (siteId) => {
        try {
          const data = await client.fetchData(
            siteId,
            "today",
            project.logger_api_key ?? undefined
          );
          return { siteId, readings: data };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          siteErrors.push(`${siteId}: ${msg}`);
          console.error(
            `[trillectric-sync] project ${project.id} site ${siteId} failed:`,
            msg
          );
          return { siteId, readings: [] as TrillectricReading[] };
        }
      })
    );

    const readings: TrillectricReading[] = siteReadings.flatMap(
      (s) => s.readings
    );
    result.readingsFetched = readings.length;

    if (siteErrors.length > 0 && readings.length === 0) {
      // Every site failed — surface as a hard failure.
      throw new Error(`All sites failed: ${siteErrors.join("; ")}`);
    }

    if (readings.length === 0) {
      result.status = "SUCCESS";
      await updateSyncLog(adminClient, syncLogId, {
        status: "SUCCESS",
        readings_fetched: 0,
        readings_inserted: 0,
      });
      return result;
    }

    // 2. Upsert raw readings (idempotent via unique constraint)
    const rows = readings.map((r) => mapReadingToRow(r, project.id));
    const { error: upsertError, count } = await adminClient
      .from("inverter_readings")
      .upsert(rows, {
        onConflict: "project_id,reading_timestamp",
        ignoreDuplicates: true,
        count: "exact",
      });

    if (upsertError) {
      throw new Error(`Upsert failed: ${upsertError.message}`);
    }
    result.readingsInserted = count ?? 0;

    // 3. Aggregate daily — per-site first, then sum across sites.
    //    EnergyToday is a per-inverter cumulative counter, so we take the
    //    latest per site (via aggregateDaily) and then sum those into one
    //    row per date for the whole plant.
    const dailyRows = aggregatePlantDaily(siteReadings, project.id);
    if (dailyRows.length > 0) {
      const { error: dailyError } = await adminClient
        .from("daily_generations")
        .upsert(dailyRows, { onConflict: "project_id,date" });

      if (dailyError) {
        throw new Error(`Daily upsert failed: ${dailyError.message}`);
      }

      // Track today's kwh for the result
      const todayIso = new Date().toISOString().slice(0, 10);
      const todayRow = dailyRows.find((d) => d.date === todayIso);
      result.dailyKwh = todayRow?.kwh ?? null;
    }

    // 4. Monthly rollup → generations table
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const monthlyKwh = await rollupMonthlyGeneration(
      adminClient,
      project.id,
      month,
      year,
      siteIds.join(",")
    );
    result.monthlyKwh = monthlyKwh;

    // 5. Fault detection (use latest reading only)
    await handleFaults(adminClient, project, readings);

    // 6. Distribute credits (only if we have meaningful generation)
    if (monthlyKwh > 0) {
      try {
        const creditResult = await distributeCredits(
          adminClient,
          project.id,
          month,
          year
        );
        result.creditsDistributed =
          creditResult.creditsCreated + creditResult.creditsUpdated;
      } catch (creditErr) {
        console.error(
          `[trillectric-sync] credit distribution failed for ${project.id}:`,
          creditErr
        );
      }
    }

    await updateSyncLog(adminClient, syncLogId, {
      status: "SUCCESS",
      readings_fetched: result.readingsFetched,
      readings_inserted: result.readingsInserted,
    });

    return result;
  } catch (err) {
    const message =
      err instanceof TrillectricError || err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `[trillectric-sync] project ${project.id} failed:`,
      message
    );
    result.status = "FAILED";
    result.error = message;

    await updateSyncLog(adminClient, syncLogId, {
      status: "FAILED",
      error_message: message,
    });

    return result;
  }
}

/**
 * Aggregate multi-site readings into one daily_generations row per date
 * for the whole plant. Per site we take the latest EnergyToday of each
 * day (since it's cumulative), then sum across sites. Peak power and
 * reading counts are summed; temperature is averaged across sites.
 */
function aggregatePlantDaily(
  siteReadings: { siteId: string; readings: TrillectricReading[] }[],
  projectId: string
) {
  const byDate = new Map<
    string,
    {
      date: string;
      kwh: number;
      peak: number;
      tempSum: number;
      tempCount: number;
      count: number;
    }
  >();

  for (const { readings } of siteReadings) {
    if (!readings.length) continue;
    const perSite = aggregateDaily(readings, projectId);
    for (const row of perSite) {
      const existing = byDate.get(row.date) || {
        date: row.date,
        kwh: 0,
        peak: 0,
        tempSum: 0,
        tempCount: 0,
        count: 0,
      };
      existing.kwh += Number(row.kwh || 0);
      if ((row.peak_power_w ?? 0) > existing.peak) {
        existing.peak = Number(row.peak_power_w || 0);
      }
      if (row.avg_temperature != null) {
        existing.tempSum += Number(row.avg_temperature);
        existing.tempCount += 1;
      }
      existing.count += row.reading_count;
      byDate.set(row.date, existing);
    }
  }

  return Array.from(byDate.values()).map((b) => ({
    project_id: projectId,
    date: b.date,
    kwh: Math.round(b.kwh * 100) / 100,
    peak_power_w: b.peak > 0 ? Math.round(b.peak) : null,
    avg_temperature:
      b.tempCount > 0 ? Math.round((b.tempSum / b.tempCount) * 10) / 10 : null,
    reading_count: b.count,
    source: "TRILLECTRIC",
  }));
}

/** Sum daily_generations for a month and upsert into generations table */
async function rollupMonthlyGeneration(
  adminClient: SupabaseClient,
  projectId: string,
  month: number,
  year: number,
  siteId: string
): Promise<number> {
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const monthEnd = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  const { data: dailies, error: dailyError } = await adminClient
    .from("daily_generations")
    .select("kwh")
    .eq("project_id", projectId)
    .gte("date", monthStart)
    .lt("date", monthEnd);

  if (dailyError) {
    throw new Error(`Daily rollup query failed: ${dailyError.message}`);
  }

  const totalKwh =
    (dailies ?? []).reduce((sum, d) => sum + Number(d.kwh || 0), 0) || 0;
  const roundedKwh = Math.round(totalKwh * 100) / 100;

  // Find existing generation row for this period
  const { data: existing } = await adminClient
    .from("generations")
    .select("id")
    .eq("project_id", projectId)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  const payload = {
    project_id: projectId,
    month,
    year,
    kwh: roundedKwh,
    validated: true,
    source: `TRILLECTRIC:${siteId}`,
  };

  if (existing) {
    const { error: updateError } = await adminClient
      .from("generations")
      .update(payload)
      .eq("id", existing.id);
    if (updateError) {
      throw new Error(`Generation update failed: ${updateError.message}`);
    }
  } else {
    const { error: insertError } = await adminClient
      .from("generations")
      .insert(payload);
    if (insertError) {
      throw new Error(`Generation insert failed: ${insertError.message}`);
    }
  }

  return roundedKwh;
}

/** Check latest reading for faults and create host_alerts if needed */
async function handleFaults(
  adminClient: SupabaseClient,
  project: ProjectRow,
  readings: TrillectricReading[]
): Promise<void> {
  if (!project.host_id || readings.length === 0) return;

  // Find the latest reading by timestamp
  const latest = readings.reduce((prev, curr) =>
    new Date(curr.ReadingTimeStamp).getTime() >
    new Date(prev.ReadingTimeStamp).getTime()
      ? curr
      : prev
  );

  const fault = detectFault(latest);
  if (!fault) return;

  // Deduplicate: check for existing active alert with same message in last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: existing } = await adminClient
    .from("host_alerts")
    .select("id")
    .eq("project_id", project.id)
    .eq("status", "ACTIVE")
    .eq("message", fault.message)
    .gte("created_at", since)
    .maybeSingle();

  if (existing) return;

  await adminClient.from("host_alerts").insert({
    host_id: project.host_id,
    project_id: project.id,
    title: `Inverter fault: ${fault.message.slice(0, 80)}`,
    message: fault.message,
    severity: fault.severity,
    status: "ACTIVE",
    category: "SYSTEM",
    metadata: {
      reading_timestamp: latest.ReadingTimeStamp,
      inverter_status: latest.InverterStatus,
      fault: latest.fault,
    },
  });
}

async function updateSyncLog(
  adminClient: SupabaseClient,
  id: string | undefined,
  updates: Record<string, unknown>
): Promise<void> {
  if (!id) return;
  await adminClient
    .from("sync_logs")
    .update({ ...updates, completed_at: new Date().toISOString() })
    .eq("id", id);
}
