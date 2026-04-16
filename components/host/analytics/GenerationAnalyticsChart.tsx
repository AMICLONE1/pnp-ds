"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsData } from "@/lib/utils/host/analytics/data";

export function GenerationAnalyticsChart(){
      const { dailyGeneration: DAILY_GENERATION } = useAnalyticsData();
      const chartData = {
        labels: DAILY_GENERATION.map((d) => `Day ${d.day}`),
        datasets: [
          {
            label: "Actual Generation (kWh)",
            data: DAILY_GENERATION.map((d) => d.actual),
            fill: true,
            backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea: { top: number; bottom: number } } }) => {
              const ctx = context.chart.ctx;
              const area = context.chart.chartArea;
              if (!area) return "rgba(13, 40, 24, 0.1)";
              const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
              gradient.addColorStop(0, "rgba(13, 40, 24, 0.15)");
              gradient.addColorStop(1, "rgba(13, 40, 24, 0)");
              return gradient;
            },
            borderColor: "#0D2818",
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#FFB800",
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 2,
          },
          {
            label: "Expected Generation (kWh)",
            data: DAILY_GENERATION.map((d) => d.expected),
            fill: false,
            borderColor: "#FFB800",
            borderWidth: 2,
            borderDash: [6, 4],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#FFB800",
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 2,
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
            displayColors: true,
            callbacks: {
              label: (context: TooltipItem<"line">) =>
                ` ${context.dataset.label}: ${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#6B7280", font: { size: 11, family: "Inter" }, maxTicksLimit: 10 },
          },
          y: {
            beginAtZero: false,
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: {
              color: "#6B7280",
              font: { size: 11, family: "Inter" },
              callback: (value: number | string) => `${Number(value).toLocaleString("en-IN")}`,
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
                <Activity className="w-5 h-5 text-forest" />
                Generation vs Expected
              </CardTitle>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-0.5 bg-forest rounded" />
                  <span>Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-0.5 bg-gold rounded border-dashed" style={{ borderTop: "2px dashed #FFB800", height: 0 }} />
                  <span>Expected</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[340px]">
                <Line data={chartData} options={options} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
}