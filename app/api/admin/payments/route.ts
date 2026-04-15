import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin/adminAuth";
import type {
  BillStatus,
  ElectricityBill,
  PaymentStatus,
  PaymentStats,
  Transaction,
} from "@/lib/data/payments";

export const dynamic = "force-dynamic";

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function percentChange(current: number, previous: number) {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }
  return round(((current - previous) / previous) * 100, 1);
}

function toPaymentStatus(status: string | null | undefined): PaymentStatus {
  const normalized = String(status || "PENDING").toUpperCase();
  if (normalized === "COMPLETED") return "success";
  if (normalized === "FAILED" || normalized === "DISPUTED") return "failed";
  if (normalized === "REFUNDED") return "refunded";
  return "pending";
}

function toBillStatus(status: string | null | undefined): BillStatus {
  const normalized = String(status || "DRAFT").toUpperCase();
  if (normalized === "PAID") return "paid";
  if (normalized === "OVERDUE") return "overdue";
  if (normalized === "SENT") return "unpaid";
  return "processing";
}

function formatMonthLabel(month: number) {
  return new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(2024, month - 1, 1));
}

function periodKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function getPaymentMethod(payment: Record<string, unknown>) {
  return (
    (payment.payment_method as string | null | undefined) ||
    (payment.gateway_payment_id ? "Gateway" : undefined) ||
    (payment.gateway_order_id ? "Gateway" : undefined) ||
    "Bank Transfer"
  );
}

function mapStatusToLabel(status: PaymentStatus) {
  if (status === "success") return "Completed";
  if (status === "failed") return "Failed";
  if (status === "refunded") return "Refunded";
  return "Pending";
}

