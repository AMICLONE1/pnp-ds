import { motion } from "framer-motion";
import {
  Zap,
  Sun,
  TrendingUp,
  TrendingDown,
  Gauge,
  IndianRupee,
} from "lucide-react";
import { DashboardStats } from "@/lib/utils/host/useDashboard";
import AnimatedNumber from "@/components/host/AnimatedNumber";

interface StatCardsProps {
  stats: DashboardStats;
}

export function StatCards({ stats: dashboardStats }: StatCardsProps) {
  const stats = [
    {
      icon: Zap,
      label: "Total Capacity",
      value: dashboardStats.totalCapacityKw,
      suffix: " kW",
      color: "text-gold-dark",
      bgColor: "bg-gold/10",
      trend: null,
    },
    {
      icon: Sun,
      label: "Today's Generation",
      value: dashboardStats.todayGenerationKwh,
      suffix: " kWh",
      color: "text-forest",
      bgColor: "bg-forest/10",
      trend: dashboardStats.todayTrend,
      trendLabel: "vs yesterday",
      decimals: 1,
    },
    {
      icon: IndianRupee,
      label: "Monthly Due",
      value: dashboardStats.monthlyRevenue,
      prefix: "₹",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: dashboardStats.monthlyTrend,
      trendLabel: "vs last month",
    },
    {
      icon: Gauge,
      label: "Plant Efficiency",
      value: dashboardStats.plantEfficiency,
      suffix: "%",
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: dashboardStats.efficiencyTrend,
      trendLabel: "vs last month",
      decimals: 1,
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
            transition={{
              delay: 0.1 + i * 0.1,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div
                className={`p-2.5 rounded-xl ${stat.bgColor} transition-transform group-hover:scale-110`}
              >
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