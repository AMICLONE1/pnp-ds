"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ListChecks,
    Search,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Trash2,
    X,
    Filter,
    RefreshCw,
    Mail,
    Phone,
    Calendar,
    Loader2,
    AlertTriangle,
    UserCheck,
    Send,
    Clock,
    CheckCircle,
    Users,
} from "lucide-react";

type WaitlistStatus = "pending" | "invited" | "converted";

interface WaitlistEntry {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    source: string;
    referral_code: string | null;
    status: WaitlistStatus;
    notes: string | null;
    metadata: Record<string, any>;
    invited_at: string | null;
    converted_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Stats {
    total: number;
    pending: number;
    invited: number;
    converted: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface EditingEntry {
    id: string;
    name: string;
    phone: string;
    notes: string;
    status: WaitlistStatus;
    source: string;
}

export default function AdminWaitlistPage() {
    const { showToast } = useToast();
    const [entries, setEntries] = useState<WaitlistEntry[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, invited: 0, converted: 0 });
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
    const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
    const [deletingEntryEmail, setDeletingEntryEmail] = useState<string>("");
    const [actionLoading, setActionLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const fetchEntries = useCallback(
        async (page = 1) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: "20",
                    ...(searchQuery && { search: searchQuery }),
                    ...(statusFilter !== "all" && { status: statusFilter }),
                });

                const res = await fetch(`/api/admin/waitlist?${params}`, {
                    credentials: "include",
                });
                const result = await res.json();

                if (!result.success) {
                    throw new Error(result.error || "Failed to fetch waitlist");
                }

                setEntries(result.data.entries);
                setStats(result.data.stats);
                setPagination(result.data.pagination);
            } catch (error) {
                console.error("Error fetching waitlist:", error);
                showToast("error", "Failed to load waitlist. Please try again.");
            } finally {
                setLoading(false);
            }
        },
        [searchQuery, statusFilter, showToast]
    );

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchEntries(1);
    };

    const handleEditStart = (entry: WaitlistEntry) => {
        setEditingEntry({
            id: entry.id,
            name: entry.name || "",
            phone: entry.phone || "",
            notes: entry.notes || "",
            status: entry.status,
            source: entry.source,
        });
    };

    const handleEditSave = async () => {
        if (!editingEntry) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/waitlist", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editingEntry),
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to update entry");
            }

            showToast("success", "Entry updated successfully");
            setEditingEntry(null);
            fetchEntries(pagination.page);
        } catch (error) {
            console.error("Error updating entry:", error);
            showToast(
                "error",
                error instanceof Error ? error.message : "Failed to update entry"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusChange = async (entryId: string, newStatus: WaitlistStatus) => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/waitlist", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id: entryId, status: newStatus }),
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to update status");
            }

            const statusLabels = { pending: "Pending", invited: "Invited", converted: "Converted" };
            showToast("success", `Status changed to ${statusLabels[newStatus]}`);
            fetchEntries(pagination.page);
        } catch (error) {
            console.error("Error updating status:", error);
            showToast(
                "error",
                error instanceof Error ? error.message : "Failed to update status"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (entryId: string) => {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/waitlist?id=${entryId}`, {
                method: "DELETE",
                credentials: "include",
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to delete entry");
            }

            showToast("success", "Entry deleted successfully");
            setDeletingEntryId(null);
            setDeletingEntryEmail("");
            fetchEntries(pagination.page);
        } catch (error) {
            console.error("Error deleting entry:", error);
            showToast(
                "error",
                error instanceof Error ? error.message : "Failed to delete entry"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: WaitlistStatus) => {
        const badges: Record<WaitlistStatus, { bg: string; text: string; label: string; icon: any }> = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending", icon: Clock },
            invited: { bg: "bg-blue-100", text: "text-blue-700", label: "Invited", icon: Send },
            converted: { bg: "bg-green-100", text: "text-green-700", label: "Converted", icon: CheckCircle },
        };
        return badges[status] || badges.pending;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Skeleton loading
    if (loading && entries.length === 0) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-gray-100 rounded-lg" />
                    <div className="h-10 w-64 bg-gray-100 rounded-lg" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 w-full bg-gray-100 rounded-xl" />
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
                        Waitlist Management
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Manage early access signups and invitations
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
                    <ListChecks className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                        {stats.total} Signups
                    </span>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
                <Card className="bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-black">{stats.total}</p>
                                <p className="text-xs text-gray-500">Total Signups</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-black">{stats.pending}</p>
                                <p className="text-xs text-gray-500">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Send className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-black">{stats.invited}</p>
                                <p className="text-xs text-gray-500">Invited</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-black">{stats.converted}</p>
                                <p className="text-xs text-gray-500">Converted</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                                        placeholder="Search by email, name, or phone..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                                    />
                                </div>
                                <div className="flex gap-2">
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
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={showFilters ? "border-gold text-gold-dark" : ""}
                                    >
                                        <Filter className="w-4 h-4 mr-1.5" />
                                        Filters
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setStatusFilter("all");
                                            fetchEntries(1);
                                        }}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>

                            {/* Expandable Filters */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
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
                                                    <option value="pending">Pending</option>
                                                    <option value="invited">Invited</option>
                                                    <option value="converted">Converted</option>
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => fetchEntries(1)}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Apply Filters
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Waitlist Table - Desktop */}
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
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Source
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {entries.map((entry, index) => (
                                    <motion.tr
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* User Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-purple-700">
                                                        {(entry.name || entry.email).charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-black text-sm">
                                                        {entry.name || "No name"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{entry.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="truncate max-w-[180px]">{entry.email}</span>
                                                </div>
                                                {entry.phone && (
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                        {entry.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Source */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {entry.source}
                                            </span>
                                            {entry.referral_code && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Ref: {entry.referral_code}
                                                </p>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const badge = getStatusBadge(entry.status);
                                                const Icon = badge.icon;
                                                return (
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                    >
                                                        <Icon className="w-3 h-3" />
                                                        {badge.label}
                                                    </span>
                                                );
                                            })()}
                                        </td>

                                        {/* Joined Date */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {formatDate(entry.created_at)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* Status control buttons */}
                                                {entry.status === "pending" && (
                                                    <button
                                                        onClick={() => handleStatusChange(entry.id, "invited")}
                                                        disabled={actionLoading}
                                                        className="p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                        title="Send Invite"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {entry.status === "invited" && (
                                                    <button
                                                        onClick={() => handleStatusChange(entry.id, "converted")}
                                                        disabled={actionLoading}
                                                        className="p-2 rounded-lg text-green-500 hover:text-green-600 hover:bg-green-50 transition-all"
                                                        title="Mark Converted"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEditStart(entry)}
                                                    className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="Edit entry"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeletingEntryId(entry.id);
                                                        setDeletingEntryEmail(entry.email);
                                                    }}
                                                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                                                    title="Delete entry"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {entries.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <ListChecks className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">No waitlist entries found</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Waitlist Cards - Mobile/Tablet */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:hidden space-y-3"
            >
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry.id}
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
                                                {(entry.name || entry.email).charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-black text-sm">
                                                {entry.name || "No name"}
                                            </p>
                                            <p className="text-xs text-gray-500">{entry.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEditStart(entry)}
                                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeletingEntryId(entry.id);
                                                setDeletingEntryEmail(entry.email);
                                            }}
                                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                    {entry.phone && (
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Phone className="w-3 h-3 text-gray-400" />
                                            {entry.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        {formatDate(entry.created_at)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const badge = getStatusBadge(entry.status);
                                            const Icon = badge.icon;
                                            return (
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                >
                                                    <Icon className="w-3 h-3" />
                                                    {badge.label}
                                                </span>
                                            );
                                        })()}
                                        <span className="text-xs text-gray-400">{entry.source}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {entry.status === "pending" && (
                                            <button
                                                onClick={() => handleStatusChange(entry.id, "invited")}
                                                disabled={actionLoading}
                                                className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50"
                                                title="Send Invite"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        )}
                                        {entry.status === "invited" && (
                                            <button
                                                onClick={() => handleStatusChange(entry.id, "converted")}
                                                disabled={actionLoading}
                                                className="p-1.5 rounded-lg text-green-500 hover:bg-green-50"
                                                title="Mark Converted"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {entries.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <ListChecks className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No waitlist entries found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Loading overlay for pagination */}
            {loading && entries.length > 0 && (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-gold" />
                </div>
            )}

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
                        of <span className="font-medium text-black">{pagination.total}</span>{" "}
                        entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchEntries(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        {/* Page numbers */}
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
                                            onClick={() => fetchEntries(pageNum)}
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
                            onClick={() => fetchEntries(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {editingEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setEditingEntry(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-black">Edit Entry</h2>
                                    <button
                                        onClick={() => setEditingEntry(null)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingEntry.name}
                                        onChange={(e) =>
                                            setEditingEntry({ ...editingEntry, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={editingEntry.phone}
                                        onChange={(e) =>
                                            setEditingEntry({ ...editingEntry, phone: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        value={editingEntry.status}
                                        onChange={(e) =>
                                            setEditingEntry({
                                                ...editingEntry,
                                                status: e.target.value as WaitlistStatus,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="invited">Invited</option>
                                        <option value="converted">Converted</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Source
                                    </label>
                                    <input
                                        type="text"
                                        value={editingEntry.source}
                                        onChange={(e) =>
                                            setEditingEntry({ ...editingEntry, source: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        value={editingEntry.notes}
                                        onChange={(e) =>
                                            setEditingEntry({ ...editingEntry, notes: e.target.value })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        placeholder="Add notes about this user..."
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingEntry(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleEditSave}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingEntryId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => {
                            setDeletingEntryId(null);
                            setDeletingEntryEmail("");
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-black">Delete Entry</h2>
                                        <p className="text-sm text-gray-500">This action cannot be undone</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">{deletingEntryEmail}</span> from the
                                    waitlist? This will permanently remove this entry.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setDeletingEntryId(null);
                                            setDeletingEntryEmail("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleDelete(deletingEntryId)}
                                        disabled={actionLoading}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {actionLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete Entry"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
