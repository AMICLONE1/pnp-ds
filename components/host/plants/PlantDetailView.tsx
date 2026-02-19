import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  TooltipItem,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Zap,
  Sun,
  TrendingUp,
  TrendingDown,
  MapPin,
  Gauge,
  CalendarDays,
  Leaf,
  Clock,
  Activity,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowLeft,
  IndianRupee,
  CloudSun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/host/plants/AnimatedNumber";

import { StatusBadge } from "@/components/host/plants/StatusBadge";

import { SeverityDot } from "@/components/host/plants/SeverityDot";



type PlantStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

interface PlantData {
  id: string;
  name: string;
  location: string;
  state: string;
  capacityKw: number;
  status: PlantStatus;
  todayKwh: number;
  monthlyKwh: number;
  lifetimeKwh: number;
  efficiency: number;
  ppaRate: number;
  commissionedDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  panelCount: number;
  inverterCount: number;
  panelType: string;
  tiltAngle: number;
  areaAcres: number;
  co2OffsetTons: number;
  todayTrend: number;
  monthlyRevenue: number;
  weather: {
    temp: number;
    condition: string;
    irradiance: number;
    humidity: number;
    windSpeed: number;
  };
  dailyGeneration: { hour: string; kwh: number }[];
  monthlyGeneration: { month: string; kwh: number; expected: number }[];
  alerts: { id: string; title: string; severity: "CRITICAL" | "WARNING" | "INFO"; time: string }[];
}

interface PlantDetailProps{
    plant: PlantData; 
    onBack: () => void
}

