"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

type Filter = "SUBMITTED" | "APPROVED" | "REJECTED" | "ALL";

interface Bill {
  id: string;
  user_id: string;
  discom: string;
  bill_number: string | null;
  amount: number;
  credits_applied: number;
  due_date: string;
  status: string;
  review_status: Filter | null;
  proof_url: string | null;
  proof_signed_url: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  user?: { id: string; email: string; name: string; phone: string; state: string | null };
}

export default function AdminBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("SUBMITTED");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Bill | null>(null);
  const [action, setAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bills?status=${filter}`, {
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) setBills(result.data);
      else setError(result.error?.message || result.error || "Failed to load bills");
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReview = async () => {
    if (!selected || !action) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/bills/${selected.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, notes: notes || null }),
      });
      const result = await res.json();
      if (result.success) {
        setSelected(null);
        setAction(null);
        setNotes("");
        await load();
      } else {
        setError(result.error?.message || "Review failed");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    pending: bills.filter((b) => b.review_status === "SUBMITTED").length,
    total: bills.length,
  };

  return (
    <div className="p-4 md:p-6">
      <AdminPageHeader
        title="Bill Reviews"
        subtitle="Approve or reject user-submitted DISCOM bills. Approving auto-applies solar credits."
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(["SUBMITTED", "APPROVED", "REJECTED", "ALL"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f === "SUBMITTED" ? `Pending (${counts.pending})` : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={load}
          className="ml-auto"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {loading && bills.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">Loading bills…</p>
        ) : bills.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                No bills match this filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          bills.map((bill) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-black truncate">
                        {bill.user?.name || "Unknown user"}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          · {bill.user?.email}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {bill.discom} · Due {formatDate(bill.due_date)}
                        {bill.bill_number ? ` · #${bill.bill_number}` : ""}
                      </p>
                    </div>
                    <StatusPill status={bill.review_status} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-xl font-bold text-black">
                        {formatCurrency(Number(bill.amount))}
                      </p>
                      {Number(bill.credits_applied || 0) > 0 && (
                        <p className="text-xs text-green-700 mt-0.5">
                          Credits applied: {formatCurrency(Number(bill.credits_applied))}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {bill.proof_signed_url && (
                        <a
                          href={bill.proof_signed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            View proof
                          </Button>
                        </a>
                      )}
                      {bill.review_status === "SUBMITTED" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelected(bill);
                              setAction("APPROVE");
                              setNotes("");
                            }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelected(bill);
                              setAction("REJECT");
                              setNotes("");
                            }}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1.5" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {bill.review_notes && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-2 text-xs text-gray-600">
                      <strong>Notes:</strong> {bill.review_notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Review confirmation modal */}
      <AnimatePresence>
        {selected && action && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => !submitting && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    action === "APPROVE" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {action === "APPROVE" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-700" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-700" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    {action === "APPROVE" ? "Approve bill" : "Reject bill"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selected.user?.name} · {formatCurrency(Number(selected.amount))}
                  </p>
                </div>
              </div>

              {action === "APPROVE" ? (
                <p className="mb-4 text-sm text-gray-600">
                  This will mark the bill as PAID and auto-apply all pending solar
                  credits for this user (FIFO, capped at bill amount).
                </p>
              ) : (
                <p className="mb-4 text-sm text-gray-600">
                  The user will be notified. Please include a reason so they know
                  what to fix.
                </p>
              )}

              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Notes {action === "REJECT" ? "*" : "(optional)"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder={
                  action === "APPROVE"
                    ? "Optional comment for the audit log"
                    : "e.g. Bill image unreadable — please re-upload"
                }
              />

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <Button
                  variant={action === "APPROVE" ? "primary" : "outline"}
                  onClick={handleReview}
                  isLoading={submitting}
                  disabled={submitting || (action === "REJECT" && !notes.trim())}
                  className={
                    action === "REJECT"
                      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : ""
                  }
                >
                  Confirm {action === "APPROVE" ? "approval" : "rejection"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelected(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusPill({ status }: { status: string | null }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
      <Clock className="h-3 w-3" /> Pending review
    </span>
  );
}
