import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Demo hourly data - replace with real API data
const MOCK_HOURLY_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  kwh: Math.random() * 500,
}));

export function HourlyDistributionChart(){
      const chartData = {
        labels: MOCK_HOURLY_DATA.map((d) => d.hour),
        datasets: [
          {
            label: "Avg kWh",
            data: MOCK_HOURLY_DATA.map((d) => d.kwh),
            backgroundColor: MOCK_HOURLY_DATA.map((d) =>
              d.kwh > 450
                ? "#0D2818"
                : d.kwh > 300
                ? "rgba(13, 40, 24, 0.7)"
                : d.kwh > 150
                ? "rgba(13, 40, 24, 0.4)"
                : "rgba(13, 40, 24, 0.2)"
            ),
            borderRadius: 6,
            barThickness: 18,
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
            ticks: { color: "#6B7280", font: { size: 10, family: "Inter" } },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: {
              color: "#6B7280",
              font: { size: 11, family: "Inter" },
              callback: (value: number | string) => `${value}`,
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
                <Sun className="w-5 h-5 text-gold" />
                Peak Hours Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <Bar data={chartData} options={options} />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-forest" />
                  <span>Peak (&gt;450 kWh)</span>
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