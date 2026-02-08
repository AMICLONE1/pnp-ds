"use client";

export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { 
  Zap, 
  TrendingUp, 
  Leaf, 
  Plus, 
  Sun,
  Wallet,
  Target,
  Award
} from "lucide-react";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/ui/skeletons/DashboardSkeleton";
import { RealTimeMonitoring } from "@/components/features/dashboard/RealTimeMonitoring";
import { CreditHistoryChart } from "@/components/features/dashboard/CreditHistoryChart";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import EmptyState from "@/components/dashboard/EmptyState";
import StatCard from "@/components/dashboard/StatCard";
import QuickActionButton from "@/components/dashboard/QuickActionButton";
import AllocationCard from "@/components/dashboard/AllocationCard";


interface DashboardSummary {
  totalCapacity: number;
  totalSavings: number;
  co2Offset: string;
  recentActivity: any[];
}

export default function DashboardPage() {
  const { showToast } = useToast();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, allocationsRes] = await Promise.all([
          fetch("/api/dashboard/summary", { credentials: "include" }),
          fetch("/api/allocations", { credentials: "include" }),
        ]);

        // Check if responses are ok
        if (!summaryRes.ok || !allocationsRes.ok) {
          if (summaryRes.status === 401 || allocationsRes.status === 401) {
            showToast("error", "Please log in to view your dashboard.");
          } else {
            showToast("error", "Failed to load dashboard data. Please try again.");
          }
          throw new Error("Failed to fetch dashboard data");
        }

        const summaryData = await summaryRes.json();
        const allocationsData = await allocationsRes.json();

        if (summaryData.success) {
          setSummary(summaryData.data);
        }
        if (allocationsData.success) {
          setAllocations(allocationsData.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default values to prevent blank page
        setSummary({
          totalCapacity: 0,
          totalSavings: 0,
          co2Offset: "0",
          recentActivity: [],
        });
        setAllocations([]);
      } finally {
        // Hide loading immediately after data is fetched
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-20">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={Zap}
              label="Total Capacity"
              value={summary?.totalCapacity || 0}
              suffix=" kW"
              color="text-black"
              bgColor="bg-white/10"
              delay={0.1}
              trend={12}
              trendLabel="Reserved solar capacity"
            />
            <StatCard
              icon={Wallet}
              label="Total Saved"
              value={summary?.totalSavings || 0}
              prefix="₹"
              color="text-green-600"
              bgColor="bg-green-100"
              delay={0.2}
              trend={8}
              trendLabel="Lifetime savings"
            />
            <StatCard
              icon={Leaf}
              label="CO₂ Offset"
              value={parseFloat(summary?.co2Offset || "0")}
              suffix=" tons"
              color="text-black"
              bgColor="bg-emerald-100"
              delay={0.3}
              trendLabel="Environmental impact"
            />
          </div>

          {/* Real-Time Monitoring */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RealTimeMonitoring />
          </motion.div>

          {/* Quick Actions & Allocations */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white to-white-light flex items-center justify-center">
                      <Target className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Manage your solar journey</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <QuickActionButton
                    href="/reserve"
                    icon={Plus}
                    label="Add More Capacity"
                    description="Expand your solar portfolio"
                    color="bg-gradient-to-br from-white to-white-light"
                    delay={0.6}
                  />
                  <QuickActionButton
                    href="/connect"
                    icon={Zap}
                    label="Connect Utility"
                    description="Link your electricity provider"
                    color="bg-gradient-to-br from-gold to-orange-500"
                    delay={0.7}
                  />
                  <QuickActionButton
                    href="/bills"
                    icon={Wallet}
                    label="View Bills"
                    description="Track payments and credits"
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    delay={0.8}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Allocations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-orange-500 flex items-center justify-center">
                        <Sun className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <CardTitle>Your Allocations</CardTitle>
                        <CardDescription>Active solar capacity</CardDescription>
                      </div>
                    </div>
                    {allocations.length > 0 && (
                      <Link href="/reserve">
                        <Button variant="ghost" size="sm" className="text-black">
                          View All
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {allocations.length === 0 ? (
                    <EmptyState
                      icon={Sun}
                      title="No Allocations Yet"
                      description="Start your solar journey by reserving capacity from one of our projects."
                      actionLabel="Reserve Capacity"
                      actionHref="/reserve"
                    />
                  ) : (
                    <div className="space-y-4">
                      {allocations.slice(0, 3).map((allocation, index) => (
                        <AllocationCard 
                          key={allocation.id} 
                          allocation={allocation} 
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Credit History Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <CreditHistoryChart />
          </motion.div>

          {/* Recent Activity */}
          <AnimatePresence>
            {summary?.recentActivity && summary.recentActivity.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 1 }}
                className="mt-8"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <Award className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest solar credits</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {summary.recentActivity.map((activity: any, index: number) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-100"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-black">
                                Credit Applied
                              </p>
                              <p className="text-sm text-black">
                                {new Date(activity.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-lg">
                              +{formatCurrency(activity.amount)}
                            </p>
                            {activity.generation_kwh && (
                              <p className="text-xs text-gray-500">
                                {activity.generation_kwh} kWh generated
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}