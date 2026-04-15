"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  CheckCircle,
  Clock,
  Plus,
  Receipt,
  Calendar,
  CreditCard,
  Upload,
  AlertCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { BillsSkeleton } from "@/components/ui/skeletons/BillsSkeleton";
import { fetchBills as apiFetchBills, submitManualBill, uploadBillProof } from "@/lib/utils/bills";

function statusBadge(bill: any) {
  if (bill.status === "PAID" || bill.review_status === "APPROVED") {
    return { label: "Approved & paid", icon: CheckCircle, cls: "bg-green-100 text-green-700" };
  }
  if (bill.review_status === "REJECTED") {
    return { label: "Rejected", icon: XCircle, cls: "bg-red-100 text-red-700" };
  }
  if (bill.review_status === "SUBMITTED") {
    return { label: "Under review", icon: Clock, cls: "bg-amber-100 text-amber-700" };
  }
  return { label: "Pending", icon: AlertCircle, cls: "bg-gray-100 text-gray-700" };
}

function BillsPageInner() {
  const searchParams = useSearchParams();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    bill_number: "",
    amount: "",
    due_date: "",
    discom: "",
  });

  const loadBills = async () => {
    setLoading(true);
    const result = await apiFetchBills();
    if (result.success) setBills(result.data);
    else setError(result.error);
    setLoading(false);
  };

  useEffect(() => {
    loadBills();
  }, []);

  useEffect(() => {
    if (searchParams.get("submit") === "1") setShowForm(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!proofFile) {
      setError("Please attach a PDF or image of your DISCOM bill.");
      return;
    }

    setSubmitting(true);
    const upload = await uploadBillProof(proofFile);
    if (!upload.success) {
      setError(upload.error);
      setSubmitting(false);
      return;
    }

    const result = await submitManualBill({ ...form, proof_url: upload.path });
    if (result.success) {
      setSuccessMessage(result.message);
      setShowForm(false);
      setForm({ bill_number: "", amount: "", due_date: "", discom: "" });
      setProofFile(null);
      await loadBills();
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-amber-100 border border-gold/30">
                  <Receipt className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-black">
                    Your Bills
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload your DISCOM bill — we review and apply your solar credits.
                  </p>
                </div>
              </div>
            </div>
            <Button variant="primary" onClick={() => setShowForm((s) => !s)}>
              <Plus className="h-4 w-4 mr-2" />
              Submit a bill
            </Button>
          </motion.div>

          {/* How it works strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {[
              { n: 1, t: "Upload", d: "Attach your DISCOM bill PDF or photo." },
              { n: 2, t: "Review", d: "Our team verifies amount and due date." },
              { n: 3, t: "Credits applied", d: "Solar credits auto-reduce your payable." },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-gold">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/10">
                    {s.n}
                  </span>
                  {s.t}
                </div>
                <p className="text-xs text-gray-600 mt-1.5">{s.d}</p>
              </div>
            ))}
          </motion.div>

          {/* Submit form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="mb-6 border border-gold/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                        <FileText className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <CardTitle>Submit a bill for review</CardTitle>
                        <CardDescription>
                          Your bill is reviewed manually. No payment needed at this step.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                            Bill number (optional)
                          </label>
                          <input
                            type="text"
                            value={form.bill_number}
                            onChange={(e) => setForm({ ...form, bill_number: e.target.value })}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                            placeholder="As shown on the bill"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                            <CreditCard className="h-3.5 w-3.5" />
                            Amount (₹) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="1"
                            required
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                            <Calendar className="h-3.5 w-3.5" />
                            Due date *
                          </label>
                          <input
                            type="date"
                            required
                            value={form.due_date}
                            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                            DISCOM *
                          </label>
                          <input
                            type="text"
                            required
                            value={form.discom}
                            onChange={(e) => setForm({ ...form, discom: e.target.value })}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                            placeholder="e.g. BSES Rajdhani"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                          <Upload className="h-3.5 w-3.5" />
                          Bill proof (PDF / JPG / PNG, max 8 MB) *
                        </label>
                        <input
                          type="file"
                          accept="application/pdf,image/png,image/jpeg,image/webp"
                          required
                          onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                          className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-gold/90"
                        />
                        {proofFile && (
                          <p className="mt-1.5 text-xs text-gray-500">
                            {proofFile.name} · {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={submitting}
                          disabled={submitting}
                        >
                          Submit for review
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {successMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <BillsSkeleton />
          ) : bills.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 mb-4">
                  <FileText className="h-7 w-7 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-1">No bills yet</h3>
                <p className="text-sm text-gray-600 mb-5">
                  Upload your first DISCOM bill to start using your solar credits.
                </p>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit a bill
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bills.map((bill, index) => {
                const badge = statusBadge(bill);
                const Icon = badge.icon;
                const payable =
                  Number(bill.amount || 0) - Number(bill.credits_applied || 0);
                return (
                  <motion.div
                    key={bill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-3">
                        <div>
                          <p className="text-sm font-semibold text-black">
                            {bill.discom || "DISCOM"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {bill.bill_number ? `#${bill.bill_number} · ` : ""}
                            Due {formatDate(bill.due_date)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.cls}`}
                        >
                          <Icon className="h-3 w-3" />
                          {badge.label}
                        </span>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bill amount</span>
                            <span className="font-medium text-black">
                              {formatCurrency(Number(bill.amount))}
                            </span>
                          </div>
                          {Number(bill.credits_applied || 0) > 0 && (
                            <div className="flex justify-between text-green-700">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" />
                                Solar credits applied
                              </span>
                              <span className="font-medium">
                                −{formatCurrency(Number(bill.credits_applied))}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-dashed border-gray-200 pt-2">
                            <span className="font-semibold text-black">Payable</span>
                            <span className="text-lg font-bold text-black">
                              {formatCurrency(Math.max(0, payable))}
                            </span>
                          </div>
                          {bill.review_status === "REJECTED" && bill.review_notes && (
                            <div className="mt-2 rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-700">
                              <strong>Reason:</strong> {bill.review_notes}
                            </div>
                          )}
                          {bill.review_status === "SUBMITTED" && (
                            <p className="mt-1 text-xs text-gray-500">
                              We usually review within 1 business day. You'll see credits here once approved.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BillsPage() {
  return (
    <Suspense fallback={<BillsSkeleton />}>
      <BillsPageInner />
    </Suspense>
  );
}
