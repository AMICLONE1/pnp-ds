"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Search,
  Loader2,
  Zap,
  FolderKanban,
  Users,
  FileText,
  TrendingUp,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { AdminPageHeader, StatPill } from "@/components/admin/shared/AdminPageHeader";

interface HostSummary {
  totalPlants: number;
  activePlants: number;
  totalCapacityKw: number;
  allocatedCapacityKw: number;
  utilizationPercent: number;
  lifetimeKwh: number;
  totalAgreements: number;
  activeAgreements: number;
}

interface HostPlant {
  id: string;
  name: string;
  spv_id: string;
  total_kw: number;
  status: string;
  location: string;
  state: string;
}

interface Host {
  id: string;
  user_id: string;
  business_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  host_status: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  kyc_status: string;
  state: string | null;
  created_at: string;
  deleted_at: string | null;
  summary: HostSummary;
  plants: HostPlant[];
}

export default function AdminHostsPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "banned">("all");
  const [expandedHost, setExpandedHost] = useState<string | null>(null);

  useEffect(() => {
    const fetchHosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search,
          status: statusFilter,
          page: "1",
          limit: "50",
        });
        const res = await fetch(`/api/admin/hosts?${params.toString()}`);
        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Failed to load hosts");
        setHosts(result.data.hosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hosts");
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchHosts, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const totals = useMemo(() => {
    return hosts.reduce(
      (acc, h) => ({
        plants: acc.plants + h.summary.totalPlants,
        capacity: acc.capacity + h.summary.totalCapacityKw,
        allocated: acc.allocated + h.summary.allocatedCapacityKw,
        kwh: acc.kwh + h.summary.lifetimeKwh,
      }),
      { plants: 0, capacity: 0, allocated: 0, kwh: 0 }
    );
  }, [hosts]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <AdminPageHeader
        title="Hosts"
        subtitle="Plant owners — drill into each host's projects, agreements, and bookers"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Hosts" },
        ]}
        badge={
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            {hosts.length} hosts
          </span>
        }
      />

      {/* Portfolio stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPill
          label="Total Plants"
          value={totals.plants}
          icon={<FolderKanban className="w-4 h-4 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatPill
          label="Total Capacity"
          value={`${totals.capacity.toLocaleString()} kW`}
          icon={<Zap className="w-4 h-4 text-gold-dark" />}
          color="bg-gold/10"
        />
        <StatPill
          label="Capacity Allocated"
          value={`${totals.allocated.toLocaleString()} kW`}
          icon={<TrendingUp className="w-4 h-4 text-green-600" />}
          color="bg-green-50"
        />
        <StatPill
          label="Lifetime Generation"
          value={`${(totals.kwh / 1000).toFixed(1)} MWh`}
          icon={<Zap className="w-4 h-4 text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search hosts by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {(["all", "active", "banned"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                statusFilter === s
                  ? "bg-gold text-forest"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Hosts list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : hosts.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No hosts found</p>
          <p className="text-sm mt-1">Hosts are created from the Projects page when provisioning new plants.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hosts.map((host, i) => {
            const isExpanded = expandedHost === host.id;
            return (
              <motion.div
                key={host.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header row */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedHost(isExpanded ? null : host.id)}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-gold-dark" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg text-black truncate">
                            {host.business_name || host.contact_name || host.name || "Unnamed Host"}
                          </h3>
                          {host.deleted_at ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                              <Ban className="w-3 h-3" /> Banned
                            </span>
                          ) : host.host_status === "ACTIVE" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                              {host.host_status}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            KYC: {host.kyc_status}
                          </span>
                        </div>
                        {host.contact_name && host.business_name && (
                          <p className="text-sm text-gray-700 mt-0.5">Contact: {host.contact_name}</p>
                        )}
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                          {(host.contact_email || host.email) && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> {host.contact_email || host.email}
                            </span>
                          )}
                          {(host.contact_phone || host.phone) && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" /> {host.contact_phone || host.phone}
                            </span>
                          )}
                          {host.state && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {host.state}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/admin/hosts/${host.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-medium text-gold-dark hover:underline whitespace-nowrap"
                    >
                      View Details →
                    </Link>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <SummaryItem
                      icon={<FolderKanban className="w-4 h-4 text-blue-600" />}
                      label="Plants"
                      value={`${host.summary.activePlants}/${host.summary.totalPlants}`}
                    />
                    <SummaryItem
                      icon={<Zap className="w-4 h-4 text-gold-dark" />}
                      label="Capacity"
                      value={`${host.summary.totalCapacityKw} kW`}
                    />
                    <SummaryItem
                      icon={<TrendingUp className="w-4 h-4 text-green-600" />}
                      label="Utilization"
                      value={`${host.summary.utilizationPercent}%`}
                    />
                    <SummaryItem
                      icon={<FileText className="w-4 h-4 text-purple-600" />}
                      label="Active PPAs"
                      value={`${host.summary.activeAgreements}/${host.summary.totalAgreements}`}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {host.summary.lifetimeKwh.toLocaleString()} kWh generated lifetime
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded plants list */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-gray-100 bg-gray-50/50"
                  >
                    <div className="p-5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Plants owned by this host
                      </p>
                      {host.plants.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">
                          No plants assigned to this host yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {host.plants.map((plant) => (
                            <Link
                              key={plant.id}
                              href={`/admin/projects/${plant.id}`}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gold transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <FolderKanban className="w-4 h-4 text-blue-600" />
                                <div>
                                  <p className="font-medium text-sm text-black group-hover:text-gold-dark">
                                    {plant.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {plant.spv_id} • {plant.location}, {plant.state}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-700">
                                  {plant.total_kw} kW
                                </span>
                                <StatusBadge status={plant.status} />
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-bold text-black">{value}</p>
      </div>
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
  return (
    <span
      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
