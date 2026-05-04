import { createAdminClient } from "@/lib/supabase/admin";
import { buildInvoiceNumber } from "@/lib/host/billing";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

/**
 * Ensure a host_invoice exists for a given paid host_payment, and that the
 * host_payment is linked to it. Idempotent — safe to call from both the
 * Cashfree webhook and the client-side verify endpoint without creating
 * duplicates.
 *
 * Returns the invoice record (with pdf_path) and a boolean indicating whether
 * an invoice was created on this call.
 */
export async function ensureHostInvoiceForPayment(
  hostPaymentId: string,
  admin?: SupabaseAdmin
) {
  const adminClient = admin || createAdminClient();

  const { data: payment } = await adminClient
    .from("host_payments")
    .select(
      "id, host_id, invoice_id, billing_month, billing_year, base_amount, total_amount, due_date"
    )
    .eq("id", hostPaymentId)
    .maybeSingle();

  if (!payment) return { invoice: null, created: false };

  // 1. If linked already, just ensure pdf_path is set and return.
  if (payment.invoice_id) {
    const downloadPath = `/api/host/financials/invoices/${payment.invoice_id}/download`;
    const { data: existing } = await adminClient
      .from("host_invoices")
      .update({ pdf_path: downloadPath })
      .eq("id", payment.invoice_id)
      .eq("host_id", payment.host_id)
      .select("*")
      .maybeSingle();
    return { invoice: existing, created: false };
  }

  // 2. No link yet — try to find an invoice that matches this billing period
  //    in case a prior partial run created one without linking it.
  const invoiceNumber = buildInvoiceNumber({
    hostId: payment.host_id,
    billingMonth: Number(payment.billing_month),
    billingYear: Number(payment.billing_year),
  });

  const { data: existingInvoiceRows } = await adminClient
    .from("host_invoices")
    .select("*")
    .eq("host_id", payment.host_id)
    .eq("invoice_number", invoiceNumber)
    .limit(1);

  let invoice = existingInvoiceRows?.[0] || null;

  // 3. Create the invoice if neither path found one.
  if (!invoice) {
    const now = new Date().toISOString();
    const { data: createdInvoice, error: invoiceError } = await adminClient
      .from("host_invoices")
      .insert({
        host_id: payment.host_id,
        invoice_number: invoiceNumber,
        invoice_date: now.slice(0, 10),
        due_date: payment.due_date,
        subtotal: payment.base_amount,
        tax_amount: 0,
        total_amount: payment.total_amount,
        status: "PAID",
        sent_at: now,
        paid_at: now,
        pdf_path: null,
      })
      .select("*")
      .single();

    if (invoiceError || !createdInvoice) {
      console.error("ensureHostInvoiceForPayment: insert failed", invoiceError);
      return { invoice: null, created: false };
    }
    invoice = createdInvoice;
  }

  // 4. Link host_payment -> invoice.
  await adminClient
    .from("host_payments")
    .update({ invoice_id: invoice.id })
    .eq("id", payment.id);

  // 5. Stamp pdf_path so the UI download links resolve.
  const downloadPath = `/api/host/financials/invoices/${invoice.id}/download`;
  const { data: stamped } = await adminClient
    .from("host_invoices")
    .update({ pdf_path: downloadPath })
    .eq("id", invoice.id)
    .eq("host_id", payment.host_id)
    .select("*")
    .maybeSingle();

  return { invoice: stamped || { ...invoice, pdf_path: downloadPath }, created: true };
}
