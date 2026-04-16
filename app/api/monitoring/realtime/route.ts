import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTrillectricClient, TrillectricError } from "@/lib/trillectric/client";
import type { TrillectricReading } from "@/lib/trillectric/types";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

/**
 * GET /api/monitoring/realtime
 * Real-time solar generation data for the user's active allocations.
 *
 * This now uses live Trillectric inverter readings for the projects tied to
 * the user's allocations, then scales those plant readings to the user's
 * reserved capacity share.
 */

function pickLatestReading(readings: TrillectricReading[]): TrillectricReading | null {
  if (readings.length === 0) return null;
  return readings.reduce((best, reading) =>
    !best || reading.ReadingTimeStamp > best.ReadingTimeStamp ? reading : best
  );
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Not authenticated" },
        },
        { status: 401 }
      );
    }

    const { data: allocations, error: allocationsError } = await supabase
      .from("allocations")
      .select("id, capacity_kw, capacity_block_id")
      .eq("user_id", user.id);

    if (allocationsError) {
      throw allocationsError;
    }

    if (!allocations || allocations.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          currentGeneration: 0,
          todayGeneration: 0,
          monthlyGeneration: 0,
          creditsGenerated: 0,
          efficiency: 0,
        },
      });
    }

    const totalCapacity = allocations.reduce(
      (sum, allocation) => sum + Number(allocation.capacity_kw || 0),
      0
    );
    const blockIds = allocations
      .map((allocation) => allocation.capacity_block_id)
      .filter((blockId): blockId is string => typeof blockId === "string" && blockId.length > 0);

    if (blockIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          currentGeneration: 0,
          todayGeneration: 0,
          monthlyGeneration: 0,
          creditsGenerated: 0,
          efficiency: 0,
        },
      });
    }

    const admin = createAdminClient();

    const { data: blocks, error: blocksError } = await admin
      .from("capacity_blocks")
      .select("id, kw, project_id")
      .in("id", blockIds);

    if (blocksError) {
      throw blocksError;
    }

    const blockById = new Map<string, any>();
    (blocks || []).forEach((block: any) => {
      blockById.set(block.id, block);
    });

    const allocationCapacityByProject = new Map<string, number>();
    allocations.forEach((allocation) => {
      const block = blockById.get(allocation.capacity_block_id);
      if (!block?.project_id) return;

      const current = allocationCapacityByProject.get(block.project_id) || 0;
      allocationCapacityByProject.set(
        block.project_id,
        current + Number(allocation.capacity_kw || 0)
      );
    });

    if (allocationCapacityByProject.size === 0) {
      return NextResponse.json({
        success: true,
        data: {
          currentGeneration: 0,
          todayGeneration: 0,
          monthlyGeneration: 0,
          creditsGenerated: 0,
          efficiency: 0,
        },
      });
    }

    const projectIds = [...allocationCapacityByProject.keys()];

    const [projectsRes, monthlyRes] = await Promise.all([
      admin
        .from("projects")
        .select("id, rate_per_kwh, total_kw, trillectric_site_ids")
        .in("id", projectIds),
      admin
        .from("generations")
        .select("project_id, kwh")
        .in("project_id", projectIds)
        .eq("month", new Date().getMonth() + 1)
        .eq("year", new Date().getFullYear()),
    ]);

    const projectById = new Map<string, any>();
    (projectsRes.data || []).forEach((project: any) => {
      projectById.set(project.id, project);
    });

    const monthlyGenerationByProject = new Map<string, number>();
    (monthlyRes.data || []).forEach((row: any) => {
      monthlyGenerationByProject.set(
        row.project_id,
        (monthlyGenerationByProject.get(row.project_id) || 0) + Number(row.kwh || 0)
      );
    });

    const client = getTrillectricClient();
    const now = new Date();

    let currentGenerationKw = 0;
    let todayGenerationKwh = 0;
    let monthlyGenerationKwh = 0;
    let creditsGenerated = 0;

    await Promise.all(
      projectIds.map(async (projectId) => {
        const project = projectById.get(projectId);
        if (!project) return;

        const userShareKw = allocationCapacityByProject.get(projectId) || 0;
        const projectTotalKw = Number(project.total_kw || 0);
        if (userShareKw <= 0 || projectTotalKw <= 0) return;

        const shareRatio = Math.min(1, userShareKw / projectTotalKw);
        const projectMonthlyKwh = Number(monthlyGenerationByProject.get(projectId) || 0);
        monthlyGenerationKwh += projectMonthlyKwh * shareRatio;

        const siteIds = Array.isArray(project.trillectric_site_ids)
          ? project.trillectric_site_ids.filter(
              (siteId: unknown): siteId is string =>
                typeof siteId === "string" && siteId.length > 0
            )
          : typeof project.trillectric_site_ids === "string"
          ? project.trillectric_site_ids
              .split(",")
              .map((siteId: string) => siteId.trim())
              .filter(Boolean)
          : [];

        if (siteIds.length === 0) return;

        const latestReadings = await Promise.all(
          siteIds.map(async (siteId: string) => {
            try {
              const readings = await client.fetchData(siteId, "today");
              return pickLatestReading(readings);
            } catch (error) {
              const message =
                error instanceof TrillectricError
                  ? error.message
                  : error instanceof Error
                  ? error.message
                  : String(error);
              console.warn(`[monitoring/realtime] site ${siteId}: ${message}`);
              return null;
            }
          })
        );

        const validReadings = latestReadings.filter(
          (reading): reading is TrillectricReading => reading !== null
        );

        if (validReadings.length === 0) return;

        const projectCurrentW = validReadings.reduce(
          (sum, reading) => sum + Number(reading.ACPower || 0),
          0
        );
        const projectTodayKwh = validReadings.reduce(
          (sum, reading) => sum + Number(reading.EnergyToday || 0),
          0
        );

        currentGenerationKw += (projectCurrentW / 1000) * shareRatio;
        todayGenerationKwh += projectTodayKwh * shareRatio;
        creditsGenerated +=
          projectTodayKwh *
          shareRatio *
          Number(project.rate_per_kwh || SOLAR_CONSTANTS.creditRatePerUnit);
      })
    );

    const expectedMonthly =
      totalCapacity *
      SOLAR_CONSTANTS.avgGenerationPerKwPerDay *
      SOLAR_CONSTANTS.daysPerMonth;
    const efficiency = expectedMonthly > 0
      ? (monthlyGenerationKwh / expectedMonthly) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        currentGeneration: Math.max(0, Math.round(currentGenerationKw * 100) / 100),
        todayGeneration: Math.max(0, Math.round(todayGenerationKwh * 100) / 100),
        monthlyGeneration: Math.max(0, Math.round(monthlyGenerationKwh * 100) / 100),
        creditsGenerated: Math.max(0, Math.round(creditsGenerated)),
        efficiency: Math.min(100, Math.max(0, efficiency)),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to fetch real-time data",
        },
      },
      { status: 500 }
    );
  }
}

