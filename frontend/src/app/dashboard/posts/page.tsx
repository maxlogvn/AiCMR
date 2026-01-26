"use client";

/**
 * Posts Page - Data Table View with Filtering and Bulk Actions
 *
 * Features:
 * - Data table with sortable columns
 * - Row selection with checkboxes (persisted across pages)
 * - Bulk actions (publish, archive, delete) with custom dialogs
 * - Advanced filters (status, category, date range)
 * - Search with debounce (300ms)
 * - Pagination (20 per page)
 * - URL persistence for filters
 * - Sticky bulk actions bar
 * - Stats cards
 */

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Eye,
  Edit2,
  Trash2,
  Archive,
  CheckCircle2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Table,
  LayoutGrid,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/useDebounce";
import {
  StatsCard,
  EmptyState,
  StatsCardSkeleton,
  PostsCardGrid,
} from "@/components/dashboard";
import { LayoutShell } from "@/components/ui/layout-shell";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { PostsTable, type SortField, type SortOrder } from "@/components/dashboard/PostsTable";
import { PostFilters, type PostFilterValues } from "@/components/dashboard/PostFilters";
import { BulkPublishDialog } from "@/components/dashboard/BulkPublishDialog";
import { BulkArchiveDialog } from "@/components/dashboard/BulkArchiveDialog";
import { BulkDeleteDialog } from "@/components/dashboard/BulkDeleteDialog";
import { usePostSelectionStore } from "@/stores/post-selection-store";
import type { Post, PostStatus } from "@/types/post";

interface Stats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
}

// Default filter values
const defaultFilters: PostFilterValues = {
  status: "all",
  categoryId: "all",
  dateFrom: "",
  dateTo: "",
  search: "",
};

