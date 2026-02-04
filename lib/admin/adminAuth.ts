import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export interface AdminVerifyResult {
  authorized: boolean;
  error?: string;
  user?: { id: string; email: string };
  userData?: { role: string };
}

/**
 * Verify if the current user is an admin
 * Uses admin client to bypass RLS when checking user role
 */
export async function verifyAdmin(): Promise<AdminVerifyResult> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { authorized: false, error: "UNAUTHORIZED" };
    }

    // Use admin client to bypass RLS and check user role
    const adminClient = createAdminClient();
    const { data: userData, error: userError } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return { authorized: false, error: "USER_NOT_FOUND" };
    }

    if (userData.role !== "ADMIN") {
      return { authorized: false, error: "FORBIDDEN" };
    }

    return {
      authorized: true,
      user: { id: user.id, email: user.email || "" },
      userData
    };
  } catch (error) {
    console.error("Admin verification error:", error);
    return { authorized: false, error: "SERVER_ERROR" };
  }
}

/**
 * Helper to create unauthorized response
 */
export function unauthorizedResponse(error: string) {
  const status = error === "UNAUTHORIZED" ? 401 : 403;
  const message = error === "UNAUTHORIZED"
    ? "Authentication required"
    : "Admin access required";

  return NextResponse.json(
    { success: false, error: { code: error, message } },
    { status }
  );
}
