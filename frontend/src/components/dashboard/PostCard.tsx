/**
 * PostCard Component
 *
 * Card-based display for individual posts in the dashboard.
 * Shows thumbnail, title, excerpt, metadata, status badge, and actions.
 *
 * Features:
 * - Checkbox for bulk selection
 * - Selected state with orange border highlight
 * - Hover actions (View, Edit, More) revealed on desktop
 * - Always-visible actions on mobile
 * - Responsive layout
 */

import * as React from "react";
import Image from "next/image";
import {
  Eye,
  Edit2,
  MoreVertical,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import type { Post } from "@/types/post";

/**
 * PostCard Props
 */
interface PostCardProps {
  post: Post;
  selected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  onView?: () => void;
  onEdit?: () => void;
  className?: string;
}

/**
 * PostCard - Individual post card for dashboard
 *
 * @example
 * <PostCard
 *   post={post}
 *   selected={selected}
 *   onSelectionChange={(checked) => toggle(post.id)}
 *   onView={() => router.push(`/blog/${post.slug}`)}
 *   onEdit={() => router.push(`/user/posts/${post.id}/edit`)}
 * />
 */
export function PostCard({
  post,
  selected = false,
  onSelectionChange,
  onView,
  onEdit,
  className,
}: PostCardProps) {
  const [imageError, setImageError] = React.useState(false);

  // Format date relative to now
  const formattedDate = React.useMemo(() => {
    if (!post.created_at) return "";
    try {
      const date = new Date(post.created_at);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "";
    }
  }, [post.created_at]);

  // Get excerpt from content
  const excerpt = React.useMemo(() => {
    if (!post.content) return "";
    // Strip HTML tags
    const text = post.content.replace(/<[^>]*>/g, "");
    // Get first 100 characters
    return text.slice(0, 100) + (text.length > 100 ? "..." : "");
  }, [post.content]);

  return (
    <Card
      data-slot="post-card"
      data-selected={selected}
      hover
      selected={selected}
      className={cn(
        // Relative positioning for absolute elements
        "relative",
        // Group for hover effects
        "group",
        className,
      )}
    >
      {/* Checkbox - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectionChange?.(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <StatusBadge status={post.status} />
      </div>

      {/* Thumbnail */}
      {post.thumbnail_image?.url && !imageError ? (
        <div className="aspect-video w-full rounded-md overflow-hidden bg-muted mb-3 mt-6">
          <Image
            src={post.thumbnail_image?.url}
            alt={post.title || "Post thumbnail"}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-md bg-muted/50 flex items-center justify-center mb-3 mt-6">
          <FileText className="h-12 w-12 text-muted-foreground/30" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-2 min-h-[3rem]">
        {post.title || "Không tiêu đề"}
      </h3>

      {/* Excerpt */}
      {excerpt && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
          {excerpt}
        </p>
      )}

      {/* Metadata Row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        {/* Author */}
        {post.author && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{post.author.username || "Unknown"}</span>
          </div>
        )}

        {/* Views */}
        {post.view_count !== undefined && (
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{post.view_count}</span>
          </div>
        )}

        {/* Date */}
        {formattedDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>

      {/* Category Tag */}
      {post.category && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
            {post.category.name}
          </span>
        </div>
      )}

      {/* Actions - Reveal on hover (desktop), Always visible (mobile) */}
      <div className="flex items-center gap-2 pt-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="flex-1 h-8"
        >
          <Eye className="h-3 w-3 mr-1" />
          Xem
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="flex-1 h-8"
        >
          <Edit2 className="h-3 w-3 mr-1" />
          Sửa
        </Button>
      </div>
    </Card>
  );
}

/**
 * Compact post card for smaller displays
 */
interface PostCardCompactProps {
  post: Post;
  selected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  onView?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function PostCardCompact({
  post,
  selected = false,
  onSelectionChange,
  onView,
  onEdit,
  className,
}: PostCardCompactProps) {
  const formattedDate = React.useMemo(() => {
    if (!post.created_at) return "";
    try {
      const date = new Date(post.created_at);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "";
    }
  }, [post.created_at]);

  return (
    <Card
      data-slot="post-card-compact"
      data-selected={selected}
      selected={selected}
      hover
      className={cn(
        "flex items-center gap-4 p-4",
        className,
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onSelectionChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20 cursor-pointer shrink-0"
      />

      {/* Thumbnail */}
      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted/50 shrink-0">
        {post.thumbnail_image?.url ? (
          <Image
            src={post.thumbnail_image?.url}
            alt={post.title || "Post thumbnail"}
            width={48}
            height={48}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-foreground truncate">
            {post.title || "Không tiêu đề"}
          </h4>
          <StatusBadge status={post.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span>{post.author?.username || "Unknown"}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onView}
          className="h-8 w-8"
        >
          <Eye className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}

export { PostCard as default };
