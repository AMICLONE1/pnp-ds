"use client";

import { useEffect, useState } from "react";
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
import { FleetOverview } from "@/components/host/plants/FleetOverview";
import { PlantCard } from "@/components/host/plants/PlantCard";
import { PlantDetailView } from "@/components/host/plants/PlantDetailView";

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

interface HostPlant {
  id: string;
  name: string;
  location: string;
  state: string;
  capacityKw: number;
  status: PlantStatus;
  todayKwh: number;
  monthlyKwh: number;
  lifetimeKwh: number;
  efficiency: number;
  ppaRate: number;
  monthlyRevenue: number;
  todayTrend: number;
  co2OffsetTons: number;
  commissionedDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  panelCount: number;
  inverterCount: number;
  panelType: string;
  tiltAngle: number;
  areaAcres: number;
  weather: {
    temp: number;
    condition: string;
    irradiance: number;
    humidity: number;
    windSpeed: number;
  };
  dailyGeneration: { hour: string; kwh: number }[];
  monthlyGeneration: { month: string; kwh: number; expected: number }[];
  alerts: { id: string; title: string; severity: "CRITICAL" | "WARNING" | "INFO"; time: string }[];
}

interface Fleet {
  totalCapacityKw: number;
  todayKwh: number;
  monthlyKwh: number;
  lifetimeKwh: number;
  avgEfficiency: number;
  co2OffsetTons: number;
  activePlants: number;
  totalPlants: number;
  onlinePlants: number;
}

export default function MyPlantsPage() {
  const [plants, setPlants] = useState<HostPlant[]>([]);
  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PlantStatus>("ALL");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/host/plants", { credentials: "include" });
        const json = await res.json();
        if (cancelled) return;
        if (!json.success) {
          setError(typeof json.error === "string" ? json.error : "Failed to load plants");
          setLoading(false);
          return;
        }
        setPlants(json.data.plants);
        setFleet(json.data.fleet);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load plants");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || plant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (selectedPlant) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PlantDetailView plant={selectedPlant} onBack={() => setSelectedPlantId(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <FleetOverview fleet={fleet} loading={loading} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

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

      {!loading && filteredPlants.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Sun className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            {plants.length === 0 ? "No plants yet." : "No plants match your search."}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {plants.length === 0 ? "Once an admin assigns a plant to you, it will appear here." : "Try adjusting your filters."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
