"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/host/financials/StatusBadge";
import { HostBillingSummary } from "@/lib/host/billing";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CreditCard,
  Download,
  FileText,
  Gauge,
  Info,
  Lock,
  Receipt,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

interface VerifyResponse {
  success: boolean;
  data?: {
    invoice?: { invoice_number?: string; id?: string } | null;
    payment?: { payment_reference?: string } | null;
    alreadyProcessed?: boolean;
  };
  error?: { message?: string } | string;
}

import { launchCashfreeCheckout } from "@/lib/payments/cashfreeClient";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatMoney(value: number) {
  return currencyFormatter.format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HostFinancialsPage() {
  const [summary, setSummary] = useState<HostBillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState<{
    invoiceId?: string;
    invoiceNumber?: string;
    paymentReference?: string;
  } | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/host/financials/summary", {
        credentials: "include",
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : result.error?.message || "Failed to load billing summary"
        );
      }
      setSummary(result.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load billing summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handlePayNow = async () => {
    if (!summary || !summary.isLiveData || summary.paymentStatus === "PAID") return;
    if (!summary.hasBilledPeriod) return;

    let phone = "";
    if (typeof window !== "undefined") {
      phone = window.prompt("Enter your 10-digit mobile number for payment receipt") || "";
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("A valid 10-digit Indian mobile number is required to start payment.");
      return;
    }

    setLoadingPayment(true);
    setError("");

    try {
      const orderResponse = await fetch("/api/host/financials/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          billingMonth: summary.billingMonth,
          billingYear: summary.billingYear,
          customer_phone: phone,
        }),
      });

      const orderResult = await orderResponse.json();
      if (!orderResult.success) {
        throw new Error(
          typeof orderResult.error === "string"
            ? orderResult.error
            : orderResult.error?.message || "Failed to create host payment order"
        );
      }

      const result = await launchCashfreeCheckout({
        paymentSessionId: orderResult.data.payment_session_id,
        mode: orderResult.data.mode,
      });

      if (result.status === "failed") {
        throw new Error(result.error || "Payment failed");
      }

      if (result.status === "dismissed") {
        return;
      }

      const verifyResponse = await fetch("/api/host/financials/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ order_id: orderResult.data.order_id }),
      });
      const verifyResult: VerifyResponse = await verifyResponse.json();
      if (!verifyResult.success) {
        throw new Error(
          typeof verifyResult.error === "string"
            ? verifyResult.error
            : verifyResult.error?.message || "Payment verification failed"
        );
      }
      setPaymentSuccess({
        invoiceId: verifyResult.data?.invoice?.id,
        invoiceNumber:
          verifyResult.data?.invoice?.invoice_number || summary.invoiceNumber,
        paymentReference:
          verifyResult.data?.payment?.payment_reference || orderResult.data.order_id,
      });
      setSummary((s) => (s ? { ...s, paymentStatus: "PAID" } : s));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setLoadingPayment(false);
    }
  };

  const hasBilledPeriod = summary?.hasBilledPeriod ?? false;
  const acc = summary?.accumulating;
  const canPay = Boolean(
    summary && summary.isLiveData && hasBilledPeriod && summary.paymentStatus !== "PAID"
  );

  const progressPct = acc
    ? Math.min(100, Math.round((acc.dayOfMonth / acc.daysInMonth) * 100))
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Premium hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-forest to-forest-light p-6 sm:p-8 shadow-lg"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4 max-w-3xl">
            <Link
              href="/host"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to host dashboard
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Receipt className="w-3.5 h-3.5" />
              Monthly PPA Billing
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-heading">
              Your generation, invoiced at the start of each month.
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-white/75">
              PowerNetPro bills the previous complete calendar month on the 1st.
              Pay securely via Cashfree before the due date to avoid late fees.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                {hasBilledPeriod ? "Billing cycle" : "First invoice on"}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {summary?.billingLabel ||
                  (acc ? formatDate(acc.nextInvoiceDate) : "Loading...")}
              </p>
              <p className="mt-1 text-sm text-white/60">
                {hasBilledPeriod && summary
                  ? `Due: ${formatDate(summary.dueDate)}`
                  : acc
                  ? `Plant active from ${formatDate(acc.ppaStartDate)}`
                  : ""}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Current status
              </p>
              <div className="mt-2">
                {summary ? (
                  <StatusBadge
                    status={hasBilledPeriod ? summary.paymentStatus : "PENDING"}
                  />
                ) : (
                  <span className="text-sm text-white/60">Loading</span>
                )}
              </div>
              <p className="mt-2 text-xs text-white/60">
                {hasBilledPeriod
                  ? "Invoice locked after payment."
                  : "No invoice due yet."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-700 mt-0.5" />
            <div>
              <p className="font-semibold">Payment completed and invoice generated</p>
              <p className="mt-1 text-emerald-800/80">
                Invoice {paymentSuccess.invoiceNumber} has been created. Reference:{" "}
                {paymentSuccess.paymentReference}.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          {/* Accumulating current-cycle card */}
          {acc && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="shadow-sm border-gold/20 overflow-hidden">
                <div className="bg-gradient-to-r from-gold/10 via-amber-50 to-white border-b border-gold/15 px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-gold/15">
                      <TrendingUp className="w-4 h-4 text-gold-dark" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {acc.label} — accumulating
                      </p>
                      <p className="text-xs text-gray-500">
                        Next invoice on {formatDate(acc.nextInvoiceDate)}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gold/30 text-[11px] font-semibold uppercase tracking-wide text-gold-dark">
                    <CalendarClock className="w-3 h-3" />
                    In progress
                  </span>
                </div>

                <CardContent className="pt-5 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
                        <Zap className="w-3.5 h-3.5 text-gold" />
                        Generation so far
                      </div>
                      <p className="mt-2 text-xl font-bold text-black font-heading">
                        {acc.generationKwh.toLocaleString("en-IN")} kWh
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
                        <Gauge className="w-3.5 h-3.5 text-forest" />
                        Rate
                      </div>
                      <p className="mt-2 text-xl font-bold text-black font-heading">
                        {formatMoney(acc.ratePerKwh)}
                        <span className="text-sm text-gray-500 font-normal">/kWh</span>
                      </p>
                    </div>
                    <div className="rounded-2xl border border-forest/15 bg-forest/5 p-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-forest/70">
                        <Wallet className="w-3.5 h-3.5 text-forest" />
                        Estimate so far
                      </div>
                      <p className="mt-2 text-xl font-bold text-forest font-heading">
                        {formatMoney(acc.estimatedAmount)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>
                        Day {acc.dayOfMonth} of {acc.daysInMonth}
                      </span>
                      <span>{progressPct}% of cycle elapsed</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-gold to-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-4 text-sm text-gray-600">
                    <Info className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                    <p>
                      This is a live preview, not a bill. The invoice for{" "}
                      <span className="font-medium text-black">{acc.label}</span> will
                      be generated on the 1st and payable until the due day of the
                      next month.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Outstanding invoice (only if previous month is billable) */}
          {hasBilledPeriod && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="w-5 h-5 text-forest" />
                  Outstanding Invoice
                </CardTitle>
                {summary && <StatusBadge status={summary.paymentStatus} />}
              </CardHeader>
              <CardContent className="space-y-6">
                {loading && !summary ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-20 rounded-2xl bg-gray-100" />
                    <div className="h-16 rounded-2xl bg-gray-100" />
                  </div>
                ) : summary ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Project
                        </p>
                        <p className="mt-2 text-sm font-semibold text-black">
                          {summary.projectName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Agreement {summary.agreementNumber}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Units consumed
                        </p>
                        <p className="mt-2 text-sm font-semibold text-black">
                          {summary.generationKwh.toLocaleString("en-IN")} kWh
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Billable: {summary.billableKwh.toLocaleString("en-IN")} kWh
                        </p>
                      </div>
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Rate
                        </p>
                        <p className="mt-2 text-sm font-semibold text-black">
                          {formatMoney(summary.ratePerKwh)}/kWh
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Invoice {summary.invoiceNumber}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">Energy charge</span>
                        <span className="text-sm font-semibold text-black">
                          {formatMoney(summary.subtotal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">Adjustments</span>
                        <span className="text-sm font-semibold text-black">
                          {formatMoney(summary.adjustments)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">Late fee</span>
                        <span
                          className={`text-sm font-semibold ${
                            summary.lateFee > 0 ? "text-red-600" : "text-black"
                          }`}
                        >
                          {formatMoney(summary.lateFee)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between gap-4">
                        <span className="text-base font-semibold text-black">
                          Total due
                        </span>
                        <span className="text-3xl font-bold text-forest font-heading">
                          {formatMoney(summary.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button
                        onClick={handlePayNow}
                        isLoading={loadingPayment}
                        disabled={!canPay || loadingPayment}
                        className="sm:w-auto"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {summary.paymentStatus === "OVERDUE"
                          ? "Pay Overdue Invoice"
                          : "Pay Securely via Cashfree"}
                      </Button>
                      {paymentSuccess?.invoiceId ? (
                        <Link
                          href={`/api/host/financials/invoices/${paymentSuccess.invoiceId}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="sm:w-auto"
                        >
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" disabled className="sm:w-auto">
                          <Download className="w-4 h-4 mr-2" />
                          Download Invoice
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
                    Unable to load billing summary.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Settlement history */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-gold" />
                Settlement History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary?.history && summary.history.length > 0 ? (
                summary.history.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between hover:border-gold/30 hover:shadow-sm transition-all"
                  >
                    <div>
                      <p className="font-medium text-black">{invoice.period}</p>
                      <p className="text-xs text-gray-500">
                        {invoice.paidAt
                          ? `Paid on ${formatDate(invoice.paidAt)}`
                          : "Electricity bill against the active PPA"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="font-semibold text-black">
                        {formatMoney(invoice.amount)}
                      </span>
                      <StatusBadge status={invoice.status} />
                      {invoice.status === "PAID" && invoice.invoiceId && (
                        <Link
                          href={`/api/host/financials/invoices/${invoice.invoiceId}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:border-gold/40 hover:text-black transition-colors"
                          title="Download invoice PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Invoice
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                  <Receipt className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  No past settlements yet. Paid invoices will appear here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-forest/10 overflow-hidden">
            <div className="bg-gradient-to-br from-forest/5 via-white to-white px-5 py-4 border-b border-forest/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forest" />
                <p className="text-base font-semibold text-black">How billing works</p>
              </div>
            </div>
            <CardContent className="pt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3 rounded-xl bg-gray-50/70 p-3">
                <div className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <p>
                  <span className="font-medium text-black">Meter.</span> Trillectric
                  records generation kWh every 5 minutes.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-gray-50/70 p-3">
                <div className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <p>
                  <span className="font-medium text-black">Invoice.</span> On the 1st
                  of each month we issue the invoice for the previous month.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-gray-50/70 p-3">
                <div className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <p>
                  <span className="font-medium text-black">Pay.</span> Settle through
                  Cashfree before the due day. Late payments accrue a fee.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-gray-50/70 p-3">
                <div className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </div>
                <p>
                  <span className="font-medium text-black">Receipt.</span> The invoice
                  PDF is locked in your history after signature verification.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="w-5 h-5 text-forest" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>
                Amounts are computed server-side from the PPA rate and metered
                generation — not from the browser.
              </p>
              <p>
                Payments flow through Cashfree; PowerNetPro never sees or stores your
                card details.
              </p>
              <p>
                Invoice records are written only after Cashfree confirms the payment.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gold/20 overflow-hidden">
            <div className="bg-gradient-to-br from-gold/10 via-amber-50 to-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gold-dark" />
                <p className="text-sm font-semibold text-black">Need help?</p>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Reach out to your PowerNetPro account manager for dispute resolution
                or payment adjustments.
              </p>
              <Link
                href="/host/alerts"
                className="inline-flex items-center gap-2 text-xs font-semibold text-forest hover:text-gold-dark transition-colors"
              >
                Review alerts first →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
