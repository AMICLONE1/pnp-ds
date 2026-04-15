import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export interface HostVerifyResult {
  authorized: boolean;
  error?: string;
  user?: { id: string; email: string };
  host?: { id: string; status: string; business_name: string };
  hostId?: string;
}

/**
 * Verify if the current user is a host with ACTIVE status.
 * Uses admin client to bypass RLS when checking user role and host record.
 */
export async function verifyHost(): Promise<HostVerifyResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { authorized: false, error: "UNAUTHORIZED" };
    }

    // Use admin client to bypass RLS
    const adminClient = createAdminClient();

    // Check user role is HOST
    const { data: userData, error: userError } = await adminClient
      .from("users")
      .select("role, deleted_at")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return { authorized: false, error: "USER_NOT_FOUND" };
    }

    if (userData.deleted_at) {
      return { authorized: false, error: "ACCOUNT_DISABLED" };
    }

    if (userData.role !== "HOST") {
      return { authorized: false, error: "NOT_A_HOST" };
    }

    // Check host record exists and is active
    const { data: hostData, error: hostError } = await adminClient
      .from("hosts")
      .select("id, status, business_name")
      .eq("user_id", user.id)
      .single();

    if (hostError || !hostData) {
      return { authorized: false, error: "HOST_NOT_FOUND" };
    }

    if (hostData.status !== "ACTIVE") {
      return { authorized: false, error: "HOST_INACTIVE" };
    }

    return {
      authorized: true,
      user: { id: user.id, email: user.email || "" },
      host: hostData,
      hostId: hostData.id,
    };
  } catch (error) {
    console.error("Host verification error:", error);
    return { authorized: false, error: "SERVER_ERROR" };
  }
}

/**
 * Helper to create unauthorized response for host routes
 */
export function unauthorizedResponse(error: string) {
  return hostUnauthorizedResponse(error);
}

export function hostUnauthorizedResponse(error: string) {
  const status =
    error === "UNAUTHORIZED"
      ? 401
      : error === "HOST_INACTIVE"
      ? 403
      : 403;

  const messages: Record<string, string> = {
    UNAUTHORIZED: "Authentication required",
    USER_NOT_FOUND: "User account not found",
      ACCOUNT_DISABLED: "This account has been disabled",
    NOT_A_HOST: "Host access required",
    HOST_NOT_FOUND: "Host profile not found",
    HOST_INACTIVE: "Host account is not active. Please contact support.",
    SERVER_ERROR: "An unexpected error occurred",
  };

  return NextResponse.json(
    { success: false, error: messages[error] || "Access denied" },
    { status }
  );
}
