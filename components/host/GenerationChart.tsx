import { useState } from "react";
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
import { MOCK_GENERATION_DATA} from "@/lib/utils/host/data";

export function GenerationChart(){
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");

  const chartData = {
    labels: MOCK_GENERATION_DATA.map((d) => d.date),
    datasets: [
      {
        label: "Generation (kWh)",
        data: MOCK_GENERATION_DATA.map((d) => d.value),
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
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
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
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            return `${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) =>
            `${Number(value).toLocaleString("en-IN")}`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
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
            Generation Trend
          </CardTitle>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {(["day", "week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p
                    ? "bg-white text-forest shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}