export async function GET() {
  try {
    const authResult = await verifyAdmin();
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const adminClient = createAdminClient();

    const [projectsResult, agreementsResult, hostsResult, invoicesResult, paymentsResult] = await Promise.all([
      adminClient
        .from("projects")
        .select("id, name, spv_id, location, host_id")
        .is("deleted_at", null),
      adminClient
        .from("ppa_agreements")
        .select("id, project_id, host_id, agreement_number, status"),
      adminClient
        .from("hosts")
        .select("id, business_name, contact_name, contact_email, contact_phone"),
      adminClient
        .from("host_invoices")
        .select("id, host_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path, created_at")
        .order("invoice_date", { ascending: false }),
      adminClient
        .from("host_payments")
        .select("id, host_id, ppa_agreement_id, invoice_id, billing_month, billing_year, generation_kwh, rate_per_kwh, base_amount, adjustments, late_fee, total_amount, status, due_date, paid_at, payment_method, payment_reference, notes, created_at, gateway_order_id, gateway_payment_id")
        .order("created_at", { ascending: false }),
    ]);

    const projects = projectsResult.data || [];
    const agreements = agreementsResult.data || [];
    const hosts = hostsResult.data || [];
    const invoices = invoicesResult.data || [];
    const payments = paymentsResult.data || [];

    const projectMap = new Map<string, (typeof projects)[number]>();
    projects.forEach((project) => projectMap.set(project.id, project));

    const agreementMap = new Map<string, (typeof agreements)[number]>();
    agreements.forEach((agreement) => agreementMap.set(agreement.id, agreement));

    const hostMap = new Map<string, (typeof hosts)[number]>();
    hosts.forEach((host) => hostMap.set(host.id, host));

    const invoiceMap = new Map<string, (typeof invoices)[number]>();
    invoices.forEach((invoice) => invoiceMap.set(invoice.id, invoice));

    const paymentsByBillingPeriod = new Map<string, number>();
    const paymentCountByBillingPeriod = new Map<string, number>();
    const completedCountByBillingPeriod = new Map<string, number>();
    const pendingCountByBillingPeriod = new Map<string, number>();
    const failedCountByBillingPeriod = new Map<string, number>();

    payments.forEach((payment) => {
      const key = periodKey(Number(payment.billing_year), Number(payment.billing_month));
      paymentsByBillingPeriod.set(key, (paymentsByBillingPeriod.get(key) || 0) + Number(payment.total_amount || 0));
      paymentCountByBillingPeriod.set(key, (paymentCountByBillingPeriod.get(key) || 0) + 1);

      const status = String(payment.status || "PENDING").toUpperCase();
      if (status === "COMPLETED") {
        completedCountByBillingPeriod.set(key, (completedCountByBillingPeriod.get(key) || 0) + 1);
      } else if (status === "FAILED" || status === "DISPUTED") {
        failedCountByBillingPeriod.set(key, (failedCountByBillingPeriod.get(key) || 0) + 1);
      } else {
        pendingCountByBillingPeriod.set(key, (pendingCountByBillingPeriod.get(key) || 0) + 1);
      }
    });

    const sortedPeriods = Array.from(paymentsByBillingPeriod.keys()).sort();
    const latestPeriod = sortedPeriods.at(-1);
    const previousPeriod = sortedPeriods.at(-2);

    const currentRevenue = latestPeriod ? paymentsByBillingPeriod.get(latestPeriod) || 0 : 0;
    const previousRevenue = previousPeriod ? paymentsByBillingPeriod.get(previousPeriod) || 0 : 0;

    const latestCompletedCount = latestPeriod ? completedCountByBillingPeriod.get(latestPeriod) || 0 : 0;
    const previousCompletedCount = previousPeriod ? completedCountByBillingPeriod.get(previousPeriod) || 0 : 0;
    const latestPendingCount = latestPeriod ? pendingCountByBillingPeriod.get(latestPeriod) || 0 : 0;
    const previousPendingCount = previousPeriod ? pendingCountByBillingPeriod.get(previousPeriod) || 0 : 0;
    const latestFailedCount = latestPeriod ? failedCountByBillingPeriod.get(latestPeriod) || 0 : 0;
    const previousFailedCount = previousPeriod ? failedCountByBillingPeriod.get(previousPeriod) || 0 : 0;

    const revenueByMonth = sortedPeriods.slice(-12).map((key) => {
      const [year, month] = key.split("-").map(Number);
      return {
        month: formatMonthLabel(month),
        year,
        value: Math.round(paymentsByBillingPeriod.get(key) || 0),
      };
    });

    const transactions: Transaction[] = payments.map((payment) => {
      const agreement = agreementMap.get(String(payment.ppa_agreement_id));
      const project = agreement ? projectMap.get(agreement.project_id) : undefined;
      const host = hostMap.get(String(payment.host_id || agreement?.host_id || project?.host_id || ""));
      const invoice = payment.invoice_id ? invoiceMap.get(String(payment.invoice_id)) : undefined;
      const amount = Number(payment.total_amount || 0);
      const baseAmount = Number(payment.base_amount || 0);
      const adjustments = Number(payment.adjustments || 0);
      const lateFee = Number(payment.late_fee || 0);
      const gstAmount = Math.max(0, Math.round(amount * 0.18));

      return {
        id: String(payment.id),
        txnId: String(payment.payment_reference || payment.gateway_payment_id || payment.gateway_order_id || invoice?.invoice_number || payment.id),
        user: {
          name: host?.contact_name || host?.business_name || "Vedvyas Host",
          email: host?.contact_email || "host@vedvyassolar.com",
          phone: host?.contact_phone || "+91 00000 00000",
        },
        project: {
          name: project?.name || "Vedvyas Solar Park",
          spvId: project?.spv_id || "SPV-VEV-001",
          location: project?.location || "Vedvyas, Odisha",
        },
        paymentType: "Monthly PPA",
        amount,
        method: getPaymentMethod(payment as Record<string, unknown>),
        status: toPaymentStatus(payment.status),
        date: String(payment.paid_at || payment.created_at || new Date().toISOString()),
        gatewayRefId: String(payment.gateway_payment_id || payment.gateway_order_id || invoice?.invoice_number || payment.payment_reference || payment.id),
        breakdown: [
          { label: "Base Amount", amount: baseAmount || Math.max(0, amount - gstAmount - adjustments - lateFee) },
          { label: "Adjustments", amount: adjustments },
          { label: "Late Fee", amount: lateFee },
          { label: "GST (18%)", amount: gstAmount },
        ],
        refundEligible: toPaymentStatus(payment.status) === "success",
      };
    });

    const electricityBills: ElectricityBill[] = invoices.map((invoice) => {
      const host = hostMap.get(String(invoice.host_id));
      const agreement = agreements.find((entry) => entry.host_id === invoice.host_id);
      const project = agreement ? projectMap.get(agreement.project_id) : undefined;

      return {
        id: String(invoice.id),
        billerName: host?.business_name || project?.name || "Vedvyas Solar Park",
        consumerNumber: String(agreement?.agreement_number || invoice.invoice_number),
        billAmount: Number(invoice.total_amount || 0),
        dueDate: String(invoice.due_date),
        status: toBillStatus(invoice.status),
        bbpsRefId: String(invoice.invoice_number),
      };
    });

    const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.total_amount || 0), 0);
    const completedPayments = payments.filter((payment) => String(payment.status || "").toUpperCase() === "COMPLETED").length;
    const pendingPayments = payments.filter((payment) => {
      const status = String(payment.status || "PENDING").toUpperCase();
      return status === "PENDING" || status === "PROCESSING";
    }).length;
    const failedPayments = payments.filter((payment) => {
      const status = String(payment.status || "PENDING").toUpperCase();
      return status === "FAILED" || status === "DISPUTED";
    }).length;

    const stats: PaymentStats = {
      totalRevenue: Math.round(totalRevenue),
      totalRevenueChange: percentChange(currentRevenue, previousRevenue),
      successfulPayments: completedPayments,
      successfulChange: percentChange(latestCompletedCount, previousCompletedCount),
      pendingPayments,
      pendingChange: percentChange(latestPendingCount, previousPendingCount),
      failedPayments,
      failedChange: percentChange(latestFailedCount, previousFailedCount),
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        transactions,
        electricityBills,
        revenueByMonth,
      },
    });
  } catch (error) {
    console.error("Admin payments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load admin payments" },
      { status: 500 }
    );
  }
}
