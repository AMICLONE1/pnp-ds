"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  ArrowRight,
  ShieldAlert,
  TriangleAlert,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/host/SeverityBadge";

interface HostAlert {
  id: string;
  title: string;
  message: string;
  severity: "INFO" | "WARNING" | "CRITICAL" | string;
  status: string;
  category: string;
  projectId: string | null;
  createdAt: string;
  time: string;
}

export default function HostAlertsPage() {
  const [alerts, setAlerts] = useState<HostAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/host/alerts", { credentials: "include" });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load alerts");
        }
        setAlerts(json.data.alerts || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const warningCount = alerts.filter(
    (a) => a.severity === "WARNING" || a.severity === "CRITICAL"
  ).length;
  const paymentCount = alerts.filter((a) => a.category === "PAYMENT").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50/50 to-white p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-700">
              <Bell className="h-4 w-4" />
              Host Alert Center
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-black font-heading">
                Live generation, maintenance, and payment signals.
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-600">
                Alerts stream from the Trillectric inverter fault detection and
                the host billing ledger.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/host/financials"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black/85"
            >
              Open Financials
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/host/plants"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-50"
            >
              Review Plants
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total Alerts
              </p>
              <p className="mt-2 text-3xl font-bold text-black">{alerts.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <Bell className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Warnings / Critical
              </p>
              <p className="mt-2 text-3xl font-bold text-black">{warningCount}</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <TriangleAlert className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment Related
              </p>
              <p className="mt-2 text-3xl font-bold text-black">{paymentCount}</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-3 text-green-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-black">
            <Bell className="h-5 w-5 text-amber-500" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              Loading alerts...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Could not load alerts</p>
                <p className="mt-1 text-red-600/90">{error}</p>
              </div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center text-sm text-gray-500">
              No active alerts. Your fleet is healthy.
            </div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge
                      severity={
                        (alert.severity === "CRITICAL" ||
                        alert.severity === "WARNING" ||
                        alert.severity === "INFO"
                          ? alert.severity
                          : "INFO") as "INFO" | "WARNING" | "CRITICAL"
                      }
                    />
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {alert.category}
                    </span>
                    {alert.status !== "ACTIVE" && (
                      <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                        {alert.status}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-black">
                      {alert.title}
                    </h3>
                    <p className="mt-1 max-w-3xl text-sm text-gray-600">
                      {alert.message}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                  {alert.time}
                </span>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
