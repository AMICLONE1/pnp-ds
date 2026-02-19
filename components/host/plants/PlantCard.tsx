import { motion } from "framer-motion";
import {
  MapPin,
  ArrowUpRight,
  Wind,
  AlertTriangle,
  CloudSun,
} from "lucide-react";
import { StatusBadge } from "@/components/host/plants/StatusBadge";
import { EfficiencyRing } from "@/components/host/plants/EfficiencyRing";



type PlantStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

interface PlantData {
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
  commissionedDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  panelCount: number;
  inverterCount: number;
  panelType: string;
  tiltAngle: number;
  areaAcres: number;
  co2OffsetTons: number;
  todayTrend: number;
  monthlyRevenue: number;
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

interface PlantCardProps{
    plant: PlantData; 
    index: number; 
    onSelect: (id: string) => void
}

export function PlantCard({ plant, index, onSelect } : PlantCardProps){
    return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => onSelect(plant.id)}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden"
    >
        {/* Top Strip — color coded by status */}
        <div
        className={`h-1 ${
            plant.status === "ACTIVE"
            ? "bg-gradient-to-r from-green-400 to-emerald-500"
            : plant.status === "MAINTENANCE"
            ? "bg-gradient-to-r from-amber-400 to-orange-500"
            : "bg-gray-300"
        }`}
        />

        <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-black text-base group-hover:text-forest transition-colors truncate">
                {plant.name}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-forest shrink-0 transition-colors" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{plant.location}</span>
            </div>
            </div>
            <StatusBadge status={plant.status} />
        </div>

        {/* Core metrics row */}
        <div className="flex items-center gap-5">
            <EfficiencyRing value={plant.efficiency} size={64} />
            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Today</p>
                <p className="text-sm font-bold text-black flex items-center gap-1">
                {plant.todayKwh.toLocaleString("en-IN")} kWh
                <span className={`text-[10px] font-semibold ${plant.todayTrend >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {plant.todayTrend >= 0 ? "+" : ""}{plant.todayTrend}%
                </span>
                </p>
            </div>
            <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Capacity</p>
                <p className="text-sm font-bold text-black">{plant.capacityKw} kW</p>
            </div>
            <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Monthly</p>
                <p className="text-sm font-bold text-black">{plant.monthlyKwh.toLocaleString("en-IN")} kWh</p>
            </div>
            <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Revenue</p>
                <p className="text-sm font-bold text-forest">₹{plant.monthlyRevenue.toLocaleString("en-IN")}</p>
            </div>
            </div>
        </div>

        {/* Weather + Alerts strip */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                {plant.weather.temp}°C · {plant.weather.irradiance} kWh/m²
            </span>
            <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                {plant.weather.windSpeed} km/h
            </span>
            </div>
            {plant.alerts.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                {plant.alerts.length} alert{plant.alerts.length > 1 ? "s" : ""}
            </span>
            )}
        </div>
        </div>
    </motion.div>
    );
}