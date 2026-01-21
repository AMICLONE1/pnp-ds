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
import { BillPayment } from "@/components/features/bills/BillPayment";

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
    discom: "",
    // Note: bill_month and bill_year are not in the current schema
    // They can be derived from due_date if needed
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
          {/* Enhanced Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 p-6 md:p-8 border border-gold/20 shadow-lg shadow-gold/5">
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/20 rounded-full blur-2xl" />
              </div>
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <motion.div 
                    className="flex items-center gap-3 mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.div 
                      className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30 shadow-md"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Receipt className="h-6 w-6 text-gold" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-black">
                      Your Bills
                    </h1>
                  </motion.div>
                  <motion.p 
                    className="text-gray-700 text-base md:text-lg font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    View your electricity bills and applied solar credits
                  </motion.p>
                </div>
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setShowManualForm(!showManualForm)}
                    className="flex items-center gap-2 border-2 hover:border-gold/50 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Add Manually
                  </Button>
                  <Button
                    variant="primary"
                    onClick={fetchBillFromBBPS}
                    isLoading={fetching}
                    disabled={fetching}
                    className="flex items-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all"
                  >
                    <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
                    Fetch Latest Bill
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
          {showManualForm && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="mb-6 border-2 border-gold/20 shadow-xl overflow-hidden">
                {/* Enhanced Header */}
                <div className="relative bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 p-6 border-b border-gold/20">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
                  </div>
                  <div className="relative z-10 flex items-center gap-4">
                    <motion.div
                      className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30 shadow-md"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FileText className="h-6 w-6 text-gold" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl mb-1">Add Bill Manually</CardTitle>
                      <CardDescription className="text-base">
                        Enter your bill details manually (useful while waiting for BBPS approval)
                      </CardDescription>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 pt-6">
                  <form onSubmit={handleManualSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Bill Number */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                          <Receipt className="h-4 w-4 text-gold" />
                          Bill Number *
                        </label>
                        <input
                          type="text"
                          value={manualFormData.bill_number}
                          onChange={(e) =>
                            setManualFormData({ ...manualFormData, bill_number: e.target.value })
                          }
                          className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold hover:border-gray-300 shadow-sm hover:shadow-md"
                          required
                          placeholder="Enter bill number"
                        />
                      </motion.div>

                      {/* Amount */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                          <CreditCard className="h-4 w-4 text-gold" />
                          Amount (₹) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={manualFormData.amount}
                            onChange={(e) =>
                              setManualFormData({ ...manualFormData, amount: e.target.value })
                            }
                            className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-8 pr-4 py-2 text-sm text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold hover:border-gray-300 shadow-sm hover:shadow-md"
                            required
                            placeholder="0.00"
                            min="0"
                          />
                        </div>
                      </motion.div>

                      {/* Due Date */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                          <Calendar className="h-4 w-4 text-gold" />
                          Due Date *
                        </label>
                        <input
                          type="date"
                          value={manualFormData.due_date}
                          onChange={(e) =>
                            setManualFormData({ ...manualFormData, due_date: e.target.value })
                          }
                          className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold hover:border-gray-300 shadow-sm hover:shadow-md"
                          required
                        />
                      </motion.div>

                      {/* DISCOM */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                          <Zap className="h-4 w-4 text-gold" />
                          DISCOM *
                        </label>
                        <input
                          type="text"
                          value={manualFormData.discom}
                          onChange={(e) =>
                            setManualFormData({ ...manualFormData, discom: e.target.value })
                          }
                          className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold hover:border-gray-300 shadow-sm hover:shadow-md"
                          required
                          placeholder="e.g., BSES Rajdhani"
                        />
                      </motion.div>

                      {/* Note: Bill month and year are derived from due_date */}
                    </div>
                    
                    {/* Enhanced Buttons */}
                    <motion.div 
                      className="flex flex-col sm:flex-row gap-3 pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={submitting}
                          disabled={submitting}
                          className="w-full sm:w-auto px-6 py-3 text-base font-semibold shadow-lg shadow-gold/20 hover:shadow-gold/30"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add Bill
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowManualForm(false);
                            setError(null);
                          }}
                          className="w-full sm:w-auto px-6 py-3 text-base font-semibold border-2 hover:border-gray-400"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="overflow-hidden border-2 border-gold/20 shadow-xl">
                <CardContent className="p-0">
                  {/* Enhanced Decorative Header */}
                  <div className="relative bg-gradient-to-br from-white via-gold/10 to-amber-50/40 p-10 md:p-12 text-center overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div 
                        className="absolute -top-24 -right-24 w-64 h-64 bg-gold/20 rounded-full blur-3xl"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-100/30 rounded-full blur-2xl"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
                    </div>
                    
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                      className="relative inline-flex p-5 rounded-3xl bg-gradient-to-br from-gold/20 via-amber-100/30 to-gold/20 border-2 border-gold/30 shadow-lg mb-6 backdrop-blur-sm"
                    >
                      <FileText className="h-12 w-12 text-gold" />
                      <motion.div
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute -top-2 -right-2 p-2 rounded-full bg-gradient-to-br from-gold to-amber-500 shadow-lg"
                      >
                        <Sparkles className="h-4 w-4 text-black" />
                      </motion.div>
                    </motion.div>
                    
                    <motion.h3 
                      className="text-3xl md:text-4xl font-heading font-bold text-black mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      No Bills Yet
                    </motion.h3>
                    <motion.p 
                      className="text-gray-700 max-w-lg mx-auto text-base md:text-lg font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Connect your utility to automatically track bills and apply solar credits
                    </motion.p>
                  </div>
                  
                  {/* Enhanced Features Grid */}
                  <div className="p-8 md:p-10 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      {[
                        { icon: Zap, title: "Auto-fetch Bills", desc: "Automatic BBPS integration", color: "from-blue-100 to-blue-50", iconColor: "text-blue-600", borderColor: "border-blue-200" },
                        { icon: TrendingDown, title: "Track Savings", desc: "See credits applied instantly", color: "from-green-100 to-green-50", iconColor: "text-green-600", borderColor: "border-green-200" },
                        { icon: CreditCard, title: "Easy Payments", desc: "Pay bills in one click", color: "from-amber-100 to-amber-50", iconColor: "text-amber-600", borderColor: "border-amber-200" },
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 text-center group hover:border-gold/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                          {/* Hover gradient effect */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                          
                          <div className="relative z-10">
                            <motion.div 
                              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} border ${feature.borderColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                              whileHover={{ rotate: 5 }}
                            >
                              <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                            </motion.div>
                            <h4 className="font-bold text-black text-base mb-2">{feature.title}</h4>
                            <p className="text-sm text-gray-600">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Enhanced CTA Buttons */}
                    <motion.div 
                      className="flex flex-col sm:flex-row items-center justify-center gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Link href="/connect">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="primary" className="group shadow-lg shadow-gold/20 hover:shadow-gold/30 px-6 py-3 text-base font-semibold">
                            <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                            Connect Utility
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      </Link>
                      <span className="text-gray-400 text-sm font-medium">or</span>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          onClick={() => setShowManualForm(true)}
                          className="group border-2 hover:border-gold/50 px-6 py-3 text-base font-semibold"
                        >
                          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                          Add Bill Manually
                        </Button>
                      </motion.div>
                    </motion.div>
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
                            <h3 className="font-semibold text-black">{bill.bill_number || "N/A"}</h3>
                            <p className="text-xs text-gray-500">
                              {bill.due_date
                                ? new Date(bill.due_date).toLocaleDateString("en-IN", {
                                    month: "long",
                                    year: "numeric",
                                  })
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
