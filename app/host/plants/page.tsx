"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Zap,
  Sun,
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowUpRight,
  Gauge,
  CalendarDays,
  Leaf,
  Wind,
  Clock,
  Activity,
  Search,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  ArrowLeft,
  IndianRupee,
  CloudSun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── Types ──────────────────────────────────────────────────────────────────

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

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_PLANTS: PlantData[] = [
  {
    id: "1",
    name: "Vedvyas Solar Park",
    location: "Cuttack, Odisha",
    state: "Odisha",
    capacityKw: 500,
    status: "ACTIVE",
    todayKwh: 1875.5,
    monthlyKwh: 52340,
    lifetimeKwh: 2456000,
    efficiency: 93.2,
    ppaRate: 3.5,
    commissionedDate: "2024-03-15",
    lastMaintenanceDate: "2026-01-10",
    nextMaintenanceDate: "2026-04-10",
    panelCount: 1200,
    inverterCount: 8,
    panelType: "Monocrystalline 440W",
    tiltAngle: 22,
    areaAcres: 3.2,
    co2OffsetTons: 52.3,
    todayTrend: 12.5,
    monthlyRevenue: 183190,
    weather: { temp: 32, condition: "Sunny", irradiance: 5.8, humidity: 45, windSpeed: 12 },
    dailyGeneration: [
      { hour: "6AM", kwh: 25 }, { hour: "7AM", kwh: 95 }, { hour: "8AM", kwh: 165 },
      { hour: "9AM", kwh: 210 }, { hour: "10AM", kwh: 245 }, { hour: "11AM", kwh: 260 },
      { hour: "12PM", kwh: 268 }, { hour: "1PM", kwh: 255 }, { hour: "2PM", kwh: 235 },
      { hour: "3PM", kwh: 195 }, { hour: "4PM", kwh: 140 }, { hour: "5PM", kwh: 65 },
      { hour: "6PM", kwh: 17 },
    ],
    monthlyGeneration: [
      { month: "Sep", kwh: 48200, expected: 50000 }, { month: "Oct", kwh: 51300, expected: 50000 },
      { month: "Nov", kwh: 47800, expected: 48000 }, { month: "Dec", kwh: 45600, expected: 46000 },
      { month: "Jan", kwh: 49200, expected: 48000 }, { month: "Feb", kwh: 52340, expected: 50000 },
    ],
    alerts: [
      { id: "a1", title: "Inverter #3 temperature high", severity: "WARNING", time: "4h ago" },
    ],
  },
  {
    id: "2",
    name: "Sunrise Energy Hub",
    location: "Bhubaneswar, Odisha",
    state: "Odisha",
    capacityKw: 600,
    status: "ACTIVE",
    todayKwh: 1520.0,
    monthlyKwh: 61080,
    lifetimeKwh: 3120000,
    efficiency: 91.8,
    ppaRate: 3.5,
    commissionedDate: "2023-09-20",
    lastMaintenanceDate: "2025-12-05",
    nextMaintenanceDate: "2026-03-05",
    panelCount: 1450,
    inverterCount: 10,
    panelType: "Bifacial 550W",
    tiltAngle: 20,
    areaAcres: 4.1,
    co2OffsetTons: 48.9,
    todayTrend: -3.2,
    monthlyRevenue: 213780,
    weather: { temp: 34, condition: "Partly Cloudy", irradiance: 4.9, humidity: 52, windSpeed: 8 },
    dailyGeneration: [
      { hour: "6AM", kwh: 30 }, { hour: "7AM", kwh: 85 }, { hour: "8AM", kwh: 150 },
      { hour: "9AM", kwh: 195 }, { hour: "10AM", kwh: 220 }, { hour: "11AM", kwh: 230 },
      { hour: "12PM", kwh: 238 }, { hour: "1PM", kwh: 225 }, { hour: "2PM", kwh: 200 },
      { hour: "3PM", kwh: 170 }, { hour: "4PM", kwh: 120 }, { hour: "5PM", kwh: 45 },
      { hour: "6PM", kwh: 12 },
    ],
    monthlyGeneration: [
      { month: "Sep", kwh: 56400, expected: 58000 }, { month: "Oct", kwh: 59800, expected: 60000 },
      { month: "Nov", kwh: 55200, expected: 56000 }, { month: "Dec", kwh: 53900, expected: 55000 },
      { month: "Jan", kwh: 58100, expected: 58000 }, { month: "Feb", kwh: 61080, expected: 60000 },
    ],
    alerts: [],
  },
  {
    id: "3",
    name: "Green Valley Plant",
    location: "Rourkela, Odisha",
    state: "Odisha",
    capacityKw: 400,
    status: "MAINTENANCE",
    todayKwh: 855.0,
    monthlyKwh: 28500,
    lifetimeKwh: 1840000,
    efficiency: 88.4,
    ppaRate: 3.5,
    commissionedDate: "2024-06-01",
    lastMaintenanceDate: "2026-02-08",
    nextMaintenanceDate: "2026-02-15",
    panelCount: 960,
    inverterCount: 6,
    panelType: "Polycrystalline 420W",
    tiltAngle: 25,
    areaAcres: 2.5,
    co2OffsetTons: 26.3,
    todayTrend: -28.5,
    monthlyRevenue: 99750,
    weather: { temp: 29, condition: "Overcast", irradiance: 3.4, humidity: 68, windSpeed: 15 },
    dailyGeneration: [
      { hour: "6AM", kwh: 12 }, { hour: "7AM", kwh: 48 }, { hour: "8AM", kwh: 88 },
      { hour: "9AM", kwh: 115 }, { hour: "10AM", kwh: 128 }, { hour: "11AM", kwh: 132 },
      { hour: "12PM", kwh: 130 }, { hour: "1PM", kwh: 120 }, { hour: "2PM", kwh: 105 },
      { hour: "3PM", kwh: 80 }, { hour: "4PM", kwh: 55 }, { hour: "5PM", kwh: 30 },
      { hour: "6PM", kwh: 12 },
    ],
    monthlyGeneration: [
      { month: "Sep", kwh: 38200, expected: 40000 }, { month: "Oct", kwh: 39800, expected: 40000 },
      { month: "Nov", kwh: 36500, expected: 38000 }, { month: "Dec", kwh: 35200, expected: 37000 },
      { month: "Jan", kwh: 37800, expected: 38000 }, { month: "Feb", kwh: 28500, expected: 38000 },
    ],
    alerts: [
      { id: "a2", title: "Scheduled maintenance in progress", severity: "INFO", time: "2d ago" },
      { id: "a3", title: "Generation 30% below expected", severity: "CRITICAL", time: "6h ago" },
    ],
  },
];

