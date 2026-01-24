"use client";

import { useState } from "react";
import { X, Filter, Calendar, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { PostStatus } from "@/types/post";

export interface PostFilterValues {
  status: PostStatus | "all";
  categoryId: number | "all";
  dateFrom: string;
  dateTo: string;
  search: string;
}

interface PostFiltersProps {
  filters: PostFilterValues;
  onChange: (filters: PostFilterValues) => void;
  onClear: () => void;
}

// Get status label
const getStatusLabel = (status: PostStatus | "all"): string => {
  const labels: Record<PostStatus | "all", string> = {
    all: "Tất cả trạng thái",
    draft: "Draft",
    published: "Đã đăng",
    archived: "Lưu trữ",
  };
  return labels[status] || status;
};

export function PostFilters({ filters, onChange, onClear }: PostFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;
      const response = await api.get("/categories/");
      return response.data.items || response.data;
    },
  });

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.categoryId !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.search;

  const updateFilter = (key: keyof PostFilterValues, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilter = (key: keyof PostFilterValues) => {
    const defaultValues: Partial<PostFilterValues> = {
      status: "all",
      categoryId: "all",
      dateFrom: "",
      dateTo: "",
    };
    onChange({
      ...filters,
      [key]: defaultValues[key],
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Button + Active Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Bộ lọc
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-xs">
              {[filters.status !== "all", filters.categoryId !== "all", filters.dateFrom, filters.dateTo].filter(
                Boolean
              ).length}
            </span>
          )}
        </Button>

        {/* Active Filter Chips */}
        {filters.status !== "all" && (
          <FilterChip label={getStatusLabel(filters.status)} onRemove={() => clearFilter("status")} />
        )}
        {filters.categoryId !== "all" && (
          <FilterChip
            label={categories.find((c: any) => c.id === filters.categoryId)?.name || `Category ${filters.categoryId}`}
            onRemove={() => clearFilter("categoryId")}
          />
        )}
        {filters.dateFrom && (
          <FilterChip label={`Từ: ${filters.dateFrom}`} onRemove={() => clearFilter("dateFrom")} />
        )}
        {filters.dateTo && (
          <FilterChip label={`Đến: ${filters.dateTo}`} onRemove={() => clearFilter("dateTo")} />
        )}
        {filters.search && (
          <FilterChip label={`Tìm: "${filters.search}"`} onRemove={() => updateFilter("search", "")} />
        )}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="p-4 rounded-lg border bg-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value as PostStatus | "all")}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="draft">Draft</option>
                <option value="published">Đã đăng</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Danh mục</label>
              <select
                value={String(filters.categoryId)}
                onChange={(e) => updateFilter("categoryId", e.target.value === "all" ? "all" : Number(e.target.value))}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
              />
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setIsExpanded(false)}>
              Áp dụng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Filter Chip Component
interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-sm">
      <Tag className="h-3 w-3" />
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 p-0.5"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export default PostFilters;
