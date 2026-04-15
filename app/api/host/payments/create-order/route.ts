import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";

// Demo payment amount for testing
const DEMO_PAYMENT_AMOUNT = 5000;

function initRazorpay() {
  try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const Razorpay = require("razorpay");
      return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
  } catch (error) {
    console.warn("Host Razorpay not configured:", error);
  }

  return null;
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyHost();

    if (!authResult.authorized) {
      return hostUnauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const body = await request.json().catch(() => ({}));
    const paymentId = String(body.payment_id || "").trim();

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "payment_id is required" },
        },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const hostId = authResult.host?.id;

    if (paymentId === "demo-payment") {
      if (isProduction()) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "GATEWAY_NOT_CONFIGURED", message: "Host billing demo mode is disabled in production." },
          },
          { status: 503 }
        );
      }

      const mockOrderId = `order_mock_${Date.now()}`;

      return NextResponse.json({
        success: true,
        data: {
          order_id: mockOrderId,
          amount: Math.round(DEMO_PAYMENT_AMOUNT * 100),
          currency: "INR",
          payment_id: paymentId,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          mock: true,
          host_id: hostId,
        },
      });
    }

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
        {
          success: false,
          error: { code: "PAYMENT_NOT_FOUND", message: "Host payment record not found" },
        },
        { status: 404 }
      );
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "ALREADY_PAID", message: "This billing record is already paid" },
        },
        { status: 400 }
      );
    }

    const totalAmount = Number(payment.total_amount);
    const existingOrderId = payment.gateway_order_id;

    if (existingOrderId && payment.status === "PROCESSING") {
      return NextResponse.json({
        success: true,
        data: {
          order_id: existingOrderId,
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          payment_id: payment.id,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          mock: false,
          host_id: hostId,
        },
      });
    }

    const razorpayInstance = initRazorpay();
    if (!razorpayInstance) {
      if (isProduction()) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "GATEWAY_NOT_CONFIGURED", message: "Razorpay keys are not configured" },
          },
          { status: 503 }
        );
      }

      const mockOrderId = `order_mock_${Date.now()}`;
      await adminClient
        .from("host_payments")
        .update({
          gateway_order_id: mockOrderId,
          status: "PROCESSING",
          payment_method: "RAZORPAY",
        })
        .eq("id", payment.id)
        .eq("host_id", hostId);

      return NextResponse.json({
        success: true,
        data: {
          order_id: mockOrderId,
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          payment_id: payment.id,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          mock: true,
          host_id: hostId,
        },
      });
    }

    const order = await razorpayInstance.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: payment.invoice_id ? `invoice_${payment.invoice_id}` : `host_${payment.id}`,
      notes: {
        host_id: hostId,
        host_payment_id: payment.id,
        billing_month: String(payment.billing_month),
        billing_year: String(payment.billing_year),
      },
    });

    await adminClient
      .from("host_payments")
      .update({
        gateway_order_id: order.id,
        status: "PROCESSING",
        payment_method: "RAZORPAY",
      })
      .eq("id", payment.id)
      .eq("host_id", hostId);

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        payment_id: payment.id,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        mock: false,
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
