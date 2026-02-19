import { motion } from "framer-motion";
import {
  Zap,
  MapPin,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { MOCK_PLANTS } from "@/lib/utils/host/data";

import { StatusBadge } from "@/components/host/StatusBadge";
import { EfficiencyRing } from "@/components/host/EfficiencyRing";


export function PlantOverviewCards(){
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black font-heading flex items-center gap-2">
          <Zap className="w-5 h-5 text-forest" />
          My Solar Plants
        </h2>
        <button className="flex items-center gap-1 text-sm text-forest font-medium hover:text-forest-light transition-colors">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_PLANTS.map((plant, i) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-black text-sm group-hover:text-forest transition-colors">
                  {plant.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {plant.location}
                </div>
              </div>
              <StatusBadge status={plant.status} />
            </div>

            <div className="flex items-center gap-4 mt-4">
              <EfficiencyRing value={plant.efficiency} />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Today</span>
                  <span className="font-semibold text-black">
                    {plant.todayKwh.toLocaleString("en-IN")} kWh
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-semibold text-black">
                    {plant.capacityKw} kW
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">PPA Rate</span>
                  <span className="font-semibold text-black">
                    ₹{plant.ppaRate}/kWh
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Efficiency: {plant.efficiency}%
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-forest transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}