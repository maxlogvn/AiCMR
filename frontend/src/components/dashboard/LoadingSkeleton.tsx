'use client';

/**
 * LoadingSkeleton Component
 *
 * Linear/Vercel style skeleton loading states that preserve layout structure.
 * Creates calm loading experience by showing what's coming.
 *
 * @example
 * <StatsCardSkeleton />
 * <CardListSkeleton rows={5} />
 */

import { cn } from '@/lib/utils';

/**
 * Stats card skeleton - matches StatsCard component structure
 */
export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card p-5',
        'animate-pulse',
        className
      )}
    >
      {/* Header with icon placeholder */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="h-4 w-24 bg-muted rounded mb-3" />
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted" />
      </div>

      {/* Value */}
      <div className="h-8 w-20 bg-muted rounded mb-4" />

      {/* Change indicator */}
      <div className="h-4 w-32 bg-muted/50 rounded" />
    </div>
  );
}

/**
 * Card list skeleton - matches card list row structure
 */
interface CardListSkeletonProps {
  rows?: number;
  showThumbnail?: boolean;
}

export function CardListSkeleton({ rows = 5, showThumbnail = true }: CardListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <CardRowSkeleton key={i} showThumbnail={showThumbnail} />
      ))}
    </div>
  );
}

/**
 * Single card row skeleton
 */
interface CardRowSkeletonProps {
  showThumbnail?: boolean;
  showCheckbox?: boolean;
}

export function CardRowSkeleton({ showThumbnail = true, showCheckbox = true }: CardRowSkeletonProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card p-5 animate-pulse">
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        {showCheckbox && <div className="h-5 w-5 rounded border bg-muted" />}

        {/* Thumbnail */}
        {showThumbnail && (
          <div className="h-12 w-12 rounded-md bg-muted shrink-0" />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="h-5 w-3/4 bg-muted rounded mb-2 max-w-md" />

          {/* Excerpt */}
          <div className="h-4 w-1/2 bg-muted/50 rounded mb-3 max-w-sm" />

          {/* Meta */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 bg-muted/40 rounded" />
            <div className="h-4 w-16 bg-muted/40 rounded" />
            <div className="h-4 w-24 bg-muted/40 rounded" />
          </div>
        </div>

        {/* Badge */}
        <div className="h-6 w-16 rounded-full bg-muted/60 shrink-0" />

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-8 w-16 rounded-md bg-muted" />
          <div className="h-8 w-16 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid skeleton - for tag cards, etc.
 */
interface GridSkeletonProps {
  columns?: 2 | 3 | 4;
  rows?: number;
}

export function GridSkeleton({ columns = 3, rows = 3 }: GridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      )}
    >
      {Array.from({ length: rows * columns }).map((_, i) => (
        <GridCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Single grid card skeleton
 */
function GridCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-24 bg-muted rounded" />
        <div className="h-6 w-12 rounded-full bg-muted/60" />
      </div>
      <div className="h-4 w-16 bg-muted/50 rounded" />
    </div>
  );
}

/**
 * Table skeleton - traditional table loading state
 */
interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 5, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card">
      {/* Header */}
      <div className="flex border-b p-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 w-24 bg-muted rounded shrink-0" />
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </div>
    </div>
  );
}

/**
 * Single table row skeleton
 */
function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex p-4 gap-4">
      {/* Checkbox */}
      <div className="h-5 w-5 rounded border bg-muted shrink-0" />

      {/* Cells */}
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="h-4 w-full max-w-[150px] bg-muted rounded shrink-0" />
      ))}
    </div>
  );
}

/**
 * Page skeleton - full page loading state
 */
export function PageSkeleton({ children }: { children?: React.ReactNode }) {
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

      {/* Content skeleton or children */}
      {children || (
        <>
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>

          {/* Card list skeleton */}
          <CardListSkeleton rows={5} />
        </>
      )}
    </div>
  );
}
