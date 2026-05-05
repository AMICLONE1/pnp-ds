"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Download,
  FileText,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { launchCashfreeCheckout } from "@/lib/payments/cashfreeClient";

type BillingPanelState = {
  demo: boolean;
  host?: {
    businessName?: string;
    status?: string;
  };
  agreement?: {
    agreementNumber?: string;
    ratePerKwh?: number;
    paymentDueDay?: number;
    paymentGraceDays?: number;
    status?: string;
    project?: { name?: string; location?: string };
  } | null;
  currentPayment?: {
    id: string;
    invoiceId?: string | null;
    invoiceNumber: string;
    periodLabel: string;
    generationKwh: number;
    ratePerKwh: number;
    adjustments: number;
    lateFee: number;
    baseAmount: number;
    taxAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    tdsAmount: number;
    grossAmount: number;
    totalDue: number;
    dueDate: string;
    status: string;
    invoiceIssued: boolean;
    paymentMethod?: string | null;
    paymentReference?: string | null;
    invoiceDate?: string | null;
  } | null;
  currentInvoice?: {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    status: string;
    paidAt?: string | null;
    pdfPath?: string | null;
  } | null;
  recentPayments?: Array<{
    id: string;
    periodLabel: string;
    totalDue: number;
    status: string;
    dueDate: string;
    paidAt?: string | null;
  }>;
  recentInvoices?: Array<{
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
    paidAt?: string | null;
  }>;
  paymentGateway?: {
    configured: boolean;
    appId: string;
    mode: "sandbox" | "production";
  };
  invoiceNote?: string;
};

export function HostBillingPanel() {
  const [billing, setBilling] = useState<BillingPanelState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const loadBilling = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/host/billing/current");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "Failed to load billing data");
      }

      setBilling(result.data);
    } catch (loadError: any) {
      setError(loadError.message || "Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const finalizePayment = async (orderId: string, hostPaymentId: string) => {
    const verifyResponse = await fetch("/api/host/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, payment_id: hostPaymentId }),
    });

    const verifyResult = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyResult.success) {
      throw new Error(verifyResult.error?.message || "Payment verification failed");
    }

    await loadBilling();
  };

  const handlePayNow = async () => {
    const currentPayment = billing?.currentPayment;

    if (!currentPayment || currentPayment.status === "COMPLETED") {
      return;
    }

    let phone = "";
    if (typeof window !== "undefined") {
      phone = window.prompt("Enter your 10-digit mobile number for payment receipt") || "";
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("A valid 10-digit Indian mobile number is required to start payment.");
      return;
    }

    setPaying(true);
    setError("");

    try {
      const orderResponse = await fetch("/api/host/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: currentPayment.id,
          customer_phone: phone,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok || !orderResult.success) {
        throw new Error(orderResult.error?.message || "Failed to create payment order");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("pnp_payment_flow", "host_payment");
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

      await finalizePayment(orderResult.data.order_id, currentPayment.id);
    } catch (payError: any) {
      setError(payError.message || "Payment could not be started");
    } finally {
      setPaying(false);
    }
  };

  const current = billing?.currentPayment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      id="billing"
      className="scroll-mt-24"
    >
      <Card className="shadow-sm border-gold/15 bg-white overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-gold/5 via-white to-amber-50/40">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-forest text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure PPA Billing
              </div>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <CreditCard className="w-5 h-5 text-gold" />
                Monthly invoice and payment center
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1.5 max-w-2xl">
                Amounts are calculated server-side from the host billing ledger, then verified again before the invoice is marked paid.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${billing?.paymentGateway?.configured ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                <BadgeCheck className="w-3.5 h-3.5" />
                {billing?.paymentGateway?.configured ? "Cashfree ready" : "Demo checkout only"}
              </span>
              <button
                type="button"
                onClick={loadBilling}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          {loading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-gold" />
              Loading secure host billing data...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Could not load host billing</p>
                <p className="mt-1 text-red-600/90">{error}</p>
              </div>
            </div>
          ) : current ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-5">
                <div className="rounded-2xl bg-forest/5 border border-forest/10 p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600">
                      <CalendarDays className="w-3.5 h-3.5 text-forest" />
                      {current.periodLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600">
                      <FileText className="w-3.5 h-3.5 text-gold-dark" />
                      {current.invoiceNumber}
                    </span>
                    {billing?.demo && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
                        Demo data
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1">Amount due</p>
                      <p className="text-3xl sm:text-4xl font-bold text-forest font-heading">
                        {formatCurrency(current.totalDue)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1.5">
                        {current.generationKwh.toLocaleString("en-IN")} kWh at {formatCurrency(current.ratePerKwh)}/kWh for the billing period.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white border border-gray-200 px-4 py-3 min-w-[220px]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Due date</p>
                      <p className="text-sm font-semibold text-black mt-1">{formatDate(current.dueDate)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {current.status === "COMPLETED" ? "Paid and invoice issued" : "Pay through secure checkout"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Base amount</span>
                      <span className="font-medium text-black">{formatCurrency(current.baseAmount)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">GST</span>
                      <span className="font-medium text-black">{formatCurrency(current.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">TDS / withholding</span>
                      <span className="font-medium text-black">-{formatCurrency(current.tdsAmount)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Late fee</span>
                      <span className="font-medium text-black">{formatCurrency(current.lateFee)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between gap-3">
                      <span className="font-semibold text-black">Net payable</span>
                      <span className="font-bold text-forest text-lg">{formatCurrency(current.totalDue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between bg-gray-50 rounded-2xl p-4 border border-gray-200/80">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Invoice lifecycle
                  </p>
                  <p className="text-sm text-gray-600">
                    {billing?.invoiceNote || "The invoice is issued after the payment confirms, then made available for download."}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    type="button"
                    onClick={handlePayNow}
                    isLoading={paying}
                    className="rounded-xl"
                    disabled={current.status === "COMPLETED"}
                  >
                    {current.status === "COMPLETED" ? "Already paid" : "Pay securely"}
                  </Button>

                  <Link href="#history" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    View history
                  </Link>

                  <Link href={billing.currentInvoice?.pdfPath || "/host/financials#history"} className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    {billing.currentInvoice?.pdfPath ? "Download invoice" : "Invoice pending"}
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center text-sm text-gray-500">
              No current billing record is available yet.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
