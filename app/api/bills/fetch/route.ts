import { NextResponse } from "next/server";

/**
 * POST /api/bills/fetch — disabled.
 *
 * Legacy BBPS "fetch latest bill from DISCOM" endpoint. We don't have BBPS
 * keys and the manual review flow replaces it. Closed so probing requests
 * can't create bill rows bypassing the review workflow.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "GONE",
        message:
          "Auto-fetch from DISCOM is not available. Please upload your bill manually at /bills.",
      },
    },
    { status: 410 }
  );
}
