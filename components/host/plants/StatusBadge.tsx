import {
  Wrench,
  XCircle,
} from "lucide-react";

import { LivePulse } from "@/components/host/plants/LivePulse";

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

export function StatusBadge({status} : { status: PlantStatus }){

    

  const styles = {
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
    INACTIVE: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status === "ACTIVE" && <LivePulse />}
      {status === "MAINTENANCE" && <Wrench className="w-3 h-3" />}
      {status === "INACTIVE" && <XCircle className="w-3 h-3" />}
      {status}
    </span>
  );
}