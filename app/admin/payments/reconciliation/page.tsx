"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap, Users, Wallet, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { AdminPageHeader, StatPill } from "@/components/admin/shared/AdminPageHeader";

interface Reconciliation {
  generation: {
    totalKwh: number;
    validatedKwh: number;
    validationPercent: number;
    hostSideValue: number;
  };
  credits: { earned: number; applied: number; pending: number };
  bills: { totalBilled: number; creditsUsed: number; count: number };
  payments: { byType: Record<string, number>; total: number };
  reconciliation: {
    hostVsCreditsDelta: number;
    creditsEarnedVsAppliedDelta: number;
    isBalanced: boolean;
  };
}

export default function ReconciliationPage() {
  const [data, setData] = useState<Reconciliation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reconciliation")
      .then((r) => r.json())
      .then((r) => {
        if (r.success) setData(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-red-600">Failed to load reconciliation data</div>;
  }

  const { generation, credits, bills, payments, reconciliation } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <AdminPageHeader
        title="Reconciliation"
        subtitle="End-to-end financial trace: generation → host value → user credits → bills"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Payments", href: "/admin/payments" },
          { label: "Reconciliation" },
        ]}
        badge={
          reconciliation.isBalanced ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Balanced
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
              <AlertTriangle className="w-3 h-3" /> Discrepancy
            </span>
          )
        }
      />

      {/* Flow diagram */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Money Flow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          <FlowBox
            icon={<Zap className="w-5 h-5 text-gold-dark" />}
            label="Generation"
            value={`${generation.totalKwh.toLocaleString()} kWh`}
            subtitle={`${generation.validationPercent}% validated`}
            color="bg-gold/10"
          />
          <ArrowCell />
          <FlowBox
            icon={<Wallet className="w-5 h-5 text-green-600" />}
            label="Host Value"
            value={`₹${generation.hostSideValue.toLocaleString()}`}
            subtitle="kWh × project rate"
            color="bg-green-50"
          />
          <ArrowCell />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center mt-3">
          <FlowBox
            icon={<Users className="w-5 h-5 text-purple-600" />}
            label="Credits Earned"
            value={`₹${credits.earned.toLocaleString()}`}
            subtitle="User ledger"
            color="bg-purple-50"
          />
          <ArrowCell />
          <FlowBox
            icon={<Wallet className="w-5 h-5 text-blue-600" />}
            label="Applied to Bills"
            value={`₹${credits.applied.toLocaleString()}`}
            subtitle={`${bills.count} bills`}
            color="bg-blue-50"
          />
          <ArrowCell hidden />
        </div>
      </div>

      {/* Deltas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`rounded-2xl p-6 border ${
            Math.abs(reconciliation.hostVsCreditsDelta) < 1
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <AlertTriangle className="w-4 h-4" />
            Host Value vs. Credits Earned
          </div>
          <p className="text-3xl font-bold mt-2">
            ₹{Math.abs(reconciliation.hostVsCreditsDelta).toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {reconciliation.hostVsCreditsDelta > 0
              ? "Host value exceeds user credits (under-credited)"
              : reconciliation.hostVsCreditsDelta < 0
              ? "User credits exceed host value (over-credited)"
              : "Perfectly balanced"}
          </p>
        </div>
        <div
          className={`rounded-2xl p-6 border ${
            credits.pending === 0 ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <Wallet className="w-4 h-4" />
            Credits Pending Application
          </div>
          <p className="text-3xl font-bold mt-2">₹{credits.pending.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">
            Earned but not yet applied to any bill
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPill label="Total Billed" value={`₹${bills.totalBilled.toLocaleString()}`} />
        <StatPill label="Credits Used on Bills" value={`₹${bills.creditsUsed.toLocaleString()}`} />
        <StatPill label="Total Payments" value={`₹${payments.total.toLocaleString()}`} />
        <StatPill label="Bills Issued" value={bills.count} />
      </div>

      {/* Payment breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Payments by Type
        </h3>
        <div className="space-y-2">
          {Object.entries(payments.byType).map(([type, amount]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">{type}</span>
              <span className="text-sm font-bold">₹{amount.toLocaleString()}</span>
            </div>
          ))}
          {Object.keys(payments.byType).length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No completed payments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function FlowBox({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl p-4 border border-gray-200 ${color}`}>
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {icon} {label}
      </div>
      <p className="text-xl font-bold mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function ArrowCell({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex items-center justify-center">
      {!hidden && <ArrowRight className="w-6 h-6 text-gray-300" />}
    </div>
  );
}
