"use client";

import { useState } from "react";
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
import { AnalyticsHeader } from "@/components/host/analytics/AnalyticsHeader";
import { KPICards } from "@/components/host/analytics/KPICards";
import { GenerationAnalyticsChart } from "@/components/host/analytics/GenerationAnalyticsChart";
import { PlantComparison } from "@/components/host/analytics/PlantComparison";
import { WeeklyPatternChart } from "@/components/host/analytics/WeeklyPatternChart";
import { MonthlyBreakdownChart } from "@/components/host/analytics/MonthlyBreakdownChart";
import { PerformanceTable } from "@/components/host/analytics/PerformanceTable";
import { EnvironmentalImpact } from "@/components/host/analytics/EnvironmentalImpact";
import { IrradianceCorrelationChart } from "@/components/host/analytics/IrradianceCorrelationChart";

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

// ─── Main Analytics Page ────────────────────────────────────────────────────

export default function HostAnalyticsPage() {
  const [period, setPeriod] = useState("30D");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

      {/* KPI Cards */}
      <KPICards />

      {/* Generation vs Expected Chart */}
      <GenerationAnalyticsChart />

      {/* Plant Comparison: Bar + Doughnut */}
      <PlantComparison />

      {/* Weekly Pattern + Monthly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeeklyPatternChart />
        <MonthlyBreakdownChart />
      </div>

      {/* Performance Table */}
      <PerformanceTable />

      {/* Environmental Impact */}
      <EnvironmentalImpact />

      {/* Irradiance Correlation */}
      <IrradianceCorrelationChart />
    </div>
  );
}
