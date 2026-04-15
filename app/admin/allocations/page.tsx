"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link2, Search, Loader2, Users, FolderKanban, Zap, Activity } from "lucide-react";
import { AdminPageHeader, StatPill, EntityLink } from "@/components/admin/shared/AdminPageHeader";

interface AllocationRow {
  id: string;
  capacity_kw: number;
  allocated_at: string;
  user: { id: string; name: string | null; email: string | null };
  project: {
    id: string;
    name: string;
    spv_id: string;
    location: string;
    state: string;
    rate_per_kwh: number;
  } | null;
  host: { id: string; name: string | null; email: string | null } | null;
  block_status: string | null;
}

interface Stats {
  totalAllocations: number;
  totalCapacityKw: number;
  uniqueUsers: number;
  uniquePlants: number;
}

export default function AdminAllocationsPage() {
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAllocations: 0,
    totalCapacityKw: 0,
    uniqueUsers: 0,
    uniquePlants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search,
          page: "1",
          limit: "100",
        });
        const res = await fetch(`/api/admin/allocations?${params.toString()}`);
        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Failed");
        setAllocations(result.data.allocations);
        setStats(result.data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchData, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <AdminPageHeader
        title="Allocations"
        subtitle="Every booking linking a user to a plant — the heart of the marketplace"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Allocations" }]}
        badge={
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            {stats.totalAllocations} total
          </span>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPill
          label="Total Allocations"
          value={stats.totalAllocations}
          icon={<Link2 className="w-4 h-4 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatPill
          label="Capacity Booked"
          value={`${stats.totalCapacityKw.toLocaleString()} kW`}
          icon={<Zap className="w-4 h-4 text-gold-dark" />}
          color="bg-gold/10"
        />
        <StatPill
          label="Unique Bookers"
          value={stats.uniqueUsers}
          icon={<Users className="w-4 h-4 text-purple-600" />}
          color="bg-purple-50"
        />
        <StatPill
          label="Plants Allocated"
          value={stats.uniquePlants}
          icon={<FolderKanban className="w-4 h-4 text-green-600" />}
          color="bg-green-50"
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, plant, or host..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : allocations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Link2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No allocations found</p>
            <p className="text-sm mt-1">Allocations appear when users book capacity from plants.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-3 font-semibold">Booker</th>
                  <th className="px-4 py-3 font-semibold">Plant</th>
                  <th className="px-4 py-3 font-semibold">Host</th>
                  <th className="px-4 py-3 font-semibold">Capacity</th>
                  <th className="px-4 py-3 font-semibold">Rate</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Allocated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allocations.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.01, 0.3) }}
                    className="hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3">
                      <EntityLink
                        type="user"
                        id={a.user.id}
                        label={a.user.name || "Unknown"}
                        secondary={a.user.email || undefined}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {a.project ? (
                        <EntityLink
                          type="project"
                          id={a.project.id}
                          label={a.project.name}
                          secondary={`${a.project.location}, ${a.project.state}`}
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {a.host ? (
                        <EntityLink
                          type="host"
                          id={a.host.id}
                          label={a.host.name || "Unknown"}
                          secondary={a.host.email || undefined}
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{a.capacity_kw} kW</td>
                    <td className="px-4 py-3 text-gray-700">
                      {a.project ? `₹${a.project.rate_per_kwh}/kWh` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {a.block_status && (
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            a.block_status === "ALLOCATED"
                              ? "bg-green-100 text-green-700"
                              : a.block_status === "AVAILABLE"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {a.block_status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(a.allocated_at).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
