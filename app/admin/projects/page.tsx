"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    FolderKanban,
    Search,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Trash2,
    X,
    Filter,
    RefreshCw,
    MapPin,
    Calendar,
    Zap,
    Loader2,
    AlertTriangle,
    Plus,
    Play,
    Pause,
    StopCircle,
    RotateCcw,
    DollarSign,
    Building2,
} from "lucide-react";

type ProjectStatus = "DRAFT" | "ACTIVE" | "MAINTENANCE" | "RETIRED";

interface ProjectCapacity {
    allocated: number;
    available: number;
    utilization: number;
}

interface AdminProject {
    id: string;
    spv_id: string;
    name: string;
    total_kw: number;
    rate_per_kwh: number;
    location: string;
    state: string;
    status: ProjectStatus;
    description: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    capacity: ProjectCapacity;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface EditingProject {
    id: string;
    name: string;
    spv_id: string;
    description: string;
    location: string;
    state: string;
    total_kw: number;
    rate_per_kwh: number;
    status: ProjectStatus;
}

interface NewProject {
    spv_id: string;
    name: string;
    description: string;
    location: string;
    state: string;
    total_kw: number;
    rate_per_kwh: number;
    status: ProjectStatus;
}

const emptyNewProject: NewProject = {
    spv_id: "",
    name: "",
    description: "",
    location: "",
    state: "",
    total_kw: 0,
    rate_per_kwh: 0,
    status: "DRAFT",
};

export default function AdminProjectsPage() {
    const { showToast } = useToast();
    const [projects, setProjects] = useState<AdminProject[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingProject, setEditingProject] = useState<EditingProject | null>(null);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const [deletingProjectName, setDeletingProjectName] = useState<string>("");
    const [actionLoading, setActionLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProject, setNewProject] = useState<NewProject>(emptyNewProject);

    const fetchProjects = useCallback(
        async (page = 1) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: "20",
                    ...(searchQuery && { search: searchQuery }),
                    ...(statusFilter !== "all" && { status: statusFilter }),
                });

                const res = await fetch(`/api/admin/projects?${params}`, {
                    credentials: "include",
                });
                const result = await res.json();

                if (!result.success) {
                    throw new Error(result.error || "Failed to fetch projects");
                }

