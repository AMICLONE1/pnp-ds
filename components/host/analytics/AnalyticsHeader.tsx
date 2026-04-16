"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Activity,
  Calendar,
  Download,
  Sun,
} from "lucide-react";
import { useAnalyticsData } from "@/lib/utils/host/analytics/data";

interface AnalyticsHeaderProps {
  period: string;
  onPeriodChange: (p: string) => void;
}

export function AnalyticsHeader({ period, onPeriodChange }: AnalyticsHeaderProps) {
  const { kpi, loading } = useAnalyticsData();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-forest to-forest-light p-6 sm:p-8 shadow-lg"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <motion.div
          className="absolute top-6 right-8 hidden sm:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Sun className="w-24 h-24 text-gold/10" strokeWidth={0.8} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/25 rounded-full">
                <div className="relative">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <div className="absolute inset-0 w-3.5 h-3.5 text-emerald-400 animate-ping opacity-50">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Live from Trillectric
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-white/60" />
                <span className="text-[11px] font-medium text-white/60">
                  {new Date().toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading">
              Plant Analytics
            </h1>
            <p className="text-white/50 mt-1.5 text-sm sm:text-base">
              Deep performance insights from your solar fleet.
            </p>

            {/* Mini KPI strip */}
            {!loading && (
              <div className="flex flex-wrap items-center gap-4 mt-5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    30d Generation
                  </p>
                  <p className="text-lg font-bold text-white font-heading">
                    {kpi.totalGeneration.toLocaleString("en-IN")} kWh
                  </p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    PR Ratio
                  </p>
                  <p className="text-lg font-bold text-white font-heading">
                    {kpi.performanceRatio}%
                  </p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    CO₂ Offset
                  </p>
                  <p className="text-lg font-bold text-white font-heading">
                    {kpi.carbonOffset} t
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-0.5 bg-white/10 rounded-xl p-0.5 border border-white/10">
              {["7D", "30D", "90D", "1Y"].map((p) => (
                <button
                  key={p}
                  onClick={() => onPeriodChange(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p
                      ? "bg-gold text-forest shadow-sm"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-xl bg-white/10 border border-white/10 text-white/50 hover:text-white hover:bg-white/15 transition-all">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
