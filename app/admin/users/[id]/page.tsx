"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon,
  Zap,
  IndianRupee,
  Wallet,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  FolderKanban,
  TrendingUp,
  Building2,
  FileText,
} from "lucide-react";
import {
  AdminPageHeader,
  AdminTabs,
  StatPill,
  EntityLink,
} from "@/components/admin/shared/AdminPageHeader";

type TabId = "profile" | "allocations" | "credits" | "bills" | "payments";

interface UserDetail {
  user: any;
  summary: {
    plantsUsing: number;
    hostsConnected: number;
    totalAllocatedKw: number;
    creditsEarned: number;
    creditsApplied: number;
    creditsPending: number;
    totalBilled: number;
    billsPaid: number;
    billsPending: number;
    totalPaid: number;
  };
  allocations: any[];
  credits: any[];
  bills: any[];
  payments: any[];
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.id as string;
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Failed to load user");
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

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
        <p className="text-red-600">{error || "User not found"}</p>
        <Link href="/admin/users" className="text-gold-dark hover:underline">
          ← Back to users
        </Link>
      </div>
    );
  }

  const { user, summary, allocations, credits, bills, payments } = data;
  const isHost = user.role === "HOST";

  // Redirect hosts to the host detail page
  if (isHost) {
    return (
      <div className="p-8">
        <p className="text-gray-600 mb-4">This user is a HOST. Redirecting to host profile...</p>
        <Link
          href={`/admin/hosts/${user.id}`}
          className="inline-block px-4 py-2 bg-gold text-forest rounded-xl font-semibold hover:bg-gold-dark transition-colors"
        >
          Go to Host Profile →
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <AdminPageHeader
        title={user.name || "Unnamed User"}
        subtitle={user.email || ""}
        backHref="/admin/users"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: user.name || user.id.slice(0, 8) },
        ]}
        badge={
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            {user.role}
          </span>
        }
      />

      {/* User info card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center shrink-0">
            <UserIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email || "—"} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone || "—"} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="State" value={user.state || "—"} />
            <InfoRow icon={<ShieldCheck className="w-4 h-4" />} label="KYC" value={user.kyc_status} />
            <InfoRow icon={<FileText className="w-4 h-4" />} label="Discom" value={user.discom || "—"} />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Joined" value={new Date(user.created_at).toLocaleDateString()} />
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPill
          label="Plants Using"
          value={summary.plantsUsing}
          icon={<FolderKanban className="w-4 h-4 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatPill
          label="Allocated"
          value={`${summary.totalAllocatedKw} kW`}
          icon={<Zap className="w-4 h-4 text-gold-dark" />}
          color="bg-gold/10"
        />
        <StatPill
          label="Credits Earned"
          value={`₹${summary.creditsEarned.toLocaleString()}`}
          icon={<TrendingUp className="w-4 h-4 text-green-600" />}
          color="bg-green-50"
        />
        <StatPill
          label="Total Paid"
          value={`₹${summary.totalPaid.toLocaleString()}`}
          icon={<Wallet className="w-4 h-4 text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-4">
          <AdminTabs
            tabs={[
              { id: "profile", label: "Profile", icon: <UserIcon className="w-4 h-4" /> },
              { id: "allocations", label: "Allocations", count: allocations.length, icon: <Zap className="w-4 h-4" /> },
              { id: "credits", label: "Credits", count: credits.length, icon: <IndianRupee className="w-4 h-4" /> },
              { id: "bills", label: "Bills", count: bills.length, icon: <FileText className="w-4 h-4" /> },
              { id: "payments", label: "Payments", count: payments.length, icon: <Wallet className="w-4 h-4" /> },
            ]}
            active={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
          />
        </div>
        <div className="p-4 sm:p-6">
          {activeTab === "profile" && <ProfileTab user={user} summary={summary} />}
          {activeTab === "allocations" && <AllocationsTab allocations={allocations} />}
          {activeTab === "credits" && <CreditsTab credits={credits} />}
          {activeTab === "bills" && <BillsTab bills={bills} />}
          {activeTab === "payments" && <PaymentsTab payments={payments} />}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-black truncate">{value}</p>
    </div>
  );
}

function ProfileTab({ user, summary }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Identity</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-500">Aadhaar</dt><dd className="font-medium">{user.aadhaar_number || "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">PAN</dt><dd className="font-medium">{user.pan_number || "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Consumer #</dt><dd className="font-medium">{user.utility_consumer_number || "—"}</dd></div>
        </dl>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Activity</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-500">Hosts Connected</dt><dd className="font-medium">{summary.hostsConnected}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Bills Paid</dt><dd className="font-medium">{summary.billsPaid}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Bills Pending</dt><dd className="font-medium">{summary.billsPending}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Credits Applied</dt><dd className="font-medium">₹{summary.creditsApplied.toLocaleString()}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Credits Pending</dt><dd className="font-medium">₹{summary.creditsPending.toLocaleString()}</dd></div>
        </dl>
      </div>
    </div>
  );
}

function AllocationsTab({ allocations }: { allocations: any[] }) {
  if (allocations.length === 0) {
    return <p className="text-gray-500 text-center py-12">This user has not booked any capacity yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
            <th className="pb-3 font-semibold">Plant</th>
            <th className="pb-3 font-semibold">Host</th>
            <th className="pb-3 font-semibold">Location</th>
            <th className="pb-3 font-semibold">Capacity</th>
            <th className="pb-3 font-semibold">Allocated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {allocations.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50/50">
              <td className="py-3">
                {a.project ? (
                  <EntityLink type="project" id={a.project.id} label={a.project.name} secondary={a.project.spv_id} />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="py-3">
                {a.host ? (
                  <EntityLink type="host" id={a.host.id} label={a.host.name || "Unknown"} secondary={a.host.email} />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="py-3 text-gray-600">
                {a.project ? `${a.project.location}, ${a.project.state}` : "—"}
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

function CreditsTab({ credits }: { credits: any[] }) {
  if (credits.length === 0) {
    return <p className="text-gray-500 text-center py-12">No credits recorded for this user.</p>;
  }
  return (
    <div className="space-y-2">
      {credits.map((c) => (
        <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">
              {c.year}-{String(c.month).padStart(2, "0")} • {c.type}
            </p>
            {c.description && <p className="text-xs text-gray-500">{c.description}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">₹{Number(c.amount).toLocaleString()}</span>
            <StatusBadge status={c.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BillsTab({ bills }: { bills: any[] }) {
  if (bills.length === 0) {
    return <p className="text-gray-500 text-center py-12">No bills on file for this user.</p>;
  }
  return (
    <div className="space-y-2">
      {bills.map((b) => (
        <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">{b.bill_number || b.id.slice(0, 8)}</p>
            <p className="text-xs text-gray-500">
              {b.discom} • Due: {new Date(b.due_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">₹{Number(b.amount).toLocaleString()}</span>
            <StatusBadge status={b.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentsTab({ payments }: { payments: any[] }) {
  if (payments.length === 0) {
    return <p className="text-gray-500 text-center py-12">No payments recorded for this user.</p>;
  }
  return (
    <div className="space-y-2">
      {payments.map((p) => (
        <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">
              {p.type} • {p.transaction_id || p.id.slice(0, 8)}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(p.created_at).toLocaleDateString()} • {p.gateway || "—"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">₹{Number(p.amount).toLocaleString()}</span>
            <StatusBadge status={p.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    APPLIED: "bg-green-100 text-green-700",
    PAID: "bg-green-100 text-green-700",
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-purple-100 text-purple-700",
    OVERDUE: "bg-red-100 text-red-700",
    EXPIRED: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
