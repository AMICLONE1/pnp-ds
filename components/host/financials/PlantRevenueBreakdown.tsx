"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANT_REVENUE } from "./data";

export function PlantRevenueBreakdown() {
  const chartData = {
    labels: PLANT_REVENUE.map((p) => p.name),
    datasets: [
      {
        label: "Dec '25",
        data: PLANT_REVENUE.map((p) => p.dec),
        backgroundColor: "#0D2818",
        borderRadius: 6,
        barThickness: 18,
      },
      {
        label: "Jan '26",
        data: PLANT_REVENUE.map((p) => p.jan),
        backgroundColor: "#1B5E3E",
        borderRadius: 6,
        barThickness: 18,
      },
      {
        label: "Feb '26",
        data: PLANT_REVENUE.map((p) => p.feb),
        backgroundColor: "#FFB800",
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 16,
          font: { size: 11, family: "Inter" },
          color: "#6B7280",
        },
      },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            ` ${context.dataset.label}: ₹${(context.parsed.x ?? 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `₹${(Number(value) / 1000).toFixed(0)}K`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#374151", font: { size: 12, family: "Inter", weight: "bold" as const } },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-forest" />
            Plant-wise Revenue (Last 3 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <Bar data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
