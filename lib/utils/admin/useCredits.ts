import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/toast";

type CreditLedgerStatus = "PENDING" | "APPLIED" | "EXPIRED";
type CreditLedgerType = "GENERATION" | "ADJUSTMENT" | "REFUND";

export interface CreditEntry {
    id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    amount: number;
    type: CreditLedgerType;
    status: CreditLedgerStatus;
    month: number | null;
    year: number | null;
    ref_type: string | null;
    description: string | null;
    created_at: string;
}

interface CreditStats {
    totalPending: number;
    totalApplied: number;
    totalExpired: number;
    totalAmount: number;
    activeUsers: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export function useCredits() {
    const { showToast } = useToast();
    const [entries, setEntries] = useState<CreditEntry[]>([]);
    const [stats, setStats] = useState<CreditStats>({
        totalPending: 0,
        totalApplied: 0,
        totalExpired: 0,
        totalAmount: 0,
        activeUsers: 0,
    });
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const fetchCredits = useCallback(
        async (page = 1) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: "20",
                    ...(searchQuery && { search: searchQuery }),
                    ...(statusFilter !== "all" && { status: statusFilter }),
                    ...(typeFilter !== "all" && { type: typeFilter }),
                });

                const res = await fetch(`/api/admin/credits?${params}`, {
                    credentials: "include",
                });
                const result = await res.json();

                if (!result.success) {
                    const errMsg = typeof result.error === "string"
                        ? result.error
                        : result.error?.message || "Failed to fetch credits";
                    throw new Error(errMsg);
                }

                setEntries(result.data.entries);
                setStats(result.data.stats);
                setPagination(result.data.pagination);
            } catch (error) {
                console.error("Error fetching credits:", error);
                showToast("error", "Failed to load credit ledger. Please try again.");
            } finally {
                setLoading(false);
            }
        },
        [searchQuery, statusFilter, typeFilter, showToast]
    );

    useEffect(() => {
        fetchCredits();
    }, [fetchCredits]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCredits(1);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: CreditLedgerStatus) => {
        const badges: Record<CreditLedgerStatus, { bg: string; text: string; label: string }> = {
            PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
            APPLIED: { bg: "bg-green-100", text: "text-green-700", label: "Applied" },
            EXPIRED: { bg: "bg-gray-100", text: "text-gray-700", label: "Expired" },
        };
        return badges[status] || badges.PENDING;
    };

    const getTypeBadge = (type: CreditLedgerType) => {
        const badges: Record<CreditLedgerType, { bg: string; text: string; label: string }> = {
            GENERATION: { bg: "bg-blue-100", text: "text-blue-700", label: "Generation" },
            ADJUSTMENT: { bg: "bg-purple-100", text: "text-purple-700", label: "Adjustment" },
            REFUND: { bg: "bg-red-100", text: "text-red-700", label: "Refund" },
        };
        return badges[type] || badges.GENERATION;
    };

    return {
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
    };
}
