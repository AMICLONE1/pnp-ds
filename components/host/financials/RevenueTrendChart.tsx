"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REVENUE_12M } from "./data";

export function RevenueTrendChart() {
  const avgRevenue = REVENUE_12M.reduce((a, d) => a + d.revenue, 0) / REVENUE_12M.length;

  const chartData = {
    labels: REVENUE_12M.map((d) => d.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: REVENUE_12M.map((d) => d.revenue),
        borderColor: "#FFB800",
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea: { top: number; bottom: number } } }) => {
          const ctx = context.chart.ctx;
          const area = context.chart.chartArea;
          if (!area) return "rgba(255, 184, 0, 0.1)";
          const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
          gradient.addColorStop(0, "rgba(255, 184, 0, 0.18)");
          gradient.addColorStop(1, "rgba(255, 184, 0, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: "#FFB800",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#FFB800",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3,
      },
      {
        label: "Average",
        data: REVENUE_12M.map(() => avgRevenue),
        borderColor: "rgba(107, 114, 128, 0.4)",
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
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
          pointStyle: "line",
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
          label: (context: TooltipItem<"line">) =>
            ` ${context.dataset.label}: ₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 11, family: "Inter" } },
      },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `₹${(Number(value) / 100000).toFixed(1)}L`,
        },
      },
    },
    interaction: { intersect: false, mode: "index" as const },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-gold" />
            Revenue Trend (12 Months)
          </CardTitle>
          <span className="text-xs text-gray-400">
            Avg: ₹{Math.round(avgRevenue).toLocaleString("en-IN")}/mo
          </span>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
