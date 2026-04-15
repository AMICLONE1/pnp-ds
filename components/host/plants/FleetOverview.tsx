import { motion } from "framer-motion";
import {
  Zap,
  Sun,
  Gauge,
  Leaf,
  BarChart3,

} from "lucide-react";

import { AnimatedNumber } from "@/components/host/plants/AnimatedNumber";
import { LivePulse } from "@/components/host/plants/LivePulse";

// Demo plants - replace with real API data
const MOCK_PLANTS: any[] = [];

export function FleetOverview(){
  const totalCapacity = MOCK_PLANTS.length > 0 ? MOCK_PLANTS.reduce((s, p) => s + p.capacityKw, 0) : 0;
  const totalToday = MOCK_PLANTS.length > 0 ? MOCK_PLANTS.reduce((s, p) => s + p.todayKwh, 0) : 0;
  const totalMonthly = MOCK_PLANTS.length > 0 ? MOCK_PLANTS.reduce((s, p) => s + p.monthlyKwh, 0) : 0;
  const avgEfficiency = MOCK_PLANTS.length > 0 ? MOCK_PLANTS.reduce((s, p) => s + p.efficiency, 0) / MOCK_PLANTS.length : 0;
  const activePlants = MOCK_PLANTS.filter((p) => p.status === "ACTIVE").length;
  const totalCo2 = MOCK_PLANTS.length > 0 ? MOCK_PLANTS.reduce((s, p) => s + p.co2OffsetTons, 0) : 0;

  const summaryStats = [
    { icon: Zap, label: "Total Capacity", value: totalCapacity, suffix: " kW", color: "text-gold-dark", bg: "bg-gold/10" },
    { icon: Sun, label: "Today's Output", value: totalToday, suffix: " kWh", color: "text-forest", bg: "bg-forest/10", decimals: 1 },
    { icon: BarChart3, label: "Monthly Output", value: totalMonthly, suffix: " kWh", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Gauge, label: "Avg Efficiency", value: avgEfficiency, suffix: "%", color: "text-green-600", bg: "bg-green-50", decimals: 1 },
    { icon: Leaf, label: "CO₂ Offset", value: totalCo2, suffix: " tons", color: "text-emerald-600", bg: "bg-emerald-50", decimals: 1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 border border-gold/15 p-6 sm:p-8 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
          <div className="absolute top-4 right-4 w-48 h-48 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-2xl" />
          <motion.div
            className="absolute top-6 right-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="w-20 h-20 text-gold/15" strokeWidth={1} />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <LivePulse />
              <span className="text-xs font-medium text-green-700">
                {activePlants}/{MOCK_PLANTS.length} Plants Online
              </span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black font-heading">
            My Solar Plants
          </h1>
          <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
            Monitor performance, track generation, and manage your solar fleet.
          </p>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {summaryStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-2`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-lg sm:text-xl font-bold mt-0.5 ${stat.color}`}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}