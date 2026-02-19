import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WEEKLY_PATTERN } from "@/lib/utils/host/analytics/data";

export function WeeklyPatternChart(){
  const maxVal = Math.max(...WEEKLY_PATTERN.map((d) => d.avg));
  const chartData = {
    labels: WEEKLY_PATTERN.map((d) => d.day),
    datasets: [
      {
        label: "Avg Generation (kWh)",
        data: WEEKLY_PATTERN.map((d) => d.avg),
        backgroundColor: WEEKLY_PATTERN.map((d) =>
          d.avg > maxVal * 0.95
            ? "#0D2818"
            : d.avg > maxVal * 0.85
            ? "rgba(13, 40, 24, 0.7)"
            : d.avg > maxVal * 0.75
            ? "rgba(13, 40, 24, 0.4)"
            : "rgba(13, 40, 24, 0.2)"
        ),
        borderRadius: 8,
        barThickness: 36,
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
          label: (context: TooltipItem<"bar">) =>
            `${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh avg`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 12, family: "Inter" } },
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-forest" />
            Weekly Generation Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <Bar data={chartData} options={options} />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest" />
              <span>Peak (&gt;95%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest/70" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest/40" />
              <span>Mid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest/20" />
              <span>Low</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}