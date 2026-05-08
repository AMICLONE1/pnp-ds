"use client";

import { useEffect, useState } from "react";

export interface DashboardPlant {
  id: string;
  name: string;
  location: string;
  state: string;
  capacityKw: number;
  status: "active" | "maintenance" | "offline";
  todayKwh: number;
  monthlyKwh: number;
  lifetimeKwh: number;
  efficiency: number;
  ppaRate: number;
  dataLoggerSerialId: string | null;
  documents?: {
    ppaAvailable: boolean;
    ppaUploadedAt: string | null;
    insuranceAvailable: boolean;
    insuranceUploadedAt: string | null;
  };
}

export interface DashboardStats {
  totalCapacityKw: number;
  todayGenerationKwh: number;
  monthlyRevenue: number;
  plantEfficiency: number;
  activePlants: number;
  totalPlants: number;
  co2OffsetTons: number;
  todayTrend: number;
  monthlyTrend: number;
  efficiencyTrend: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  time: string;
}

export interface PaymentDue {
  month: string;
  generationKwh: number;
  ratePerKwh: number;
  adjustments: number;
  totalDue: number;
  dueDate: string;
}

export interface GenerationHistory {
  month: string;
  year: number;
  kwh: number;
}

export interface PaymentRecord {
  id: string;
  month: string;
  year: number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

export interface LiveInverterData {
  currentPowerW: number;
  energyTodayKwh: number;
  inverterStatus: string | null;
  inverterTemperature: number | null;
  fault: string | null;
  lastReadingAt: string;
  isStale: boolean;
}

export interface HostDashboardData {
  isLiveData: boolean;
  plant: DashboardPlant | null;
  stats: DashboardStats;
  generationHistory: GenerationHistory[];
  paymentDue: PaymentDue | null;
  recentPayments: PaymentRecord[];
  alerts: Alert[];
  liveData: LiveInverterData | null;
}

interface DashboardState {
  data: HostDashboardData | null;
  loading: boolean;
  error: string | null;
}

const emptyStats: DashboardStats = {
  totalCapacityKw: 0,
  todayGenerationKwh: 0,
  monthlyRevenue: 0,
  plantEfficiency: 0,
  activePlants: 0,
  totalPlants: 0,
  co2OffsetTons: 0,
  todayTrend: 0,
  monthlyTrend: 0,
  efficiencyTrend: 0,
};

const emptyData: HostDashboardData = {
  isLiveData: false,
  plant: null,
  stats: emptyStats,
  generationHistory: [],
  paymentDue: null,
  recentPayments: [],
  alerts: [],
  liveData: null,
};

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await fetch("/api/host/dashboard");

        if (!response.ok) {
          throw new Error(`Failed to load dashboard: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error(result.error || "Invalid dashboard response");
        }

        setState({
          data: result.data as HostDashboardData,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setState({
          data: emptyData,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    };

    fetchDashboard();
  }, []);

  const refetch = async () => {
    await fetch("/api/host/dashboard");
  };

  return {
    ...state,
    refetch,
  };
}
