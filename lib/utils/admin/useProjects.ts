import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/toast";

type ProjectStatus = "DRAFT" | "ACTIVE" | "MAINTENANCE" | "RETIRED";

interface ProjectCapacity {
    allocated: number;
    available: number;
    utilization: number;
}

interface ProjectHost {
    id: string;
    business_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
}

interface ProjectAgreement {
    id: string;
    agreement_number: string;
    status: string;
    rate_per_kwh: number;
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
    host_id: string | null;
    data_logger_serial_id: string | null;
    logger_api_key: string | null;
    trillectric_site_ids: string[] | null;
    host?: ProjectHost | null;
    agreement?: ProjectAgreement | null;
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
    logger_api_key?: string;
    trillectric_site_ids?: string;
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
    logger_api_key?: string;
    trillectric_site_ids: string;
    host_business_name: string;
    host_contact_name: string;
    host_contact_email: string;
    host_contact_phone: string;
    host_password: string;
    ppa_document?: File | null;
    insurance_document?: File | null;
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
    logger_api_key: undefined,
    trillectric_site_ids: "",
    host_business_name: "",
    host_contact_name: "",
    host_contact_email: "",
    host_contact_phone: "",
    host_password: "",
    ppa_document: null,
    insurance_document: null,
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
                    const errMsg = typeof result.error === "string"
                        ? result.error
                        : result.error?.message || "Failed to fetch projects";
                    throw new Error(errMsg);
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
            logger_api_key: project.logger_api_key || "",
            trillectric_site_ids: (project.trillectric_site_ids || []).join(", "),
        });
    };

    const extractError = (error: any, fallback: string): string => {
        if (typeof error === "string") return error;
        if (error && typeof error === "object" && error.message) return error.message;
        return fallback;
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
                throw new Error(extractError(result.error, "Failed to update project"));
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
                throw new Error(extractError(result.error, "Failed to update status"));
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
                throw new Error(extractError(result.error, "Failed to delete project"));
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
        if (
            !newProject.spv_id ||
            !newProject.name ||
            !newProject.location ||
            !newProject.state ||
            !newProject.trillectric_site_ids.trim() ||
            !newProject.host_business_name ||
            !newProject.host_contact_name ||
            !newProject.host_contact_email ||
            !newProject.host_contact_phone ||
            !newProject.host_password
        ) {
            showToast("error", "Please fill in all required fields");
            return;
        }

        if (newProject.host_password.length < 12) {
            showToast("error", "Use at least 12 characters for the initial host password");
            return;
        }

        // Allowed mime types for PPA + insurance docs (PDF or Word).
        const ALLOWED_DOC_TYPES = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const MAX_DOC_BYTES = 10 * 1024 * 1024;

        const validateDoc = (file: File | null | undefined, label: string): boolean => {
            if (!file) return true;
            if (!ALLOWED_DOC_TYPES.includes(file.type)) {
                showToast("error", `${label} must be a PDF or Word document`);
                return false;
            }
            if (file.size > MAX_DOC_BYTES) {
                showToast("error", `${label} must be under 10MB`);
                return false;
            }
            return true;
        };

        if (!validateDoc(newProject.ppa_document, "PPA document")) return;
        if (!validateDoc(newProject.insurance_document, "Plant insurance")) return;

        setActionLoading(true);
        try {
            const formData = new FormData();
            formData.append("spv_id", newProject.spv_id);
            formData.append("name", newProject.name);
            formData.append("description", newProject.description);
            formData.append("location", newProject.location);
            formData.append("state", newProject.state);
            formData.append("total_kw", String(newProject.total_kw));
            formData.append("rate_per_kwh", String(newProject.rate_per_kwh));
            formData.append("status", newProject.status);
            if (newProject.logger_api_key) {
                formData.append("logger_api_key", newProject.logger_api_key);
            }
            // API normalises this CSV into a TEXT[].
            formData.append("trillectric_site_ids", newProject.trillectric_site_ids.trim());
            formData.append("host_business_name", newProject.host_business_name);
            formData.append("host_contact_name", newProject.host_contact_name);
            formData.append("host_contact_email", newProject.host_contact_email);
            formData.append("host_contact_phone", newProject.host_contact_phone);
            formData.append("host_password", newProject.host_password);
            if (newProject.ppa_document) {
                formData.append("ppa_document", newProject.ppa_document);
            }
            if (newProject.insurance_document) {
                formData.append("insurance_document", newProject.insurance_document);
            }

            const res = await fetch("/api/admin/projects", {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(extractError(result.error, "Failed to create project"));
            }

            showToast("success", "Project, host, and logger provisioned successfully");
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