// ─── Helper Components ──────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const startValue = hasAnimated.current ? displayValue : 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = startValue + (value - startValue) * easeOutQuart;
      setDisplayValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimated.current = true;
      }
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString("en-IN");

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function LivePulse() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
    </span>
  );
}

function StatusBadge({ status }: { status: PlantStatus }) {
  const styles = {
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
    INACTIVE: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status === "ACTIVE" && <LivePulse />}
      {status === "MAINTENANCE" && <Wrench className="w-3 h-3" />}
      {status === "INACTIVE" && <XCircle className="w-3 h-3" />}
      {status}
    </span>
  );
}

function EfficiencyRing({ value, size = 64 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color =
    value >= 90 ? "#22C55E" : value >= 70 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={5}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-800">{value}%</span>
      </div>
    </div>
  );
}

function SeverityDot({ severity }: { severity: "CRITICAL" | "WARNING" | "INFO" }) {
  const colors = {
    CRITICAL: "bg-red-500",
    WARNING: "bg-amber-500",
    INFO: "bg-blue-500",
  };
  return <span className={`w-2 h-2 rounded-full ${colors[severity]}`} />;
}

// ─── Fleet Overview Header ──────────────────────────────────────────────────

function FleetOverview() {
  const totalCapacity = MOCK_PLANTS.reduce((s, p) => s + p.capacityKw, 0);
  const totalToday = MOCK_PLANTS.reduce((s, p) => s + p.todayKwh, 0);
  const totalMonthly = MOCK_PLANTS.reduce((s, p) => s + p.monthlyKwh, 0);
  const avgEfficiency = MOCK_PLANTS.reduce((s, p) => s + p.efficiency, 0) / MOCK_PLANTS.length;
  const activePlants = MOCK_PLANTS.filter((p) => p.status === "ACTIVE").length;
  const totalCo2 = MOCK_PLANTS.reduce((s, p) => s + p.co2OffsetTons, 0);

  const summaryStats = [
    { icon: Zap, label: "Total Capacity", value: totalCapacity, suffix: " kW", color: "text-gold-dark", bg: "bg-gold/10" },
    { icon: Sun, label: "Today's Output", value: totalToday, suffix: " kWh", color: "text-forest", bg: "bg-forest/10", decimals: 1 },
    { icon: BarChart3, label: "Monthly Output", value: totalMonthly, suffix: " kWh", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Gauge, label: "Avg Efficiency", value: avgEfficiency, suffix: "%", color: "text-green-600", bg: "bg-green-50", decimals: 1 },
    { icon: Leaf, label: "CO₂ Offset", value: totalCo2, suffix: " tons", color: "text-emerald-600", bg: "bg-emerald-50", decimals: 1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 border border-gold/15 p-6 sm:p-8 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
          <div className="absolute top-4 right-4 w-48 h-48 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-2xl" />
          <motion.div
            className="absolute top-6 right-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="w-20 h-20 text-gold/15" strokeWidth={1} />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <LivePulse />
              <span className="text-xs font-medium text-green-700">
                {activePlants}/{MOCK_PLANTS.length} Plants Online
              </span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black font-heading">
            My Solar Plants
          </h1>
          <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
            Monitor performance, track generation, and manage your solar fleet.
          </p>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {summaryStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-2`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-lg sm:text-xl font-bold mt-0.5 ${stat.color}`}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Plant Card (List View) ────────────────────────────────────────────────

function PlantCard({ plant, index, onSelect }: { plant: PlantData; index: number; onSelect: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(plant.id)}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden"
    >
      {/* Top Strip — color coded by status */}
      <div
        className={`h-1 ${
          plant.status === "ACTIVE"
            ? "bg-gradient-to-r from-green-400 to-emerald-500"
            : plant.status === "MAINTENANCE"
            ? "bg-gradient-to-r from-amber-400 to-orange-500"
            : "bg-gray-300"
        }`}
      />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-black text-base group-hover:text-forest transition-colors truncate">
                {plant.name}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-forest shrink-0 transition-colors" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{plant.location}</span>
            </div>
          </div>
          <StatusBadge status={plant.status} />
        </div>

        {/* Core metrics row */}
        <div className="flex items-center gap-5">
          <EfficiencyRing value={plant.efficiency} size={64} />
          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Today</p>
              <p className="text-sm font-bold text-black flex items-center gap-1">
                {plant.todayKwh.toLocaleString("en-IN")} kWh
                <span className={`text-[10px] font-semibold ${plant.todayTrend >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {plant.todayTrend >= 0 ? "+" : ""}{plant.todayTrend}%
                </span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Capacity</p>
              <p className="text-sm font-bold text-black">{plant.capacityKw} kW</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Monthly</p>
              <p className="text-sm font-bold text-black">{plant.monthlyKwh.toLocaleString("en-IN")} kWh</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Revenue</p>
              <p className="text-sm font-bold text-forest">₹{plant.monthlyRevenue.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Weather + Alerts strip */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              {plant.weather.temp}°C · {plant.weather.irradiance} kWh/m²
            </span>
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-blue-400" />
              {plant.weather.windSpeed} km/h
            </span>
          </div>
          {plant.alerts.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {plant.alerts.length} alert{plant.alerts.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Plant Detail View ──────────────────────────────────────────────────────

function PlantDetailView({ plant, onBack }: { plant: PlantData; onBack: () => void }) {
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

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function MyPlantsPage() {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PlantStatus>("ALL");

  const selectedPlant = MOCK_PLANTS.find((p) => p.id === selectedPlantId);

  const filteredPlants = MOCK_PLANTS.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || plant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // If a plant is selected, show detail view
  if (selectedPlant) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PlantDetailView plant={selectedPlant} onBack={() => setSelectedPlantId(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Fleet Overview */}
      <FleetOverview />

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["ALL", "ACTIVE", "MAINTENANCE", "INACTIVE"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-white text-forest shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Plant Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredPlants.map((plant, i) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            index={i}
            onSelect={setSelectedPlantId}
          />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Sun className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No plants match your search.</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters.</p>
        </motion.div>
      )}
    </div>
  );
}
