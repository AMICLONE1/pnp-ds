"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { TooltipItem } from "chart.js";
import { Chart } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REVENUE_12M } from "./data";

export function RevenueGenerationCorrelation() {
  const data6m = REVENUE_12M.slice(-6);

  const chartData = {
    labels: data6m.map((d) => d.month),
    datasets: [
      {
        type: "bar" as const,
        label: "Generation (kWh)",
        data: data6m.map((d) => d.generation),
        backgroundColor: "rgba(13, 40, 24, 0.75)",
        borderRadius: 6,
        barThickness: 28,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "Revenue (₹)",
        data: data6m.map((d) => d.revenue),
        borderColor: "#FFB800",
        backgroundColor: "rgba(255, 184, 0, 0.08)",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#FFB800",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        fill: false,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, family: "Inter" },
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
          label: (context: TooltipItem<"bar">) => {
            if (context.datasetIndex === 0) {
              return ` Generation: ${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh`;
            }
            return ` Revenue: ₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 11, family: "Inter" } },
      },
      y: {
        type: "linear" as const,
        position: "left" as const,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#0D2818",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `${(Number(value) / 1000).toFixed(0)}K`,
        },
        title: {
          display: true,
          text: "Generation (kWh)",
          color: "#0D2818",
          font: { size: 11, family: "Inter" },
        },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#FFB800",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `₹${(Number(value) / 100000).toFixed(1)}L`,
        },
        title: {
          display: true,
          text: "Revenue (₹)",
          color: "#FFB800",
          font: { size: 11, family: "Inter" },
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-gold" />
            Revenue vs Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Chart type="bar" data={chartData as never} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
