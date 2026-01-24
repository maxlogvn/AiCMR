/**
 * EmptyState Component
 *
 * Consistent empty state display with icon, title, description,
 * and optional action button. Used across all dashboard pages
 * when there's no data to display.
 *
 * @see {@link https://ui.shadcn.com/docs/components/empty-state}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * EmptyState - Consistent empty state display
 *
 * @example
 * <EmptyState
 *   icon={<FileText className="h-8 w-8" />}
 *   title="Không có bài viết nào"
 *   description="Bắt đầu bằng cách tạo bài viết đầu tiên của bạn."
 *   action={<Button>Tạo bài viết</Button>}
 * />
 */
export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: React.ComponentProps<"div"> & {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        // Layout
        "flex flex-col items-center justify-center",
        // Spacing
        "py-12 px-4",
        // Text centering
        "text-center",
        className,
      )}
      {...props}
    >
      {/* Icon Container */}
      <div
        className={cn(
          // Size and shape
          "flex h-16 w-16 items-center justify-center",
          "rounded-full",
          // Background
          "bg-muted/50",
        )}
      >
        {/* Icon */}
        <div className="h-8 w-8 text-muted-foreground">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3
        className={cn(
          // Typography
          "text-lg font-semibold text-foreground",
          // Spacing
          "mt-4",
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            // Typography
            "text-sm text-muted-foreground",
            // Spacing and layout
            "mt-2 max-w-sm mx-auto",
          )}
        >
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/**
 * Preset empty states for common contexts
 */

import { FileText, FolderTree, Tag, Users, Search } from "lucide-react";
import { Button } from "./button";
import { Plus } from "lucide-react";

/**
 * Empty state for posts/pages
 */
export function EmptyPosts({
  title = "Không có bài viết nào",
  description = "Bắt đầu bằng cách tạo bài viết đầu tiên của bạn.",
  actionLabel = "Tạo bài viết",
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <EmptyState
      icon={<FileText />}
      title={title}
      description={description}
      action={
        onAction ? (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        ) : undefined
      }
    />
  );
}

/**
 * Empty state for categories
 */
export function EmptyCategories({
  title = "Không có danh mục nào",
  description = "Tạo danh mục đầu tiên để tổ chức nội dung của bạn.",
  actionLabel = "Tạo danh mục",
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <EmptyState
      icon={<FolderTree />}
      title={title}
      description={description}
      action={
        onAction ? (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        ) : undefined
      }
    />
  );
}

/**
 * Empty state for tags
 */
export function EmptyTags({
  title = "Không có thẻ nào",
  description = "Tạo thẻ đầu tiên để phân loại bài viết.",
  actionLabel = "Tạo thẻ",
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <EmptyState
      icon={<Tag />}
      title={title}
      description={description}
      action={
        onAction ? (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        ) : undefined
      }
    />
  );
}

/**
 * Empty state for users
 */
export function EmptyUsers({
  title = "Không có người dùng nào",
  description = "Người dùng đầu tiên sẽ là quản trị viên.",
  actionLabel = "Tạo người dùng",
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <EmptyState
      icon={<Users />}
      title={title}
      description={description}
      action={
        onAction ? (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        ) : undefined
      }
    />
  );
}

/**
 * Empty state for search results
 */
export function EmptySearch({
  title = "Không tìm thấy kết quả",
  description = "Thử tìm kiếm với từ khóa khác.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon={<Search />}
      title={title}
      description={description}
    />
  );
}

export { EmptyState as default };
