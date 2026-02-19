"use client";

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
import { WelcomeBanner } from "@/components/host/WelcomeBanner";
import { StatCards } from "@/components/host/StatCards";
import { GenerationChart } from "@/components/host/GenerationChart";
import { PaymentDueCard } from "@/components/host/PaymentDueCard";
import { HourlyDistributionChart } from "@/components/host/HourlyDistributionChart";
import { RevenueOverview } from "@/components/host/RevenueOverview";
import { PlantOverviewCards } from "@/components/host/PlantOverviewCards";
import { AlertsPanel } from "@/components/host/AlertsPanel";
import { QuickActions } from "@/components/host/QuickActions";


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

// ─── Main Dashboard Page ────────────────────────────────────────────────────

export default function HostDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stat Cards */}
      <StatCards />

      {/* Charts Row: Generation + Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <GenerationChart />
        </div>
        <div>
          <PaymentDueCard />
        </div>
      </div>

      {/* Plant Overview */}
      <PlantOverviewCards />

      {/* Charts Row 2: Hourly + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <HourlyDistributionChart />
        <RevenueOverview />
      </div>

      {/* Alerts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AlertsPanel />
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
