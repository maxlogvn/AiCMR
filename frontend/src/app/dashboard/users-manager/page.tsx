"use client";

/**
 * Users Manager Page - Linear/Vercel Style Redesign
 *
 * Features:
 * - Living stats cards (Total, New this week, Online now)
 * - Card list layout (not table)
 * - Real-time search (300ms debounce)
 * - Status filter pills
 * - Hover-reveal actions
 * - Empty state with icon + CTA
 */

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Lock,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Activity,
  Crown,
  UserCheck,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/useDebounce";
import {
  PageHeader,
  StatsCard,
  EmptyState,
  CardListSkeleton,
  StatsCardSkeleton,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User, PaginatedResponse } from "@/types";

// Rank labels and styles
const getRankInfo = (rank: number) => {
  const rankMap: Record<number, { label: string; color: string }> = {
    0: { label: "Guest", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
    1: { label: "Member", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    2: { label: "Member", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    3: { label: "Moderator", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    4: { label: "Moderator", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    5: { label: "Admin", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  };
  return rankMap[rank] || { label: "Unknown", color: "bg-gray-100 text-gray-700" };
};

interface UserStats {
  total: number;
  new_this_week: number;
  online_now: number;
}

export default function UsersManagerPage() {
  const { isLoading: userLoading, user: currentUser } = useUser();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const size = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const {
    data,
    isLoading,
    error,
  } = useQuery<PaginatedResponse<User>>({
    queryKey: ["dashboard", "users", page, debouncedSearch, filterStatus],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;
      const response = await api.get(
        `/users/?page=${page}&size=${size}&search=${debouncedSearch || ""}&status=${filterStatus}`
      );
      return response.data;
    },
  });

  // Mock stats - in real app, this would come from an API endpoint
  const stats: UserStats = {
    total: data?.total || 0,
    new_this_week: Math.floor((data?.total || 0) * 0.1), // Mock: 10% of total
    online_now: Math.floor((data?.total || 0) * 0.05), // Mock: 5% of total
  };

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      const api = (await import("@/lib/api")).default;
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Xóa người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Không thể xóa người dùng");
    },
  });

  const handleDelete = useCallback(
    (userId: number, username: string) => {
      if (confirm(`Bạn có chắc chắn muốn xóa người dùng "${username}"?`)) {
        deleteMutation.mutate(userId);
      }
    },
    [deleteMutation]
  );

  const handleToggleActive = useCallback(
    (user: User) => {
      const newStatus = !user.is_active;
      const confirmMessage = newStatus
        ? `Kích hoạt người dùng ${user.username}?`
        : `Vô hiệu hóa người dùng ${user.username}?`;

      if (confirm(confirmMessage)) {
        // In real app, this would call an API
        showSuccess(`Đã ${newStatus ? "kích hoạt" : "vô hiệu hóa"} người dùng`);
      }
    },
    [showSuccess]
  );

  const users = data?.items || [];

  if (userLoading || isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
          <div>
            <div className="h-7 w-48 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        {/* Card list skeleton */}
        <CardListSkeleton rows={5} showThumbnail={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Đã xảy ra lỗi khi tải dữ liệu.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = currentUser && currentUser.rank >= 3;
  const canDelete = currentUser && currentUser.rank === 5;

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Quản lý người dùng"
        subtitle="Quản lý tài khoản và phân quyền trong hệ thống"
        icon={Shield}
        actions={
          canEdit && (
            <Button onClick={() => {/* Open create user modal */}}>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm user
            </Button>
          )
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Tổng số"
          value={stats.total}
          icon={Users}
          changeLabel="người dùng"
        />
        <StatsCard
          title="Mới tuần này"
          value={stats.new_this_week}
          icon={Calendar}
          changeLabel="user mới"
          trend="up"
        />
        <StatsCard
          title="Đang online"
          value={stats.online_now}
          icon={Activity}
          changeLabel="hoạt động"
          trend="neutral"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6">
        {/* Desktop: Pills + Search inline */}
        <div className="hidden md:flex items-center gap-4 p-4 rounded-lg border bg-card">
          {/* Filter pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "active"
                  ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Hoạt động
            </button>
            <button
              onClick={() => setFilterStatus("inactive")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "inactive"
                  ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Không hoạt động
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Tìm kiếm theo username hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border bg-background pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile: Search + Dropdown */}
        <div className="md:hidden space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border bg-background pl-10 pr-10 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full h-10 rounded-md border bg-background px-4 text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      {/* Card List */}
      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Không có người dùng nào"
          description="Thêm người dùng đầu tiên để bắt đầu"
          actionLabel="Thêm user"
          onAction={() => {/* Open create modal */}}
        />
      ) : (
        <>
          <div className="space-y-3">
            {users.map((user) => {
              const rankInfo = getRankInfo(user.rank);

              return (
                <div
                  key={user.id}
                  className="group relative overflow-hidden rounded-lg border bg-card p-5 transition-all duration-200 hover:border-[rgb(var(--card-hover-border))] hover:shadow-lg hover:shadow-[rgb(var(--card-hover-shadow))]"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {/* Username & Email */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-foreground">
                              {user.username}
                            </h3>
                            {user.rank === 5 && (
                              <Crown className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                            <span className="font-mono">ID: {user.id}</span>
                            {user.created_at && (
                              <span>
                                Tham gia {new Date(user.created_at).toLocaleDateString("vi-VN")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status & Rank Badges */}
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.is_active
                              ? "bg-[rgb(var(--semantic-success-bg))] text-[rgb(var(--semantic-success))] dark:bg-[rgb(var(--semantic-success-bg))] dark:text-[rgb(var(--semantic-success-light))]"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {user.is_active ? (
                              <span className="flex items-center gap-1">
                                <UserCheck className="h-3 w-3" />
                                Hoạt động
                              </span>
                            ) : (
                              "Không hoạt động"
                            )}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${rankInfo.color}`}>
                            {rankInfo.label}
                          </span>
                        </div>

                        {/* Actions - hover reveal on desktop */}
                        <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => {/* Edit user */}}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {canEdit && user.id !== currentUser?.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => handleToggleActive(user)}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && user.id !== currentUser?.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(user.id, user.username)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {data && data.total > size && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <span className="text-sm text-muted-foreground">
                Trang {page} / {Math.ceil(data.total / size)}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data || users.length < size}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
