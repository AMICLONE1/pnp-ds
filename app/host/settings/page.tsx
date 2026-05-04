"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  CreditCard,
  BellRing,
  LockKeyhole,
  Mail,
  User,
  Phone,
  MapPin,
  FileText,
  Loader2,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface HostProfile {
  loginEmail: string;
  businessName: string;
  businessType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  state: string;
  gstNumber: string;
  panNumber: string;
  bankName: string;
  bankIfsc: string;
  status: string;
  verifiedAt: string | null;
  ppa: {
    agreementNumber: string;
    ratePerKwh: number;
    paymentDueDay: number;
    paymentGraceDays: number;
    lateFeePercent: number;
    startDate: string;
    endDate: string;
    contractedCapacityKw: number;
    status: string;
  } | null;
  avgInvoice: number;
}

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl bg-gray-50/80 border border-gray-100 p-4">
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold text-black">{value || "—"}</p>
    </div>
  );
}

export default function HostSettingsPage() {
  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/host/profile", { credentials: "include" });
        const json = await res.json();
        if (json.success) setProfile(json.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  const p = profile;
  const ppa = p?.ppa;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1400px] mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-forest to-forest-light p-6 sm:p-8 shadow-lg"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Host account settings
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-heading">
            Portal configuration
          </h1>
          <p className="text-white/60 mt-2 max-w-2xl text-sm sm:text-base">
            Your profile, PPA terms, and billing preferences — all sourced
            from the admin-provisioned host record.
          </p>
          {p && (
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span className="text-sm font-medium text-gold">{p.loginEmail}</span>
              </div>
              {p.verifiedAt && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Verified</span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Business profile */}
        <Card className="shadow-sm border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-forest" />
              Business profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Field label="Business name" value={p?.businessName || ""} icon={Building2} />
            <Field label="Login email" value={p?.loginEmail || ""} icon={Mail} />
            <Field label="Contact name" value={p?.contactName || ""} icon={User} />
            <Field label="Contact email" value={p?.contactEmail || ""} icon={Mail} />
            <Field label="Phone" value={p?.contactPhone || ""} icon={Phone} />
            <Field label="Location" value={[p?.city, p?.state].filter(Boolean).join(", ") || ""} icon={MapPin} />
            <Field label="GST number" value={p?.gstNumber || "Not provided"} icon={FileText} />
            <Field label="PAN number" value={p?.panNumber || "Not provided"} icon={FileText} />
          </CardContent>
        </Card>

        {/* PPA & billing */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-gold" />
              PPA & billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {ppa ? (
              <>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                    Agreement
                  </p>
                  <p className="font-semibold text-black mt-1">
                    {ppa.agreementNumber}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                    Rate
                  </p>
                  <p className="font-semibold text-black mt-1">
                    {formatCurrency(ppa.ratePerKwh)}/kWh
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                    Capacity
                  </p>
                  <p className="font-semibold text-black mt-1">
                    {ppa.contractedCapacityKw} kW
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                    Payment due day
                  </p>
                  <p className="font-semibold text-black mt-1">
                    {ppa.paymentDueDay}th of every month ({ppa.paymentGraceDays} day grace)
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                    Late fee
                  </p>
                  <p className="font-semibold text-black mt-1">
                    {ppa.lateFeePercent}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                    Term
                  </p>
                  <p className="font-semibold text-black mt-1">
                    {new Date(ppa.startDate).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    —{" "}
                    {new Date(ppa.endDate).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                    Average invoice
                  </p>
                  <p className="font-semibold text-black mt-1">
                    {(p?.avgInvoice || 0) > 0
                      ? formatCurrency(p!.avgInvoice)
                      : "No payments yet"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 py-4 text-center">
                No active PPA agreement found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellRing className="w-5 h-5 text-amber-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p className="rounded-2xl bg-gray-50 p-4">
              Payment reminders, maintenance notices, and new invoice alerts
              are routed to{" "}
              <span className="font-semibold text-black">
                {p?.contactEmail || p?.loginEmail || "your registered email"}
              </span>
              .
            </p>
            <p className="rounded-2xl bg-gray-50 p-4">
              Acknowledge alerts promptly from the Alert Center. Financial
              follow-ups move into invoice history after each monthly
              settlement.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LockKeyhole className="w-5 h-5 text-forest" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p className="rounded-2xl bg-gray-50 p-4">
              Your billing amounts are computed server-side from the PPA +
              metered generation. Browser-submitted values are never accepted.
            </p>
            <p className="rounded-2xl bg-gray-50 p-4">
              Payments flow through Cashfree — PowerNetPro never stores card
              data. Password resets and account changes are handled by your
              admin.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
