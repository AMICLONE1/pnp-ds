"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type {
    BillStatus,
    ElectricityBill,
    PaymentStatus,
    PaymentStats,
    Transaction,
} from "@/lib/data/payments";

type SortColumn = "txnId" | "user" | "project" | "amount" | "date" | "status";
type SortDirection = "asc" | "desc";
type ActiveTab = "transactions" | "bills";

type RevenuePoint = {
    month: string;
    year: number;
    value: number;
};

type LivePaymentsResponse = {
    stats: PaymentStats;
    transactions: Transaction[];
    electricityBills: ElectricityBill[];
    revenueByMonth: RevenuePoint[];
};

const emptyTransactions: Transaction[] = [];

const emptyStats: PaymentStats = {
    totalRevenue: 0,
    totalRevenueChange: 0,
    successfulPayments: 0,
    successfulChange: 0,
    pendingPayments: 0,
    pendingChange: 0,
    failedPayments: 0,
    failedChange: 0,
};

export function usePayments() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("transactions");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<SortColumn>("date");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundTransaction, setRefundTransaction] = useState<Transaction | null>(null);
    const [refundAmount, setRefundAmount] = useState("");
    const [refundReason, setRefundReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiData, setApiData] = useState<LivePaymentsResponse | null>(null);

    const itemsPerPage = 8;

    useEffect(() => {
        const controller = new AbortController();

        async function loadPayments() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/admin/payments", {
                    signal: controller.signal,
                    cache: "no-store",
                });
                const payload = await response.json();

                if (!response.ok || !payload?.success) {
                    throw new Error(payload?.error || "Failed to load payment data");
                }

                setApiData(payload.data as LivePaymentsResponse);
            } catch (loadError) {
                if (controller.signal.aborted) {
                    return;
                }

                setError(loadError instanceof Error ? loadError.message : "Failed to load payment data");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadPayments();

        return () => controller.abort();
    }, []);

    const transactionsSource = apiData?.transactions ?? emptyTransactions;

    const filteredTransactions = useMemo(() => {
        let data = [...transactionsSource];

        if (statusFilter !== "all") {
            data = data.filter((transaction) => transaction.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(
                (transaction) =>
                    transaction.txnId.toLowerCase().includes(query) ||
                    transaction.user.name.toLowerCase().includes(query) ||
                    transaction.project.name.toLowerCase().includes(query) ||
                    transaction.method.toLowerCase().includes(query)
            );
        }

        data.sort((left, right) => {
            let comparison = 0;

            switch (sortColumn) {
                case "txnId":
                    comparison = left.txnId.localeCompare(right.txnId);
                    break;
                case "user":
                    comparison = left.user.name.localeCompare(right.user.name);
                    break;
                case "project":
                    comparison = left.project.name.localeCompare(right.project.name);
                    break;
                case "amount":
                    comparison = left.amount - right.amount;
                    break;
                case "date":
                    comparison = new Date(left.date).getTime() - new Date(right.date).getTime();
                    break;
                case "status":
                    comparison = left.status.localeCompare(right.status);
                    break;
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });

        return data;
    }, [searchQuery, sortColumn, sortDirection, statusFilter, transactionsSource]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(start, start + itemsPerPage);
    }, [currentPage, filteredTransactions]);

    const electricityBills = apiData?.electricityBills || [];
    const revenueByMonth = apiData?.revenueByMonth || [];

    const pagination = {
        page: currentPage,
        totalPages,
        total: filteredTransactions.length,
        limit: itemsPerPage,
    };

    useEffect(() => {
        if (totalPages === 0) {
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
            return;
        }

        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleSort = useCallback(
        (column: SortColumn) => {
            if (sortColumn === column) {
                setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
            } else {
                setSortColumn(column);
                setSortDirection("asc");
            }
            setCurrentPage(1);
        },
        [sortColumn]
    );

    const handleSearch = useCallback((event: FormEvent) => {
        event.preventDefault();
        setCurrentPage(1);
    }, []);

    const handleStatusFilter = useCallback((status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
    }, []);

    const handleTabChange = useCallback((tab: ActiveTab) => {
        setActiveTab(tab);
    }, []);

    const handleViewTransaction = useCallback((transaction: Transaction) => {
        setSelectedTransaction(transaction);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setSelectedTransaction(null);
    }, []);

    const handleOpenRefund = useCallback((transaction: Transaction) => {
        setRefundTransaction(transaction);
        setRefundAmount(String(transaction.amount));
        setRefundReason("");
        setShowRefundModal(true);
    }, []);

    const handleCloseRefund = useCallback(() => {
        setShowRefundModal(false);
        setRefundTransaction(null);
        setRefundAmount("");
        setRefundReason("");
    }, []);

    const handleConfirmRefund = useCallback(async () => {
        setActionLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setActionLoading(false);
        handleCloseRefund();
    }, [handleCloseRefund]);

    const fetchPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

    const getStatusBadge = (status: PaymentStatus) => {
        const map: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
            success: { bg: "bg-green-100", text: "text-green-700", label: "Success" },
            failed: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
            refunded: { bg: "bg-blue-100", text: "text-blue-700", label: "Refunded" },
        };

        return map[status];
    };

    const getBillStatusBadge = (status: BillStatus) => {
        const map: Record<BillStatus, { bg: string; text: string; label: string }> = {
            paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
            unpaid: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Unpaid" },
            overdue: { bg: "bg-red-100", text: "text-red-700", label: "Overdue" },
            processing: { bg: "bg-blue-100", text: "text-blue-700", label: "Processing" },
        };

        return map[status];
    };

    return {
        activeTab,
        handleTabChange,
        stats: apiData?.stats || emptyStats,
        revenueByMonth,
        transactions: paginatedTransactions,
        electricityBills,
        pagination,
        loading,
        error,
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
    };
}
