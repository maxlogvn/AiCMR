'use client';

/**
 * EmptyState Component
 *
 * Linear/Vercel style empty state with icon, headline, description, and CTA.
 * Creates calm, confident first-run experience.
 *
 * @example
 * <EmptyState
 *   icon={FileText}
 *   title="Chưa có bài viết nào"
 *   description="Tạo bài viết đầu tiên để bắt đầu"
 *   actionLabel="Tạo bài viết"
 *   onAction={() => router.push('/dashboard/posts/new')}
 * />
 */

import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {/* Icon container */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3">
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && onAction && (
            <Button onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {actionLabel && actionHref && (
            <Button asChild>
              <a href={actionHref}>
                {actionLabel}
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact empty state for smaller spaces
 */
interface EmptyStateCompactProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyStateCompact({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateCompactProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
        <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * Inline empty state for card content
 */
interface EmptyStateInlineProps {
  title: string;
  description?: string;
}

export function EmptyStateInline({ title, description }: EmptyStateInlineProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm font-medium text-muted-foreground mb-1">
        {title}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground/60">
          {description}
        </p>
      )}
    </div>
  );
}
