"use client";

import { useState, useMemo, useCallback } from "react";
import {
    mockTransactions,
    mockElectricityBills,
    paymentStats,
    type Transaction,
    type PaymentStatus,
    type BillStatus,
} from "@/lib/data/paymentsMockData";

type SortColumn = "txnId" | "user" | "project" | "amount" | "date" | "status";
type SortDirection = "asc" | "desc";
type ActiveTab = "transactions" | "bills";

export function usePayments() {
    // Tab state
    const [activeTab, setActiveTab] = useState<ActiveTab>("transactions");

    // Transactions state
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<SortColumn>("date");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Drawer & modal state
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundTransaction, setRefundTransaction] = useState<Transaction | null>(null);
    const [refundAmount, setRefundAmount] = useState("");
    const [refundReason, setRefundReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Filter & sort transactions
    const filteredTransactions = useMemo(() => {
        let data = [...mockTransactions];

        // Status filter
        if (statusFilter !== "all") {
            data = data.filter((t) => t.status === statusFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            data = data.filter(
                (t) =>
                    t.txnId.toLowerCase().includes(q) ||
                    t.user.name.toLowerCase().includes(q) ||
                    t.project.name.toLowerCase().includes(q) ||
                    t.method.toLowerCase().includes(q)
            );
        }

        // Sort
        data.sort((a, b) => {
            let cmp = 0;
            switch (sortColumn) {
                case "txnId":
                    cmp = a.txnId.localeCompare(b.txnId);
                    break;
                case "user":
                    cmp = a.user.name.localeCompare(b.user.name);
                    break;
                case "project":
                    cmp = a.project.name.localeCompare(b.project.name);
                    break;
                case "amount":
                    cmp = a.amount - b.amount;
                    break;
                case "date":
                    cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case "status":
                    cmp = a.status.localeCompare(b.status);
                    break;
            }
            return sortDirection === "asc" ? cmp : -cmp;
        });

        return data;
    }, [statusFilter, searchQuery, sortColumn, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(start, start + itemsPerPage);
    }, [filteredTransactions, currentPage]);

    const pagination = {
        page: currentPage,
        totalPages,
        total: filteredTransactions.length,
        limit: itemsPerPage,
    };

    // Electricity bills (no pagination needed for 10 items)
    const electricityBills = mockElectricityBills;

    // Handlers
    const handleSort = useCallback(
        (column: SortColumn) => {
            if (sortColumn === column) {
                setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
            } else {
                setSortColumn(column);
                setSortDirection("asc");
            }
            setCurrentPage(1);
        },
        [sortColumn]
    );

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setCurrentPage(1);
        },
        []
    );

    const handleStatusFilter = useCallback((status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
    }, []);

    const handleTabChange = useCallback((tab: ActiveTab) => {
        setActiveTab(tab);
    }, []);

    const handleViewTransaction = useCallback((txn: Transaction) => {
        setSelectedTransaction(txn);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setSelectedTransaction(null);
    }, []);

    const handleOpenRefund = useCallback((txn: Transaction) => {
        setRefundTransaction(txn);
        setRefundAmount(String(txn.amount));
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
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1200));
        setActionLoading(false);
        handleCloseRefund();
        // In real app, would refetch data
    }, [handleCloseRefund]);

    const fetchPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Formatters
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString("en-IN")}`;
    };

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
        // Tab
        activeTab,
        handleTabChange,
        // Data
        stats: paymentStats,
        transactions: paginatedTransactions,
        electricityBills,
        pagination,
        // Filter / sort / search
        statusFilter,
        handleStatusFilter,
        searchQuery,
        setSearchQuery,
        sortColumn,
        sortDirection,
        handleSort,
        handleSearch,
        fetchPage,
        // Drawer
        selectedTransaction,
        handleViewTransaction,
        handleCloseDrawer,
        // Refund modal
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
        // Formatters
        formatDate,
        formatCurrency,
        getStatusBadge,
        getBillStatusBadge,
    };
}
