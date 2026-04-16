import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await verifyHost();
    if (!auth.authorized || !auth.host) {
      return hostUnauthorizedResponse(auth.error || "UNAUTHORIZED");
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("host_alerts")
      .select(
        "id, title, message, severity, status, category, project_id, created_at, acknowledged_at, resolved_at, metadata"
      )
      .eq("host_id", auth.host.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const alerts = (data || []).map(
      (a: {
        id: string;
        title: string;
        message: string;
        severity: string;
        status: string;
        category: string;
        project_id: string | null;
        created_at: string;
      }) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        severity: a.severity,
        status: a.status,
        category: a.category,
        projectId: a.project_id,
        createdAt: a.created_at,
        time: new Date(a.created_at).toLocaleString("en-IN"),
      })
    );

    return NextResponse.json({ success: true, data: { alerts } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[host/alerts] fatal:", msg);
    return NextResponse.json(
      { success: false, error: "Failed to load alerts" },
      { status: 500 }
    );
  }
}
