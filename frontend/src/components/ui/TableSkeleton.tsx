/**
 * TableSkeleton Component
 *
 * Loading skeleton for data tables.
 * Shows header row and configurable data rows with cell placeholders
 * while data is being loaded.
 *
 * @see {@link https://ui.shadcn.com/docs/components/skeleton}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * TableSkeleton - Loading skeleton for data tables
 *
 * @example
 * <TableSkeleton rowCount={5} columnCount={4} />
 */
export function TableSkeleton({
  className,
  rowCount = 5,
  columnCount = 4,
  ...props
}: React.ComponentProps<"div"> & {
  rowCount?: number;
  columnCount?: number;
}) {
  return (
    <div
      data-slot="table-skeleton"
      className={cn(
        // Container
        "w-full border rounded-lg bg-card",
        // Overflow
        "overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Header Row */}
      <div className="flex items-center gap-4 border-b bg-muted/20 px-4 py-3">
        {/* Checkbox */}
        <div className="h-4 w-4 animate-pulse bg-muted/50 rounded" />
        {/* Header Cells */}
        {Array.from({ length: columnCount }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="h-4 w-24 animate-pulse bg-muted/50 rounded"
          />
        ))}
      </div>

      {/* Data Rows */}
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className={cn(
            "flex items-center gap-4 px-4 py-3",
            rowIndex < rowCount - 1 && "border-b",
          )}
        >
          {/* Checkbox */}
          <div className="h-4 w-4 animate-pulse bg-muted/50 rounded" />
          {/* Data Cells */}
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <div
              key={`cell-${rowIndex}-${cellIndex}`}
              className={cn(
                "h-4 animate-pulse bg-muted/50 rounded",
                // Vary widths for visual interest
                cellIndex === 0 ? "w-32" :
                cellIndex === 1 ? "w-48" :
                cellIndex === 2 ? "w-24" :
                "w-20",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Compact table skeleton for smaller displays
 */
export function TableSkeletonCompact({
  className,
  rowCount = 3,
  ...props
}: React.ComponentProps<"div"> & {
  rowCount?: number;
}) {
  return (
    <div
      data-slot="table-skeleton-compact"
      className={cn(
        // Container
        "w-full border rounded-lg bg-card",
        // Overflow
        "overflow-hidden",
        className,
      )}
      {...props}
    >
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className={cn(
            "flex items-center gap-4 px-4 py-3",
            rowIndex < rowCount - 1 && "border-b",
          )}
        >
          {/* Checkbox */}
          <div className="h-4 w-4 shrink-0 animate-pulse bg-muted/50 rounded" />
          {/* Main Content */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse bg-muted/50 rounded" />
            <div className="h-3 w-1/2 animate-pulse bg-muted/50 rounded" />
          </div>
          {/* Status Badge */}
          <div className="h-6 w-16 shrink-0 animate-pulse bg-muted/50 rounded" />
          {/* Action */}
          <div className="h-8 w-8 shrink-0 animate-pulse bg-muted/50 rounded" />
        </div>
      ))}
    </div>
  );
}

export { TableSkeleton as default };
