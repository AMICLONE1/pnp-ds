import { motion } from "framer-motion";
import {
  BarChart3,
  Activity,
  Calendar,
  Download,
  Filter,
  
} from "lucide-react";


interface AnalyticsHeaderProps{
    period: string;
    onPeriodChange: (p: string) => void;
}
export function AnalyticsHeader({period, onPeriodChange} : AnalyticsHeaderProps){

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 border border-gold/15 p-6 sm:p-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
        <div className="absolute top-4 right-4 w-48 h-48 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-2xl" />
        <motion.div
          className="absolute top-6 right-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <BarChart3 className="w-20 h-20 text-gold/15" strokeWidth={1} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-forest/5 border border-forest/15 rounded-full">
                <Activity className="w-3.5 h-3.5 text-forest" />
                <span className="text-xs font-medium text-forest">
                  Live Analytics
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-heading">
              <span className="gradient-text">Plant Analytics</span>
            </h1>
            <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
              Deep performance insights across your{" "}
              <span className="font-semibold text-forest">1,500 kW</span> solar portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {["7D", "30D", "90D", "1Y"].map((p) => (
                <button
                  key={p}
                  onClick={() => onPeriodChange(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    period === p
                      ? "bg-white text-forest shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-forest hover:border-forest/20 transition-all">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-forest hover:border-forest/20 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}