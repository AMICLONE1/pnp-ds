import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { calculateAllocationPrice } from "@/lib/pricing";
import {
  buildAllowedPaymentMethods,
  createCashfreeOrder,
  getCashfreeMode,
  getPublicAppId,
  isCashfreeConfigured,
} from "@/lib/payments/cashfree";

const createPaymentSchema = z.object({
  allocation_id: z.string().uuid().optional(),
  bill_id: z.string().uuid().optional(),
  payment_type: z.enum(["ALLOCATION", "MONTHLY", "BILL"]),
  customer_phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  customer_email: z.string().email().optional(),
  customer_name: z.string().min(1).max(120).optional(),
});

function getAppOrigin(request: Request) {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000";
  return raw.trim().replace(/\/$/, "");
}

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

    const body = createPaymentSchema.safeParse(await request.json());

    if (!body.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: body.error.errors.map((item) => item.message).join(", "),
          },
        },
        { status: 400 }
      );
    }

    const { allocation_id, bill_id, payment_type, customer_phone, customer_email, customer_name } =
      body.data;

    if (payment_type === "MONTHLY") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNSUPPORTED_PAYMENT_TYPE",
            message: "Monthly host payments must use /api/host/payments/create-order",
          },
        },
        { status: 400 }
      );
    }

    let amount = 0;
    const paymentMetadata: Record<string, unknown> = { payment_type };
    let billIdToPersist: string | null = null;

    if (payment_type === "ALLOCATION") {
      if (!allocation_id) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "VALIDATION_ERROR", message: "allocation_id is required for allocation payments" },
          },
          { status: 400 }
        );
      }

      const { data: allocation, error: allocationError } = await supabase
        .from("allocations")
        .select("id, payment_id, capacity_kw")
        .eq("id", allocation_id)
        .eq("user_id", user.id)
        .single();

      if (allocationError || !allocation) {
        return NextResponse.json(
          { success: false, error: { code: "ALLOCATION_NOT_FOUND", message: "Allocation not found" } },
          { status: 404 }
        );
      }

      if (allocation.payment_id) {
        return NextResponse.json(
          { success: false, error: { code: "ALREADY_LINKED", message: "Allocation already has a linked payment" } },
          { status: 409 }
        );
      }

      const price = calculateAllocationPrice(Number(allocation.capacity_kw));
      amount = price.total;

      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { success: false, error: { code: "INVALID_AMOUNT", message: "Could not calculate allocation payment amount" } },
          { status: 400 }
        );
      }

      paymentMetadata.allocation_id = allocation_id;
      paymentMetadata.capacity_kw = allocation.capacity_kw;
      paymentMetadata.price_breakdown = price;
    }

    if (payment_type === "BILL") {
      if (!bill_id) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", message: "bill_id is required for bill payments" } },
          { status: 400 }
        );
      }

      const { data: bill, error: billError } = await supabase
        .from("bills")
        .select("id, amount, credits_applied, status")
        .eq("id", bill_id)
        .eq("user_id", user.id)
        .single();

      if (billError || !bill) {
        return NextResponse.json(
          { success: false, error: { code: "BILL_NOT_FOUND", message: "Bill not found" } },
          { status: 404 }
        );
      }

      if (bill.status === "PAID") {
        return NextResponse.json(
          { success: false, error: { code: "ALREADY_PAID", message: "Bill is already paid" } },
          { status: 400 }
        );
      }

      amount = Math.max(0, Number(bill.amount) - Number(bill.credits_applied || 0));
      billIdToPersist = bill.id;

      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { success: false, error: { code: "NO_PAYMENT_REQUIRED", message: "No payment is required for this bill" } },
          { status: 400 }
        );
      }

      paymentMetadata.bill_id = bill.id;
      paymentMetadata.credits_applied = bill.credits_applied || 0;
    }

    if (!isCashfreeConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "PAYMENT_GATEWAY_UNAVAILABLE", message: "Payment gateway is not configured" },
        },
        { status: 503 }
      );
    }

    // Resolve customer details. Prefer Cashfree-required fields from request,
    // fall back to Supabase user metadata. Phone is required by Cashfree.
    const phone =
      customer_phone ||
      (user.user_metadata?.phone as string | undefined) ||
      (user.phone as string | undefined);

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PHONE_REQUIRED",
            message: "A 10-digit Indian mobile number is required to start payment",
          },
        },
        { status: 400 }
      );
    }

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount,
        type: payment_type,
        gateway: "CASHFREE",
        status: "PENDING",
        bill_id: billIdToPersist,
        metadata: paymentMetadata,
      })
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: paymentError.message } },
        { status: 500 }
      );
    }

    const orderId = `pnp_${payment.id}`;
    const origin = getAppOrigin(request);

    try {
      const order = await createCashfreeOrder({
        order_id: orderId,
        order_amount: Math.round(amount * 100) / 100,
        order_currency: "INR",
        customer_details: {
          customer_id: user.id,
          customer_phone: phone,
          customer_email: customer_email || user.email || "customer@powernetpro.local",
          customer_name: customer_name || (user.user_metadata?.name as string) || "Customer",
        },
        order_meta: {
          return_url: `${origin}/payment/return?order_id=${orderId}`,
          notify_url: `${origin}/api/payments/webhook`,
          payment_methods: buildAllowedPaymentMethods(),
          invoice_date: new Date().toISOString(),
          invoice_id: `pnp_${payment.id}`,
        },
        order_note:
          payment_type === "ALLOCATION"
            ? "PNP capacity allocation"
            : "PNP electricity bill",
        order_tags: {
          payment_id: String(payment.id),
          payment_type,
        },
      });

      await supabase
        .from("payments")
        .update({ gateway_order_id: order.order_id })
        .eq("id", payment.id);

      return NextResponse.json({
        success: true,
        data: {
          order_id: order.order_id,
          payment_session_id: order.payment_session_id,
          amount: order.order_amount,
          currency: order.order_currency,
          payment_id: payment.id,
          app_id: getPublicAppId(),
          mode: getCashfreeMode(),
        },
      });
    } catch (gatewayError: any) {
      await supabase
        .from("payments")
        .update({ status: "FAILED", metadata: { ...paymentMetadata, gateway_error: gatewayError?.message } })
        .eq("id", payment.id);
      throw gatewayError;
    }
  } catch (error: any) {
    console.error("Payment error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PAYMENT_ERROR",
          message: error.message || "Failed to create payment order",
        },
      },
      { status: 500 }
    );
  }
}
