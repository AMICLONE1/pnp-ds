import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/toast";

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

export function useProjects(){
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
    
    return{
        projects,
        loading,
        pagination,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        editingProject,
        setEditingProject,
        deletingProjectId,
        setDeletingProjectId,
        deletingProjectName,
        setDeletingProjectName,
        actionLoading,
        showFilters,
        setShowFilters,
        showCreateModal,
        setShowCreateModal,
        newProject,
        setNewProject,
        fetchProjects,
        handleSearch,
        handleEditStart,
        handleEditSave,
        handleStatusChange,
        handleDelete,
        handleCreateProject,
        getStatusBadge,
        formatDate,
        formatNumber
    }
}