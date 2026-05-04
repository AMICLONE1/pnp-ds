import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/allocations — returns the current user's allocations with the
 * linked capacity_block and project. Used by the dashboard.
 */
export async function GET() {
  try {
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

    // RLS on projects only exposes ACTIVE rows publicly. Users with paid
    // allocations in DRAFT / COMING_SOON plants still need to see the plant
    // they reserved, so we resolve allocation → capacity_block → project
    // via the service-role client (scoped to the current user's own rows).
    const { data: rows, error: plainErr } = await supabase
      .from("allocations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (plainErr) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: plainErr.message } },
        { status: 500 }
      );
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const admin = createAdminClient();
    const blockIds = rows.map((a: any) => a.capacity_block_id).filter(Boolean);
    const { data: blocks } = await admin
      .from("capacity_blocks")
      .select("id, kw, project_id")
      .in("id", blockIds);
    const projectIds = [...new Set((blocks || []).map((b: any) => b.project_id))];
    const { data: projects } = await admin
      .from("projects")
      .select("*")
      .in("id", projectIds);

    const enriched = rows.map((a: any) => {
      const block = blocks?.find((b: any) => b.id === a.capacity_block_id) || null;
      const project = projects?.find((p: any) => p.id === block?.project_id) || null;
      return {
        ...a,
        capacity_block: block ? { ...block, project } : null,
        project,
        block_kw: block?.kw || a.capacity_kw,
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error: any) {
    console.error("Allocations GET error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/allocations is permanently disabled.
 *
 * The legacy "reserve first, pay later" path let any authenticated user
 * create unpaid allocations against legacy AVAILABLE seed blocks. Under the
 * virtual booking model, allocations are only ever created after a
 * Cashfree payment is verified, inside /api/signup/complete (new users) or
 * a future /api/reserve/complete (existing users). Hard-closed here so the
 * endpoint can never be used to mint free capacity.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "GONE",
        message:
          "Direct allocation creation is disabled. Reserve capacity through the paid signup or reserve-more flow.",
      },
    },
    { status: 410 }
  );
}
