"use client";

/**
 * PostsCardGrid Component
 *
 * Grid layout for displaying posts as cards.
 * Supports selection, select all, and responsive layout.
 *
 * Features:
 * - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
 * - Select all functionality
 * - Selection count display
 * - Works with usePostSelectionStore
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyPosts } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/CardSkeleton";
import { PostCard, PostCardCompact } from "./PostCard";
import type { Post } from "@/types/post";

/**
 * PostsCardGrid Props
 */
interface PostsCardGridProps {
  posts?: Post[];
  selectedIds?: Set<number> | number[];
  onSelectionChange?: (ids: Set<number>) => void;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  onSelectAll?: () => void;
  onClear?: () => void;
  isLoading?: boolean;
  layout?: "grid" | "list";
  className?: string;
}

/**
 * PostsCardGrid - Grid/list layout for post cards
 *
 * @example
 * <PostsCardGrid
 *   posts={posts}
 *   selectedIds={selectedIds}
 *   onSelectionChange={(ids) => setSelectedIds(ids)}
 *   isAllSelected={isAllSelected}
 *   isSomeSelected={isSomeSelected}
 *   onSelectAll={handleSelectAll}
 *   layout="grid"
 * />
 */
export function PostsCardGrid({
  posts = [],
  selectedIds = new Set(),
  onSelectionChange,
  isAllSelected = false,
  isSomeSelected = false,
  onSelectAll,
  onClear,
  isLoading = false,
  layout = "grid",
  className,
}: PostsCardGridProps) {
  const router = useRouter();

  // Convert selectedIds to Set for easier checking
  const selectedSet = React.useMemo(
    () => (selectedIds instanceof Set ? selectedIds : new Set(selectedIds)),
    [selectedIds]
  );

  // Handle individual post selection
  const handlePostSelection = React.useCallback(
    (postId: number, selected: boolean) => {
      const newSet = new Set(selectedSet);
      if (selected) {
        newSet.add(postId);
      } else {
        newSet.delete(postId);
      }
      onSelectionChange?.(newSet);
    },
    [selectedSet, onSelectionChange]
  );

  // Navigate to post view
  const handleView = React.useCallback(
    (post: Post) => {
      if (post.slug) {
        router.push(`/blog/${post.slug}`);
      } else {
        router.push(`/blog/${post.id}`);
      }
    },
    [router]
  );

  // Navigate to post edit
  const handleEdit = React.useCallback(
    (post: Post) => {
      router.push(`/user/posts/${post.id}/edit`);
    },
    [router]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-48 bg-muted/50 rounded animate-pulse" />
        </div>
        <div
          className={cn(
            "grid gap-4",
            layout === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} showImage={layout === "grid"} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <EmptyPosts
        title="Không tìm thấy bài viết nào"
        description="Thử thay đổi bộ lọc hoặc tạo bài viết mới"
        actionLabel="Tạo bài viết"
        onAction={() => (window.location.href = "/user/posts/new")}
      />
    );
  }

  const selectedCount = selectedSet.size;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selection Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Select All Checkbox */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isSomeSelected && !isAllSelected;
                }
              }}
              onChange={onSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20 cursor-pointer"
            />
            <label
              htmlFor="select-all-posts"
              className="ml-2 text-sm text-muted-foreground cursor-pointer"
              onClick={onSelectAll}
            >
              Chọn tất cả ({posts.length})
            </label>
          </div>

          {/* Selection Count */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                {selectedCount} đã chọn
              </span>
              <button
                onClick={onClear}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Bỏ chọn
              </button>
            </div>
          )}
        </div>

        {/* Layout Toggle (optional - can be controlled by parent) */}
        <div className="text-sm text-muted-foreground">
          {posts.length} bài viết
        </div>
      </div>

      {/* Grid/List Layout */}
      <div
        className={cn(
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "grid grid-cols-1 gap-3",
          "transition-all duration-200"
        )}
      >
        {posts.map((post) => {
          const isSelected = selectedSet.has(post.id);
          const CardComponent = layout === "grid" ? PostCard : PostCardCompact;

          return (
            <CardComponent
              key={post.id}
              post={post}
              selected={isSelected}
              onSelectionChange={(selected) =>
                handlePostSelection(post.id, selected)
              }
              onView={() => handleView(post)}
              onEdit={() => handleEdit(post)}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact list view component for dense information display
 */
interface PostsListViewProps extends Omit<PostsCardGridProps, "layout"> {}

export function PostsListView(props: PostsListViewProps) {
  return <PostsCardGrid {...props} layout="list" />;
}

export { PostsCardGrid as default };
