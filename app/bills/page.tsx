"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, CheckCircle, Clock, RefreshCw, Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    bill_number: "",
    amount: "",
    due_date: "",
    bill_month: new Date().getMonth() + 1,
    bill_year: new Date().getFullYear(),
    discom: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/bills");
      const result = await response.json();
      if (result.success) {
        setBills(result.data);
      } else {
        setError(result.error?.message || "Failed to fetch bills");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchBillFromBBPS = async () => {
    setFetching(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/bills/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(result.message || "Bill fetched successfully!");
        // Refresh bills list
        await fetchBills();
      } else {
        setError(result.error?.message || "Failed to fetch bill from BBPS");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setFetching(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/bills/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualFormData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(result.message || "Bill added successfully!");
        setShowManualForm(false);
        setManualFormData({
          bill_number: "",
          amount: "",
          due_date: "",
          bill_month: new Date().getMonth() + 1,
          bill_year: new Date().getFullYear(),
          discom: "",
        });
        await fetchBills();
      } else {
        setError(result.error?.message || "Failed to add bill");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-2 text-charcoal">
                Your Bills
              </h1>
              <p className="text-gray-600">
                View your electricity bills and applied solar credits
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowManualForm(!showManualForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Manually
              </Button>
              <Button
                variant="primary"
                onClick={fetchBillFromBBPS}
                isLoading={fetching}
                disabled={fetching}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
                Fetch Latest Bill
              </Button>
            </div>
          </div>

          {showManualForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Bill Manually</CardTitle>
                <CardDescription>
                  Enter your bill details manually (useful while waiting for BBPS approval)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        Bill Number *
                      </label>
                      <input
                        type="text"
                        value={manualFormData.bill_number}
                        onChange={(e) =>
                          setManualFormData({ ...manualFormData, bill_number: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                        required
                        placeholder="Enter bill number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        Amount (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={manualFormData.amount}
                        onChange={(e) =>
                          setManualFormData({ ...manualFormData, amount: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                        required
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={manualFormData.due_date}
                        onChange={(e) =>
                          setManualFormData({ ...manualFormData, due_date: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        DISCOM *
                      </label>
                      <input
                        type="text"
                        value={manualFormData.discom}
                        onChange={(e) =>
                          setManualFormData({ ...manualFormData, discom: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                        required
                        placeholder="e.g., BSES Rajdhani"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        Bill Month
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={manualFormData.bill_month}
                        onChange={(e) =>
                          setManualFormData({
                            ...manualFormData,
                            bill_month: parseInt(e.target.value),
                          })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        Bill Year
                      </label>
                      <input
                        type="number"
                        min="2020"
                        max={new Date().getFullYear() + 1}
                        value={manualFormData.bill_year}
                        onChange={(e) =>
                          setManualFormData({
                            ...manualFormData,
                            bill_year: parseInt(e.target.value),
                          })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={submitting}
                      disabled={submitting}
                    >
                      Add Bill
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowManualForm(false);
                        setError(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
            </div>
          ) : bills.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  No Bills Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Once you connect your utility, your bills will appear here. You can also fetch your latest bill using the button above.
                </p>
                <Link href="/connect">
                  <Button variant="primary">Connect Utility</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => (
                <Card key={bill.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-charcoal">
                            {bill.bill_number}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                              bill.status === "PAID" || bill.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : bill.status === "OVERDUE" || bill.status === "overdue"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {bill.status === "PAID" || bill.status === "paid" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {bill.status === "PAID" || bill.status === "paid"
                              ? "Paid"
                              : bill.status === "OVERDUE" || bill.status === "overdue"
                              ? "Overdue"
                              : "Pending"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {bill.bill_month && bill.bill_year
                            ? new Date(bill.bill_year, bill.bill_month - 1).toLocaleDateString(
                                "en-IN",
                                { month: "long", year: "numeric" }
                              )
                            : bill.fetched_at
                            ? new Date(bill.fetched_at).toLocaleDateString("en-IN", {
                                month: "long",
                                year: "numeric",
                              })
                            : "N/A"}{" "}
                          • Due: {bill.due_date ? formatDate(bill.due_date) : "N/A"}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Bill Amount</span>
                            <span className="font-medium">{formatCurrency(Number(bill.amount))}</span>
                          </div>
                          {Number(bill.credits_applied || 0) > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 text-green-600">
                                Solar Credits Applied
                              </span>
                              <span className="font-medium text-green-600">
                                -{formatCurrency(Number(bill.credits_applied || 0))}
                              </span>
                            </div>
                          )}
                          <div className="pt-2 border-t flex justify-between">
                            <span className="font-semibold text-charcoal">Final Amount</span>
                            <span className="font-bold text-lg text-charcoal">
                              {formatCurrency(
                                Number(bill.final_amount || bill.amount) -
                                  Number(bill.credits_applied || 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
