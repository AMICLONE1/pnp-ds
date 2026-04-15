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
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

  interface VerifyResponse {
    success: boolean;
    data?: {
      invoice?: {
        invoice_number?: string;
        id?: string;
      } | null;
      payment?: {
        payment_reference?: string;
      } | null;
      alreadyProcessed?: boolean;
    };
    error?: {
      message?: string;
    } | string;
  }

  declare global {
    interface Window {
      Razorpay: any;
    }
  }

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  const INVOICE_HISTORY = [
    { period: "January 2026", amount: 561376.84, status: "PAID" as const },
    { period: "December 2025", amount: 582321.75, status: "PAID" as const },
    { period: "November 2025", amount: 492187.43, status: "OVERDUE" as const },
  ];

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

  async function loadRazorpayScript() {
    if (typeof window === "undefined" || window.Razorpay) {
      return true;
    }

    return await new Promise<boolean>((resolve) => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
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
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load billing summary");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchSummary();
    }, []);

    const handlePayNow = async () => {
      if (!summary || !summary.isLiveData || summary.paymentStatus === "PAID") {
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

        if (orderResult.data.mock) {
          const verifyResponse = await fetch("/api/host/financials/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id: orderResult.data.order_id,
              razorpay_payment_id: `mock_payment_${Date.now()}`,
              razorpay_signature: "mock_signature",
            }),
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
            invoiceNumber: verifyResult.data?.invoice?.invoice_number || summary.invoiceNumber,
            paymentReference: verifyResult.data?.payment?.payment_reference || orderResult.data.order_id,
          });
          setSummary({ ...summary, paymentStatus: "PAID" });
          return;
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || !window.Razorpay) {
          throw new Error("Razorpay checkout could not be loaded. Please try again.");
        }

        const options = {
          key: orderResult.data.key,
          amount: orderResult.data.amount,
          currency: orderResult.data.currency,
          name: "PowerNetPro Host Billing",
          description: `${summary.billingLabel} electricity invoice`,
          order_id: orderResult.data.order_id,
          prefill: {
            email: "",
            contact: "",
          },
          theme: {
            color: "#0D2818",
          },
          handler: async (response: any) => {
            const verifyResponse = await fetch("/api/host/financials/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResult: VerifyResponse = await verifyResponse.json();

            if (verifyResult.success) {
              setPaymentSuccess({
                invoiceId: verifyResult.data?.invoice?.id,
                invoiceNumber: verifyResult.data?.invoice?.invoice_number || summary.invoiceNumber,
                paymentReference: verifyResult.data?.payment?.payment_reference || response.razorpay_payment_id,
              });
              setSummary((currentSummary) =>
                currentSummary ? { ...currentSummary, paymentStatus: "PAID" } : currentSummary
              );
            } else {
              throw new Error(
                typeof verifyResult.error === "string"
                  ? verifyResult.error
                  : verifyResult.error?.message || "Payment verification failed"
              );
            }
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (paymentError) {
        setError(paymentError instanceof Error ? paymentError.message : "Payment failed");
      } finally {
        setLoadingPayment(false);
      }
    };

    const canPay = Boolean(summary && summary.isLiveData && summary.paymentStatus !== "PAID");

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50/40 to-white p-6 sm:p-8 shadow-sm"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-100/60 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3 max-w-3xl">
              <Link href="/host" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to host dashboard
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                <Receipt className="w-3.5 h-3.5" />
                Monthly PPA Billing
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black font-heading">
                Invoice, settle, and lock the payment record in one secure flow.
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-gray-600">
                This screen calculates the monthly bill from live generation data, routes the payment through Razorpay, and generates the invoice only after payment verification.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-400">Billing cycle</p>
                <p className="mt-2 text-lg font-semibold text-black">{summary?.billingLabel || "Loading..."}</p>
                <p className="mt-1 text-sm text-gray-500">Due date: {summary ? formatDate(summary.dueDate) : "Pending"}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-400">Current status</p>
                <div className="mt-2">
                  {summary ? <StatusBadge status={summary.paymentStatus} /> : <span className="text-sm text-gray-500">Loading</span>}
                </div>
                <p className="mt-2 text-sm text-gray-500">Invoice is generated after successful payment verification.</p>
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
                  Invoice {paymentSuccess.invoiceNumber} has been created. Payment reference: {paymentSuccess.paymentReference}.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="w-5 h-5 text-forest" />
                  Current Invoice
                </CardTitle>
                {summary && <StatusBadge status={summary.paymentStatus} />}
              </CardHeader>
              <CardContent className="space-y-6">
                {loading && !summary ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-20 rounded-2xl bg-gray-100" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 rounded-2xl bg-gray-100" />
                      <div className="h-16 rounded-2xl bg-gray-100" />
                    </div>
                    <div className="h-12 rounded-2xl bg-gray-100" />
                  </div>
                ) : summary ? (
                  <>
                    {!summary.isLiveData && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Billing data is not live yet</p>
                          <p className="mt-1 text-amber-800/80">
                            This is a design-safe fallback until the admin provisions the host, assigns an active PPA, and generation data starts flowing.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Project</p>
                        <p className="mt-2 text-sm font-semibold text-black">{summary.projectName}</p>
                        <p className="mt-1 text-xs text-gray-500">Agreement {summary.agreementNumber}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Units consumed</p>
                        <p className="mt-2 text-sm font-semibold text-black">{summary.generationKwh.toLocaleString("en-IN")} kWh</p>
                        <p className="mt-1 text-xs text-gray-500">Billable: {summary.billableKwh.toLocaleString("en-IN")} kWh</p>
                      </div>
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Rate</p>
                        <p className="mt-2 text-sm font-semibold text-black">{formatMoney(summary.ratePerKwh)}/kWh</p>
                        <p className="mt-1 text-xs text-gray-500">Invoice {summary.invoiceNumber}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">Energy charge</span>
                        <span className="text-sm font-semibold text-black">{formatMoney(summary.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">Adjustments</span>
                        <span className="text-sm font-semibold text-black">{summary.adjustments === 0 ? formatMoney(0) : formatMoney(summary.adjustments)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">Late fee</span>
                        <span className="text-sm font-semibold text-black">{formatMoney(summary.lateFee)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between gap-4">
                        <span className="text-base font-semibold text-black">Total due</span>
                        <span className="text-2xl font-bold text-forest">{formatMoney(summary.totalAmount)}</span>
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
                        {summary.paymentStatus === "OVERDUE" ? "Pay Overdue Invoice" : "Pay Securely via Razorpay"}
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

                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
                      <p className="font-medium text-black">Billing notes</p>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Amount is calculated server-side from the active PPA and generation data.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          The invoice record is created only after the payment signature is verified.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          No card details are stored by PowerNetPro.
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
                    Unable to load billing summary.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-gold" />
                  Recent Settlement History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {INVOICE_HISTORY.map((invoice) => (
                  <div
                    key={invoice.period}
                    className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-black">{invoice.period}</p>
                      <p className="text-xs text-gray-500">Electricity bill settled against the active PPA</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-black">{formatMoney(invoice.amount)}</span>
                      <StatusBadge status={invoice.status} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border-forest/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="w-5 h-5 text-forest" />
                  Security Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                  <Lock className="w-4 h-4 mt-0.5 text-forest" />
                  <div>
                    <p className="font-medium text-black">Host-scoped access</p>
                    <p className="mt-1">Only the authenticated host account can read or pay this billing cycle.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                  <ShieldCheck className="w-4 h-4 mt-0.5 text-forest" />
                  <div>
                    <p className="font-medium text-black">Server-side calculation</p>
                    <p className="mt-1">The billed amount is derived from the PPA and generation rows on the server, not from the browser.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                  <Receipt className="w-4 h-4 mt-0.5 text-forest" />
                  <div>
                    <p className="font-medium text-black">Invoice after verification</p>
                    <p className="mt-1">The invoice record is created only after Razorpay returns a valid payment signature.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                  <ExternalLink className="w-4 h-4 mt-0.5 text-forest" />
                  <div>
                    <p className="font-medium text-black">Admin-provisioned access</p>
                    <p className="mt-1">Host accounts are created from the admin panel and should not share credentials with consumer users.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-gold" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <Link href="/admin/users" className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-gold/40 hover:shadow-sm transition-all">
                  <span>Provision or reactivate host access</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/host/alerts" className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-gold/40 hover:shadow-sm transition-all">
                  <span>Review alerts before paying</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/host/settings" className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-gold/40 hover:shadow-sm transition-all">
                  <span>Confirm payout and security preferences</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
