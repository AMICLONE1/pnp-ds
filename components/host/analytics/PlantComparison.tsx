"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  TooltipItem,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  BarChart3,
  Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsData } from "@/lib/utils/host/analytics/data";

export function PlantComparison(){
      const { plants: PLANTS } = useAnalyticsData();
      const barData = {
        labels: PLANTS.map((p) => p.name.split(" ").slice(0, 2).join(" ")),
        datasets: [
          {
            label: "Avg Daily Generation (kWh)",
            data: PLANTS.map((p) => p.avgDailyGen),
            backgroundColor: PLANTS.map((p) => p.color),
            borderRadius: 8,
            barThickness: 28,
          },
        ],
      };
    
      const barOptions = {
        indexAxis: "y" as const,
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
                `${(context.parsed.x ?? 0).toLocaleString("en-IN")} kWh/day`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: {
              color: "#6B7280",
              font: { size: 11, family: "Inter" },
              callback: (value: number | string) => `${Number(value).toLocaleString("en-IN")}`,
            },
          },
          y: {
            grid: { display: false },
            ticks: { color: "#374151", font: { size: 12, family: "Inter", weight: "bold" as const } },
          },
        },
      };
    
      const totalGen = PLANTS.reduce((a, p) => a + p.avgDailyGen, 0);
      const doughnutData = {
        labels: PLANTS.map((p) => p.name.split(" ").slice(0, 2).join(" ")),
        datasets: [
          {
            data: PLANTS.map((p) => p.avgDailyGen),
            backgroundColor: ["#0D2818", "#1B5E3E", "#FFB800"],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      };
    
      const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0D2818",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context: TooltipItem<"doughnut">) => {
                const val = context.parsed;
                const pct = ((val / totalGen) * 100).toFixed(1);
                return ` ${val.toLocaleString("en-IN")} kWh (${pct}%)`;
              },
            },
          },
        },
      };
    
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-forest" />
                  Plant-wise Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <Bar data={barData} options={barOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
    
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Card className="shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="w-5 h-5 text-gold" />
                  Generation Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="h-[200px] w-[200px] mx-auto shrink-0">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                  <div className="space-y-3 flex-1">
                    {PLANTS.map((plant) => {
                      const pct = ((plant.avgDailyGen / totalGen) * 100).toFixed(1);
                      return (
                        <div key={plant.id} className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: plant.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black truncate">
                              {plant.name.split(" ").slice(0, 2).join(" ")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {plant.avgDailyGen.toLocaleString("en-IN")} kWh/day
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
}