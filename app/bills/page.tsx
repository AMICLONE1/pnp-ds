"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  RefreshCw, 
  Plus, 
  Zap, 
  Receipt, 
  ArrowRight,
  Sparkles,
  TrendingDown,
  Calendar,
  CreditCard
} from "lucide-react";
import { BillsSkeleton } from "@/components/ui/skeletons/BillsSkeleton";

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
      // Show skeleton for minimum 10 seconds
      setTimeout(() => {
        setLoading(false);
      }, 10000);
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-white/10">
                  <Receipt className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-4xl font-heading font-bold text-black">
                  Your Bills
                </h1>
              </div>
              <p className="text-black">
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
          </motion.div>

          <AnimatePresence mode="wait">
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
                      <label className="block text-sm font-medium text-black mb-1.5">
                        Bill Number *
                      </label>
                      <input
                        type="text"
                        value={manualFormData.bill_number}
                        onChange={(e) =>
                          setManualFormData({ ...manualFormData, bill_number: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                        required
                        placeholder="Enter bill number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1.5">
                        Amount (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={manualFormData.amount}
                        onChange={(e) =>
                          setManualFormData({ ...manualFormData, amount: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                        required
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1.5">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={manualFormData.due_date}
                        onChange={(e) =>
                          setManualFormData({ ...manualFormData, due_date: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1.5">
                        DISCOM *
                      </label>
                      <input
                        type="text"
                        value={manualFormData.discom}
                        onChange={(e) =>
                          setManualFormData({ ...manualFormData, discom: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                        required
                        placeholder="e.g., BSES Rajdhani"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1.5">
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
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1.5">
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
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
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
            <BillsSkeleton />
          ) : bills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Decorative Header */}
                  <div className="relative bg-gradient-to-br from-white via-white to-white-light p-8 text-center">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
                      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                      className="relative inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-4"
                    >
                      <FileText className="h-10 w-10 text-black" />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-gold"
                      >
                        <Sparkles className="h-3 w-3 text-black" />
                      </motion.div>
                    </motion.div>
                    <h3 className="text-2xl font-heading font-bold text-black mb-2">
                      No Bills Yet
                    </h3>
                    <p className="text-black/80 max-w-md mx-auto">
                      Connect your utility to automatically track bills and apply solar credits
                    </p>
                  </div>
                  
                  {/* Features Grid */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {[
                        { icon: Zap, title: "Auto-fetch Bills", desc: "Automatic BBPS integration" },
                        { icon: TrendingDown, title: "Track Savings", desc: "See credits applied instantly" },
                        { icon: CreditCard, title: "Easy Payments", desc: "Pay bills in one click" },
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="p-4 rounded-xl bg-white border border-gray-100 text-center group hover:bg-white/5 hover:border-gray-200/20 transition-all duration-300"
                        >
                          <div className="inline-flex p-2 rounded-lg bg-white/10 mb-3 group-hover:bg-white/20 transition-colors">
                            <feature.icon className="h-5 w-5 text-black" />
                          </div>
                          <h4 className="font-semibold text-black text-sm mb-1">{feature.title}</h4>
                          <p className="text-xs text-gray-500">{feature.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link href="/connect">
                        <Button variant="primary" className="group">
                          <Zap className="h-4 w-4 mr-2" />
                          Connect Utility
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <span className="text-gray-400 text-sm">or</span>
                      <Button
                        variant="outline"
                        onClick={() => setShowManualForm(true)}
                        className="group"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Bill Manually
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Bills Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Bills", value: bills.length, icon: Receipt },
                  { label: "Pending", value: bills.filter(b => b.status !== "PAID" && b.status !== "paid").length, icon: Clock },
                  { label: "Paid", value: bills.filter(b => b.status === "PAID" || b.status === "paid").length, icon: CheckCircle },
                  { label: "Total Saved", value: formatCurrency(bills.reduce((sum, b) => sum + Number(b.credits_applied || 0), 0)), icon: TrendingDown, isGreen: true },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className={`h-4 w-4 ${stat.isGreen ? 'text-energy-green' : 'text-gray-400'}`} />
                      <span className="text-xs text-gray-500">{stat.label}</span>
                    </div>
                    <p className={`text-xl font-bold ${stat.isGreen ? 'text-energy-green' : 'text-black'}`}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {bills.map((bill, index) => (
                <motion.div 
                  key={bill.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="space-y-4"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      {/* Bill Header with Status */}
                      <div className={`px-6 py-3 border-b flex items-center justify-between ${
                        bill.status === "PAID" || bill.status === "paid"
                          ? "bg-green-50 border-green-100"
                          : bill.status === "OVERDUE" || bill.status === "overdue"
                          ? "bg-red-50 border-red-100"
                          : "bg-amber-50 border-amber-100"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            bill.status === "PAID" || bill.status === "paid"
                              ? "bg-green-100"
                              : bill.status === "OVERDUE" || bill.status === "overdue"
                              ? "bg-red-100"
                              : "bg-amber-100"
                          }`}>
                            <Receipt className={`h-4 w-4 ${
                              bill.status === "PAID" || bill.status === "paid"
                                ? "text-green-600"
                                : bill.status === "OVERDUE" || bill.status === "overdue"
                                ? "text-red-600"
                                : "text-amber-600"
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-black">{bill.bill_number}</h3>
                            <p className="text-xs text-gray-500">
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
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                            bill.status === "PAID" || bill.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : bill.status === "OVERDUE" || bill.status === "overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {bill.status === "PAID" || bill.status === "paid" ? (
                            <CheckCircle className="h-3.5 w-3.5" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          {bill.status === "PAID" || bill.status === "paid"
                            ? "Paid"
                            : bill.status === "OVERDUE" || bill.status === "overdue"
                            ? "Overdue"
                            : "Pending"}
                        </span>
                      </div>

                      {/* Bill Details */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {bill.due_date ? formatDate(bill.due_date) : "N/A"}</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-black">Bill Amount</span>
                            <span className="font-medium">{formatCurrency(Number(bill.amount))}</span>
                          </div>
                          {Number(bill.credits_applied || 0) > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex justify-between text-sm bg-green-50 -mx-2 px-2 py-2 rounded-lg"
                            >
                              <span className="text-green-600 flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Solar Credits Applied
                              </span>
                              <span className="font-semibold text-green-600">
                                -{formatCurrency(Number(bill.credits_applied || 0))}
                              </span>
                            </motion.div>
                          )}
                          <div className="pt-3 border-t border-dashed flex justify-between items-center">
                            <span className="font-semibold text-black">Final Amount</span>
                            <span className="font-bold text-2xl text-black">
                              {formatCurrency(
                                Number(bill.final_amount || bill.amount) -
                                  Number(bill.credits_applied || 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <BillPayment
                    bill={bill}
                    onPaymentComplete={() => {
                      fetchBills();
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