export function PlantDetailView({ plant, onBack } : PlantDetailProps){
  const [activeTab, setActiveTab] = useState<"overview" | "generation" | "technical">("overview");

  // Daily generation chart
  const dailyChartData = {
    labels: plant.dailyGeneration.map((d) => d.hour),
    datasets: [
      {
        label: "kWh",
        data: plant.dailyGeneration.map((d) => d.kwh),
        backgroundColor: plant.dailyGeneration.map((d) =>
          d.kwh > 200 ? "#0D2818" : d.kwh > 120 ? "rgba(13, 40, 24, 0.6)" : d.kwh > 60 ? "rgba(13, 40, 24, 0.35)" : "rgba(13, 40, 24, 0.15)"
        ),
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const barOptions = {
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
          label: (ctx: TooltipItem<"bar">) => `${ctx.parsed.y} kWh`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 10 } } },
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { color: "#6B7280", font: { size: 11 } } },
    },
  };

  // Monthly generation vs expected chart
  const monthlyChartData = {
    labels: plant.monthlyGeneration.map((d) => d.month),
    datasets: [
      {
        label: "Actual (kWh)",
        data: plant.monthlyGeneration.map((d) => d.kwh),
        borderColor: "#0D2818",
        backgroundColor: "rgba(13, 40, 24, 0.08)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0D2818",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 2.5,
      },
      {
        label: "Expected (kWh)",
        data: plant.monthlyGeneration.map((d) => d.expected),
        borderColor: "#FFB800",
        borderDash: [6, 4],
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#FFB800",
        fill: false,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: { boxWidth: 12, boxHeight: 3, usePointStyle: false, padding: 16, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: TooltipItem<"line">) => `${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toLocaleString("en-IN")} kWh`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 11 } } },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11 },
          callback: (v: number | string) => `${(Number(v) / 1000).toFixed(0)}K`,
        },
      },
    },
    interaction: { intersect: false, mode: "index" as const },
  };

  // Efficiency doughnut
  const efficiencyData = {
    labels: ["Efficiency", "Loss"],
    datasets: [
      {
        data: [plant.efficiency, 100 - plant.efficiency],
        backgroundColor: [
          plant.efficiency >= 90 ? "#22C55E" : plant.efficiency >= 70 ? "#F59E0B" : "#EF4444",
          "#F3F4F6",
        ],
        borderWidth: 0,
        cutout: "78%",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  const commissioned = new Date(plant.commissionedDate).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button + Plant Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 border border-gold/15 p-6 sm:p-8 mb-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
          <div className="absolute top-4 right-4 w-48 h-48 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-forest font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Plants
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-black font-heading">
                  {plant.name}
                </h1>
                <StatusBadge status={plant.status} />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {plant.location}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Since {commissioned}
                </span>
              </div>
            </div>

            {/* Live weather */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white/80 rounded-xl border border-gray-200 shadow-sm">
              <CloudSun className="w-5 h-5 text-amber-500" />
              <div className="text-xs">
                <p className="font-semibold text-black">{plant.weather.temp}°C · {plant.weather.condition}</p>
                <p className="text-gray-500">{plant.weather.irradiance} kWh/m² · {plant.weather.humidity}% humidity</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { icon: Sun, label: "Today", value: plant.todayKwh, suffix: " kWh", color: "text-forest", bg: "bg-forest/10", trend: plant.todayTrend },
          { icon: BarChart3, label: "This Month", value: plant.monthlyKwh, suffix: " kWh", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: IndianRupee, label: "Monthly Revenue", value: plant.monthlyRevenue, prefix: "₹", color: "text-purple-600", bg: "bg-purple-50" },
          { icon: Leaf, label: "CO₂ Offset", value: plant.co2OffsetTons, suffix: " tons", color: "text-emerald-600", bg: "bg-emerald-50", decimals: 1 },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                {stat.trend !== undefined && (
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${stat.trend >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {stat.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(stat.trend)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium mt-2">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>
                <AnimatedNumber value={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} decimals={stat.decimals || 0} />
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {(["overview", "generation", "technical"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? "bg-white text-forest shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Daily Generation */}
              <div className="lg:col-span-2">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="w-5 h-5 text-forest" />
                      Today&apos;s Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <Bar data={dailyChartData} options={barOptions} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Efficiency Gauge */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gauge className="w-5 h-5 text-green-600" />
                    Plant Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="h-[140px] w-[140px] relative">
                    <Doughnut data={efficiencyData} options={doughnutOptions} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-black">{plant.efficiency}%</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">Efficiency</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">PPA Rate</span>
                      <span className="font-semibold text-black">₹{plant.ppaRate}/kWh</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Capacity Factor</span>
                      <span className="font-semibold text-black">
                        {((plant.todayKwh / (plant.capacityKw * 12)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Lifetime Output</span>
                      <span className="font-semibold text-black">
                        {(plant.lifetimeKwh / 1000).toLocaleString("en-IN")} MWh
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts for this plant */}
            {plant.alerts.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {plant.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <SeverityDot severity={alert.severity} />
                        <span className="text-sm font-medium text-black flex-1">{alert.title}</span>
                        <span className="text-xs text-gray-400">{alert.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === "generation" && (
          <motion.div
            key="generation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Monthly Actual vs Expected */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-forest" />
                  Actual vs Expected Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <Line data={monthlyChartData} options={lineOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Monthly breakdown table */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  Monthly Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Month</th>
                        <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Actual (kWh)</th>
                        <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Expected (kWh)</th>
                        <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Variance</th>
                        <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plant.monthlyGeneration.map((row) => {
                        const variance = ((row.kwh - row.expected) / row.expected) * 100;
                        return (
                          <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2 font-medium text-black">{row.month}</td>
                            <td className="py-3 px-2 text-right text-black">{row.kwh.toLocaleString("en-IN")}</td>
                            <td className="py-3 px-2 text-right text-gray-500">{row.expected.toLocaleString("en-IN")}</td>
                            <td className={`py-3 px-2 text-right font-medium ${variance >= 0 ? "text-green-600" : "text-red-500"}`}>
                              {variance >= 0 ? "+" : ""}{variance.toFixed(1)}%
                            </td>
                            <td className="py-3 px-2 text-right font-semibold text-forest">
                              ₹{(row.kwh * plant.ppaRate).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "technical" && (
          <motion.div
            key="technical"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* Equipment Details */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-gold" />
                  Equipment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Panel Type", value: plant.panelType },
                    { label: "Panel Count", value: plant.panelCount.toLocaleString() },
                    { label: "Inverter Count", value: `${plant.inverterCount} units` },
                    { label: "Tilt Angle", value: `${plant.tiltAngle}°` },
                    { label: "Total Area", value: `${plant.areaAcres} acres` },
                    { label: "DC Capacity", value: `${plant.capacityKw} kWp` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className="text-sm font-semibold text-black">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Schedule */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="w-5 h-5 text-amber-600" />
                  Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Last Maintenance</span>
                    </div>
                    <p className="text-sm font-semibold text-black">
                      {new Date(plant.lastMaintenanceDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 border ${
                    plant.status === "MAINTENANCE"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-blue-50 border-blue-200"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className={`w-4 h-4 ${plant.status === "MAINTENANCE" ? "text-amber-600" : "text-blue-600"}`} />
                      <span className={`text-xs font-medium uppercase tracking-wide ${
                        plant.status === "MAINTENANCE" ? "text-amber-700" : "text-blue-700"
                      }`}>
                        {plant.status === "MAINTENANCE" ? "In Progress" : "Next Scheduled"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-black">
                      {new Date(plant.nextMaintenanceDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {[
                      { label: "Commissioned", value: commissioned },
                      { label: "Plant Age", value: `${((Date.now() - new Date(plant.commissionedDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1)} years` },
                      { label: "Lifetime Output", value: `${(plant.lifetimeKwh / 1000000).toFixed(2)} GWh` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-500">{item.label}</span>
                        <span className="text-sm font-semibold text-black">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}