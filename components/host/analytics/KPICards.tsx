import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Sun,
  Gauge,
  Leaf,
  
} from "lucide-react";
import { KPI_DATA } from "@/lib/utils/host/analytics/data";
import { AnimatedNumber } from "@/components/host/analytics/AnimatedNumber";


export function KPICards(){
      const stats = [
        {
          icon: Zap,
          label: "Total Generation",
          value: KPI_DATA.totalGeneration,
          suffix: " kWh",
          color: "text-forest",
          bgColor: "bg-forest/10",
          trend: KPI_DATA.genTrend,
          trendLabel: "vs last month",
        },
        {
          icon: Gauge,
          label: "Avg Efficiency",
          value: KPI_DATA.avgEfficiency,
          suffix: "%",
          color: "text-green-600",
          bgColor: "bg-green-100",
          trend: KPI_DATA.effTrend,
          trendLabel: "vs last month",
          decimals: 1,
        },
        {
          icon: Sun,
          label: "Performance Ratio",
          value: KPI_DATA.performanceRatio,
          suffix: "%",
          color: "text-gold-dark",
          bgColor: "bg-gold/10",
          trend: KPI_DATA.prTrend,
          trendLabel: "vs last month",
          decimals: 1,
        },
        {
          icon: Leaf,
          label: "Carbon Offset",
          value: KPI_DATA.carbonOffset,
          suffix: " tons",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          trend: KPI_DATA.co2Trend,
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