"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  Sun,
  Search,
} from "lucide-react";
import { MOCK_PLANTS } from "@/lib/utils/host/plants/data";
import { FleetOverview } from "@/components/host/plants/FleetOverview";
import { PlantCard } from "@/components/host/plants/PlantCard";
import { PlantDetailView } from "@/components/host/plants/PlantDetailView";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type PlantStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";


// ─── Main Page ──────────────────────────────────────────────────────────────

export default function MyPlantsPage() {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PlantStatus>("ALL");

  const selectedPlant = MOCK_PLANTS.find((p) => p.id === selectedPlantId);

  const filteredPlants = MOCK_PLANTS.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || plant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // If a plant is selected, show detail view
  if (selectedPlant) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PlantDetailView plant={selectedPlant} onBack={() => setSelectedPlantId(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Fleet Overview */}
      <FleetOverview />

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["ALL", "ACTIVE", "MAINTENANCE", "INACTIVE"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-white text-forest shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Plant Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredPlants.map((plant, i) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            index={i}
            onSelect={setSelectedPlantId}
          />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Sun className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No plants match your search.</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters.</p>
        </motion.div>
      )}
    </div>
  );
}
