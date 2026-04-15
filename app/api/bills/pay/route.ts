import { NextResponse } from "next/server";

/**
 * POST /api/bills/pay — disabled.
 *
 * Legacy "pay a bill through the platform" endpoint from the BBPS-era
 * design. Under the manual review flow, bills become PAID only when an
 * admin approves a submission via /api/admin/bills/[id]/review. Closed
 * here so stale clients or probing requests can't mutate bills.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "GONE",
        message:
          "Direct bill payment is disabled. Submit your bill via /bills and it will be reviewed by our team.",
      },
    },
    { status: 410 }
  );
}
