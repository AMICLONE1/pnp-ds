"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Users,
  FolderKanban,
  Wallet,
  TrendingUp,
  Activity,
  ListChecks,
  Building2,
  ArrowUpRight,
  BarChart3,
  AlertTriangle,
  Clock,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { UserGrowthChart } from "@/components/admin/charts/UserGrowthChart";
import { CapacityChart } from "@/components/admin/charts/CapacityChart";
import { GenerationChart } from "@/components/admin/charts/GenerationChart";
import DashboardSkeleton from "@/components/admin/DashboardSkeleton";

interface AdminStats {
  totalDeployedCapacity: number;
  totalCapacity: number;
  capacityUtilization: number;
  activeUsers: number;
  activeProjects: number;
  totalRevenue: number;
  waitlistCount: number;
  revenueByMonth: Array<{ month: string; year: number; value: number }>;
  userGrowthByMonth: Array<{ month: string; year: number; value: number }>;
  generationByMonth: Array<{ month: string; year: number; value: number }>;
  capacityByProject: Array<{ name: string; value: number }>;
}

const quickActions = [
  {
    label: "New Plant",
    description: "Register a new solar project",
    href: "/admin/projects",
    icon: FolderKanban,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
  },
  {
    label: "View Hosts",
    description: "Manage plant owners",
    href: "/admin/hosts",
    icon: Building2,
    gradient: "from-emerald-500 to-green-500",
    bgGradient: "from-emerald-50 to-green-50",
    borderColor: "border-emerald-200",
  },
  {
    label: "Payments",
    description: "Track revenue & billing",
    href: "/admin/payments",
    icon: IndianRupee,
    gradient: "from-purple-500 to-violet-500",
    bgGradient: "from-purple-50 to-violet-50",
    borderColor: "border-purple-200",
  },
  {
    label: "Generations",
    description: "Validate energy data",
    href: "/admin/generations",
    icon: Zap,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch stats");
        }
        setStats(result.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error || !stats) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <p className="text-red-500 font-medium">{error || "Failed to load dashboard"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 py-2.5 bg-gold text-forest rounded-xl font-medium hover:bg-gold-dark transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0D2818] via-[#1a4a2e] to-[#0D2818] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{greeting}, Admin</h1>
              <p className="text-white/60 mt-1 text-sm sm:text-base">
                Here&apos;s what&apos;s happening across your solar platform today.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl self-start">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">Live Data</span>
            </div>
          </div>

          {/* Quick summary pills inside banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-white/50 text-xs font-medium">Platform Capacity</p>
              <p className="text-xl font-bold mt-1">{stats.totalCapacity.toLocaleString()} kW</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-white/50 text-xs font-medium">Active Users</p>
              <p className="text-xl font-bold mt-1">{stats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-white/50 text-xs font-medium">Active Plants</p>
              <p className="text-xl font-bold mt-1">{stats.activeProjects}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-white/50 text-xs font-medium">Waitlist</p>
              <p className="text-xl font-bold mt-1">{stats.waitlistCount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Zap}
          label="Deployed Capacity"
          value={stats.totalDeployedCapacity}
          suffix=" kW"
          color="text-gold-dark"
          bgColor="bg-gold/10"
          delay={0}
          trend={stats.capacityUtilization}
          trendLabel={`${stats.capacityUtilization}% utilization`}
        />
        <AdminStatCard
          icon={Users}
          label="Active Users"
          value={stats.activeUsers}
          color="text-green-600"
          bgColor="bg-green-100"
          delay={0.1}
        />
        <AdminStatCard
          icon={FolderKanban}
          label="Active Projects"
          value={stats.activeProjects}
          color="text-blue-600"
          bgColor="bg-blue-100"
          delay={0.2}
        />
        <AdminStatCard
          icon={Wallet}
          label="Total Revenue"
          value={stats.totalRevenue}
          prefix="₹"
          color="text-purple-600"
          bgColor="bg-purple-100"
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={`group relative bg-gradient-to-br ${action.bgGradient} rounded-xl p-4 border ${action.borderColor} hover:shadow-md transition-all cursor-pointer`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-sm text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{action.description}</p>
                <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Operational Health */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-green-100">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <span className="font-semibold text-sm text-black">Capacity Utilization</span>
              <p className="text-xs text-gray-500">Allocated vs total</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-black">{stats.capacityUtilization}%</p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.capacityUtilization}%` }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {stats.totalDeployedCapacity.toLocaleString()} / {stats.totalCapacity.toLocaleString()} kW
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <ListChecks className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="font-semibold text-sm text-black">Waitlist Pipeline</span>
              <p className="text-xs text-gray-500">Pending signups</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-black">{stats.waitlistCount.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-3">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-gray-500 text-xs">People waiting for access</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-blue-100">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="font-semibold text-sm text-black">Total Capacity</span>
              <p className="text-xs text-gray-500">Across all plants</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-black">{stats.totalCapacity.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-3">
            <Zap className="w-3.5 h-3.5 text-gold" />
            <p className="text-gray-500 text-xs">kW available across {stats.activeProjects} projects</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="p-1.5 rounded-lg bg-purple-50">
                  <Wallet className="w-4 h-4 text-purple-600" />
                </div>
                Revenue Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={stats.revenueByMonth} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="p-1.5 rounded-lg bg-green-50">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                User Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserGrowthChart data={stats.userGrowthByMonth} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="p-1.5 rounded-lg bg-blue-50">
                  <FolderKanban className="w-4 h-4 text-blue-600" />
                </div>
                Capacity by Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CapacityChart data={stats.capacityByProject} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="p-1.5 rounded-lg bg-amber-50">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                Monthly Energy Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GenerationChart data={stats.generationByMonth} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
