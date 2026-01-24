"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Edit2,
  MoreVertical,
} from "lucide-react";
import { StatusBadge, type PostStatus as StatusBadgePostStatus } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Post } from "@/types/post";

export type SortField = "title" | "status" | "author" | "created_at" | "updated_at";
export type SortOrder = "asc" | "desc" | null;

interface PostsTableProps {
  posts: Post[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

interface ColumnConfig {
  key: string;
  label: string;
  sortable: boolean;
  sortField: SortField;
  className?: string;
}

const columns: ColumnConfig[] = [
  { key: "title", label: "Tiêu đề", sortable: true, sortField: "title" as SortField, className: "min-w-[200px]" },
  { key: "status", label: "Trạng thái", sortable: true, sortField: "status" as SortField, className: "w-[120px]" },
  { key: "author", label: "Tác giả", sortable: true, sortField: "author" as SortField, className: "w-[150px]" },
  { key: "created_at", label: "Ngày tạo", sortable: true, sortField: "created_at" as SortField, className: "w-[140px]" },
  { key: "updated_at", label: "Cập nhật", sortable: true, sortField: "updated_at" as SortField, className: "w-[140px]" },
  { key: "actions", label: "", sortable: false, sortField: "title" as any, className: "w-[100px]" },
];

export function PostsTable({
  posts,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  isAllSelected,
  isSomeSelected,
  sortField,
  sortOrder,
  onSortChange,
}: PostsTableProps) {
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      const newOrder: SortOrder =
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc";
      onSortChange(field, newOrder);
    } else {
      onSortChange(field, "asc");
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />;
    }
    if (sortOrder === "asc") {
      return <ChevronUp className="h-4 w-4 text-orange-500" />;
    }
    if (sortOrder === "desc") {
      return <ChevronDown className="h-4 w-4 text-orange-500" />;
    }
    return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Convert post status to StatusBadge type
  const getStatusForBadge = (status: string): StatusBadgePostStatus => {
    if (status === "published" || status === "draft" || status === "archived") {
      return status as StatusBadgePostStatus;
    }
    return "draft"; // fallback
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              {/* Checkbox column */}
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={isSomeSelected ? (input) => {
                    if (input) input.indeterminate = true;
                  } : undefined}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-border"
                  aria-label="Select all posts"
                />
              </th>

              {/* Data columns */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider ${column.className || ""}`}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.sortField)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {column.label}
                      {getSortIndicator(column.sortField)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {posts.map((post) => {
              const isSelected = selectedIds.includes(post.id);

              return (
                <tr
                  key={post.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    isSelected ? "bg-orange-50/50 dark:bg-orange-900/10" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          onSelectionChange(selectedIds.filter((id) => id !== post.id));
                        } else {
                          onSelectionChange([...selectedIds, post.id]);
                        }
                      }}
                      className="h-4 w-4 rounded border-border"
                      aria-label={`Select ${post.title}`}
                    />
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <div className="max-w-[300px]">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground truncate">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={getStatusForBadge(post.status)} hideIcon />
                  </td>

                  {/* Author */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {post.author?.username || "-"}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(post.created_at)}
                    </span>
                  </td>

                  {/* Updated Date */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(post.updated_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                        title="Xem bài viết"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => (window.location.href = `/user/posts/${post.id}/edit`)}
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      {/* Mobile dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="lg:hidden">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => (window.location.href = `/user/posts/${post.id}/edit`)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}

            {posts.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">Không có bài viết nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostsTable;
