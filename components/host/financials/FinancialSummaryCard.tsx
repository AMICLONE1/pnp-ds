"use client";

import { motion } from "framer-motion";
import { Wallet, IndianRupee, Calendar, TrendingUp, FileText, CalendarDays, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FINANCIAL_SUMMARY } from "./data";

export function FinancialSummaryCard() {
  const metrics = [
    {
      label: "Total Units Generated",
      value: `${FINANCIAL_SUMMARY.totalUnits.toLocaleString("en-IN")} kWh`,
      icon: Zap,
      color: "text-forest",
    },
    {
      label: "Total Revenue Earned",
      value: `₹${FINANCIAL_SUMMARY.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-gold-dark",
    },
    {
      label: "Average Monthly Revenue",
      value: `₹${FINANCIAL_SUMMARY.avgMonthlyRevenue.toLocaleString("en-IN")}`,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      label: "Highest Monthly Revenue",
      value: `₹${FINANCIAL_SUMMARY.highestMonthlyRevenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "PPA Contract Rate",
      value: `₹${FINANCIAL_SUMMARY.ppaRate.toFixed(2)}/kWh`,
      icon: FileText,
      color: "text-purple-600",
    },
    {
      label: "Contract Start Date",
      value: FINANCIAL_SUMMARY.contractStart,
      icon: CalendarDays,
      color: "text-gray-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5 text-forest" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-white border border-gray-200 shrink-0">
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                    <p className="text-sm font-bold text-black mt-0.5 truncate">{m.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
