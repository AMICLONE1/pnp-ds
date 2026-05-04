"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, BarChart3, ArrowRight, Sparkles, Clock } from "lucide-react";
import Link from "next/link";

interface DailyCredit {
  date: string;
  kwh: number;
  amount: number;
}

interface DailyResponse {
  days: DailyCredit[];
  hasAllocations: boolean;
}

export function CreditHistoryChart() {
  const [days, setDays] = useState<DailyCredit[]>([]);
  const [hasAllocations, setHasAllocations] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/credits/daily", { credentials: "include" });
        if (!response.ok) {
          throw new Error("Failed to fetch credits");
        }

        const result = await response.json();
        if (result.success && result.data) {
          const data = result.data as DailyResponse;
          setDays(data.days || []);
          setHasAllocations(!!data.hasAllocations);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle>Credit History</CardTitle>
              <CardDescription>Daily solar credits</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex flex-col items-center justify-center">
            <motion.div
              className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-4 text-sm text-gray-500">Loading credit history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (days.length === 0) {
    const title = hasAllocations ? "Generating Soon" : "No Credits Yet";
    const message = hasAllocations
      ? "Your plant hasn't reported a daily reading yet. Credits will appear here as soon as it goes live and starts generating."
      : "Your solar credits will appear here once you reserve capacity and start generating energy.";

    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle>Credit History</CardTitle>
              <CardDescription>Daily solar credits</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 text-center"
          >
            <div className="flex items-end justify-center gap-2 h-24 mb-6">
              {[40, 65, 45, 80, 55, 70].map((height, i) => (
                <motion.div
                  key={i}
                  className="w-8 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                />
              ))}
            </div>

            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="h-8 w-8 text-green-600" />
            </motion.div>

            <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">{message}</p>

            {!hasAllocations && (
              <Link href="/reserve">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Earning Credits
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const maxAmount = Math.max(...days.map((d) => d.amount), 0.01);
  const totalAmount = days.reduce((s, d) => s + d.amount, 0);
  const totalKwh = days.reduce((s, d) => s + d.kwh, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle>Credit History</CardTitle>
              <CardDescription>Daily solar credits · last {days.length} day{days.length === 1 ? "" : "s"}</CardDescription>
            </div>
          </div>
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Energy generated</p>
            <p className="text-base font-bold text-black">
              {totalKwh.toLocaleString("en-IN", { maximumFractionDigits: 1 })} kWh
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Credit value</p>
            <p className="text-base font-bold text-green-700">{formatCurrency(Math.round(totalAmount))}</p>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {[...days].reverse().map((d) => {
            const label = new Date(d.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            });
            const percentage = (d.amount / maxAmount) * 100;

            return (
              <div key={d.date} className="space-y-1">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-gray-700 font-medium w-16">{label}</span>
                  <span className="text-gray-500 flex-1 text-right pr-2">
                    {d.kwh.toLocaleString("en-IN", { maximumFractionDigits: 2 })} kWh
                  </span>
                  <span className="font-semibold text-black w-20 text-right">
                    {formatCurrency(Math.round(d.amount))}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
