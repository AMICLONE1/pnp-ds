import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MONTHLY_BREAKDOWN } from "@/lib/utils/host/analytics/data";

export function MonthlyBreakdownChart(){
      const chartData = {
        labels: MONTHLY_BREAKDOWN.map((d) => d.month),
        datasets: [
          {
            label: "Actual (kWh)",
            data: MONTHLY_BREAKDOWN.map((d) => d.actual),
            backgroundColor: "#0D2818",
            borderRadius: 6,
            barThickness: 20,
          },
          {
            label: "Expected (kWh)",
            data: MONTHLY_BREAKDOWN.map((d) => d.expected),
            backgroundColor: "rgba(255, 184, 0, 0.7)",
            borderRadius: 6,
            barThickness: 20,
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
              pointStyle: "rectRounded",
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
              label: (context: TooltipItem<"bar">) =>
                ` ${context.dataset.label}: ${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh`,
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
              callback: (value: number | string) => `${(Number(value) / 1000).toFixed(0)}K`,
            },
          },
        },
      };
    
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-gold" />
                Monthly Generation: Actual vs Expected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar data={chartData} options={options} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
}