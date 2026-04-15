import { NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/bills
 *
 * Returns bills awaiting review (and optionally all bills, via ?status=ALL).
 * Admin only. Uses the service-role client to bypass RLS.
 */
export async function GET(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return unauthorizedResponse(auth.error || "FORBIDDEN");

  const url = new URL(request.url);
  const filter = url.searchParams.get("status") || "SUBMITTED";

  const admin = createAdminClient();
  let query = admin
    .from("bills")
    .select(
      `id, user_id, discom, bill_number, amount, credits_applied, due_date,
       status, review_status, proof_url, submitted_at, reviewed_at, review_notes,
       created_at,
       user:users(id, email, name, phone, state, discom)`
    )
    .order("submitted_at", { ascending: false, nullsFirst: false });

  if (filter !== "ALL") {
    query = query.eq("review_status", filter);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "DB_ERROR", message: error.message } },
      { status: 500 }
    );
  }

  // Sign proof URLs so the admin UI can preview them. 10-minute signed URLs.
  const withSignedProofs = await Promise.all(
    (data || []).map(async (bill: any) => {
      if (!bill.proof_url) return { ...bill, proof_signed_url: null };
      const { data: signed } = await admin.storage
        .from("bill-proofs")
        .createSignedUrl(bill.proof_url, 600);
      return { ...bill, proof_signed_url: signed?.signedUrl || null };
    })
  );

  return NextResponse.json({ success: true, data: withSignedProofs });
}
