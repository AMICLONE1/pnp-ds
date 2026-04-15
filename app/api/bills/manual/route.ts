import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/bills/manual
 *
 * User submits a DISCOM bill for admin review. Credits are NOT applied here —
 * an admin must approve via /api/admin/bills/[id]/review, at which point the
 * bill becomes PAID and any PENDING credits are auto-applied.
 *
 * Body: { bill_number, amount, due_date, discom, proof_url }
 */
export async function POST(request: Request) {
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

    const body = await request.json();
    const { bill_number, amount, due_date, discom, proof_url } = body;

    if (!amount || !due_date || !discom || !proof_url) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "amount, due_date, discom and proof_url are required",
          },
        },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid amount" } },
        { status: 400 }
      );
    }

    // Guard: the proof must live under the user's own folder in bill-proofs.
    // Path convention set by the upload helper: `${user.id}/${uuid}.${ext}`.
    if (!proof_url.startsWith(`${user.id}/`)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "FORBIDDEN", message: "Proof path does not belong to you" },
        },
        { status: 403 }
      );
    }

    // Prevent duplicate SUBMITTED bills for the same bill_number.
    if (bill_number) {
      const { data: existing } = await supabase
        .from("bills")
        .select("id")
        .eq("user_id", user.id)
        .eq("bill_number", bill_number)
        .maybeSingle();
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "BILL_EXISTS", message: "A bill with this number already exists" },
          },
          { status: 409 }
        );
      }
    }

    const { data: bill, error: billError } = await supabase
      .from("bills")
      .insert({
        user_id: user.id,
        bill_number: bill_number || null,
        amount: numericAmount,
        due_date,
        discom,
        status: "PENDING",
        review_status: "SUBMITTED",
        proof_url,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (billError) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: billError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bill,
      message: "Bill submitted for review. We'll notify you once an admin approves it.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message || "Failed to submit bill" },
      },
      { status: 500 }
    );
  }
}
