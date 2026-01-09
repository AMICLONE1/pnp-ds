"use client";

import { useEffect, useState } from "react";
import { ScrollAnimation } from "@/components/features/landing/ScrollAnimation";
import { Zap, Leaf, TrendingUp, IndianRupee } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface LiveStatsData {
  totalCapacity: number; // kW
  totalEnergy: number; // kWh
  totalCredits: number; // ₹
  carbonOffset: number; // kg
}

export function LiveStats() {
  const [stats, setStats] = useState<LiveStatsData>({
    totalCapacity: 0,
    totalEnergy: 0,
    totalCredits: 0,
    carbonOffset: 0,
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
          setStats(result.data);
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

  // Return a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="py-20 bg-gradient-to-br from-forest to-forest-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Connecting people, power and planet
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="h-8 w-8 bg-gold/20 rounded mx-auto mb-4" />
                <div className="h-8 bg-white/20 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-forest to-forest-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Connecting people, power and planet
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="h-8 w-8 bg-gold/20 rounded mx-auto mb-4 animate-pulse" />
                <div className="h-8 bg-white/20 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-forest to-forest-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation direction="fade">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Connecting people, power and planet
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <ScrollAnimation direction="up" delay={0.1}>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Zap className="h-8 w-8 text-gold mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {stats.totalCapacity.toFixed(2)}kW
                </div>
                <div className="text-sm text-gray-200">Digital Solar Installed</div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.2}>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Leaf className="h-8 w-8 text-gold mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {formatNumber(stats.totalEnergy, { maximumFractionDigits: 1 })} kWh
                </div>
                <div className="text-sm text-gray-200">Clean Energy Delivered</div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.3}>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <IndianRupee className="h-8 w-8 text-gold mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {formatCurrency(stats.totalCredits)}
                </div>
                <div className="text-sm text-gray-200">Credits Generated</div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4}>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <TrendingUp className="h-8 w-8 text-gold mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {formatNumber(stats.carbonOffset, { maximumFractionDigits: 2 })} kg
                </div>
                <div className="text-sm text-gray-200">Carbon Avoided</div>
              </div>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

