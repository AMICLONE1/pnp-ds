import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildInvoiceNumber } from "@/lib/host/billing";
import { fetchCashfreeOrder, fetchCashfreePayments } from "@/lib/payments/cashfree";
import { ensureHostInvoiceForPayment } from "@/lib/host/ensureInvoice";

export async function POST(request: Request) {
  try {
    const authResult = await verifyHost();
    if (!authResult.authorized || !authResult.host) {
      return hostUnauthorizedResponse(authResult.error || "UNAUTHORIZED");
    }

    const body = await request.json().catch(() => ({}));
    const { order_id } = body || {};

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Missing order_id" } },
        { status: 400 }
      );
    }

    const order = await fetchCashfreeOrder(order_id);
    if (order.order_status !== "PAID") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "PAYMENT_NOT_COMPLETED", message: `Payment is ${order.order_status}` },
          data: { order_status: order.order_status },
        },
        { status: 400 }
      );
    }

    const payments = await fetchCashfreePayments(order_id);
    const successful = payments.find((p) => p.payment_status === "SUCCESS");
    if (!successful) {
      return NextResponse.json(
        { success: false, error: { code: "PAYMENT_NOT_COMPLETED", message: "No successful payment found" } },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const { data: paymentRows, error: paymentError } = await adminClient
      .from("host_payments")
      .select("*")
      .eq("host_id", authResult.host.id)
      .eq("gateway_order_id", order_id)
      .limit(1);

    const paymentRecord = paymentRows?.[0];

    if (paymentError || !paymentRecord) {
      return NextResponse.json(
        { success: false, error: { code: "PAYMENT_NOT_FOUND", message: "Host payment record not found for this order" } },
        { status: 404 }
      );
    }

    if (paymentRecord.status === "COMPLETED") {
      // The webhook may have marked it COMPLETED already without creating
      // the invoice (older deploys). Ensure one exists now.
      const { invoice } = await ensureHostInvoiceForPayment(
        paymentRecord.id,
        adminClient
      );

      return NextResponse.json({
        success: true,
        data: {
          payment: paymentRecord,
          invoice,
          alreadyProcessed: true,
        },
      });
    }

    const { error: updateError } = await adminClient
      .from("host_payments")
      .update({
        gateway_payment_id: successful.cf_payment_id,
        gateway_signature: null,
        payment_reference: successful.cf_payment_id,
        status: "COMPLETED",
        paid_at: new Date().toISOString(),
        payment_method: "CASHFREE",
      })
      .eq("id", paymentRecord.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: updateError.message } },
        { status: 500 }
      );
    }

    const { data: ppaRows } = await adminClient
      .from("ppa_agreements")
      .select("id, agreement_number, project_id")
      .eq("id", paymentRecord.ppa_agreement_id)
      .limit(1);

    const ppa = ppaRows?.[0];

    const { data: projectRows } = ppa
      ? await adminClient.from("projects").select("name").eq("id", ppa.project_id).limit(1)
      : { data: [] };

    const projectName = projectRows?.[0]?.name || "Solar Project";
    const invoiceNumber = buildInvoiceNumber({
      hostId: authResult.host.id,
      billingMonth: Number(paymentRecord.billing_month),
      billingYear: Number(paymentRecord.billing_year),
    });

    let invoiceId = paymentRecord.invoice_id;
    let invoiceRecord: any = null;

    if (!invoiceId) {
      const { data: createdInvoice, error: invoiceError } = await adminClient
        .from("host_invoices")
        .insert({
          host_id: authResult.host.id,
          invoice_number: invoiceNumber,
          invoice_date: new Date().toISOString().slice(0, 10),
          due_date: paymentRecord.due_date,
          subtotal: paymentRecord.base_amount,
          tax_amount: 0,
          total_amount: paymentRecord.total_amount,
          status: "PAID",
          sent_at: new Date().toISOString(),
          paid_at: new Date().toISOString(),
          pdf_path: null,
        })
        .select("*")
        .single();

      if (invoiceError || !createdInvoice) {
        return NextResponse.json(
          { success: false, error: { code: "DB_ERROR", message: invoiceError?.message || "Failed to generate host invoice" } },
          { status: 500 }
        );
      }
      invoiceRecord = createdInvoice;
      invoiceId = createdInvoice.id;

      await adminClient
        .from("host_payments")
        .update({ invoice_id: invoiceId })
        .eq("id", paymentRecord.id);
    } else {
      const { data: existingInvoice } = await adminClient
        .from("host_invoices")
        .select("*")
        .eq("id", invoiceId)
        .limit(1);
      invoiceRecord = existingInvoice?.[0] || null;
    }

    if (invoiceId) {
      const invoiceDownloadPath = `/api/host/financials/invoices/${invoiceId}/download`;
      const { data: invoiceWithPath } = await adminClient
        .from("host_invoices")
        .update({ pdf_path: invoiceDownloadPath })
        .eq("id", invoiceId)
        .eq("host_id", authResult.host.id)
        .select("id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path")
        .single();

      if (invoiceWithPath) {
        invoiceRecord = invoiceWithPath;
      } else if (invoiceRecord) {
        invoiceRecord = { ...invoiceRecord, pdf_path: invoiceDownloadPath };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        payment: {
          ...paymentRecord,
          status: "COMPLETED",
          payment_reference: successful.cf_payment_id,
        },
        invoice: invoiceRecord,
        projectName,
      },
    });
  } catch (error: any) {
    console.error("Host billing verification error:", error);
    return NextResponse.json(
      { success: false, error: { code: "HOST_BILLING_ERROR", message: error.message || "Failed to verify host payment" } },
      { status: 500 }
    );
  }
}