                setProjects(result.data.projects);
                setPagination(result.data.pagination);
            } catch (error) {
                console.error("Error fetching projects:", error);
                showToast("error", "Failed to load projects. Please try again.");
            } finally {
                setLoading(false);
            }
        },
        [searchQuery, statusFilter, showToast]
    );

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProjects(1);
    };

    const handleEditStart = (project: AdminProject) => {
        setEditingProject({
            id: project.id,
            name: project.name,
            spv_id: project.spv_id,
            description: project.description || "",
            location: project.location,
            state: project.state,
            total_kw: project.total_kw,
            rate_per_kwh: project.rate_per_kwh,
            status: project.status,
        });
    };

    const handleEditSave = async () => {
        if (!editingProject) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/projects", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editingProject),
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to update project");
            }

            showToast("success", "Project updated successfully");
            setEditingProject(null);
            fetchProjects(pagination.page);
        } catch (error) {
            console.error("Error updating project:", error);
            showToast(
                "error",
                error instanceof Error ? error.message : "Failed to update project"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/projects", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id: projectId, status: newStatus }),
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to update status");
            }

            showToast("success", `Project status changed to ${newStatus}`);
            fetchProjects(pagination.page);
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

    const handleDelete = async (projectId: string) => {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/projects?id=${projectId}`, {
                method: "DELETE",
                credentials: "include",
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to delete project");
            }

            showToast("success", "Project deleted successfully");
            setDeletingProjectId(null);
            setDeletingProjectName("");
            fetchProjects(pagination.page);
        } catch (error) {
            console.error("Error deleting project:", error);
            showToast(
                "error",
                error instanceof Error ? error.message : "Failed to delete project"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.spv_id || !newProject.name || !newProject.location || !newProject.state) {
            showToast("error", "Please fill in all required fields");
            return;
        }
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newProject),
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to create project");
            }

            showToast("success", "Project created successfully");
            setShowCreateModal(false);
            setNewProject(emptyNewProject);
            fetchProjects(1);
        } catch (error) {
            console.error("Error creating project:", error);
            showToast(
                "error",
                error instanceof Error ? error.message : "Failed to create project"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: ProjectStatus) => {
        const badges: Record<ProjectStatus, { bg: string; text: string; label: string }> = {
            DRAFT: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Draft" },
            ACTIVE: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
            MAINTENANCE: { bg: "bg-orange-100", text: "text-orange-700", label: "Maintenance" },
            RETIRED: { bg: "bg-gray-100", text: "text-gray-700", label: "Retired" },
        };
        return badges[status] || badges.DRAFT;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString("en-IN");
    };

    // Skeleton loading
    if (loading && projects.length === 0) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-gray-100 rounded-lg" />
                    <div className="h-10 w-64 bg-gray-100 rounded-lg" />
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
                        Project Management
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Manage and monitor all solar projects
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                        <FolderKanban className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                            {pagination.total} Projects
                        </span>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Project</span>
                    </Button>
                </div>
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
                                        placeholder="Search by name, location, or SPV ID..."
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
                                            fetchProjects(1);
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
                                                    <option value="DRAFT">Draft</option>
                                                    <option value="ACTIVE">Active</option>
                                                    <option value="MAINTENANCE">Maintenance</option>
                                                    <option value="RETIRED">Retired</option>
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => fetchProjects(1)}
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

            {/* Projects Table - Desktop */}
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
                                        Project
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Capacity
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Rate
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {projects.map((project, index) => (
                                    <motion.tr
                                        key={project.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Project Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                                    <FolderKanban className="w-5 h-5 text-gold-dark" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-black text-sm">
                                                        {project.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {project.spv_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="truncate max-w-[150px]">
                                                    {project.location}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {project.state}
                                            </p>
                                        </td>

                                        {/* Capacity */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-sm">
                                                    <Zap className="w-3.5 h-3.5 text-gold" />
                                                    <span className="text-gray-700">
                                                        {formatNumber(project.total_kw)} kW
                                                    </span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gold rounded-full transition-all"
                                                        style={{ width: `${project.capacity.utilization}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {project.capacity.utilization}% allocated
                                                </p>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const badge = getStatusBadge(project.status);
                                                return (
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                );
                                            })()}
                                        </td>

                                        {/* Rate */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                                ₹{project.rate_per_kwh}/kWh
                                            </div>
                                        </td>

                                        {/* Created Date */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {formatDate(project.created_at)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* Status control buttons */}
                                                {project.status === "ACTIVE" && (
                                                    <button
                                                        onClick={() => handleStatusChange(project.id, "MAINTENANCE")}
                                                        disabled={actionLoading}
                                                        className="p-2 rounded-lg text-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
                                                        title="Pause project"
                                                    >
                                                        <Pause className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {project.status === "MAINTENANCE" && (
                                                    <button
                                                        onClick={() => handleStatusChange(project.id, "ACTIVE")}
                                                        disabled={actionLoading}
                                                        className="p-2 rounded-lg text-green-500 hover:text-green-600 hover:bg-green-50 transition-all"
                                                        title="Resume project"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {project.status === "DRAFT" && (
                                                    <button
                                                        onClick={() => handleStatusChange(project.id, "ACTIVE")}
                                                        disabled={actionLoading}
                                                        className="p-2 rounded-lg text-green-500 hover:text-green-600 hover:bg-green-50 transition-all"
                                                        title="Activate project"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {(project.status === "ACTIVE" || project.status === "MAINTENANCE") && (
                                                    <button
                                                        onClick={() => handleStatusChange(project.id, "RETIRED")}
                                                        disabled={actionLoading}
                                                        className="p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                                        title="Retire project"
                                                    >
                                                        <StopCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {project.status === "RETIRED" && (
                                                    <button
                                                        onClick={() => handleStatusChange(project.id, "DRAFT")}
                                                        disabled={actionLoading}
                                                        className="p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                        title="Reactivate project"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEditStart(project)}
                                                    className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="Edit project"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeletingProjectId(project.id);
                                                        setDeletingProjectName(project.name);
                                                    }}
                                                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                                                    title="Delete project"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {projects.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <FolderKanban className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">No projects found</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Projects Cards - Mobile/Tablet */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:hidden space-y-3"
            >
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                            <FolderKanban className="w-5 h-5 text-gold-dark" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-black text-sm">
                                                {project.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{project.spv_id}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEditStart(project)}
                                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeletingProjectId(project.id);
                                                setDeletingProjectName(project.name);
                                            }}
                                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <MapPin className="w-3 h-3 text-gray-400" />
                                        {project.state}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        {formatDate(project.created_at)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Zap className="w-3 h-3 text-gold" />
                                        {formatNumber(project.total_kw)} kW
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <DollarSign className="w-3 h-3 text-gray-400" />
                                        ₹{project.rate_per_kwh}/kWh
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const badge = getStatusBadge(project.status);
                                            return (
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                                >
                                                    {badge.label}
                                                </span>
                                            );
                                        })()}
                                        <span className="text-xs text-gray-500">
                                            {project.capacity.utilization}% allocated
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        {project.status === "ACTIVE" && (
                                            <button
                                                onClick={() => handleStatusChange(project.id, "MAINTENANCE")}
                                                disabled={actionLoading}
                                                className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50"
                                            >
                                                <Pause className="w-4 h-4" />
                                            </button>
                                        )}
                                        {project.status === "MAINTENANCE" && (
                                            <button
                                                onClick={() => handleStatusChange(project.id, "ACTIVE")}
                                                disabled={actionLoading}
                                                className="p-1.5 rounded-lg text-green-500 hover:bg-green-50"
                                            >
                                                <Play className="w-4 h-4" />
                                            </button>
                                        )}
                                        {project.status === "DRAFT" && (
                                            <button
                                                onClick={() => handleStatusChange(project.id, "ACTIVE")}
                                                disabled={actionLoading}
                                                className="p-1.5 rounded-lg text-green-500 hover:bg-green-50"
                                            >
                                                <Play className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {projects.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <FolderKanban className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No projects found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Loading overlay for pagination */}
            {loading && projects.length > 0 && (
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
                        projects
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchProjects(pagination.page - 1)}
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
                                            onClick={() => fetchProjects(pageNum)}
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
                            onClick={() => fetchProjects(pagination.page + 1)}
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
                {editingProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setEditingProject(null)}
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
                                    <h2 className="text-xl font-bold text-black">Edit Project</h2>
                                    <button
                                        onClick={() => setEditingProject(null)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingProject.name}
                                        onChange={(e) =>
                                            setEditingProject({ ...editingProject, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        value={editingProject.description}
                                        onChange={(e) =>
                                            setEditingProject({ ...editingProject, description: e.target.value })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={editingProject.location}
                                            onChange={(e) =>
                                                setEditingProject({ ...editingProject, location: e.target.value })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            value={editingProject.state}
                                            onChange={(e) =>
                                                setEditingProject({ ...editingProject, state: e.target.value })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Total Capacity (kW)
                                        </label>
                                        <input
                                            type="number"
                                            value={editingProject.total_kw}
                                            onChange={(e) =>
                                                setEditingProject({
                                                    ...editingProject,
                                                    total_kw: Number(e.target.value),
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Rate (₹/kWh)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editingProject.rate_per_kwh}
                                            onChange={(e) =>
                                                setEditingProject({
                                                    ...editingProject,
                                                    rate_per_kwh: Number(e.target.value),
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        value={editingProject.status}
                                        onChange={(e) =>
                                            setEditingProject({
                                                ...editingProject,
                                                status: e.target.value as ProjectStatus,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="MAINTENANCE">Maintenance</option>
                                        <option value="RETIRED">Retired</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingProject(null)}
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

            {/* Create Project Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowCreateModal(false)}
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
                                    <h2 className="text-xl font-bold text-black">Create New Project</h2>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            SPV ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., MAH-SOLAR-002"
                                            value={newProject.spv_id}
                                            onChange={(e) =>
                                                setNewProject({ ...newProject, spv_id: e.target.value })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Project Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Maharashtra Solar Farm II"
                                            value={newProject.name}
                                            onChange={(e) =>
                                                setNewProject({ ...newProject, name: e.target.value })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Project description..."
                                        value={newProject.description}
                                        onChange={(e) =>
                                            setNewProject({ ...newProject, description: e.target.value })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Nagpur, Maharashtra"
                                            value={newProject.location}
                                            onChange={(e) =>
                                                setNewProject({ ...newProject, location: e.target.value })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Maharashtra"
                                            value={newProject.state}
                                            onChange={(e) =>
                                                setNewProject({ ...newProject, state: e.target.value })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Total Capacity (kW) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 500000"
                                            value={newProject.total_kw || ""}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    total_kw: Number(e.target.value),
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Rate (₹/kWh) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 4.50"
                                            value={newProject.rate_per_kwh || ""}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    rate_per_kwh: Number(e.target.value),
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Initial Status
                                    </label>
                                    <select
                                        value={newProject.status}
                                        onChange={(e) =>
                                            setNewProject({
                                                ...newProject,
                                                status: e.target.value as ProjectStatus,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="ACTIVE">Active</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setNewProject(emptyNewProject);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleCreateProject}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Project"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingProjectId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => {
                            setDeletingProjectId(null);
                            setDeletingProjectName("");
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
                                        <h2 className="text-lg font-bold text-black">Delete Project</h2>
                                        <p className="text-sm text-gray-500">This action cannot be undone</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">{deletingProjectName}</span>? This will
                                    set the project status to retired and mark it as deleted.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setDeletingProjectId(null);
                                            setDeletingProjectName("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleDelete(deletingProjectId)}
                                        disabled={actionLoading}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {actionLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete Project"
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
