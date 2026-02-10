import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/toast";

interface UserAllocation {
  count: number;
  totalCapacity: number;
}

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN";
  kyc_status: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";
  state: string | null;
  discom: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  allocations: UserAllocation;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EditingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  kyc_status: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";
  state: string;
  discom: string;
}

export function useUsers(){
    const { showToast } = useToast();
      const [users, setUsers] = useState<AdminUser[]>([]);
      const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
      const [loading, setLoading] = useState(true);
      const [searchQuery, setSearchQuery] = useState("");
      const [statusFilter, setStatusFilter] = useState("all");
      const [roleFilter, setRoleFilter] = useState("all");
      const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
      const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
      const [actionLoading, setActionLoading] = useState(false);
      const [showFilters, setShowFilters] = useState(false);
    
      const fetchUsers = useCallback(
        async (page = 1) => {
          setLoading(true);
          try {
            const params = new URLSearchParams({
              page: page.toString(),
              limit: "20",
              ...(searchQuery && { search: searchQuery }),
              ...(statusFilter !== "all" && { status: statusFilter }),
              ...(roleFilter !== "all" && { role: roleFilter }),
            });
    
            const res = await fetch(`/api/admin/users?${params}`, {
              credentials: "include",
            });
            const result = await res.json();
    
            if (!result.success) {
              throw new Error(result.error || "Failed to fetch users");
            }
    
            setUsers(result.data.users);
            setPagination(result.data.pagination);
          } catch (error) {
            console.error("Error fetching users:", error);
            showToast("error", "Failed to load users. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        [searchQuery, statusFilter, roleFilter, showToast]
      );
    
      useEffect(() => {
        fetchUsers();
      }, [fetchUsers]);
    
      const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(1);
      };
    
      const handleEditStart = (user: AdminUser) => {
        setEditingUser({
          id: user.id,
          name: user.name || "",
          email: user.email,
          phone: user.phone || "",
          role: user.role,
          kyc_status: user.kyc_status,
          state: user.state || "",
          discom: user.discom || "",
        });
      };
    
      const handleEditSave = async () => {
        if (!editingUser) return;
        setActionLoading(true);
        try {
          const res = await fetch("/api/admin/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(editingUser),
          });
          const result = await res.json();
    
          if (!result.success) {
            throw new Error(result.error || "Failed to update user");
          }
    
          showToast("success", "User updated successfully");
          setEditingUser(null);
          fetchUsers(pagination.page);
        } catch (error) {
          console.error("Error updating user:", error);
          showToast(
            "error",
            error instanceof Error ? error.message : "Failed to update user"
          );
        } finally {
          setActionLoading(false);
        }
      };
    
      const handleDelete = async (userId: string) => {
        setActionLoading(true);
        try {
          const res = await fetch(`/api/admin/users?id=${userId}`, {
            method: "DELETE",
            credentials: "include",
          });
          const result = await res.json();
    
          if (!result.success) {
            throw new Error(result.error || "Failed to delete user");
          }
    
          showToast("success", "User deleted successfully");
          setDeletingUserId(null);
          fetchUsers(pagination.page);
        } catch (error) {
          console.error("Error deleting user:", error);
          showToast(
            "error",
            error instanceof Error ? error.message : "Failed to delete user"
          );
        } finally {
          setActionLoading(false);
        }
      };
    
      const getKycBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> =
          {
            VERIFIED: {
              bg: "bg-green-100",
              text: "text-green-700",
              label: "Verified",
            },
            SUBMITTED: {
              bg: "bg-blue-100",
              text: "text-blue-700",
              label: "Submitted",
            },
            PENDING: {
              bg: "bg-yellow-100",
              text: "text-yellow-700",
              label: "Pending",
            },
            REJECTED: {
              bg: "bg-red-100",
              text: "text-red-700",
              label: "Rejected",
            },
          };
        return badges[status] || badges.PENDING;
      };
    
      const getRoleBadge = (role: string) => {
        if (role === "ADMIN") {
          return { bg: "bg-purple-100", text: "text-purple-700", label: "Admin" };
        }
        return { bg: "bg-gray-100", text: "text-gray-700", label: "User" };
      };
    
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      };

      return{
        users,
        pagination,
        loading,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,
        editingUser,
        setEditingUser,
        deletingUserId,
        setDeletingUserId,
        actionLoading,
        setActionLoading,
        showFilters,
        setShowFilters,
        fetchUsers,
        handleSearch,
        handleEditStart,
        handleEditSave,
        handleDelete,
        getKycBadge,
        getRoleBadge,
        formatDate
      }
}