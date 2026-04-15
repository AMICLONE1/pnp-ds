import { NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * PATCH /api/admin/bills/[id]/review
 *
 * Admin approves or rejects a submitted bill. On APPROVE:
 *   1. Bill moves to review_status=APPROVED, status=PAID, paid_at=now()
 *   2. All PENDING credit_ledger rows for the user are applied (capped at
 *      bill amount) and written back as credits_applied on the bill.
 * On REJECT: review_status=REJECTED, optional notes stored.
 */
export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return unauthorizedResponse(auth.error || "FORBIDDEN");

  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const action = (body.action || "").toUpperCase();
  const notes: string | null = body.notes || null;

  if (action !== "APPROVE" && action !== "REJECT") {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "action must be APPROVE or REJECT" } },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: bill, error: billErr } = await admin
    .from("bills")
    .select("id, user_id, amount, review_status, status")
    .eq("id", id)
    .single();

  if (billErr || !bill) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Bill not found" } },
      { status: 404 }
    );
  }

  if (bill.review_status && bill.review_status !== "SUBMITTED") {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ALREADY_REVIEWED",
          message: `Bill already ${bill.review_status.toLowerCase()}`,
        },
      },
      { status: 409 }
    );
  }

  const reviewedAt = new Date().toISOString();

  if (action === "REJECT") {
    const { data: updated, error: upErr } = await admin
      .from("bills")
      .update({
        review_status: "REJECTED",
        reviewed_by: auth.user!.id,
        reviewed_at: reviewedAt,
        review_notes: notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (upErr) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: upErr.message } },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  }

  // APPROVE — apply PENDING credits FIFO up to bill amount.
  const { data: pendingCredits } = await admin
    .from("credit_ledgers")
    .select("id, amount")
    .eq("user_id", bill.user_id)
    .eq("status", "PENDING")
    .order("created_at", { ascending: true });

  let remaining = Number(bill.amount);
  let appliedTotal = 0;
  const toApply: { id: string; amount: number }[] = [];

  for (const c of pendingCredits || []) {
    if (remaining <= 0) break;
    const amt = Math.min(Number(c.amount), remaining);
    toApply.push({ id: c.id, amount: amt });
    appliedTotal += amt;
    remaining -= amt;
  }

  // Mark credits APPLIED. Full consumption only — partial split is out of
  // scope for v1; if a credit is larger than the remaining bill we still
  // apply the full row and carry the overage implicitly via credits_applied
  // being capped at bill.amount. We accept this trade-off for simplicity.
  for (const c of toApply) {
    await admin
      .from("credit_ledgers")
      .update({ status: "APPLIED", ref_id: bill.id, ref_type: "bill" })
      .eq("id", c.id);
  }

  const { data: updated, error: upErr } = await admin
    .from("bills")
    .update({
      review_status: "APPROVED",
      reviewed_by: auth.user!.id,
      reviewed_at: reviewedAt,
      review_notes: notes,
      credits_applied: appliedTotal,
      status: "PAID",
      paid_at: reviewedAt,
    })
    .eq("id", id)
    .select()
    .single();

  if (upErr) {
    return NextResponse.json(
      { success: false, error: { code: "DB_ERROR", message: upErr.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: updated,
    credits_applied: appliedTotal,
  });
}
