"use client";

// ============================================
// Real-data hook for host analytics
//
// Previously this file exported hardcoded PLANTS/KPI_DATA constants for
// UI prototyping. Now it fetches /api/host/plants (which fans out to
// Trillectric per-plant) and exposes the same field names so every
// analytics component can stay close to its existing shape.
// ============================================

import { useEffect, useState } from "react";

export interface AnalyticsPlant {
  id: string;
  name: string;
  location: string;
  capacityKw: number;
  efficiency: number;
  prRatio: number;
  availability: number;
  avgDailyGen: number;
  peakGen: number;
  color: string;
}

export interface AnalyticsKPI {
  totalGeneration: number;
  avgEfficiency: number;
  performanceRatio: number;
  carbonOffset: number;
  genTrend: number;
  effTrend: number;
  prTrend: number;
  co2Trend: number;
}

export interface EnvImpact {
  co2Tons: number;
  treesEquivalent: number;
  homesPowered: number;
}

export interface MonthlyBreakdownRow {
  month: string;
  actual: number;
  expected: number;
}

export interface DailyGenerationRow {
  day: number;
  actual: number;
  expected: number;
}

export interface WeeklyPatternRow {
  day: string;
  avg: number;
}

export interface IrradianceRow {
  hour: string;
  irradiance: number;
  generation: number;
}

export interface AnalyticsBundle {
  plants: AnalyticsPlant[];
  kpi: AnalyticsKPI;
  envImpact: EnvImpact;
  dailyGeneration: DailyGenerationRow[];
  weeklyPattern: WeeklyPatternRow[];
  monthlyBreakdown: MonthlyBreakdownRow[];
  irradiance: IrradianceRow[];
  loading: boolean;
  error: string | null;
}

const PALETTE = ["#0D2818", "#1B5E3E", "#FFB800", "#2E7D32", "#FB8C00", "#6A1B9A"];

const EMPTY: AnalyticsBundle = {
  plants: [],
  kpi: {
    totalGeneration: 0,
    avgEfficiency: 0,
    performanceRatio: 0,
    carbonOffset: 0,
    genTrend: 0,
    effTrend: 0,
    prTrend: 0,
    co2Trend: 0,
  },
  envImpact: { co2Tons: 0, treesEquivalent: 0, homesPowered: 0 },
  dailyGeneration: [],
  weeklyPattern: [],
  monthlyBreakdown: [],
  irradiance: [],
  loading: true,
  error: null,
};

export function useAnalyticsData(): AnalyticsBundle {
  const [bundle, setBundle] = useState<AnalyticsBundle>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/host/analytics", { credentials: "include" });
        const json = await res.json();
        if (cancelled) return;
        if (!json.success) {
          setBundle({ ...EMPTY, loading: false, error: String(json.error || "Failed to load") });
          return;
        }
        const data = json.data;
        setBundle({
          plants: (data.plants || []).map((p: Omit<AnalyticsPlant, "color">, i: number) => ({
            ...p,
            color: PALETTE[i % PALETTE.length],
          })),
          kpi: data.kpi,
          envImpact: data.envImpact,
          dailyGeneration: data.dailyGeneration,
          weeklyPattern: data.weeklyPattern,
          monthlyBreakdown: data.monthlyBreakdown,
          irradiance: data.irradiance,
          loading: false,
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setBundle({
          ...EMPTY,
          loading: false,
          error: e instanceof Error ? e.message : "Failed to load analytics",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return bundle;
}
