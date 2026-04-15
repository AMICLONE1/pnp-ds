"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { GenerationTrendChart } from "@/components/admin/charts/GenerationTrendChart";
import { MiniGenerationChart } from "@/components/admin/charts/MiniGenerationChart";
import { useGenerations } from "@/lib/utils/admin/useGenerations";
import type { ChartPeriod } from "@/lib/data/generations";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import {
    Zap,
    Sun,
    CalendarDays,
    Wallet,
    FolderKanban,
    Gauge,
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Eye,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MapPin,
    Calendar,
    AlertTriangle,
    AlertCircle,
    Info,
    TreePine,
    Leaf,
    Wind,
    Activity,
    Clock,
    Wrench,
    TrendingUp,
    BarChart3,
    Loader2,
} from "lucide-react";

// Skeleton component
function GenerationsSkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
                ))}
            </div>
            <div className="h-96 bg-gray-100 rounded-2xl" />
            <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
    );
}

// Error state
function ErrorState({ message }: { message: string }) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-8 flex flex-col items-center text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Something went wrong</h3>
                    <p className="text-sm text-red-600">{message}</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Retry
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminGenerationsPage() {
    const {
        stats,
        impact,
        projects,
        alerts,
        pagination,
        loading,
        error,
        chartPeriod,
        setChartPeriod,
        currentTrendData,
        chartUnit,
        statusFilter,
        handleStatusFilter,
        searchQuery,
        setSearchQuery,
        sortColumn,
        sortDirection,
        handleSort,
        handleSearch,
        fetchPage,
        selectedProject,
        handleViewProject,
        handleCloseDrawer,
        formatDate,
        formatCurrency,
        formatEnergy,
        formatCapacity,
        getStatusBadge,
        formatTimestamp,
    } = useGenerations();

    if (loading) return <GenerationsSkeleton />;
    if (error) return <ErrorState message={error} />;

    const SortIcon = ({ column }: { column: string }) => {
        if (sortColumn !== column) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
        return sortDirection === "asc" ? (
            <ArrowUp className="w-3 h-3 text-green-600" />
        ) : (
            <ArrowDown className="w-3 h-3 text-green-600" />
        );
    };

    const severityConfig = {
        critical: { icon: AlertCircle, bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
        warning: { icon: AlertTriangle, bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
        info: { icon: Info, bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
    };

    const periods: { key: ChartPeriod; label: string }[] = [
        { key: "daily", label: "Daily" },
        { key: "weekly", label: "Weekly" },
        { key: "monthly", label: "Monthly" },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <AdminPageHeader
                title="Generation Management"
                subtitle="Monitor solar generation, performance, and environmental impact"
                breadcrumbs={[
                    { label: "Admin", href: "/admin" },
                    { label: "Generations" },
                ]}
                badge={
                    <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full">
                        {stats.activeProjects} Active Projects
                    </span>
                }
            />

            {/* Summary Stats Cards — 6 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <AdminStatCard icon={Zap} label="Total Energy" value={stats.totalEnergy} suffix=" MWh" color="text-green-600" bgColor="bg-green-100" delay={0} trend={stats.totalEnergyChange} trendLabel={`+${stats.totalEnergyChange}% vs last month`} />
                <AdminStatCard icon={Sun} label="Today's Generation" value={stats.todayGeneration} suffix=" kWh" color="text-yellow-600" bgColor="bg-yellow-100" delay={0.05} trend={stats.todayChange} trendLabel={`+${stats.todayChange}% vs yesterday`} />
                <AdminStatCard icon={CalendarDays} label="This Month" value={stats.monthGeneration} suffix=" MWh" color="text-blue-600" bgColor="bg-blue-100" delay={0.1} trend={stats.monthChange} trendLabel={`+${stats.monthChange}% vs last month`} />
                <AdminStatCard icon={Wallet} label="Revenue" value={stats.totalRevenue} prefix="₹" color="text-purple-600" bgColor="bg-purple-100" delay={0.15} trend={stats.revenueChange} trendLabel={`+${stats.revenueChange}%`} />
                <AdminStatCard icon={FolderKanban} label="Active Projects" value={stats.activeProjects} color="text-emerald-600" bgColor="bg-emerald-100" delay={0.2} trend={stats.activeChange} trendLabel="No change" />
                <AdminStatCard icon={Gauge} label="Avg. PR" value={stats.avgPerformanceRatio} suffix="%" color="text-orange-600" bgColor="bg-orange-100" delay={0.25} trend={stats.prChange} trendLabel={`+${stats.prChange}%`} decimals={1} />
            </div>

            {/* Generation Trend Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BarChart3 className="w-5 h-5 text-green-600" />
                                Generation Overview
                            </CardTitle>
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                                {periods.map((p) => (
                                    <button
                                        key={p.key}
                                        onClick={() => setChartPeriod(p.key)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${chartPeriod === p.key ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <GenerationTrendChart data={currentTrendData} unit={chartUnit} />
                    </CardContent>
                </Card>
            </motion.div>

            {/* Search & Filters */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by project name, location, or state..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => handleStatusFilter(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="offline">Offline</option>
                                </select>
                                <Button type="submit" variant="primary" size="sm" className="px-5">
                                    <Search className="w-4 h-4 mr-1.5" /> Search
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => { setSearchQuery(""); handleStatusFilter("all"); }}>
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Project Performance Table — Desktop */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="hidden lg:block">
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {[
                                        { col: "name" as const, label: "Project Name" },
                                        { col: "capacity" as const, label: "Capacity" },
                                        { col: "todayGeneration" as const, label: "Today" },
                                        { col: "monthlyGeneration" as const, label: "Monthly" },
                                        { col: "lifetimeGeneration" as const, label: "Lifetime" },
                                        { col: "performanceRatio" as const, label: "PR %" },
                                        { col: "status" as const, label: "Status" },
                                    ].map(({ col, label }) => (
                                        <th
                                            key={col}
                                            className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                                            onClick={() => handleSort(col)}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                {label} <SortIcon column={col} />
                                            </span>
                                        </th>
                                    ))}
                                    <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {projects.map((project, index) => {
                                    const badge = getStatusBadge(project.status);
                                    return (
                                        <motion.tr
                                            key={project.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-black">{project.name}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}, {project.state}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4"><span className="text-sm font-medium text-black">{formatCapacity(project.installedCapacity)}</span></td>
                                            <td className="px-5 py-4"><span className="text-sm text-gray-700">{formatEnergy(project.todayGeneration)}</span></td>
                                            <td className="px-5 py-4"><span className="text-sm text-gray-700">{formatEnergy(project.monthlyGeneration)}</span></td>
                                            <td className="px-5 py-4"><span className="text-sm font-medium text-black">{project.lifetimeGeneration.toLocaleString("en-IN")} MWh</span></td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${project.performanceRatio >= 80 ? "bg-green-500" : project.performanceRatio >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                                                            style={{ width: `${Math.min(project.performanceRatio, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{project.performanceRatio}%</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => handleViewProject(project)}
                                                        className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all"
                                                        title="View details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {projects.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <FolderKanban className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">No projects found</p>
                                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Project Cards — Mobile */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:hidden space-y-3">
                {projects.map((project, index) => {
                    const badge = getStatusBadge(project.status);
                    return (
                        <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-black text-sm">{project.name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{project.location}, {project.state}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />{badge.label}
                                            </span>
                                            <button onClick={() => handleViewProject(project)} className="p-1.5 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <p className="text-xs text-gray-500">Today</p>
                                            <p className="text-sm font-semibold text-black">{formatEnergy(project.todayGeneration)}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <p className="text-xs text-gray-500">Monthly</p>
                                            <p className="text-sm font-semibold text-black">{formatEnergy(project.monthlyGeneration)}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <p className="text-xs text-gray-500">PR</p>
                                            <p className="text-sm font-semibold text-black">{project.performanceRatio}%</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                        <span>{formatCapacity(project.installedCapacity)}</span>
                                        <span className="font-medium text-black">{project.lifetimeGeneration.toLocaleString("en-IN")} MWh lifetime</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
                {projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <FolderKanban className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No projects found</p>
                    </div>
                )}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium text-black">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                        <span className="font-medium text-black">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
                        <span className="font-medium text-black">{pagination.total}</span> projects
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => fetchPage(pagination.page - 1)} disabled={pagination.page <= 1} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            <ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline">Previous</span>
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (pagination.totalPages <= 5) pageNum = i + 1;
                                else if (pagination.page <= 3) pageNum = i + 1;
                                else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                                else pageNum = pagination.page - 2 + i;
                                return (
                                    <button key={pageNum} onClick={() => fetchPage(pageNum)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${pageNum === pagination.page ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button onClick={() => fetchPage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            <span className="hidden sm:inline">Next</span><ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Alerts Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Generation Alerts
                            <span className="ml-auto text-xs font-normal text-gray-400">{alerts.length} alerts</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {alerts.map((alert, index) => {
                                const config = severityConfig[alert.severity];
                                const Icon = config.icon;
                                return (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                        className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg ${config.bg} mt-0.5`}>
                                            <Icon className={`w-4 h-4 ${config.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-sm font-medium text-black">{alert.projectName}</p>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.text}`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{alert.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                                            <Clock className="w-3 h-3" />{formatTimestamp(alert.timestamp)}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Environmental Impact */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                <Card className="shadow-sm overflow-hidden">
                    <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 sm:p-8">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                        <div className="relative">
                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                <Leaf className="w-5 h-5" /> Environmental Impact
                            </h3>
                            <p className="text-green-100 text-sm mb-6">Our contribution to a cleaner planet</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-white/20 rounded-lg"><Wind className="w-5 h-5 text-white" /></div>
                                        <span className="text-green-100 text-sm">CO₂ Offset</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{impact.co2Offset.toLocaleString("en-IN")}</p>
                                    <p className="text-green-200 text-sm mt-1">tons of CO₂</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-white/20 rounded-lg"><TreePine className="w-5 h-5 text-white" /></div>
                                        <span className="text-green-100 text-sm">Trees Equivalent</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{impact.treesPlanted.toLocaleString("en-IN")}</p>
                                    <p className="text-green-200 text-sm mt-1">trees planted</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-white/20 rounded-lg"><Zap className="w-5 h-5 text-white" /></div>
                                        <span className="text-green-100 text-sm">Clean Energy</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{impact.cleanEnergyPercent}%</p>
                                    <p className="text-green-200 text-sm mt-1">contribution</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* === Project Details Drawer === */}
            <AnimatePresence>
                {selectedProject && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40" onClick={handleCloseDrawer} />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-xl overflow-y-auto"
                        >
                            {/* Drawer Header */}
                            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-black">{selectedProject.name}</h2>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{selectedProject.location}, {selectedProject.state}</p>
                                    </div>
                                    <button onClick={handleCloseDrawer} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Project Overview */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><FolderKanban className="w-3.5 h-3.5" /> Project Overview</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-gray-500">Capacity</span><p className="font-medium text-black">{formatCapacity(selectedProject.installedCapacity)}</p></div>
                                        <div><span className="text-gray-500">Installed</span><p className="font-medium text-black">{formatDate(selectedProject.installDate)}</p></div>
                                        <div><span className="text-gray-500">Status</span><p className="font-medium text-black">{(() => { const b = getStatusBadge(selectedProject.status); return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${b.bg} ${b.text}`}><span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />{b.label}</span>; })()}</p></div>
                                        <div><span className="text-gray-500">Lifetime</span><p className="font-medium text-black">{selectedProject.lifetimeGeneration.toLocaleString("en-IN")} MWh</p></div>
                                    </div>
                                </div>

                                {/* Daily Generation Chart */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Daily Generation (Last 7 days)</h3>
                                    <MiniGenerationChart labels={selectedProject.dailyData.map((d) => d.date)} values={selectedProject.dailyData.map((d) => d.value)} color="#4CAF50" unit="kWh" />
                                </div>

                                {/* Monthly Generation Chart */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Monthly Generation</h3>
                                    <MiniGenerationChart labels={selectedProject.monthlyData.map((d) => d.month)} values={selectedProject.monthlyData.map((d) => d.value)} color="#FFB800" unit="kWh" />
                                </div>

                                {/* Performance Metrics */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Gauge className="w-3.5 h-3.5" /> Performance Metrics</h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Performance Ratio", value: `${selectedProject.performanceRatio}%`, pct: selectedProject.performanceRatio, color: selectedProject.performanceRatio >= 80 ? "bg-green-500" : selectedProject.performanceRatio >= 70 ? "bg-yellow-500" : "bg-red-500" },
                                            { label: "CUF", value: `${selectedProject.cuf}%`, pct: selectedProject.cuf * 4, color: "bg-blue-500" },
                                            { label: "Downtime", value: `${selectedProject.downtime}%`, pct: selectedProject.downtime * 10, color: selectedProject.downtime <= 2 ? "bg-green-500" : selectedProject.downtime <= 5 ? "bg-yellow-500" : "bg-red-500" },
                                        ].map((m) => (
                                            <div key={m.label}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">{m.label}</span>
                                                    <span className="font-medium text-black">{m.value}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${m.color}`} style={{ width: `${Math.min(m.pct, 100)}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Revenue */}
                                <div className="flex items-center justify-between bg-purple-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg"><Wallet className="w-5 h-5 text-purple-600" /></div>
                                        <div>
                                            <p className="text-xs text-gray-500">Revenue from Project</p>
                                            <p className="text-lg font-bold text-black">{formatCurrency(selectedProject.revenue)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Alerts */}
                                {selectedProject.alerts.length > 0 && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Recent Alerts</h3>
                                        {selectedProject.alerts.map((a) => (
                                            <div key={a.id} className="text-sm text-gray-600 py-1">{a.message}</div>
                                        ))}
                                    </div>
                                )}

                                {/* Maintenance History */}
                                {selectedProject.maintenanceHistory.length > 0 && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Wrench className="w-3.5 h-3.5" /> Maintenance History</h3>
                                        <div className="space-y-3">
                                            {selectedProject.maintenanceHistory.map((m) => (
                                                <div key={m.id} className="flex items-start gap-3">
                                                    <div className={`mt-0.5 w-2 h-2 rounded-full ${m.status === "completed" ? "bg-green-500" : m.status === "in-progress" ? "bg-yellow-500" : "bg-blue-500"}`} />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-black">{m.type}</p>
                                                            <span className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded ${m.status === "completed" ? "bg-green-100 text-green-700" : m.status === "in-progress" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{m.status}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500">{m.description}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(m.date)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
