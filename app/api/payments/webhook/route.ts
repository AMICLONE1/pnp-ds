import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCashfreeWebhook } from "@/lib/payments/cashfree";
import { ensureHostInvoiceForPayment } from "@/lib/host/ensureInvoice";

/**
 * Cashfree webhook receiver for driver/user payments.
 *
 * Cashfree POSTs JSON with headers:
 *  - x-webhook-timestamp  (Unix epoch seconds)
 *  - x-webhook-signature  (HMAC-SHA256(timestamp + rawBody) base64)
 *
 * The body MUST be read as raw text (not JSON-parsed) for signature
 * verification — re-stringifying changes whitespace and breaks the signature.
 *
 * Authoritative source of truth for final status. The /verify endpoint exists
 * for fast UX, but this webhook reconciles the record even if the client
 * never calls back (closed tab, network failure, etc.).
 */

// Reject webhooks where the signature timestamp is more than 5 minutes off
// from now — guards against replay of captured webhook traffic.
const MAX_WEBHOOK_SKEW_SECONDS = 300;

// Only accept event types we actually handle. Any other type is rejected
// up-front so a leaked secret can't be used to drive unexpected branches.
const ACCEPTED_EVENT_TYPES = new Set([
  "PAYMENT_SUCCESS_WEBHOOK",
  "PAYMENT_FAILED_WEBHOOK",
  "PAYMENT_USER_DROPPED_WEBHOOK",
  "REFUND_STATUS_WEBHOOK",
  "REFUND_SUCCESS_WEBHOOK",
  "REFUND_FAILED_WEBHOOK",
]);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const timestamp = request.headers.get("x-webhook-timestamp") || "";
    const signature = request.headers.get("x-webhook-signature") || "";

    if (!timestamp || !signature) {
      return NextResponse.json(
        { success: false, error: "Missing webhook headers" },
        { status: 400 }
      );
    }

    // Recency check: stop replays of captured webhook payloads.
    const tsSeconds = Number(timestamp);
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (
      !Number.isFinite(tsSeconds) ||
      Math.abs(nowSeconds - tsSeconds) > MAX_WEBHOOK_SKEW_SECONDS
    ) {
      return NextResponse.json(
        { success: false, error: "Webhook timestamp out of range" },
        { status: 401 }
      );
    }

    if (!verifyCashfreeWebhook(rawBody, timestamp, signature)) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event?.type || "";
    if (!ACCEPTED_EVENT_TYPES.has(eventType)) {
      return NextResponse.json(
        { success: true, ignored: true, reason: "unsupported_event_type" }
      );
    }
    const payload = event?.data || {};
    const orderId: string | undefined = payload?.order?.order_id;
    const cfPayment = payload?.payment;
    const paymentStatus: string = cfPayment?.payment_status || "";

    if (!orderId) {
      // Non-payment event (e.g., REFUND_*) is handled separately further down.
      if (eventType.startsWith("REFUND_")) {
        return handleRefundEvent(event);
      }
      return NextResponse.json({ success: true, ignored: true });
    }

    const admin = createAdminClient();

    const { data: paymentRow } = await admin
      .from("payments")
      .select("id, status, type, bill_id, user_id, metadata")
      .eq("gateway_order_id", orderId)
      .maybeSingle();

    if (!paymentRow) {
      // Could be a host payment, signup, or unknown. Try host_payments next.
      return handleHostOrSignupOrder(orderId, paymentStatus, cfPayment, event);
    }

    if (paymentRow.status === "COMPLETED") {
      return NextResponse.json({ success: true, idempotent: true });
    }

    if (paymentStatus !== "SUCCESS") {
      const newStatus =
        paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED"
          ? "FAILED"
          : paymentRow.status;
      await admin
        .from("payments")
        .update({
          status: newStatus,
          metadata: {
            ...((paymentRow.metadata as Record<string, unknown>) || {}),
            last_event: eventType,
            last_payment_status: paymentStatus,
          },
        })
        .eq("id", paymentRow.id);
      return NextResponse.json({ success: true });
    }

    const existingMetadata = (paymentRow.metadata as Record<string, unknown>) || {};
    await admin
      .from("payments")
      .update({
        status: "COMPLETED",
        gateway_payment_id: cfPayment.cf_payment_id,
        metadata: {
          ...existingMetadata,
          cf_payment_id: cfPayment.cf_payment_id,
          payment_method: cfPayment.payment_method,
          payment_time: cfPayment.payment_time,
          bank_reference: cfPayment.bank_reference,
        },
      })
      .eq("id", paymentRow.id);

    // Activation side-effects mirror /verify. We do them with the admin client
    // so we don't need a user session.
    if (paymentRow.type === "ALLOCATION") {
      const allocationId = String(existingMetadata.allocation_id || "");
      if (allocationId) {
        const { data: allocation } = await admin
          .from("allocations")
          .select("id, capacity_block_id, payment_id")
          .eq("id", allocationId)
          .eq("user_id", paymentRow.user_id)
          .maybeSingle();
        if (allocation && !allocation.payment_id) {
          await admin
            .from("allocations")
            .update({ payment_id: paymentRow.id })
            .eq("id", allocation.id);
          await admin
            .from("capacity_blocks")
            .update({ status: "ALLOCATED", allocated_at: new Date().toISOString() })
            .eq("id", allocation.capacity_block_id);
        }
      }
    }

    if (paymentRow.type === "BILL" && paymentRow.bill_id) {
      await admin
        .from("bills")
        .update({ status: "PAID", paid_at: new Date().toISOString() })
        .eq("id", paymentRow.bill_id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cashfree webhook error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleHostOrSignupOrder(
  orderId: string,
  paymentStatus: string,
  cfPayment: any,
  event: any
) {
  const admin = createAdminClient();

  // Host payment?
  const { data: hostPayment } = await admin
    .from("host_payments")
    .select("id, status")
    .eq("gateway_order_id", orderId)
    .maybeSingle();

  if (hostPayment && paymentStatus === "SUCCESS" && hostPayment.status !== "COMPLETED") {
    await admin
      .from("host_payments")
      .update({
        status: "COMPLETED",
        gateway_payment_id: cfPayment.cf_payment_id,
        payment_reference: cfPayment.cf_payment_id,
        payment_method: "CASHFREE",
        paid_at: new Date().toISOString(),
      })
      .eq("id", hostPayment.id);

    // Webhook is the source of truth for final status, so create the invoice
    // here too. Without this, hosts can't download their invoice if the
    // client tab closed before the verify call returned.
    await ensureHostInvoiceForPayment(hostPayment.id, admin);

    return NextResponse.json({ success: true, kind: "host_payment" });
  }

  // Pending signup?
  const { data: pending } = await admin
    .from("pending_signups")
    .select("id")
    .eq("gateway_order_id", orderId)
    .maybeSingle();

  if (pending) {
    // Signup completion is gated by the user re-supplying their password from
    // the browser, so we cannot finalize via webhook alone. We just log it.
    return NextResponse.json({ success: true, kind: "pending_signup_noop" });
  }

  return NextResponse.json({ success: true, ignored: true, eventType: event?.type });
}

async function handleRefundEvent(event: any) {
  const admin = createAdminClient();
  const refund = event?.data?.refund;
  if (!refund?.refund_id) return NextResponse.json({ success: true, ignored: true });

  await admin
    .from("payments")
    .update({
      metadata: {
        last_refund_event: event?.type,
        refund_id: refund.refund_id,
        refund_status: refund.refund_status,
        refund_amount: refund.refund_amount,
      },
    })
    .eq("gateway_payment_id", refund.cf_payment_id);

  return NextResponse.json({ success: true, kind: "refund_event" });
}
