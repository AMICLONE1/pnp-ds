"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  FolderKanban,
  Users,
  FileText,
  Zap,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  ExternalLink,
  Edit3,
  Save,
  X,
  Upload,
} from "lucide-react";
import {
  AdminPageHeader,
  AdminTabs,
  StatPill,
  EntityLink,
} from "@/components/admin/shared/AdminPageHeader";

type TabId = "plants" | "agreements" | "bookers" | "generation";

export default function HostDetailPage() {
  const params = useParams();
  const hostId = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("plants");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/hosts/${hostId}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to load host");
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load host");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hostId) fetchData();
  }, [hostId]);

  const startEdit = () => {
    const h = data.host;
    setEditForm({
      business_name: h.business_name || "",
      contact_name: h.contact_name || "",
      contact_email: h.contact_email || "",
      contact_phone: h.contact_phone || "",
      state: h.user_state || "",
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/hosts/${hostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const result = await res.json();
      if (result.success) {
        setEditing(false);
        setLoading(true);
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  };

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
        <p className="text-red-600">{error || "Host not found"}</p>
        <Link href="/admin/hosts" className="text-gold-dark hover:underline mt-2 inline-block">
          &larr; Back to hosts
        </Link>
      </div>
    );
  }

  const { host, summary, projects, agreements, allocations } = data;
  const displayName = host.business_name || host.contact_name || host.name || "Unnamed Host";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <AdminPageHeader
        title={displayName}
        subtitle={host.contact_email || host.email || ""}
        backHref="/admin/hosts"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Hosts", href: "/admin/hosts" },
          { label: displayName },
        ]}
        badge={
          <span className="px-2 py-1 bg-gold/10 text-gold-dark text-xs font-semibold rounded-full">HOST</span>
        }
        actions={
          !editing ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit Host
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-1 px-4 py-2 bg-gold text-forest rounded-xl text-sm font-semibold hover:bg-gold-dark disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )
        }
      />

      {/* Host info card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <EditField label="Business Name" value={editForm.business_name} onChange={(v) => setEditForm((f) => ({ ...f, business_name: v }))} />
            <EditField label="Contact Name" value={editForm.contact_name} onChange={(v) => setEditForm((f) => ({ ...f, contact_name: v }))} />
            <EditField label="Contact Email" value={editForm.contact_email} onChange={(v) => setEditForm((f) => ({ ...f, contact_email: v }))} />
            <EditField label="Contact Phone" value={editForm.contact_phone} onChange={(v) => setEditForm((f) => ({ ...f, contact_phone: v }))} />
            <EditField label="State" value={editForm.state} onChange={(v) => setEditForm((f) => ({ ...f, state: v }))} />
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center shrink-0">
              <Building2 className="w-8 h-8 text-gold-dark" />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoRow icon={<Building2 className="w-4 h-4" />} label="Business" value={host.business_name || "—"} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={host.contact_email || host.email || "—"} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={host.contact_phone || host.phone || "—"} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="State" value={host.user_state || "—"} />
              <InfoRow icon={<Users className="w-4 h-4" />} label="Contact" value={host.contact_name || "—"} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Verified" value={host.verified_at ? new Date(host.verified_at).toLocaleDateString() : "—"} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Joined" value={host.user_created_at ? new Date(host.user_created_at).toLocaleDateString() : "—"} />
              <InfoRow
                icon={<Zap className="w-4 h-4" />}
                label="Status"
                value={host.deleted_at ? "Banned" : host.host_status || "ACTIVE"}
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPill
          label="Plants"
          value={`${summary.activePlants}/${summary.totalPlants}`}
          icon={<FolderKanban className="w-4 h-4 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatPill
          label="Capacity Utilized"
          value={`${summary.utilizationPercent}%`}
          icon={<TrendingUp className="w-4 h-4 text-green-600" />}
          color="bg-green-50"
        />
        <StatPill
          label="Bookers"
          value={summary.totalBookers}
          icon={<Users className="w-4 h-4 text-purple-600" />}
          color="bg-purple-50"
        />
        <StatPill
          label="Lifetime Generation"
          value={summary.lifetimeKwh > 1000 ? `${(summary.lifetimeKwh / 1000).toFixed(1)} MWh` : `${summary.lifetimeKwh} kWh`}
          icon={<Zap className="w-4 h-4 text-gold-dark" />}
          color="bg-gold/10"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-4">
          <AdminTabs
            tabs={[
              { id: "plants", label: "Plants", count: projects.length, icon: <FolderKanban className="w-4 h-4" /> },
              { id: "agreements", label: "PPA Agreements", count: agreements.length, icon: <FileText className="w-4 h-4" /> },
              { id: "bookers", label: "Bookers", count: allocations.length, icon: <Users className="w-4 h-4" /> },
              { id: "generation", label: "Generation", icon: <Zap className="w-4 h-4" /> },
            ]}
            active={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
          />
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "plants" && <PlantsTab projects={projects} />}
          {activeTab === "agreements" && <AgreementsTab agreements={agreements} projects={projects} hostId={hostId} onRefresh={fetchData} />}
          {activeTab === "bookers" && <BookersTab allocations={allocations} />}
          {activeTab === "generation" && <GenerationTab generations={data.generations} />}
        </div>
      </div>
    </div>
  );
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wide">
        {icon} {label}
      </div>
      <p className="mt-1 text-sm font-medium text-black truncate">{value}</p>
    </div>
  );
}

function PlantsTab({ projects }: { projects: any[] }) {
  if (projects.length === 0) {
    return <EmptyState message="No plants assigned to this host yet." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
            <th className="pb-3 font-semibold">Plant</th>
            <th className="pb-3 font-semibold">Location</th>
            <th className="pb-3 font-semibold">Capacity</th>
            <th className="pb-3 font-semibold">Utilization</th>
            <th className="pb-3 font-semibold">Bookers</th>
            <th className="pb-3 font-semibold">Lifetime kWh</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {projects.map((p: any) => (
            <tr key={p.id} className="hover:bg-gray-50/50">
              <td className="py-4">
                <EntityLink type="project" id={p.id} label={p.name} secondary={p.spv_id} />
              </td>
              <td className="py-4 text-gray-700">{p.location}, {p.state}</td>
              <td className="py-4 font-medium">{p.total_kw} kW</td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 bg-gold rounded-full" style={{ width: `${p.utilization_percent}%` }} />
                  </div>
                  <span className="text-xs text-gray-600">{p.utilization_percent}%</span>
                </div>
              </td>
              <td className="py-4">{p.booker_count}</td>
              <td className="py-4 text-gray-700">{p.lifetime_kwh.toLocaleString()}</td>
              <td className="py-4"><StatusBadge status={p.status} /></td>
              <td className="py-4">
                <Link href={`/admin/projects/${p.id}`}><ExternalLink className="w-4 h-4 text-gray-400 hover:text-gold-dark" /></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AgreementsTab({ agreements, projects, hostId, onRefresh }: { agreements: any[]; projects: any[]; hostId: string; onRefresh: () => void }) {
  const [uploading, setUploading] = useState(false);
  const projectMap = new Map(projects.map((p: any) => [p.id, p]));

  const handlePpaUpload = async (agreementId: string, file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("agreement_id", agreementId);
      formData.append("host_id", hostId);

      const res = await fetch("/api/admin/hosts/ppa-upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) onRefresh();
    } finally {
      setUploading(false);
    }
  };

  if (agreements.length === 0) {
    return <EmptyState message="No PPA agreements found for this host." />;
  }
  return (
    <div className="space-y-3">
      {agreements.map((a: any) => {
        const project = projectMap.get(a.project_id);
        return (
          <div key={a.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <p className="font-semibold text-black">{a.agreement_number || "No agreement number"}</p>
                </div>
                {project && (
                  <p className="text-sm text-gray-600 mt-0.5">
                    Plant:{" "}
                    <Link href={`/admin/projects/${project.id}`} className="text-gold-dark hover:underline">{project.name}</Link>
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                  <span>Start: {a.start_date}</span>
                  <span>End: {a.end_date}</span>
                  {a.contracted_capacity_kw && <span>{a.contracted_capacity_kw} kW</span>}
                  {a.rate_per_kwh && <span>&#x20B9;{a.rate_per_kwh}/kWh</span>}
                  {a.duration_years && <span>{a.duration_years} yrs</span>}
                </div>
                {a.agreement_document_path && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> PPA document uploaded
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={a.status} />
                {!a.agreement_document_path && (
                  <label className={`flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-50 ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                    <Upload className="w-3 h-3" />
                    Upload PPA
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handlePpaUpload(a.id, f);
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BookersTab({ allocations }: { allocations: any[] }) {
  if (allocations.length === 0) {
    return <EmptyState message="No bookers have allocated capacity from this host&apos;s plants yet." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
            <th className="pb-3 font-semibold">Booker</th>
            <th className="pb-3 font-semibold">Plant</th>
            <th className="pb-3 font-semibold">Capacity</th>
            <th className="pb-3 font-semibold">Allocated On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {allocations.map((a: any) => (
            <tr key={a.id} className="hover:bg-gray-50/50">
              <td className="py-3">
                <EntityLink type="user" id={a.user.id} label={a.user.name || "Unknown"} secondary={a.user.email} />
              </td>
              <td className="py-3">
                {a.project ? <EntityLink type="project" id={a.project.id} label={a.project.name} /> : <span className="text-gray-400">&mdash;</span>}
              </td>
              <td className="py-3 font-medium">{a.capacity_kw} kW</td>
              <td className="py-3 text-gray-600">{new Date(a.allocated_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GenerationTab({ generations }: { generations: any[] }) {
  if (generations.length === 0) {
    return <EmptyState message="No generation data recorded yet." />;
  }
  return (
    <div className="space-y-2">
      {generations.slice(0, 24).map((g: any, i: number) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-black">
            {g.year}-{String(g.month).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{Number(g.kwh).toLocaleString()} kWh</span>
            {g.validated ? (
              <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Validated</span>
            ) : (
              <span className="text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">Unvalidated</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-center text-gray-500 py-12 text-sm">{message}</p>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    DRAFT: "bg-gray-100 text-gray-700",
    MAINTENANCE: "bg-yellow-100 text-yellow-700",
    RETIRED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
