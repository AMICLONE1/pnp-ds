"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Users,
  Zap,
  FileText,
  Wallet,
  Loader2,
  Building2,
  MapPin,
  Activity,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Sun,
  ThermometerSun,
  BarChart3,
  ArrowDownRight,
  ArrowUpRight,
  Gauge,
  Calendar,
} from "lucide-react";
import {
  AdminPageHeader,
  AdminTabs,
  StatPill,
  EntityLink,
} from "@/components/admin/shared/AdminPageHeader";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

type TabId = "analytics" | "host" | "bookers" | "generation" | "billing" | "alerts";

interface ProjectDetail {
  project: any;
  host: any;
  capacity: {
    total: number;
    allocated: number;
    available: number;
    suspended: number;
    utilization_percent: number;
  };
  ppa_agreements: any[];
  bookers: any[];
  booker_count: number;
  generation: {
    entries: any[];
    lifetime_kwh: number;
    validated_kwh: number;
    validation_percent: number;
  };
  revenue_estimate: number;
}

// Solar analytics derived from raw generation data
function computeSolarAnalytics(project: any, generation: any) {
  const totalKw = Number(project.total_kw || 0);
  const entries = generation.entries || [];
  const lifetimeKwh = generation.lifetime_kwh;

  // Group by month for trend
  const monthly = entries.map((e: any) => ({
    period: `${e.year}-${String(e.month).padStart(2, "0")}`,
    kwh: Number(e.kwh),
    validated: e.validated,
  }));

  // Expected generation: totalKw * avgGenPerKwPerDay * 30
  const expectedMonthlyKwh = totalKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;

  // Performance Ratio
  const avgMonthlyActual = monthly.length > 0
    ? monthly.reduce((s: number, m: any) => s + m.kwh, 0) / monthly.length
    : 0;
  const performanceRatio = expectedMonthlyKwh > 0
    ? Math.round((avgMonthlyActual / expectedMonthlyKwh) * 100 * 10) / 10
    : 0;

  // CUF = Actual kWh / (capacity_kW * hours_in_period)
  const totalMonths = monthly.length || 1;
  const totalHours = totalMonths * 30 * 24;
  const cuf = totalKw > 0 && totalHours > 0
    ? Math.round((lifetimeKwh / (totalKw * totalHours)) * 100 * 10) / 10
    : 0;

  // Specific yield = kWh / kWp
  const specificYield = totalKw > 0
    ? Math.round((lifetimeKwh / totalKw) * 10) / 10
    : 0;

  // CO2 offset
  const co2OffsetTonnes = Math.round((lifetimeKwh * SOLAR_CONSTANTS.co2PerKwh) / 1000 * 10) / 10;
  const treesEquivalent = Math.round(co2OffsetTonnes * SOLAR_CONSTANTS.treesPerTonCO2);

  // Month-over-month trend
  const last2 = monthly.slice(0, 2);
  const mom = last2.length === 2 && last2[1].kwh > 0
    ? Math.round(((last2[0].kwh - last2[1].kwh) / last2[1].kwh) * 100)
    : 0;

  // Alerts
  const alerts: { severity: "critical" | "warning" | "info"; message: string }[] = [];

  if (performanceRatio < 70) {
    alerts.push({ severity: "critical", message: `Performance Ratio at ${performanceRatio}% — significantly below expected 100%. Check for panel degradation, shading, or inverter issues.` });
  } else if (performanceRatio < 85) {
    alerts.push({ severity: "warning", message: `Performance Ratio at ${performanceRatio}% — below optimal. Consider panel cleaning or inverter inspection.` });
  }

  if (cuf < 12) {
    alerts.push({ severity: "warning", message: `CUF at ${cuf}% — lower than typical 14-19% for this region. Verify orientation, tilt angle, and shading.` });
  }

  if (mom < -20) {
    alerts.push({ severity: "warning", message: `Generation dropped ${Math.abs(mom)}% month-over-month. Investigate potential equipment or weather issues.` });
  }

  const unvalidatedCount = entries.filter((e: any) => !e.validated).length;
  if (unvalidatedCount > 0) {
    alerts.push({ severity: "info", message: `${unvalidatedCount} generation entries pending validation.` });
  }

  if (generation.validation_percent < 80 && entries.length > 2) {
    alerts.push({ severity: "warning", message: `Only ${generation.validation_percent}% of generation data validated. QA review recommended.` });
  }

  return { monthly, expectedMonthlyKwh, performanceRatio, cuf, specificYield, co2OffsetTonnes, treesEquivalent, mom, avgMonthlyActual, alerts };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [data, setData] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("analytics");

  useEffect(() => {
    if (!projectId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/projects/${projectId}`);
        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Failed to load project");
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const analytics = useMemo(() => {
    if (!data) return null;
    return computeSolarAnalytics(data.project, data.generation);
  }, [data]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error || "Project not found"}</p>
        <Link href="/admin/projects" className="text-gold-dark hover:underline">&larr; Back to projects</Link>
      </div>
    );
  }

  const { project, host, capacity, ppa_agreements, bookers, generation, revenue_estimate } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <AdminPageHeader
        title={project.name}
        subtitle={`${project.spv_id} \u2022 ${project.location}, ${project.state}`}
        backHref="/admin/projects"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Plants", href: "/admin/projects" },
          { label: project.name },
        ]}
        badge={<StatusBadge status={project.status} />}
      />

      {/* Top hero cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Plant info */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl flex items-center justify-center shrink-0">
              <Sun className="w-7 h-7 text-gold-dark" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Owner</p>
              {host ? (
                <div className="mt-1">
                  <EntityLink type="host" id={host.id} label={host.name || "Unnamed Host"} secondary={host.email} />
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-1">No host assigned</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <MiniInfo icon={<Zap className="w-3.5 h-3.5" />} label="Capacity" value={`${project.total_kw} kW`} />
                <MiniInfo icon={<IndianRupee className="w-3.5 h-3.5" />} label="Rate" value={`\u20B9${project.rate_per_kwh}/kWh`} />
                <MiniInfo icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={project.location} />
                <MiniInfo icon={<Activity className="w-3.5 h-3.5" />} label="Logger" value={project.data_logger_serial_id || "\u2014"} />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue card */}
        <div className="bg-gradient-to-br from-forest to-[#1a4a2e] rounded-2xl p-6 text-white">
          <p className="text-xs uppercase tracking-wide text-white/60">Revenue Estimate</p>
          <p className="text-3xl font-bold mt-2">\u20B9{revenue_estimate.toLocaleString()}</p>
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-white/60">Lifetime</span><span className="font-semibold">{generation.lifetime_kwh.toLocaleString()} kWh</span></div>
            <div className="flex justify-between"><span className="text-white/60">Validated</span><span className="font-semibold">{generation.validation_percent}%</span></div>
          </div>
        </div>

        {/* Environment impact */}
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 text-white">
          <p className="text-xs uppercase tracking-wide text-white/60">Environmental Impact</p>
          <p className="text-3xl font-bold mt-2">{analytics?.co2OffsetTonnes || 0} t</p>
          <p className="text-xs text-white/60 mt-1">CO&#x2082; offset</p>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-sm">
            <Leaf className="w-4 h-4 text-green-300" />
            <span className="text-white/80">{analytics?.treesEquivalent || 0} trees equivalent</span>
          </div>
        </div>
      </div>

      {/* Performance metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Allocated" value={`${capacity.allocated} kW`} sublabel={`of ${capacity.total} kW`} icon={<CheckCircle2 className="w-4 h-4 text-green-600" />} />
        <MetricCard label="Available" value={`${capacity.available} kW`} icon={<Zap className="w-4 h-4 text-blue-600" />} />
        <MetricCard label="Utilization" value={`${capacity.utilization_percent}%`} icon={<Gauge className="w-4 h-4 text-purple-600" />} />
        <MetricCard label="PR" value={`${analytics?.performanceRatio || 0}%`} sublabel="Performance Ratio" icon={<ThermometerSun className="w-4 h-4 text-orange-600" />} highlight={analytics ? analytics.performanceRatio < 80 : undefined} />
        <MetricCard label="CUF" value={`${analytics?.cuf || 0}%`} sublabel="Capacity Util. Factor" icon={<BarChart3 className="w-4 h-4 text-indigo-600" />} />
        <MetricCard label="MoM" value={analytics?.mom !== undefined ? `${analytics.mom > 0 ? "+" : ""}${analytics.mom}%` : "\u2014"} icon={analytics && analytics.mom >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-600" /> : <ArrowDownRight className="w-4 h-4 text-red-600" />} />
      </div>

      {/* Alerts banner */}
      {analytics && analytics.alerts.length > 0 && (
        <div className="space-y-2">
          {analytics.alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                alert.severity === "critical"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : alert.severity === "warning"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${
                alert.severity === "critical" ? "text-red-500" : alert.severity === "warning" ? "text-yellow-500" : "text-blue-500"
              }`} />
              <p className="text-sm">{alert.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-4">
          <AdminTabs
            tabs={[
              { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "host", label: "Host", icon: <Building2 className="w-4 h-4" /> },
              { id: "bookers", label: "Bookers", count: bookers.length, icon: <Users className="w-4 h-4" /> },
              { id: "generation", label: "Generation", count: generation.entries.length, icon: <Zap className="w-4 h-4" /> },
              { id: "billing", label: "PPA & Billing", count: ppa_agreements.length, icon: <Wallet className="w-4 h-4" /> },
              { id: "alerts", label: "Alerts", count: analytics?.alerts.length, icon: <AlertTriangle className="w-4 h-4" /> },
            ]}
            active={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
          />
        </div>
        <div className="p-4 sm:p-6">
          {activeTab === "analytics" && analytics && <AnalyticsTab analytics={analytics} project={project} capacity={capacity} generation={generation} />}
          {activeTab === "host" && <HostTab host={host} />}
          {activeTab === "bookers" && <BookersTab bookers={bookers} />}
          {activeTab === "generation" && <GenerationTab entries={generation.entries} />}
          {activeTab === "billing" && <BillingTab agreements={ppa_agreements} />}
          {activeTab === "alerts" && analytics && <AlertsTab alerts={analytics.alerts} />}
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wide">{icon}{label}</div>
      <p className="mt-1 text-sm font-medium text-black truncate">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, sublabel, icon, highlight }: { label: string; value: string; sublabel?: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide">
        {icon}{label}
      </div>
      <p className="text-xl font-bold mt-1.5 text-black">{value}</p>
      {sublabel && <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>}
    </div>
  );
}

function AnalyticsTab({ analytics, project, capacity, generation }: any) {
  const totalKw = Number(project.total_kw || 0);

  return (
    <div className="space-y-6">
      {/* Capacity breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Capacity Breakdown</h3>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <CapacityBar label="Allocated" value={capacity.allocated} total={capacity.total} color="bg-green-500" />
          <CapacityBar label="Available" value={capacity.available} total={capacity.total} color="bg-blue-500" />
          {capacity.suspended > 0 && <CapacityBar label="Suspended" value={capacity.suspended} total={capacity.total} color="bg-red-500" />}
        </div>
      </div>

      {/* Monthly Generation Trend */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Monthly Generation Trend</h3>
        <div className="bg-gray-50 rounded-xl p-4">
          {analytics.monthly.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No generation data available</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Expected: {Math.round(analytics.expectedMonthlyKwh).toLocaleString()} kWh/month</span>
                <span>Avg actual: {Math.round(analytics.avgMonthlyActual).toLocaleString()} kWh/month</span>
              </div>
              {analytics.monthly.slice(0, 12).map((m: any) => {
                const pct = analytics.expectedMonthlyKwh > 0 ? (m.kwh / analytics.expectedMonthlyKwh) * 100 : 0;
                const isBelow = pct < 80;
                return (
                  <div key={m.period} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-600 w-16 shrink-0">{m.period}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isBelow ? "bg-orange-400" : "bg-green-500"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                      {/* Expected line */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400" style={{ left: "100%" }} />
                    </div>
                    <span className="text-xs font-medium w-20 text-right">{m.kwh.toLocaleString()} kWh</span>
                    <span className={`text-[10px] font-semibold w-12 text-right ${isBelow ? "text-orange-600" : "text-green-600"}`}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Performance summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase">Specific Yield</p>
          <p className="text-2xl font-bold mt-1">{analytics.specificYield.toLocaleString()} kWh/kWp</p>
          <p className="text-xs text-gray-400 mt-1">Lifetime energy per installed kW</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase">Generation Quality</p>
          <p className="text-2xl font-bold mt-1">{generation.validation_percent}%</p>
          <p className="text-xs text-gray-400 mt-1">{generation.validated_kwh.toLocaleString()} of {generation.lifetime_kwh.toLocaleString()} kWh validated</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase">Environmental</p>
          <p className="text-2xl font-bold mt-1">{analytics.co2OffsetTonnes}t CO&#x2082;</p>
          <p className="text-xs text-gray-400 mt-1">{analytics.treesEquivalent} trees equivalent</p>
        </div>
      </div>
    </div>
  );
}

function CapacityBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-black">{value} kW ({pct.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function HostTab({ host }: { host: any }) {
  if (!host) return <p className="text-gray-500 text-center py-12">No host assigned to this project.</p>;
  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center">
          <Building2 className="w-8 h-8 text-gold-dark" />
        </div>
        <div>
          <EntityLink type="host" id={host.id} label={host.name || "Unnamed Host"} secondary={host.email} className="text-lg" />
          <p className="text-sm text-gray-500 mt-1">{host.phone || "No phone"}</p>
        </div>
      </div>
      <Link
        href={`/admin/hosts/${host.id}`}
        className="block text-center py-3 bg-gold text-forest rounded-xl font-semibold hover:bg-gold-dark transition-colors"
      >
        View Full Host Profile &rarr;
      </Link>
    </div>
  );
}

function BookersTab({ bookers }: { bookers: any[] }) {
  if (bookers.length === 0) return <p className="text-gray-500 text-center py-12">No bookers yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
            <th className="pb-3 font-semibold">Booker</th>
            <th className="pb-3 font-semibold">Capacity</th>
            <th className="pb-3 font-semibold">Allocated On</th>
            <th className="pb-3 font-semibold">Credits Earned</th>
            <th className="pb-3 font-semibold">Payment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookers.map((b: any) => (
            <tr key={b.allocation_id} className="hover:bg-gray-50/50">
              <td className="py-3"><EntityLink type="user" id={b.user.id} label={b.user.name || "Unknown"} secondary={b.user.email} /></td>
              <td className="py-3 font-medium">{b.capacity_kw} kW</td>
              <td className="py-3 text-gray-600">{new Date(b.allocated_at).toLocaleDateString()}</td>
              <td className="py-3 text-gray-700">\u20B9{Number(b.credits_earned).toLocaleString()}</td>
              <td className="py-3">
                {b.payment ? <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{b.payment.status}</span> : <span className="text-xs text-gray-400">None</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GenerationTab({ entries }: { entries: any[] }) {
  const [rows, setRows] = useState(entries);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => setRows(entries), [entries]);

  const toggleValidation = async (id: string, current: boolean) => {
    setPending(id);
    try {
      const res = await fetch(`/api/admin/generations/${id}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validated: !current }),
      });
      const result = await res.json();
      if (result.success) {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, validated: !current } : r)));
      }
    } finally {
      setPending(null);
    }
  };

  if (rows.length === 0) return <p className="text-gray-500 text-center py-12">No generation data recorded yet.</p>;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-2">
        <p className="text-xs text-gray-500">Click status to toggle validation</p>
        <p className="text-xs text-gray-500">{rows.filter((r) => r.validated).length}/{rows.length} validated</p>
      </div>
      {rows.map((g: any) => (
        <div key={g.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">{g.year}-{String(g.month).padStart(2, "0")}</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{Number(g.kwh).toLocaleString()} kWh</span>
            {g.source && <span className="text-xs text-gray-400">{g.source}</span>}
            <button
              onClick={() => toggleValidation(g.id, g.validated)}
              disabled={pending === g.id}
              className={`text-xs px-2 py-0.5 rounded-full transition-colors ${g.validated ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"} ${pending === g.id ? "opacity-50" : ""}`}
            >
              {pending === g.id ? "..." : g.validated ? "\u2713 Validated" : "Validate"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BillingTab({ agreements }: { agreements: any[] }) {
  if (agreements.length === 0) return <p className="text-gray-500 text-center py-12">No PPA agreements on file.</p>;
  return (
    <div className="space-y-3">
      {agreements.map((a: any) => (
        <div key={a.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" /><p className="font-semibold">{a.agreement_number || "\u2014"}</p></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                <div><p className="text-gray-500">Start</p><p className="font-medium">{a.start_date}</p></div>
                <div><p className="text-gray-500">End</p><p className="font-medium">{a.end_date}</p></div>
                <div><p className="text-gray-500">Rate</p><p className="font-medium">\u20B9{a.rate_per_kwh || "\u2014"}/kWh</p></div>
                <div><p className="text-gray-500">Capacity</p><p className="font-medium">{a.contracted_capacity_kw || "\u2014"} kW</p></div>
              </div>
            </div>
            <StatusBadge status={a.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertsTab({ alerts }: { alerts: { severity: string; message: string }[] }) {
  if (alerts.length === 0) return <p className="text-green-600 text-center py-12 text-sm flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> All systems nominal. No alerts detected.</p>;
  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${a.severity === "critical" ? "bg-red-50 border-red-200 text-red-800" : a.severity === "warning" ? "bg-yellow-50 border-yellow-200 text-yellow-800" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
          <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${a.severity === "critical" ? "text-red-500" : a.severity === "warning" ? "text-yellow-500" : "text-blue-500"}`} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">{a.severity}</p>
            <p className="text-sm mt-0.5">{a.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    DRAFT: "bg-gray-100 text-gray-700",
    MAINTENANCE: "bg-yellow-100 text-yellow-700",
    RETIRED: "bg-red-100 text-red-700",
  };
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}
