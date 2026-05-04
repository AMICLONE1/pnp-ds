import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { BILLING_HISTORY } from "@/components/host/financials/data";
import { calculatePpaBilling } from "@/lib/host/billing";

function hasCashfreeKeys() {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
}

function demoMonthForIndex(index: number) {
  const month = 2 - index;
  if (month > 0) {
    return { month, year: 2026 };
  }

  return { month: 12 + month, year: 2025 };
}

function mapDemoPayment(entry: (typeof BILLING_HISTORY)[number], index: number, hostId?: string) {
  const period = demoMonthForIndex(index);
  const billing = calculatePpaBilling({
    generationKwh: entry.generation,
    ratePerKwh: entry.rate,
    adjustments: entry.adjustments,
    billingMonth: period.month,
    billingYear: period.year,
    hostId,
  });

  return {
    id: `demo-bill-${index}`,
    invoiceId: null,
    invoiceNumber: billing.invoiceNumber,
    periodLabel: billing.periodLabel,
    billingMonth: billing.billingMonth,
    billingYear: billing.billingYear,
    generationKwh: billing.generationKwh,
    ratePerKwh: billing.ratePerKwh,
    adjustments: billing.adjustments,
    lateFee: billing.lateFee,
    baseAmount: billing.baseAmount,
    taxAmount: billing.taxAmount,
    cgstAmount: billing.cgstAmount,
    sgstAmount: billing.sgstAmount,
    tdsAmount: billing.tdsAmount,
    grossAmount: billing.grossAmount,
    totalDue: billing.totalDue,
    dueDate: `${billing.billingYear}-${String(billing.billingMonth).padStart(2, "0")}-10`,
    status: entry.status === "PAID" ? "COMPLETED" : entry.status === "OVERDUE" ? "DISPUTED" : "PENDING",
    invoiceIssued: false,
    paymentMethod: null,
    paymentReference: null,
    invoiceDate: `${billing.billingYear}-${String(billing.billingMonth).padStart(2, "0")}-01`,
  };
}

