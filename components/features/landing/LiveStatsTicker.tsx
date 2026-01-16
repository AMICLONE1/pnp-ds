"use client";

import { useEffect, useState } from "react";
import { Zap, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface LiveStatsTickerData {
  savedToday: number;
  generatedToday: number;
}

export function LiveStatsTicker() {
  const [stats, setStats] = useState<LiveStatsTickerData>({
    savedToday: 245678,
    generatedToday: 1234,
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats/live");
        const result = await response.json();
        if (result.success) {
          // Calculate daily stats (simplified - in real app, calculate from actual data)
          setStats({
            savedToday: result.data.totalCredits || 245678,
            generatedToday: result.data.totalEnergy || 1234,
          });
        }
      } catch (error) {
        console.error("Error fetching live stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Return empty div during SSR to prevent hydration mismatch
  if (!mounted) {
    return <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/20 py-3" aria-hidden="true" />;
  }

  if (loading) {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/20 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base">
            <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/20 py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base">
          <div className="flex items-center gap-2 text-black">
            <Zap className="h-4 w-4 text-gold animate-pulse" />
            <span className="font-semibold">
              ₹{formatCurrency(stats.savedToday)} saved today
            </span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/30" />
          <div className="flex items-center gap-2 text-black">
            <TrendingUp className="h-4 w-4 text-gold animate-pulse" />
            <span className="font-semibold">
              {formatNumber(stats.generatedToday)} kWh generated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