export default function DashboardPostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: userLoading } = useUser();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  // Zustand store for selection (persists across pages)
  const { selectedIds, toggle, setAll, clear, isSelected } = usePostSelectionStore();

  // Dialog states
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Initialize filters from URL
  const getFiltersFromUrl = useCallback((): PostFilterValues => {
    return {
      status: (searchParams.get("status") as PostStatus | "all") || "all",
      categoryId: Number(searchParams.get("categoryId")) || "all",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      search: searchParams.get("search") || "",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<PostFilterValues>(getFiltersFromUrl);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.categoryId !== "all") params.set("categoryId", String(filters.categoryId));
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.search) params.set("search", filters.search);

    const queryString = params.toString();
    const newPath = queryString ? `/dashboard/posts?${queryString}` : "/dashboard/posts";
    router.replace(newPath);
  }, [filters, router]);

  // View mode: table or cards
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Sorting
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const debouncedSearch = useDebounce(filters.search, 300);

  const {
    data: postsData,
    isLoading: postsLoading,
    error,
  } = useQuery<{
    items: Post[];
    total: number;
    page: number;
    size: number;
    pages: number;
    stats: Stats;
  }>({
    queryKey: ["admin", "posts", filters.status, filters.categoryId, filters.dateFrom, filters.dateTo, debouncedSearch, page, sortField, sortOrder],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;

      // Build ordering param
      const ordering = sortOrder
        ? sortOrder === "desc"
          ? `-${sortField}`
          : sortField
        : undefined;

      const response = await api.get("/posts/all", {
        params: {
          status: filters.status === "all" ? undefined : filters.status,
          category_id: filters.categoryId === "all" ? undefined : filters.categoryId,
          date_from: filters.dateFrom || undefined,
          date_to: filters.dateTo || undefined,
          search: debouncedSearch || undefined,
          page: page,
          size: pageSize,
          ordering,
        },
      });
      return response.data;
    },
  });

  const posts = postsData?.items || [];
  const stats = postsData?.stats || {
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
  };

  // Mutations
  const publishMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/posts/bulk/publish", { post_ids: postIds });
    },
    onSuccess: (_, variables) => {
      showSuccess(`Đã đăng ${variables.length} bài viết`);
      clear();
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      setPublishDialogOpen(false);
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Đăng bài thất bại");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/posts/bulk/archive", { post_ids: postIds });
    },
    onSuccess: (_, variables) => {
      showSuccess(`Đã lưu trữ ${variables.length} bài viết`);
      clear();
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      setArchiveDialogOpen(false);
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Lưu trữ thất bại");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/posts/bulk/delete", { post_ids: postIds });
    },
    onSuccess: (_, variables) => {
      showSuccess(`Đã xóa ${variables.length} bài viết`);
      clear();
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Xóa thất bại");
    },
  });

  // Handlers
  const handleFilterChange = (newFilters: PostFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleSelectAll = () => {
    if (posts.length > 0 && selectedIds.length === posts.length) {
      clear();
    } else {
      setAll(posts.map((p) => p.id));
    }
  };

  const handlePublish = () => {
    if (selectedIds.length === 0) {
      showError("Vui lòng chọn ít nhất một bài viết");
      return;
    }
    setPublishDialogOpen(true);
  };

  const handleArchive = () => {
    if (selectedIds.length === 0) {
      showError("Vui lòng chọn ít nhất một bài viết");
      return;
    }
    setArchiveDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      showError("Vui lòng chọn ít nhất một bài viết");
      return;
    }
    setDeleteDialogOpen(true);
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  };

  const isAllSelected = posts.length > 0 && selectedIds.length === posts.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < posts.length;

  if (userLoading || postsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
          <div>
            <div className="h-7 w-48 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
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

  return (
    <div className="relative pb-20">
      {/* Page Header with LayoutShell */}
      <LayoutShell
        title="Quản lý bài đăng"
        subtitle="Quản lý tất cả bài viết trong hệ thống"
        icon={FileText}
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 transition-colors ${
                  viewMode === "table"
                    ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                    : "hover:bg-muted"
                }`}
                title="Table view"
              >
                <Table className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 transition-colors ${
                  viewMode === "cards"
                    ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                    : "hover:bg-muted"
                }`}
                title="Card view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <Button onClick={() => (window.location.href = "/user/posts/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài viết
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Tổng số"
          value={stats.total}
          icon={FileText}
          changeLabel="bài viết"
        />
        <StatsCard
          title="Đã đăng"
          value={stats.published}
          icon={CheckCircle2}
          changeLabel="công khai"
        />
        <StatsCard
          title="Draft"
          value={stats.drafts}
          icon={Edit2}
          changeLabel="nháp thảo"
        />
        <StatsCard
          title="Lưu trữ"
          value={stats.archived}
          icon={Archive}
          changeLabel="đã lưu"
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <PostFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchInput
          value={filters.search}
          onChange={(value) => handleFilterChange({ ...filters, search: value })}
          isLoading={postsLoading && filters.search !== debouncedSearch}
          placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
        />

        {/* Sort indicator */}
        {sortOrder && (
          <div className="mt-2 text-xs text-muted-foreground">
            Sắp xếp: <span className="font-medium">{sortField === "created_at" ? "ngày tạo" : sortField === "title" ? "tiêu đề" : sortField === "author" ? "tác giả" : sortField}</span>
            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
            <button
              onClick={() => { setSortOrder(null); }}
              className="ml-2 text-orange-600 hover:underline"
            >
              Bỏ
            </button>
          </div>
        )}
      </div>

      {/* Content View - Table or Cards */}
      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Không tìm thấy bài viết nào"
          description="Thử thay đổi bộ lọc hoặc tạo bài viết mới"
          actionLabel="Tạo bài viết"
          onAction={() => (window.location.href = "/user/posts/new")}
        />
      ) : viewMode === "cards" ? (
        <>
          <PostsCardGrid
            posts={posts}
            selectedIds={new Set(selectedIds)}
            onSelectionChange={(ids) => setAll(Array.from(ids))}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={handleSelectAll}
            onClear={clear}
            layout="grid"
          />

          {/* Pagination */}
          {postsData && postsData.total > pageSize && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <span className="text-sm text-muted-foreground">
                Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, postsData.total)} trong số {postsData.total} bài viết
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Trang {page} / {postsData.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!postsData || page >= postsData.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <PostsTable
            posts={posts}
            selectedIds={selectedIds}
            onSelectionChange={(ids) => setAll(ids)}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Pagination */}
          {postsData && postsData.total > pageSize && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <span className="text-sm text-muted-foreground">
                Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, postsData.total)} trong số {postsData.total} bài viết
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Trang {page} / {postsData.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!postsData || page >= postsData.pages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Sticky Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 pb-safe bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white shadow-lg animate-in slide-in-from-bottom-4 duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm font-medium">
              ✓ Đã chọn <span className="font-bold text-lg mx-1">{selectedIds.length}</span> bài viết
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <Button
                size="sm"
                variant="secondary"
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                className="h-11 min-h-[44px]"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Đăng bài
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleArchive}
                disabled={archiveMutation.isPending}
                className="h-11 min-h-[44px]"
              >
                <Archive className="h-4 w-4 mr-1" />
                Lưu trữ
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white h-11 min-h-[44px]"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clear}
                className="text-white hover:bg-white/20 h-11 min-h-[44px]"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <BulkPublishDialog
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        postCount={selectedIds.length}
        onConfirm={() => publishMutation.mutate(selectedIds)}
        isPending={publishMutation.isPending}
      />

      <BulkArchiveDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        postCount={selectedIds.length}
        onConfirm={() => archiveMutation.mutate(selectedIds)}
        isPending={archiveMutation.isPending}
      />

      <BulkDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        postCount={selectedIds.length}
        onConfirm={() => deleteMutation.mutate(selectedIds)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
