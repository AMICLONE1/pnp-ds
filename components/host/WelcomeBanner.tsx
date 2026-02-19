import { motion } from "framer-motion";
import {
  Sun,
  CalendarDays,
  
} from "lucide-react";
import { HOST_NAME, MOCK_STATS } from "@/lib/utils/host/data";
import { LivePulse } from "@/components/host/LivePulse";

export function WelcomeBanner(){
    const today = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return(
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 border border-gold/15 p-6 sm:p-8"
        >
            {/* Decorative elements */}
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
                <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <LivePulse />
                    <span className="text-xs font-medium text-green-700">
                    System Online
                    </span>
                </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
                <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">{today}</span>
                </div>
            </div>
    
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-heading mt-4">
                Welcome back,{" "}
                <span className="gradient-text">{HOST_NAME}</span>
            </h1>
            <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
                Your solar plants generated{" "}
                <span className="font-semibold text-forest">
                {MOCK_STATS.todayGenerationKwh.toLocaleString("en-IN")} kWh
                </span>{" "}
                today across {MOCK_STATS.activePlants} active installations.
            </p>
            </div>
        </motion.div>
    )
}