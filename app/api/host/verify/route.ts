import { NextResponse } from "next/server";
import { verifyHost } from "@/lib/host/hostAuth";

/**
 * GET /api/host/verify
 * Verify if the current user is an active host
 */
export async function GET() {
  try {
    const result = await verifyHost();

    if (!result.authorized) {
      return NextResponse.json({
        success: false,
        isHost: false,
        error: result.error,
      });
    }

    return NextResponse.json({
      success: true,
      isHost: true,
      user: result.user,
      host: result.host,
    });
  } catch (error) {
    console.error("Host verify error:", error);
    return NextResponse.json(
      { success: false, isHost: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
