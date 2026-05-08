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
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { WelcomeBanner } from "@/components/host/WelcomeBanner";
import { StatCards } from "@/components/host/StatCards";
import { GenerationChart } from "@/components/host/GenerationChart";
import { PaymentDueCard } from "@/components/host/PaymentDueCard";
import { HourlyDistributionChart } from "@/components/host/HourlyDistributionChart";
import { RevenueOverview } from "@/components/host/RevenueOverview";
import { PlantOverviewCards } from "@/components/host/PlantOverviewCards";
import { AlertsPanel } from "@/components/host/AlertsPanel";
import { QuickActions } from "@/components/host/QuickActions";
import { useDashboard } from "@/lib/utils/host/useDashboard";
import { Card } from "@/components/ui/card";
import { ProjectDocumentsCard } from "@/components/projects/ProjectDocumentsCard";


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
  const { data, loading, error } = useDashboard();

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto animate-pulse">
        <div className="h-20 bg-gray-100 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-red-50 border-red-200">
            <div className="p-6 flex gap-4">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Dashboard Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Provisioning state
  if (!data?.isLiveData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-amber-50 border-amber-200">
            <div className="p-6 flex gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">Setup in Progress</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Your solar plant is being provisioned. You&apos;ll see live data here once your project registration is complete.
                  Contact your administrator if this takes longer than expected.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <WelcomeBanner stats={data.stats} />

      {/* Stat Cards */}
      <StatCards stats={data.stats} />

      {/* Charts Row: Generation + Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <GenerationChart generationHistory={data.generationHistory} />
        </div>
        <div>
          <PaymentDueCard paymentDue={data.paymentDue} />
        </div>
      </div>

      {/* Plant Overview */}
      <PlantOverviewCards plant={data.plant} />

      {/* Project documents — host always sees their own PPA + insurance */}
      {data.plant && (data.plant.documents?.ppaAvailable || data.plant.documents?.insuranceAvailable) && (
        <ProjectDocumentsCard
          projectId={data.plant.id}
          projectName={data.plant.name}
          ppaAvailable={Boolean(data.plant.documents?.ppaAvailable)}
          ppaUploadedAt={data.plant.documents?.ppaUploadedAt || null}
          insuranceAvailable={Boolean(data.plant.documents?.insuranceAvailable)}
          insuranceUploadedAt={data.plant.documents?.insuranceUploadedAt || null}
        />
      )}

      {/* Charts Row 2: Hourly + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <HourlyDistributionChart />
        <RevenueOverview generationHistory={data.generationHistory} />
      </div>

      {/* Alerts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AlertsPanel alerts={data.alerts} />
        <div>
          <QuickActions stats={data.stats} />
        </div>
      </div>
    </div>
  );
}
