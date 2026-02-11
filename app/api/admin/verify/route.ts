import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/adminAuth";

/**
 * GET /api/admin/verify
 * Verify if the current user is an admin
 */
export async function GET() {
  try {
    const result = await verifyAdmin();

    if (!result.authorized) {
      return NextResponse.json({
        success: false,
        isAdmin: false,
        error: result.error,
      });
    }

    return NextResponse.json({
      success: true,
      isAdmin: true,
      user: result.user,
    });
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json(
      { success: false, isAdmin: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
