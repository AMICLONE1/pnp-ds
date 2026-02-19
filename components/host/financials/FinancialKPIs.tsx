"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, IndianRupee, Receipt, Clock, Zap } from "lucide-react";
import AnimatedNumber from "@/components/host/AnimatedNumber";
import { KPI_DATA } from "./data";

export function FinancialKPIs() {
  const stats = [
    {
      icon: IndianRupee,
      label: "Total Revenue Earned",
      value: KPI_DATA.totalRevenue,
      prefix: "₹",
      color: "text-forest",
      bgColor: "bg-forest/10",
      trend: KPI_DATA.revTrend,
      trendLabel: "vs last year",
    },
    {
      icon: Receipt,
      label: "Current Month Billing",
      value: KPI_DATA.currentBilling,
      prefix: "₹",
      color: "text-gold-dark",
      bgColor: "bg-gold/10",
      trend: KPI_DATA.billTrend,
      trendLabel: "vs last month",
    },
    {
      icon: Clock,
      label: "Pending Payments",
      value: KPI_DATA.pendingPayments,
      prefix: "₹",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      trend: KPI_DATA.pendTrend,
      trendLabel: "overdue included",
    },
    {
      icon: Zap,
      label: "PPA Rate",
      value: KPI_DATA.avgPpaRate,
      prefix: "₹",
      suffix: "/kWh",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: null,
      trendLabel: "contract rate",
      decimals: 2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${stat.bgColor} transition-transform group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.trend !== null && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.trend >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-1 ${stat.color}`}>
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix || ""}
                  suffix={stat.suffix || ""}
                  decimals={stat.decimals || 0}
                />
              </p>
              {stat.trendLabel && (
                <p className="text-xs text-gray-400 mt-1">{stat.trendLabel}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
