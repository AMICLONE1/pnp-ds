"use client";

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
  ArrowRight, 
  Sun,
  Battery,
  Wallet,
  Clock,
  Sparkles,
  ChevronRight,
  Activity,
  Calendar,
  Target,
  Award
} from "lucide-react";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/ui/skeletons/DashboardSkeleton";
import { RealTimeMonitoring } from "@/components/features/dashboard/RealTimeMonitoring";
import { CreditHistoryChart } from "@/components/features/dashboard/CreditHistoryChart";

export const dynamic = 'force-dynamic';

interface DashboardSummary {
  totalCapacity: number;
  totalSavings: number;
  co2Offset: string;
  recentActivity: any[];
}

// Animated counter component
function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated && value === displayValue) return;
    
    const duration = 1500;
    const startTime = performance.now();
    const startValue = hasAnimated ? displayValue : 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = startValue + (value - startValue) * easeOutQuart;
      setDisplayValue(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    requestAnimationFrame(animate);
  }, [value, hasAnimated, displayValue]);

  return (
    <span>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}

// Stat card with animation
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix = "",
  prefix = "",
  color,
  bgColor,
  delay = 0,
  trend,
  trendLabel
}: {
  icon: any;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color: string;
  bgColor: string;
  delay?: number;
  trend?: number;
  trendLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden group">
        {/* Animated background gradient */}
        <div className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Decorative circles */}
        <div className={`absolute -top-8 -right-8 w-24 h-24 ${bgColor} rounded-full blur-2xl opacity-50`} />
        
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-black mb-1 flex items-center gap-2">
                {label}
                {trend !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {trend >= 0 ? '+' : ''}{trend}%
                  </span>
                )}
              </p>
              <p className={`text-3xl font-bold ${color}`}>
                <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={suffix === " kW" ? 1 : 0} />
              </p>
              {trendLabel && (
                <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>
              )}
            </div>
            <motion.div 
              className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center`}
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon className={`h-7 w-7 ${color}`} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick action button with animation
function QuickActionButton({ 
  href, 
  icon: Icon, 
  label, 
  description,
  color,
  delay = 0 
}: {
  href: string;
  icon: any;
  label: string;
  description: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link href={href}>
        <motion.div 
          className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-200/30 hover:shadow-lg transition-all cursor-pointer"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6 text-black" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-black group-hover:text-black transition-colors">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Empty state with animation
function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: {
  icon: any;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div 
        className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-gold/10 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Icon className="h-10 w-10 text-black" />
      </motion.div>
      <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-xs mx-auto">{description}</p>
      <Link href={actionHref}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="primary" className="bg-gradient-to-r from-white to-white-light">
            <Sparkles className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Allocation card with animation
function AllocationCard({ allocation, index }: { allocation: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-gray-200/30 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-orange-500 flex items-center justify-center">
            <Sun className="h-5 w-5 text-black" />
          </div>
          <div>
            <h4 className="font-semibold text-black">
              {allocation.project?.name || "Solar Project"}
            </h4>
            <p className="text-sm text-gray-500">
              {allocation.capacity_kw} kW capacity
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            allocation.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {allocation.status}
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="font-semibold text-black">{formatCurrency(allocation.monthly_fee || 0)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Savings</p>
            <p className="font-semibold text-green-600">~₹{Math.round((allocation.capacity_kw || 0) * 120 * 7)}</p>
          </div>
        </div>
        <Link href={`/reserve?project=${allocation.project_id}`}>
          <Button variant="ghost" size="sm" className="text-black hover:bg-white/10">
            Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// Welcome banner component
function WelcomeBanner() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-white-light to-white p-8 mb-8"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      
      {/* Animated sun */}
      <motion.div 
        className="absolute top-4 right-8 opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sun className="w-24 h-24 text-gold" />
      </motion.div>
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-black/70 text-sm font-medium mb-1">{greeting}! 👋</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-black mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-black/80 max-w-xl">
            Track your solar energy production, savings, and environmental impact all in one place.
          </p>
        </motion.div>
        
        {/* Quick stats */}
        <motion.div 
          className="flex flex-wrap gap-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-black/90">
            <Activity className="w-4 h-4 text-gold" />
            <span className="text-sm">System Online</span>
          </div>
          <div className="flex items-center gap-2 text-black/90">
            <Calendar className="w-4 h-4 text-gold" />
            <span className="text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
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

