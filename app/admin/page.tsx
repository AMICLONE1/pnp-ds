"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Users,
  FolderKanban,
  Wallet,
  TrendingUp,
  Activity,
  ListChecks,
  Loader2,
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 font-medium">{error || "Failed to load dashboard"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gold text-forest rounded-lg font-medium hover:bg-gold-dark transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-gray-700 mt-1">
            Overview of your solar platform performance
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
          <Activity className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Live Data</span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-100 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-medium text-black">Capacity Utilization</span>
          </div>
          <p className="text-4xl font-bold text-black">{stats.capacityUtilization}%</p>
          <p className="text-gray-500 text-sm mt-2">
            {stats.totalDeployedCapacity.toLocaleString()} / {stats.totalCapacity.toLocaleString()} kW allocated
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#FFF6E0] rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg">
              <ListChecks className="w-5 h-5 text-gold-dark" />
            </div>
            <span className="font-medium text-black">Waitlist</span>
          </div>
          <p className="text-4xl font-bold text-black">{stats.waitlistCount.toLocaleString()}</p>
          <p className="text-gray-500 text-sm mt-2">
            People waiting for access
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#EAF3FE] rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg">
              <Zap className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="font-medium text-black">Total Capacity</span>
          </div>
          <p className="text-4xl font-bold text-black">{stats.totalCapacity.toLocaleString()}</p>
          <p className="text-gray-500 text-sm mt-2">
            kW available across all projects
          </p>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="w-5 h-5 text-gold" />
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
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-green-600" />
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
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderKanban className="w-5 h-5 text-forest" />
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
          transition={{ delay: 1 }}
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-cyan-600" />
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
