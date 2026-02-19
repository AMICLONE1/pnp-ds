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
import { FinancialsHeader } from "@/components/host/financials/FinancialsHeader";
import { FinancialKPIs } from "@/components/host/financials/FinancialKPIs";
import { RevenueTrendChart } from "@/components/host/financials/RevenueTrendChart";
import { BillingHistoryTable } from "@/components/host/financials/BillingHistoryTable";
import { PaymentStatusOverview } from "@/components/host/financials/PaymentStatusOverview";
import { PlantRevenueBreakdown } from "@/components/host/financials/PlantRevenueBreakdown";
import { RevenueGenerationCorrelation } from "@/components/host/financials/RevenueGenerationCorrelation";
import { FinancialSummaryCard } from "@/components/host/financials/FinancialSummaryCard";
import { TaxDeductionsCard } from "@/components/host/financials/TaxDeductionsCard";

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

export default function HostFinancialsPage() {
  const [period, setPeriod] = useState("This Year");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      <FinancialsHeader period={period} onPeriodChange={setPeriod} />
      <FinancialKPIs />
      <RevenueTrendChart />
      <BillingHistoryTable />
      <PaymentStatusOverview />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PlantRevenueBreakdown />
        <RevenueGenerationCorrelation />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FinancialSummaryCard />
        <TaxDeductionsCard />
      </div>
    </div>
  );
}
