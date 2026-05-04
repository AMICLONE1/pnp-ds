import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createCashfreeRefund } from "@/lib/payments/cashfree";

const refundSchema = z.object({
  payment_id: z.string().uuid(),
  refund_amount: z.number().positive().optional(),
  refund_note: z.string().max(200).optional(),
});

/**
 * Refund a driver payment via Cashfree. Admin-only — gated by users.role.
 * Partial refunds supported (refund_amount); omitting it refunds full amount.
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

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }

    const parsed = refundSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: parsed.error.errors.map((e) => e.message).join(", ") },
        },
        { status: 400 }
      );
    }

    const { payment_id, refund_amount, refund_note } = parsed.data;

    const { data: payment } = await admin
      .from("payments")
      .select("id, amount, status, gateway_order_id, gateway_payment_id, metadata")
      .eq("id", payment_id)
      .maybeSingle();

    if (!payment) {
      return NextResponse.json(
        { success: false, error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" } },
        { status: 404 }
      );
    }

    if (payment.status !== "COMPLETED" || !payment.gateway_order_id) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_REFUNDABLE", message: "Payment is not in a refundable state" } },
        { status: 400 }
      );
    }

    const amount = refund_amount ?? Number(payment.amount);
    const refundId = `rfnd_${payment.id}_${Date.now()}`;

    const refund = await createCashfreeRefund(payment.gateway_order_id, {
      refund_amount: Math.round(amount * 100) / 100,
      refund_id: refundId,
      refund_note: refund_note,
    });

    await admin
      .from("payments")
      .update({
        status: "REFUNDED",
        metadata: {
          ...((payment.metadata as Record<string, unknown>) || {}),
          last_refund: {
            id: refund.refund_id,
            cf_refund_id: refund.cf_refund_id,
            amount: refund.refund_amount,
            status: refund.refund_status,
          },
        },
      })
      .eq("id", payment.id);

    return NextResponse.json({ success: true, data: refund });
  } catch (error: any) {
    console.error("Refund error:", error);
    return NextResponse.json(
      { success: false, error: { code: "REFUND_ERROR", message: error.message || "Refund failed" } },
      { status: 500 }
    );
  }
}
