import { useToast } from "@/components/ui/toast";
import { useCallback, useEffect, useState } from "react";
import {
    Send,
    Clock,
    CheckCircle,
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


export function useWaitlist(){
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

    return{
        showToast,
        entries,
        setEntries,
        stats,
        setStats,
        pagination,
        setPagination,
        loading,
        setLoading,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        editingEntry,
        setEditingEntry,
        deletingEntryId,
        setDeletingEntryId,
        deletingEntryEmail,
        setDeletingEntryEmail,
        actionLoading,
        setActionLoading,
        showFilters,
        setShowFilters,
        fetchEntries,
        handleSearch,
        handleEditStart,
        handleEditSave,
        handleStatusChange,
        handleDelete,
        getStatusBadge,
        formatDate,
        formatDateTime
    }
}