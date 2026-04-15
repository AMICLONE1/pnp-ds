"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sun,
  MapPin,
  Zap,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Activity,
  Gauge,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface AllocationCardProps {
  allocation: any;
  index: number;
}

function resolveProject(allocation: any) {
  return allocation.project || allocation.capacity_block?.project || null;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface Performance {
  project: {
    id: string;
    name: string;
    location: string;
    total_kw: number;
    rate_per_kwh: number;
    status: string;
  };
  user: { reserved_kw: number; share_ratio: number };
  history: { month: number; year: number; kwh: number; validated: boolean }[];
  stats: {
    last12_total_kwh: number;
    last_month_kwh: number;
    month_over_month_pct: number | null;
    avg_cuf_pct: number | null;
    user_last_month_kwh: number;
    user_last_month_inr: number;
  };
}

export default function AllocationCard({ allocation, index }: AllocationCardProps) {
  const project = resolveProject(allocation);
  const capacityKw = Number(allocation.capacity_kw || 0);
  const estMonthlyKwh = Math.round(capacityKw * 120);
  const ratePerKwh = Number(project?.rate_per_kwh || 7);
  const estMonthlySavings = Math.round(estMonthlyKwh * ratePerKwh);

  const [expanded, setExpanded] = useState(false);
  const [perf, setPerf] = useState<Performance | null>(null);
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfError, setPerfError] = useState<string | null>(null);

  useEffect(() => {
    if (!expanded || perf || !project?.id) return;
    let cancelled = false;
    (async () => {
      setPerfLoading(true);
      setPerfError(null);
      try {
        const res = await fetch(`/api/projects/${project.id}/performance`, {
          credentials: "include",
        });
        const result = await res.json();
        if (!cancelled) {
          if (result.success) setPerf(result.data);
          else setPerfError(result.error?.message || "Failed to load performance");
        }
      } catch (err: any) {
        if (!cancelled) setPerfError(err.message || "Network error");
      } finally {
        if (!cancelled) setPerfLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [expanded, perf, project?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-white via-white to-amber-50/30 shadow-sm transition-all hover:border-gold/40 hover:shadow-lg"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl transition-opacity group-hover:opacity-80 pointer-events-none" />

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="relative block w-full p-5 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-orange-500 shadow-sm">
              <Sun className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-black">
                {project?.name || "Solar Project"}
              </h4>
              {project?.location && (
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {project.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Active
            </span>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-500 border border-gray-200"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-gray-100 bg-white/70 p-3 backdrop-blur">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Reserved</p>
            <p className="text-sm font-bold text-black">{capacityKw.toFixed(2)} kW</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Est. gen</p>
            <p className="text-sm font-bold text-black">{estMonthlyKwh} kWh/mo</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Savings</p>
            <p className="text-sm font-bold text-green-600">~₹{estMonthlySavings}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Zap className="h-3 w-3 text-gold" />
            Reserved{" "}
            {new Date(allocation.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <span className="text-xs font-semibold text-gold">
            {expanded ? "Hide performance" : "View performance →"}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="perf"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative overflow-hidden border-t border-gold/10 bg-white/60"
          >
            <div className="p-5 space-y-4">
              {perfLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Activity className="h-3.5 w-3.5 animate-pulse" />
                  Loading live plant data…
                </div>
              )}
              {perfError && (
                <p className="text-xs text-red-600">Couldn't load performance: {perfError}</p>
              )}
              {perf && perf.history.length === 0 && (
                <PreGenerationView perf={perf} />
              )}
              {perf && perf.history.length > 0 && (
                <PerformanceView perf={perf} />
              )}

              <div className="flex items-center justify-end pt-1">
                <Link href={`/bills`}>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-black hover:bg-gold/10">
                    View bills
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PerformanceView({ perf }: { perf: Performance }) {
  const { history, stats, project, user } = perf;

  const maxKwh = Math.max(...history.map((h) => h.kwh), 1);
  const chartW = 320;
  const chartH = 90;
  const barW = chartW / history.length;

  const mom = stats.month_over_month_pct;
  const MoMIcon = mom !== null && mom >= 0 ? TrendingUp : TrendingDown;
  const momColor =
    mom === null ? "text-gray-500" : mom >= 0 ? "text-green-600" : "text-red-500";

  return (
    <>
      {/* Headline stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Stat
          label="Last month"
          value={`${stats.last_month_kwh.toLocaleString("en-IN")} kWh`}
          sub={
            mom !== null ? (
              <span className={`inline-flex items-center gap-0.5 ${momColor}`}>
                <MoMIcon className="h-3 w-3" />
                {Math.abs(mom).toFixed(1)}% vs prev
              </span>
            ) : (
              "No prior data"
            )
          }
        />
        <Stat
          label="Your share (last mo)"
          value={`${stats.user_last_month_kwh.toLocaleString("en-IN")} kWh`}
          sub={`${formatCurrency(stats.user_last_month_inr)} value`}
          subColor="text-green-700"
        />
        <Stat
          label="Avg CUF"
          value={stats.avg_cuf_pct !== null ? `${stats.avg_cuf_pct.toFixed(1)}%` : "—"}
          sub={
            <span className="inline-flex items-center gap-0.5 text-gray-500">
              <Gauge className="h-3 w-3" />
              Plant utilisation
            </span>
          }
        />
        <Stat
          label="12-mo total"
          value={`${(stats.last12_total_kwh / 1000).toFixed(1)} MWh`}
          sub={`${project.total_kw} kW plant`}
        />
      </div>

      {/* Bar chart */}
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            Monthly generation
          </p>
          <p className="text-[11px] text-gray-400">
            Your reserved share: {(user.share_ratio * 100).toFixed(2)}%
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <svg
            viewBox={`0 0 ${chartW} ${chartH + 18}`}
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            {history.map((h, i) => {
              const h2 = (h.kwh / maxKwh) * chartH;
              const x = i * barW + barW * 0.15;
              const y = chartH - h2;
              return (
                <g key={`${h.year}-${h.month}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barW * 0.7}
                    height={h2}
                    rx={2}
                    fill="url(#barGradient)"
                  />
                  <text
                    x={x + (barW * 0.7) / 2}
                    y={chartH + 12}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#9ca3af"
                  >
                    {MONTH_LABELS[h.month - 1]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </>
  );
}

function PreGenerationView({ perf }: { perf: Performance }) {
  const { project, user } = perf;
  const status = (project.status || "").toString();
  const isLive = status.toUpperCase() === "ACTIVE";

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
        <Activity className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800 leading-snug">
          {isLive
            ? "The plant is live but hasn't published a validated generation reading yet. You'll see real performance here once the first month is logged."
            : `This plant is currently marked "${status || "not active"}". You'll see real performance here once it goes live and the first month of generation is validated.`}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Stat
          label="Plant capacity"
          value={`${project.total_kw} kW`}
          sub={project.location}
        />
        <Stat
          label="Your share"
          value={`${user.reserved_kw.toFixed(2)} kW`}
          sub={`${(user.share_ratio * 100).toFixed(2)}% of plant`}
        />
        <Stat
          label="Credit rate"
          value={`₹${project.rate_per_kwh}/kWh`}
          sub="Applied to bills"
        />
        <Stat
          label="Est. monthly gen"
          value={`${Math.round(user.reserved_kw * 120)} kWh`}
          sub={`${formatCurrency(Math.round(user.reserved_kw * 120 * project.rate_per_kwh))} value`}
          subColor="text-green-700"
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  subColor?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white/80 p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-sm font-bold text-black leading-tight">{value}</p>
      {sub !== undefined && (
        <p className={`mt-0.5 text-[11px] ${subColor || "text-gray-500"}`}>{sub}</p>
      )}
    </div>
  );
}
