import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildAllowedPaymentMethods,
  createCashfreeOrder,
  getCashfreeMode,
  getPublicAppId,
  isCashfreeConfigured,
} from "@/lib/payments/cashfree";

function getAppOrigin(request: Request) {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000";
  return raw.trim().replace(/\/$/, "");
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyHost();

    if (!authResult.authorized) {
      return hostUnauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const body = await request.json().catch(() => ({}));
    const paymentId = String(body.payment_id || "").trim();
    const customerPhone = String(body.customer_phone || "").trim();
    const customerEmail = String(body.customer_email || "").trim();

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "payment_id is required" } },
        { status: 400 }
      );
    }

    if (!isCashfreeConfigured()) {
      return NextResponse.json(
        { success: false, error: { code: "GATEWAY_NOT_CONFIGURED", message: "Cashfree keys are not configured" } },
        { status: 503 }
      );
    }

    const adminClient = createAdminClient();
    const hostId = authResult.host?.id;

    const { data: payment, error: paymentError } = await adminClient
      .from("host_payments")
      .select(
        "id, host_id, invoice_id, billing_month, billing_year, generation_kwh, rate_per_kwh, base_amount, adjustments, late_fee, total_amount, status, due_date, paid_at, payment_method, payment_reference, gateway_order_id, gateway_payment_id"
      )
      .eq("id", paymentId)
      .eq("host_id", hostId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { success: false, error: { code: "PAYMENT_NOT_FOUND", message: "Host payment record not found" } },
        { status: 404 }
      );
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json(
        { success: false, error: { code: "ALREADY_PAID", message: "This billing record is already paid" } },
        { status: 400 }
      );
    }

    const phone = customerPhone || (authResult.host as any)?.contact_phone || "";
    if (!/^[6-9]\d{9}$/.test(phone)) {
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

    const totalAmount = Number(payment.total_amount);
    const orderId = `pnp_host_${payment.id}`;
    const origin = getAppOrigin(request);

    const order = await createCashfreeOrder({
      order_id: orderId,
      order_amount: Math.round(totalAmount * 100) / 100,
      order_currency: "INR",
      customer_details: {
        customer_id: hostId!,
        customer_phone: phone,
        customer_email: customerEmail || (authResult.host as any)?.contact_email || "host@powernetpro.local",
        customer_name: (authResult.host as any)?.business_name || "Host",
      },
      order_meta: {
        return_url: `${origin}/payment/return?order_id=${orderId}`,
        notify_url: `${origin}/api/payments/webhook`,
        payment_methods: buildAllowedPaymentMethods(),
        invoice_date: new Date().toISOString(),
        invoice_id: payment.invoice_id ? String(payment.invoice_id) : `host_${payment.id}`,
      },
      order_note: payment.invoice_id ? `Invoice ${payment.invoice_id}` : `Host PPA ${payment.id}`,
      order_tags: {
        host_payment_id: String(payment.id),
        host_id: String(hostId),
        billing_month: String(payment.billing_month),
        billing_year: String(payment.billing_year),
      },
    });

    await adminClient
      .from("host_payments")
      .update({
        gateway_order_id: order.order_id,
        status: "PROCESSING",
        payment_method: "CASHFREE",
      })
      .eq("id", payment.id)
      .eq("host_id", hostId);

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
        host_id: hostId,
      },
    });
  } catch (error: any) {
    console.error("Host payment order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "PAYMENT_ERROR", message: error.message || "Failed to create host payment order" },
      },
      { status: 500 }
    );
  }
}
