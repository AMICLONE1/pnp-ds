// ============================================
// Credit Distribution Cron Endpoint (safety net)
//
// Runs once daily to ensure credits are distributed
// for every active project with generation data in
// the current month. Complements the per-sync credit
// distribution performed by trillectric-sync.
// ============================================

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { distributeCredits } from "@/lib/trillectric/credits";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function verifyCronAuth(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.warn("[credit-cron] CRON_SECRET not set — allowing request");
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

  try {
    const adminClient = createAdminClient();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Find all projects with generation rows for this period
    const { data: generations, error } = await adminClient
      .from("generations")
      .select("project_id")
      .eq("month", month)
      .eq("year", year)
      .gt("kwh", 0);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const uniqueProjectIds = Array.from(
      new Set((generations ?? []).map((g) => g.project_id as string))
    );

    // Log start
    const { data: syncLog } = await adminClient
      .from("sync_logs")
      .insert({
        sync_type: "CREDIT_DISTRIBUTE",
        status: "STARTED",
        metadata: { month, year, projectCount: uniqueProjectIds.length },
      })
      .select("id")
      .single();

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const projectId of uniqueProjectIds) {
      try {
        const result = await distributeCredits(
          adminClient,
          projectId,
          month,
          year
        );
        results.push(result);
        successCount += 1;
      } catch (err) {
        failCount += 1;
        results.push({
          projectId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (syncLog?.id) {
      await adminClient
        .from("sync_logs")
        .update({
          status: failCount === 0 ? "SUCCESS" : "PARTIAL",
          metadata: { month, year, successCount, failCount },
          completed_at: new Date().toISOString(),
        })
        .eq("id", syncLog.id);
    }

    return NextResponse.json({
      success: true,
      month,
      year,
      projectsProcessed: uniqueProjectIds.length,
      successCount,
      failCount,
      results,
    });
  } catch (err) {
    console.error("[credit-cron] fatal error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
