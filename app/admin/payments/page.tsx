"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { PaymentRevenueChart } from "@/components/admin/charts/PaymentRevenueChart";
import { revenueByMonth } from "@/lib/data/paymentsMockData";
import { usePayments } from "@/lib/utils/admin/usePayments";
import {
    Wallet,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    Filter,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Eye,
    RotateCcw,
    X,
    Download,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    CreditCard,
    User,
    FolderKanban,
    Calendar,
    Hash,
    Loader2,
    Zap,
    Receipt,
} from "lucide-react";

export default function AdminPaymentsPage() {
    const {
        activeTab,
        handleTabChange,
        stats,
        transactions,
        electricityBills,
        pagination,
        statusFilter,
        handleStatusFilter,
        searchQuery,
        setSearchQuery,
        sortColumn,
        sortDirection,
        handleSort,
        handleSearch,
        fetchPage,
        selectedTransaction,
        handleViewTransaction,
        handleCloseDrawer,
        showRefundModal,
        refundTransaction,
        refundAmount,
        setRefundAmount,
        refundReason,
        setRefundReason,
        handleOpenRefund,
        handleCloseRefund,
        handleConfirmRefund,
        actionLoading,
        formatDate,
        formatCurrency,
        getStatusBadge,
        getBillStatusBadge,
    } = usePayments();

    // Sort icon helper
    const SortIcon = ({ column }: { column: string }) => {
        if (sortColumn !== column) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
        return sortDirection === "asc" ? (
            <ArrowUp className="w-3 h-3 text-gold-dark" />
        ) : (
            <ArrowDown className="w-3 h-3 text-gold-dark" />
        );
    };

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
                        Payment Management
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Track revenue, transactions, and billing
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
                    <Wallet className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                        {pagination.total} Transactions
                    </span>
                </div>
            </motion.div>

            {/* Summary Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <AdminStatCard
                    icon={Wallet}
                    label="Total Revenue"
                    value={stats.totalRevenue}
                    prefix="₹"
                    color="text-purple-600"
                    bgColor="bg-purple-100"
                    delay={0}
                    trend={stats.totalRevenueChange}
                    trendLabel={`${stats.totalRevenueChange > 0 ? "+" : ""}${stats.totalRevenueChange}% from last month`}
                />
                <AdminStatCard
                    icon={CheckCircle2}
                    label="Successful Payments"
                    value={stats.successfulPayments}
                    color="text-green-600"
                    bgColor="bg-green-100"
                    delay={0.1}
                    trend={stats.successfulChange}
                    trendLabel={`${stats.successfulChange > 0 ? "+" : ""}${stats.successfulChange}% from last month`}
                />
                <AdminStatCard
                    icon={Clock}
                    label="Pending Payments"
                    value={stats.pendingPayments}
                    color="text-yellow-600"
                    bgColor="bg-yellow-100"
                    delay={0.2}
                    trend={stats.pendingChange}
                    trendLabel={`${stats.pendingChange > 0 ? "+" : ""}${stats.pendingChange}% from last month`}
                />
                <AdminStatCard
                    icon={XCircle}
                    label="Failed Payments"
                    value={stats.failedPayments}
                    color="text-red-600"
                    bgColor="bg-red-100"
                    delay={0.3}
                    trend={stats.failedChange}
                    trendLabel={`${stats.failedChange > 0 ? "+" : ""}${stats.failedChange}% from last month`}
                />
            </div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Wallet className="w-5 h-5 text-gold" />
                            Revenue Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PaymentRevenueChart data={revenueByMonth} />
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2"
            >
                <button
                    onClick={() => handleTabChange("transactions")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "transactions"
                            ? "bg-gold text-black shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        All Transactions
                    </span>
                </button>
                <button
                    onClick={() => handleTabChange("bills")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "bills"
                            ? "bg-gold text-black shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Electricity Bills
                    </span>
                </button>
            </motion.div>

            {/* === Transactions Tab === */}
            {activeTab === "transactions" && (
                <>
                    {/* Search & Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-4 sm:p-6">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex flex-col sm:flex-row gap-3"
                                >
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by txn ID, user, project, or method..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => handleStatusFilter(e.target.value)}
                                            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="success">Success</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="sm"
                                            className="px-5"
                                        >
                                            <Search className="w-4 h-4 mr-1.5" />
                                            Search
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery("");
                                                handleStatusFilter("all");
                                            }}
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Transactions Table - Desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th
                                                className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                                                onClick={() => handleSort("txnId")}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    Txn ID <SortIcon column="txnId" />
                                                </span>
                                            </th>
                                            <th
                                                className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                                                onClick={() => handleSort("user")}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    User <SortIcon column="user" />
                                                </span>
                                            </th>
                                            <th
                                                className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                                                onClick={() => handleSort("project")}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    Project <SortIcon column="project" />
                                                </span>
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th
                                                className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                                                onClick={() => handleSort("amount")}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    Amount <SortIcon column="amount" />
                                                </span>
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Method
                                            </th>
                                            <th
                                                className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                                                onClick={() => handleSort("status")}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    Status <SortIcon column="status" />
                                                </span>
                                            </th>
                                            <th
                                                className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                                                onClick={() => handleSort("date")}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    Date <SortIcon column="date" />
                                                </span>
                                            </th>
                                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {transactions.map((txn, index) => {
                                            const badge = getStatusBadge(txn.status);
                                            return (
                                                <motion.tr
                                                    key={txn.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className="hover:bg-gray-50/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-mono text-gray-700">
                                                            {txn.txnId}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                                <span className="text-xs font-medium text-purple-700">
                                                                    {txn.user.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-black">
                                                                    {txn.user.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {txn.user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-gray-700">{txn.project.name}</p>
                                                        <p className="text-xs text-gray-500">{txn.project.spvId}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                            {txn.paymentType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-semibold text-black">
                                                            {formatCurrency(txn.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-700">{txn.method}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                        >
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                            {formatDate(txn.date)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => handleViewTransaction(txn)}
                                                                className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                                title="View details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            {txn.refundEligible && (
                                                                <button
                                                                    onClick={() => handleOpenRefund(txn)}
                                                                    className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
                                                                    title="Refund"
                                                                >
                                                                    <RotateCcw className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {transactions.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <CreditCard className="w-12 h-12 text-gray-300 mb-4" />
                                        <p className="text-gray-500 font-medium">No transactions found</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Try adjusting your search or filters
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Transactions Cards - Mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:hidden space-y-3"
                    >
                        {transactions.map((txn, index) => {
                            const badge = getStatusBadge(txn.status);
                            return (
                                <motion.div
                                    key={txn.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-purple-700">
                                                            {txn.user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-black text-sm">
                                                            {txn.user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-mono">
                                                            {txn.txnId}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleViewTransaction(txn)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {txn.refundEligible && (
                                                        <button
                                                            onClick={() => handleOpenRefund(txn)}
                                                            className="p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <FolderKanban className="w-3 h-3 text-gray-400" />
                                                    {txn.project.name}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    {formatDate(txn.date)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <CreditCard className="w-3 h-3 text-gray-400" />
                                                    {txn.method}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Hash className="w-3 h-3 text-gray-400" />
                                                    {txn.paymentType}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                >
                                                    {badge.label}
                                                </span>
                                                <span className="text-sm font-bold text-black">
                                                    {formatCurrency(txn.amount)}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}

                        {transactions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <CreditCard className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">No transactions found</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-between gap-4"
                        >
                            <p className="text-sm text-gray-500">
                                Showing{" "}
                                <span className="font-medium text-black">
                                    {(pagination.page - 1) * pagination.limit + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium text-black">
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-black">{pagination.total}</span>{" "}
                                transactions
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchPage(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        { length: Math.min(5, pagination.totalPages) },
                                        (_, i) => {
                                            let pageNum: number;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = i + 1;
                                            } else if (pagination.page >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 4 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => fetchPage(pageNum)}
                                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${pageNum === pagination.page
                                                            ? "bg-gold text-black"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

                                <button
                                    onClick={() => fetchPage(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </>
            )}

            {/* === Electricity Bills Tab === */}
            {activeTab === "bills" && (
                <>
                    {/* Bills Table - Desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="hidden lg:block"
                    >
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Biller Name
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Consumer Number
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Bill Amount
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Due Date
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                BBPS Ref ID
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {electricityBills.map((bill, index) => {
                                            const badge = getBillStatusBadge(bill.status);
                                            return (
                                                <motion.tr
                                                    key={bill.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className="hover:bg-gray-50/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                                                <Zap className="w-4 h-4 text-yellow-600" />
                                                            </div>
                                                            <span className="text-sm font-medium text-black">
                                                                {bill.billerName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-mono text-gray-700">
                                                            {bill.consumerNumber}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-semibold text-black">
                                                            {formatCurrency(bill.billAmount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                            {formatDate(bill.dueDate)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                        >
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-mono text-gray-500">
                                                            {bill.bbpsRefId}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Bills Cards - Mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:hidden space-y-3"
                    >
                        {electricityBills.map((bill, index) => {
                            const badge = getBillStatusBadge(bill.status);
                            return (
                                <motion.div
                                    key={bill.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                                        <Zap className="w-5 h-5 text-yellow-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-black text-sm">
                                                            {bill.billerName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-mono">
                                                            {bill.consumerNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                >
                                                    {badge.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    Due: {formatDate(bill.dueDate)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Receipt className="w-3 h-3 text-gray-400" />
                                                    {bill.bbpsRefId}
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-xs text-gray-500">Bill Amount</span>
                                                <span className="text-sm font-bold text-black">
                                                    {formatCurrency(bill.billAmount)}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </>
            )}

            {/* === Payment Details Drawer === */}
            <AnimatePresence>
                {selectedTransaction && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/40"
                            onClick={handleCloseDrawer}
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl overflow-y-auto"
                        >
                            {/* Drawer Header */}
                            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-black">Payment Details</h2>
                                    <button
                                        onClick={handleCloseDrawer}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 font-mono">
                                    {selectedTransaction.txnId}
                                </p>
                            </div>

                            {/* Drawer Content */}
                            <div className="p-6 space-y-6">
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Status</span>
                                    {(() => {
                                        const badge = getStatusBadge(selectedTransaction.status);
                                        return (
                                            <span
                                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
                                            >
                                                {badge.label}
                                            </span>
                                        );
                                    })()}
                                </div>

                                {/* User Details */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" />
                                        User Details
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Name</span>
                                            <span className="text-sm font-medium text-black">
                                                {selectedTransaction.user.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Email</span>
                                            <span className="text-sm text-black">
                                                {selectedTransaction.user.email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Phone</span>
                                            <span className="text-sm text-black">
                                                {selectedTransaction.user.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <FolderKanban className="w-3.5 h-3.5" />
                                        Project Details
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Project</span>
                                            <span className="text-sm font-medium text-black">
                                                {selectedTransaction.project.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">SPV ID</span>
                                            <span className="text-sm font-mono text-black">
                                                {selectedTransaction.project.spvId}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Location</span>
                                            <span className="text-sm text-black">
                                                {selectedTransaction.project.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Breakdown */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CreditCard className="w-3.5 h-3.5" />
                                        Payment Breakdown
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedTransaction.breakdown.map((item, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span className="text-sm text-gray-600">{item.label}</span>
                                                <span className="text-sm text-black">
                                                    {formatCurrency(item.amount)}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="pt-2 border-t border-gray-200 flex justify-between">
                                            <span className="text-sm font-semibold text-black">Total</span>
                                            <span className="text-sm font-bold text-black">
                                                {formatCurrency(selectedTransaction.amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Gateway & Meta */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Gateway Ref ID</span>
                                        <span className="text-sm font-mono text-gray-700">
                                            {selectedTransaction.gatewayRefId}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Payment Method</span>
                                        <span className="text-sm text-gray-700">
                                            {selectedTransaction.method}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Payment Type</span>
                                        <span className="text-sm text-gray-700">
                                            {selectedTransaction.paymentType}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Date</span>
                                        <span className="text-sm text-gray-700">
                                            {formatDate(selectedTransaction.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-3">
                                {selectedTransaction.refundEligible && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            handleCloseDrawer();
                                            handleOpenRefund(selectedTransaction);
                                        }}
                                        className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Refund
                                    </Button>
                                )}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                        // Simulate receipt download
                                        const blob = new Blob([`Receipt for ${selectedTransaction.txnId}\nAmount: ${formatCurrency(selectedTransaction.amount)}\nDate: ${formatDate(selectedTransaction.date)}`], { type: "text/plain" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `receipt-${selectedTransaction.txnId}.txt`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Receipt
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* === Refund Confirmation Modal === */}
            <AnimatePresence>
                {showRefundModal && refundTransaction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={handleCloseRefund}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-black">Confirm Refund</h2>
                                    <button
                                        onClick={handleCloseRefund}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Refund for transaction{" "}
                                    <span className="font-mono font-medium">
                                        {refundTransaction.txnId}
                                    </span>
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Refund Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        max={refundTransaction.amount}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Max: {formatCurrency(refundTransaction.amount)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Reason for Refund
                                    </label>
                                    <textarea
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        placeholder="Enter reason for refund..."
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCloseRefund}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleConfirmRefund}
                                    disabled={actionLoading || !refundAmount || !refundReason.trim()}
                                    className="bg-orange-500 hover:bg-orange-600"
                                >
                                    {actionLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Confirm Refund
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
