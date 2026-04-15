import crypto from "crypto";
import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildInvoiceNumber, calculatePpaBilling } from "@/lib/host/billing";

export async function POST(request: Request) {
  try {
    const authResult = await verifyHost();

    if (!authResult.authorized) {
      return hostUnauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const body = await request.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !payment_id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Missing payment verification details" },
        },
        { status: 400 }
      );
    }

    const isMockPayment =
      razorpay_payment_id.startsWith("mock_payment_") ||
      razorpay_signature === "mock_signature";

    if (!isMockPayment) {
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(text)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "INVALID_SIGNATURE", message: "Invalid payment signature" },
          },
          { status: 400 }
        );
      }
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "DEMO_DISABLED", message: "Mock host payments are disabled in production" },
        },
        { status: 403 }
      );
    }

    if (payment_id === "demo-payment") {
      return NextResponse.json({
        success: true,
        data: {
          id: payment_id,
          gateway_order_id: razorpay_order_id,
          gateway_payment_id: razorpay_payment_id,
          status: "COMPLETED",
          invoice_created: true,
          demo: true,
        },
      });
    }

    const adminClient = createAdminClient();
    const hostId = authResult.host?.id;

    const { data: payment, error: paymentError } = await adminClient
      .from("host_payments")
      .select(
        "id, host_id, invoice_id, billing_month, billing_year, generation_kwh, rate_per_kwh, base_amount, adjustments, late_fee, total_amount, status, due_date, paid_at, payment_method, payment_reference, gateway_order_id, gateway_payment_id, gateway_signature"
      )
      .eq("id", payment_id)
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
      return NextResponse.json({
        success: true,
        data: {
          id: payment.id,
          gateway_order_id: payment.gateway_order_id,
          gateway_payment_id: payment.gateway_payment_id,
          status: payment.status,
          invoice_created: Boolean(payment.invoice_id),
          idempotent: true,
        },
      });
    }

    if (payment.gateway_order_id && payment.gateway_order_id !== razorpay_order_id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "ORDER_MISMATCH", message: "The payment order does not match this billing record" },
        },
        { status: 400 }
      );
    }

    const billing = calculatePpaBilling({
      generationKwh: Number(payment.generation_kwh),
      ratePerKwh: Number(payment.rate_per_kwh),
      adjustments: Number(payment.adjustments || 0),
      lateFee: Number(payment.late_fee || 0),
      billingMonth: Number(payment.billing_month),
      billingYear: Number(payment.billing_year),
      hostId: hostId || undefined,
    });

    const invoiceNumber = buildInvoiceNumber({
      hostId: hostId || undefined,
      billingMonth: billing.billingMonth,
      billingYear: billing.billingYear,
    });

    const now = new Date().toISOString();
    let invoiceId = payment.invoice_id;
    let invoiceRecord = null;

    if (invoiceId) {
      const { data: existingInvoice } = await adminClient
        .from("host_invoices")
        .select("id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path")
        .eq("id", invoiceId)
        .eq("host_id", hostId)
        .single();

      invoiceRecord = existingInvoice || null;
    }

    if (!invoiceRecord) {
      const { data: createdInvoice, error: invoiceError } = await adminClient
        .from("host_invoices")
        .insert({
          host_id: hostId,
          invoice_number: invoiceNumber,
          invoice_date: now.slice(0, 10),
          due_date: payment.due_date,
          subtotal: billing.baseAmount + billing.lateFee,
          tax_amount: billing.taxAmount,
          total_amount: billing.totalDue,
          status: "PAID",
          sent_at: now,
          paid_at: now,
          pdf_path: null,
        })
        .select("id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path")
        .single();

      if (invoiceError || !createdInvoice) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "INVOICE_ERROR", message: invoiceError?.message || "Failed to generate invoice" },
          },
          { status: 500 }
        );
      }

      invoiceRecord = createdInvoice;
      invoiceId = createdInvoice.id;
    } else {
      const { data: updatedInvoice, error: updateInvoiceError } = await adminClient
        .from("host_invoices")
        .update({
          status: "PAID",
          paid_at: now,
          sent_at: invoiceRecord.sent_at || now,
          subtotal: billing.baseAmount + billing.lateFee,
          tax_amount: billing.taxAmount,
          total_amount: billing.totalDue,
        })
        .eq("id", invoiceRecord.id)
        .eq("host_id", hostId)
        .select("id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path")
        .single();

      if (updateInvoiceError || !updatedInvoice) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "INVOICE_ERROR", message: updateInvoiceError?.message || "Failed to update invoice" },
          },
          { status: 500 }
        );
      }

      invoiceRecord = updatedInvoice;
    }

    const invoiceDownloadPath = `/api/host/financials/invoices/${invoiceId}/download`;
    const { data: invoiceWithPath } = await adminClient
      .from("host_invoices")
      .update({ pdf_path: invoiceDownloadPath })
      .eq("id", invoiceId)
      .eq("host_id", hostId)
      .select("id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path")
      .single();

    if (invoiceWithPath) {
      invoiceRecord = invoiceWithPath;
    } else if (invoiceRecord) {
      invoiceRecord = {
        ...invoiceRecord,
        pdf_path: invoiceDownloadPath,
      };
    }

    const { data: updatedPayment, error: paymentUpdateError } = await adminClient
      .from("host_payments")
      .update({
        invoice_id: invoiceId,
        status: "COMPLETED",
        paid_at: now,
        payment_method: "RAZORPAY",
        payment_reference: razorpay_payment_id,
        gateway_order_id: razorpay_order_id,
        gateway_payment_id: razorpay_payment_id,
        gateway_signature: razorpay_signature,
        updated_at: now,
      })
      .eq("id", payment.id)
      .eq("host_id", hostId)
      .select(
        "id, host_id, invoice_id, billing_month, billing_year, generation_kwh, rate_per_kwh, base_amount, adjustments, late_fee, total_amount, status, due_date, paid_at, payment_method, payment_reference, gateway_order_id, gateway_payment_id, gateway_signature"
      )
      .single();

    if (paymentUpdateError || !updatedPayment) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "PAYMENT_UPDATE_ERROR", message: paymentUpdateError?.message || "Failed to finalize payment" },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        payment: {
          id: updatedPayment.id,
          invoiceId: updatedPayment.invoice_id,
          status: updatedPayment.status,
          gatewayOrderId: updatedPayment.gateway_order_id,
          gatewayPaymentId: updatedPayment.gateway_payment_id,
          paymentReference: updatedPayment.payment_reference,
        },
        invoice: invoiceRecord,
        bill: {
          invoiceNumber,
          billingMonth: billing.billingMonth,
          billingYear: billing.billingYear,
          periodLabel: billing.periodLabel,
          generationKwh: billing.generationKwh,
          totalDue: billing.totalDue,
        },
      },
    });
  } catch (error: any) {
    console.error("Host payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message || "Failed to verify host payment" },
      },
      { status: 500 }
    );
  }
}
