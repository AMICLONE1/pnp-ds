import { motion } from "framer-motion";
import {
  Download,
  Eye,
  FileText,
  ArrowUpRight,
  Leaf,
} from "lucide-react";
import { MOCK_STATS } from "@/lib/utils/host/data";

export function QuickActions(){
  const actions = [
    {
      icon: Download,
      label: "Download Invoice",
      description: "Feb 2026 invoice",
      color: "text-forest",
      bg: "bg-forest/10 hover:bg-forest/15",
    },
    {
      icon: Eye,
      label: "View All Plants",
      description: `${MOCK_STATS.totalPlants} plants`,
      color: "text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      icon: FileText,
      label: "Payment History",
      description: "24 payments",
      color: "text-purple-600",
      bg: "bg-purple-50 hover:bg-purple-100",
    },
    {
      icon: Leaf,
      label: "Environmental Impact",
      description: `${MOCK_STATS.co2OffsetTons} tons CO₂ saved`,
      color: "text-green-600",
      bg: "bg-green-50 hover:bg-green-100",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <h2 className="text-lg font-bold text-black font-heading mb-4 flex items-center gap-2">
        <ArrowUpRight className="w-5 h-5 text-forest" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-center`}
            >
              <div className={`p-2.5 rounded-xl ${action.bg} transition-colors`}>
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-xs font-semibold text-black">
                {action.label}
              </span>
              <span className="text-[10px] text-gray-400">
                {action.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}