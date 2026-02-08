"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  X,
  Check,
  UserCheck,
  UserX,
  Shield,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Zap,
  Loader2,
  AlertTriangle,
} from "lucide-react";

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

export default function AdminUsersPage() {
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

  // Skeleton loading
  if (loading && users.length === 0) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-100 rounded-lg" />
          <div className="h-10 w-64 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-12 w-full bg-gray-100 rounded-xl" />
        {[...Array(8)].map((_, i) => (
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
            User Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage and monitor all registered users
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl self-start">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {pagination.total} Total Users
          </span>
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
                    placeholder="Search by name, email, or phone..."
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
                      setRoleFilter("all");
                      fetchUsers(1);
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
                          onChange={(e) => {
                            setStatusFilter(e.target.value);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="deleted">Deleted</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          Role
                        </label>
                        <select
                          value={roleFilter}
                          onChange={(e) => {
                            setRoleFilter(e.target.value);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                        >
                          <option value="all">All Roles</option>
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => fetchUsers(1)}
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

      {/* Users Table - Desktop */}
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
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    KYC Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Allocations
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      user.deleted_at ? "opacity-60" : ""
                    }`}
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gold/10 text-gold-dark"
                          }`}
                        >
                          {(user.name || user.email)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-black text-sm">
                            {user.name || "—"}
                          </p>
                          {user.deleted_at && (
                            <span className="text-xs text-red-500 font-medium">
                              Deleted
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate max-w-[180px]">
                            {user.email}
                          </span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {(() => {
                        const badge = getRoleBadge(user.role);
                        return (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                          >
                            {user.role === "ADMIN" ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <UserCheck className="w-3 h-3" />
                            )}
                            {badge.label}
                          </span>
                        );
                      })()}
                    </td>

                    {/* KYC Status */}
                    <td className="px-6 py-4">
                      {(() => {
                        const badge = getKycBadge(user.kyc_status);
                        return (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        );
                      })()}
                    </td>

                    {/* Allocations */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Zap className="w-3.5 h-3.5 text-gold" />
                        <span className="text-gray-700">
                          {user.allocations.totalCapacity > 0
                            ? `${user.allocations.totalCapacity} kW`
                            : "None"}
                        </span>
                        {user.allocations.count > 0 && (
                          <span className="text-xs text-gray-400">
                            ({user.allocations.count})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditStart(user)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Edit user"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {!user.deleted_at && (
                          <button
                            onClick={() => setDeletingUserId(user.id)}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <UserX className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No users found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Users Cards - Mobile/Tablet */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:hidden space-y-3"
      >
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`${user.deleted_at ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gold/10 text-gold-dark"
                      }`}
                    >
                      {(user.name || user.email)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm">
                        {user.name || "—"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditStart(user)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {!user.deleted_at && (
                      <button
                        onClick={() => setDeletingUserId(user.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-3 h-3 text-gray-400" />
                    {user.phone || "—"}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {formatDate(user.created_at)}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Zap className="w-3 h-3 text-gold" />
                    {user.allocations.totalCapacity > 0
                      ? `${user.allocations.totalCapacity} kW`
                      : "No allocations"}
                  </div>
                  {user.state && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {user.state}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  {(() => {
                    const roleBadge = getRoleBadge(user.role);
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <UserCheck className="w-3 h-3" />
                        )}
                        {roleBadge.label}
                      </span>
                    );
                  })()}
                  {(() => {
                    const kycBadge = getKycBadge(user.kyc_status);
                    return (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${kycBadge.bg} ${kycBadge.text}`}
                      >
                        {kycBadge.label}
                      </span>
                    );
                  })()}
                  {user.deleted_at && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Deleted
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {users.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <UserX className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No users found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </motion.div>

      {/* Loading overlay for pagination */}
      {loading && users.length > 0 && (
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
              {Math.min(
                pagination.page * pagination.limit,
                pagination.total
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-black">{pagination.total}</span>{" "}
            users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUsers(pagination.page - 1)}
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
                  } else if (
                    pagination.page >=
                    pagination.totalPages - 2
                  ) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchUsers(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        pageNum === pagination.page
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
              onClick={() => fetchUsers(pagination.page + 1)}
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
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingUser(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Edit User</h2>
                    <p className="text-sm text-gray-500">
                      Update user information
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <Input
                  label="Full Name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  placeholder="Enter name"
                />
                <Input
                  label="Email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
                <Input
                  label="Phone"
                  value={editingUser.phone}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1.5">
                      Role
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value as "USER" | "ADMIN",
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1.5">
                      KYC Status
                    </label>
                    <select
                      value={editingUser.kyc_status}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          kyc_status: e.target.value as
                            | "PENDING"
                            | "SUBMITTED"
                            | "VERIFIED"
                            | "REJECTED",
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="State"
                    value={editingUser.state}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, state: e.target.value })
                    }
                    placeholder="Enter state"
                  />
                  <Input
                    label="DISCOM"
                    value={editingUser.discom}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, discom: e.target.value })
                    }
                    placeholder="Enter discom"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEditSave}
                  isLoading={actionLoading}
                  className="px-6"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUserId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeletingUserId(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-black mb-2">
                  Delete User
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Are you sure you want to delete this user? This action will
                  soft-delete the account. The user will no longer be able to
                  access the platform.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingUserId(null)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <button
                    onClick={() => handleDelete(deletingUserId)}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1.5" />
                    )}
                    Delete User
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