export async function GET() {
  try {
    const authResult = await verifyHost();

    if (!authResult.authorized) {
      return hostUnauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const hostId = authResult.host?.id;
    const adminClient = createAdminClient();

    const [agreementsResult, paymentsResult, invoicesResult] = await Promise.all([
      adminClient
        .from("ppa_agreements")
        .select(
          "id, agreement_number, start_date, end_date, duration_years, rate_per_kwh, payment_due_day, payment_grace_days, late_fee_percent, status, contracted_capacity_kw, minimum_guarantee_kwh, project:projects(id, name, location, total_kw)"
        )
        .eq("host_id", hostId)
        .order("created_at", { ascending: false }),
      adminClient
        .from("host_payments")
        .select(
          "id, host_id, ppa_agreement_id, invoice_id, billing_month, billing_year, generation_kwh, rate_per_kwh, base_amount, adjustments, late_fee, total_amount, status, due_date, paid_at, payment_method, payment_reference, gateway_order_id, gateway_payment_id, created_at, updated_at"
        )
        .eq("host_id", hostId)
        .order("billing_year", { ascending: false })
        .order("billing_month", { ascending: false })
        .limit(6),
      adminClient
        .from("host_invoices")
        .select(
          "id, host_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path, created_at, updated_at"
        )
        .eq("host_id", hostId)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const activeAgreement = (agreementsResult.data || []).find((agreement) => agreement.status === "ACTIVE") || agreementsResult.data?.[0] || null;
    const latestPayment = paymentsResult.data?.[0] || null;
    const latestInvoice = latestPayment
      ? invoicesResult.data?.find((invoice) => invoice.id === latestPayment.invoice_id) || invoicesResult.data?.[0] || null
      : invoicesResult.data?.[0] || null;

    if (!activeAgreement || !latestPayment) {
      const demoCurrent = mapDemoPayment(BILLING_HISTORY[0], 0, hostId || undefined);

      return NextResponse.json({
        success: true,
        data: {
          demo: true,
          host: {
            id: authResult.host?.id,
            businessName: authResult.host?.business_name || "Demo Host Portfolio",
            status: authResult.host?.status || "PENDING",
          },
          agreement: activeAgreement
            ? {
                id: activeAgreement.id,
                agreementNumber: activeAgreement.agreement_number,
                ratePerKwh: Number(activeAgreement.rate_per_kwh),
                paymentDueDay: activeAgreement.payment_due_day,
                paymentGraceDays: activeAgreement.payment_grace_days,
                status: activeAgreement.status,
                project: Array.isArray(activeAgreement.project)
                  ? activeAgreement.project[0]
                  : activeAgreement.project,
              }
            : null,
          currentPayment: demoCurrent,
          currentInvoice: null,
          recentPayments: BILLING_HISTORY.map((entry, index) => mapDemoPayment(entry, index, hostId || undefined)),
          recentInvoices: BILLING_HISTORY.map((entry, index) => mapDemoPayment(entry, index, hostId || undefined)),
          paymentGateway: {
            configured: hasCashfreeKeys(),
            appId: process.env.CASHFREE_APP_ID || "",
            mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox",
          },
          invoiceNote: "Admin provisioning is pending. This is a demo billing snapshot.",
        },
      });
    }

    const billing = calculatePpaBilling({
      generationKwh: Number(latestPayment.generation_kwh),
      ratePerKwh: Number(latestPayment.rate_per_kwh),
      adjustments: Number(latestPayment.adjustments || 0),
      lateFee: Number(latestPayment.late_fee || 0),
      billingMonth: Number(latestPayment.billing_month),
      billingYear: Number(latestPayment.billing_year),
      hostId: hostId || undefined,
    });

    const currentPayment = {
      id: latestPayment.id,
      invoiceId: latestPayment.invoice_id,
      invoiceNumber: latestInvoice?.invoice_number || billing.invoiceNumber,
      periodLabel: billing.periodLabel,
      billingMonth: billing.billingMonth,
      billingYear: billing.billingYear,
      generationKwh: billing.generationKwh,
      ratePerKwh: billing.ratePerKwh,
      adjustments: billing.adjustments,
      lateFee: billing.lateFee,
      baseAmount: billing.baseAmount,
      taxAmount: billing.taxAmount,
      cgstAmount: billing.cgstAmount,
      sgstAmount: billing.sgstAmount,
      tdsAmount: billing.tdsAmount,
      grossAmount: billing.grossAmount,
      totalDue: billing.totalDue,
      dueDate: String(latestPayment.due_date),
      status: latestPayment.status,
      invoiceIssued: Boolean(latestInvoice),
      paymentMethod: latestPayment.payment_method,
      paymentReference: latestPayment.payment_reference,
      invoiceDate: latestInvoice?.invoice_date || null,
    };

    const recentPayments = (paymentsResult.data || []).map((payment) => {
      const calculation = calculatePpaBilling({
        generationKwh: Number(payment.generation_kwh),
        ratePerKwh: Number(payment.rate_per_kwh),
        adjustments: Number(payment.adjustments || 0),
        lateFee: Number(payment.late_fee || 0),
        billingMonth: Number(payment.billing_month),
        billingYear: Number(payment.billing_year),
        hostId: hostId || undefined,
      });

      return {
        id: payment.id,
        invoiceId: payment.invoice_id,
        invoiceNumber: calculation.invoiceNumber,
        periodLabel: calculation.periodLabel,
        generationKwh: calculation.generationKwh,
        totalDue: calculation.totalDue,
        status: payment.status,
        dueDate: String(payment.due_date),
        paidAt: payment.paid_at,
        paymentMethod: payment.payment_method,
        paymentReference: payment.payment_reference,
        invoiceIssued: Boolean(payment.invoice_id),
      };
    });

    const recentInvoices = (invoicesResult.data || []).map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      invoiceDate: invoice.invoice_date,
      dueDate: invoice.due_date,
      subtotal: Number(invoice.subtotal),
      taxAmount: Number(invoice.tax_amount),
      totalAmount: Number(invoice.total_amount),
      status: invoice.status,
      paidAt: invoice.paid_at,
      pdfPath: invoice.pdf_path,
    }));

    return NextResponse.json({
      success: true,
      data: {
        demo: false,
        host: {
          id: authResult.host?.id,
          businessName: authResult.host?.business_name || "Host Portfolio",
          status: authResult.host?.status,
        },
        agreement: {
          id: activeAgreement.id,
          agreementNumber: activeAgreement.agreement_number,
          startDate: activeAgreement.start_date,
          endDate: activeAgreement.end_date,
          durationYears: Number(activeAgreement.duration_years),
          ratePerKwh: Number(activeAgreement.rate_per_kwh),
          paymentDueDay: activeAgreement.payment_due_day,
          paymentGraceDays: activeAgreement.payment_grace_days,
          lateFeePercent: Number(activeAgreement.late_fee_percent || 0),
          status: activeAgreement.status,
          contractedCapacityKw: Number(activeAgreement.contracted_capacity_kw),
          minimumGuaranteeKwh: activeAgreement.minimum_guarantee_kwh ? Number(activeAgreement.minimum_guarantee_kwh) : null,
          project: Array.isArray(activeAgreement.project) ? activeAgreement.project[0] : activeAgreement.project,
        },
        currentPayment,
        currentInvoice: latestInvoice
          ? {
              id: latestInvoice.id,
              invoiceNumber: latestInvoice.invoice_number,
              invoiceDate: latestInvoice.invoice_date,
              dueDate: latestInvoice.due_date,
              subtotal: Number(latestInvoice.subtotal),
              taxAmount: Number(latestInvoice.tax_amount),
              totalAmount: Number(latestInvoice.total_amount),
              status: latestInvoice.status,
              paidAt: latestInvoice.paid_at,
              pdfPath: latestInvoice.pdf_path,
            }
          : null,
        recentPayments,
        recentInvoices,
        paymentGateway: {
          configured: hasCashfreeKeys(),
          appId: process.env.CASHFREE_APP_ID || "",
          mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox",
        },
        invoiceNote: latestInvoice
          ? `Invoice ${latestInvoice.invoice_number} is ready for receipt download.`
          : "The invoice will be issued after the payment is confirmed.",
      },
    });
  } catch (error: any) {
    console.error("Host billing current error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message || "Failed to load host billing" },
      },
      { status: 500 }
    );
  }
}
