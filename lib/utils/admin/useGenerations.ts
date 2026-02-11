"use client";

import { useState, useMemo, useCallback } from "react";
import {
    mockGenerationProjects,
    mockAlerts,
    generationStats,
    environmentalImpact,
    trendData,
    type GenerationProject,
    type ProjectStatus,
    type ChartPeriod,
} from "@/lib/data/generationsMockData";

type SortColumn = "name" | "capacity" | "todayGeneration" | "monthlyGeneration" | "lifetimeGeneration" | "performanceRatio" | "status";
type SortDirection = "asc" | "desc";

export function useGenerations() {
    // Chart period
    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");

    // Table state
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<SortColumn>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Drawer state
    const [selectedProject, setSelectedProject] = useState<GenerationProject | null>(null);

    // Loading / error states
    const [loading] = useState(false);
    const [error] = useState<string | null>(null);

    // Chart data for current period
    const currentTrendData = useMemo(() => trendData[chartPeriod], [chartPeriod]);
    const chartUnit = chartPeriod === "monthly" ? "MWh" : "kWh";

    // Filter & sort projects
    const filteredProjects = useMemo(() => {
        let data = [...mockGenerationProjects];

        if (statusFilter !== "all") {
            data = data.filter((p) => p.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            data = data.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.location.toLowerCase().includes(q) ||
                    p.state.toLowerCase().includes(q)
            );
        }

        data.sort((a, b) => {
            let cmp = 0;
            switch (sortColumn) {
                case "name":
                    cmp = a.name.localeCompare(b.name);
                    break;
                case "capacity":
                    cmp = a.installedCapacity - b.installedCapacity;
                    break;
                case "todayGeneration":
                    cmp = a.todayGeneration - b.todayGeneration;
                    break;
                case "monthlyGeneration":
                    cmp = a.monthlyGeneration - b.monthlyGeneration;
                    break;
                case "lifetimeGeneration":
                    cmp = a.lifetimeGeneration - b.lifetimeGeneration;
                    break;
                case "performanceRatio":
                    cmp = a.performanceRatio - b.performanceRatio;
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
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProjects.slice(start, start + itemsPerPage);
    }, [filteredProjects, currentPage]);

    const pagination = {
        page: currentPage,
        totalPages,
        total: filteredProjects.length,
        limit: itemsPerPage,
    };

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

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    }, []);

    const handleStatusFilter = useCallback((status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
    }, []);

    const handleViewProject = useCallback((project: GenerationProject) => {
        setSelectedProject(project);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setSelectedProject(null);
    }, []);

    const fetchPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Formatters
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    const formatCurrency = (amount: number) =>
        `₹${amount.toLocaleString("en-IN")}`;

    const formatEnergy = (value: number, unit: string = "kWh") => {
        if (unit === "MWh" || value >= 100000) {
            return `${(value / 1000).toFixed(1)} MWh`;
        }
        return `${value.toLocaleString("en-IN")} kWh`;
    };

    const formatCapacity = (kw: number) => {
        if (kw >= 1000) return `${(kw / 1000).toFixed(1)} MW`;
        return `${kw} kW`;
    };

    const getStatusBadge = (status: ProjectStatus) => {
        const map: Record<ProjectStatus, { bg: string; text: string; dot: string; label: string }> = {
            active: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500", label: "Active" },
            maintenance: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500", label: "Maintenance" },
            offline: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Offline" },
        };
        return map[status];
    };

    const formatTimestamp = (ts: string) => {
        const d = new Date(ts);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return {
        // Data
        stats: generationStats,
        impact: environmentalImpact,
        projects: paginatedProjects,
        alerts: mockAlerts,
        pagination,
        loading,
        error,
        // Chart
        chartPeriod,
        setChartPeriod,
        currentTrendData,
        chartUnit,
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
        selectedProject,
        handleViewProject,
        handleCloseDrawer,
        // Formatters
        formatDate,
        formatCurrency,
        formatEnergy,
        formatCapacity,
        getStatusBadge,
        formatTimestamp,
    };
}
