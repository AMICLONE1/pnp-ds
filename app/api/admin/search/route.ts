import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSearchTerm } from "@/lib/security/inputSanitizer";

/**
 * GET /api/admin/search?q=...
 * Global command-palette search across users, hosts, and plants.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin();
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const adminClient = createAdminClient();
    const { searchParams } = new URL(request.url);
    const rawQ = searchParams.get("q") || "";
    const q = sanitizeSearchTerm(rawQ).trim();

    if (!q || q.length < 1) {
      return NextResponse.json({ success: true, data: { users: [], hosts: [], projects: [] } });
    }

    const [usersRes, projectsRes] = await Promise.all([
      adminClient
        .from("users")
        .select("id, name, email, role")
        .or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
        .is("deleted_at", null)
        .limit(10),
      adminClient
        .from("projects")
        .select("id, name, spv_id, location, state")
        .or(`name.ilike.%${q}%,spv_id.ilike.%${q}%,location.ilike.%${q}%`)
        .is("deleted_at", null)
        .limit(10),
    ]);

    const allUsers = usersRes.data || [];
    const users = allUsers.filter((u: any) => u.role !== "HOST");
    const hosts = allUsers.filter((u: any) => u.role === "HOST");
    const projects = projectsRes.data || [];

    return NextResponse.json({
      success: true,
      data: { users, hosts, projects },
    });
  } catch (error) {
    console.error("Admin search error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
