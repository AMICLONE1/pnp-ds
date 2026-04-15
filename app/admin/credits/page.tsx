"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    IndianRupee,
    Search,
    Filter,
    RefreshCw,
    Calendar,
    Mail,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useCredits } from "@/lib/utils/admin/useCredits";

export default function AdminCreditsPage() {
    const {
        entries,
        stats,
        pagination,
        loading,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        fetchCredits,
        handleSearch,
        formatCurrency,
        formatDate,
        getStatusBadge,
        getTypeBadge,
    } = useCredits();

    // Skeleton loading
    if (loading && entries.length === 0) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-gray-100 rounded-lg" />
                    <div className="h-10 w-32 bg-gray-100 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                    ))}
                </div>
                <div className="h-12 w-full bg-gray-100 rounded-xl" />
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-gray-100 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-black">
                        Credit Ledger
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Track user credits allocation and application
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchCredits(1)}
                    className="flex items-center gap-2 w-full sm:w-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </motion.div>

            {/* Stat Cards */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Pending</p>
                                <p className="text-2xl font-bold text-black mt-2">
                                    {formatCurrency(stats.totalPending)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <IndianRupee className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Applied</p>
                                <p className="text-2xl font-bold text-black mt-2">
                                    {formatCurrency(stats.totalApplied)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <IndianRupee className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Expired</p>
                                <p className="text-2xl font-bold text-black mt-2">
                                    {formatCurrency(stats.totalExpired)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <IndianRupee className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Active Users</p>
                                <p className="text-2xl font-bold text-black mt-2">
                                    {stats.activeUsers}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold text-blue-600">👥</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4">
                            {/* Search Bar */}
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col sm:flex-row gap-3"
                            >
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by user name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    className="px-5"
                                >
                                    <Search className="w-4 h-4 mr-1.5" />
                                    Search
                                </Button>
                            </form>

                            {/* Filter Tabs */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="APPLIED">Applied</option>
                                        <option value="EXPIRED">Expired</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                        Type
                                    </label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="GENERATION">Generation</option>
                                        <option value="ADJUSTMENT">Adjustment</option>
                                        <option value="REFUND">Refund</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => fetchCredits(1)}
                                        className="w-full sm:w-auto"
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Credits Table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden lg:block"
            >
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Period
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {entries.map((entry, index) => {
                                    const statusBadge = getStatusBadge(entry.status);
                                    const typeBadge = getTypeBadge(entry.type);
                                    const period = entry.month && entry.year ? `${entry.month}/${entry.year}` : "—";

                                    return (
                                        <motion.tr
                                            key={entry.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium text-black">
                                                        {entry.user_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {entry.user_email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm font-medium text-black">
                                                    <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                                                    {formatCurrency(entry.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeBadge.bg} ${typeBadge.text}`}
                                                >
                                                    {typeBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                                                >
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600">{period}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 max-w-xs truncate">
                                                    {entry.description || "—"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {formatDate(entry.created_at)}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {entries.length === 0 && (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 text-sm">No credit ledger entries found</p>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between"
                >
                    <div className="text-sm text-gray-600">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                        {pagination.total} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => fetchCredits(pagination.page - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {[...Array(pagination.totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            if (
                                pageNum === 1 ||
                                pageNum === pagination.totalPages ||
                                (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                            ) {
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === pagination.page ? "primary" : "outline"}
                                        size="sm"
                                        onClick={() => fetchCredits(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            } else if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                                return (
                                    <span key={pageNum} className="text-gray-400">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => fetchCredits(pagination.page + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
