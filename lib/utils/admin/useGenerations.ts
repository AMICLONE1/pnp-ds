"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type {
    ChartPeriod,
    EnvironmentalImpact,
    GenerationAlert,
    GenerationProject,
    GenerationStats,
    ProjectStatus,
} from "@/lib/data/generations";

type SortColumn = "name" | "capacity" | "todayGeneration" | "monthlyGeneration" | "lifetimeGeneration" | "performanceRatio" | "status";
type SortDirection = "asc" | "desc";

type TrendPoint = {
    label: string;
    value: number;
    prev: number;
};

type LiveGenerationProject = GenerationProject & {
    dataLoggerSerialId?: string | null;
    hostBusinessName?: string | null;
};

type LiveGenerationResponse = {
    stats: GenerationStats;
    impact: EnvironmentalImpact;
    projects: LiveGenerationProject[];
    alerts: GenerationAlert[];
    currentTrendData: Record<ChartPeriod, TrendPoint[]>;
    chartUnit: string;
};

const emptyProjects: LiveGenerationProject[] = [];

const emptyStats: GenerationStats = {
    totalEnergy: 0,
    totalEnergyChange: 0,
    todayGeneration: 0,
    todayChange: 0,
    monthGeneration: 0,
    monthChange: 0,
    totalRevenue: 0,
    revenueChange: 0,
    activeProjects: 0,
    activeChange: 0,
    avgPerformanceRatio: 0,
    prChange: 0,
};

const emptyImpact: EnvironmentalImpact = {
    co2Offset: 0,
    treesPlanted: 0,
    cleanEnergyPercent: 0,
};

const emptyTrendData: Record<ChartPeriod, TrendPoint[]> = {
    daily: [],
    weekly: [],
    monthly: [],
};

export function useGenerations() {
    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<SortColumn>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProject, setSelectedProject] = useState<GenerationProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiData, setApiData] = useState<LiveGenerationResponse | null>(null);

    const itemsPerPage = 6;

    useEffect(() => {
        const controller = new AbortController();

        async function loadGenerations() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/admin/generations", {
                    signal: controller.signal,
                    cache: "no-store",
                });
                const payload = await response.json();

                if (!response.ok || !payload?.success) {
                    throw new Error(payload?.error || "Failed to load generation data");
                }

                setApiData(payload.data as LiveGenerationResponse);
            } catch (loadError) {
                if (controller.signal.aborted) {
                    return;
                }

                setError(loadError instanceof Error ? loadError.message : "Failed to load generation data");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadGenerations();

        return () => controller.abort();
    }, []);

    const projectsSource = apiData?.projects ?? emptyProjects;

    const filteredProjects = useMemo(() => {
        let data = [...projectsSource];

        if (statusFilter !== "all") {
            data = data.filter((project) => project.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(
                (project) =>
                    project.name.toLowerCase().includes(query) ||
                    project.location.toLowerCase().includes(query) ||
                    project.state.toLowerCase().includes(query)
            );
        }

        data.sort((left, right) => {
            let comparison = 0;

            switch (sortColumn) {
                case "name":
                    comparison = left.name.localeCompare(right.name);
                    break;
                case "capacity":
                    comparison = left.installedCapacity - right.installedCapacity;
                    break;
                case "todayGeneration":
                    comparison = left.todayGeneration - right.todayGeneration;
                    break;
                case "monthlyGeneration":
                    comparison = left.monthlyGeneration - right.monthlyGeneration;
                    break;
                case "lifetimeGeneration":
                    comparison = left.lifetimeGeneration - right.lifetimeGeneration;
                    break;
                case "performanceRatio":
                    comparison = left.performanceRatio - right.performanceRatio;
                    break;
                case "status":
                    comparison = left.status.localeCompare(right.status);
                    break;
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });

        return data;
    }, [projectsSource, searchQuery, sortColumn, sortDirection, statusFilter]);

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProjects.slice(start, start + itemsPerPage);
    }, [currentPage, filteredProjects]);

    const currentTrendData = useMemo(() => {
        return apiData?.currentTrendData[chartPeriod] || emptyTrendData[chartPeriod];
    }, [apiData, chartPeriod]);

    const chartUnit = chartPeriod === "monthly" ? "MWh" : "kWh";

    const pagination = {
        page: currentPage,
        totalPages,
        total: filteredProjects.length,
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

    const handleViewProject = useCallback((project: GenerationProject) => {
        setSelectedProject(project);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setSelectedProject(null);
    }, []);

    const fetchPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

    const formatEnergy = (value: number, unit: string = "kWh") => {
        if (unit === "MWh" || value >= 100000) {
            return `${(value / 1000).toFixed(1)} MWh`;
        }

        return `${value.toLocaleString("en-IN")} kWh`;
    };

    const formatCapacity = (kw: number) => {
        if (kw >= 1000) {
            return `${(kw / 1000).toFixed(1)} MW`;
        }

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

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return {
        stats: apiData?.stats || emptyStats,
        impact: apiData?.impact || emptyImpact,
        projects: paginatedProjects,
        alerts: apiData?.alerts || [],
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
    };
}
