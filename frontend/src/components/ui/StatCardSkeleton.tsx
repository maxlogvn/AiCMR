/**
 * StatCardSkeleton Component
 *
 * Loading skeleton for stat cards.
 * Shows icon placeholder, value placeholder, and label placeholder
 * while data is being loaded.
 *
 * @see {@link https://ui.shadcn.com/docs/components/skeleton}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * StatCardSkeleton - Loading skeleton for stat cards
 *
 * @example
 * <StatCardSkeleton />
 */
export function StatCardSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card-skeleton"
      className={cn(
        // Layout
        "flex items-center gap-4",
        // Card styling
        "border rounded-lg p-5",
        // Background
        "bg-card",
        className,
      )}
      {...props}
    >
      {/* Icon Placeholder */}
      <div
        className={cn(
          // Size and shape
          "h-10 w-10 rounded-md",
          // Animation and color
          "animate-pulse bg-muted/50",
        )}
      />

      {/* Content Placeholder */}
      <div className="flex-1 space-y-2">
        {/* Value Placeholder */}
        <div
          className={cn(
            // Size
            "h-6 w-24",
            // Animation and color
            "animate-pulse bg-muted/50 rounded",
          )}
        />
        {/* Label Placeholder */}
        <div
          className={cn(
            // Size
            "h-4 w-32",
            // Animation and color
            "animate-pulse bg-muted/50 rounded",
          )}
        />
      </div>
    </div>
  );
}

export { StatCardSkeleton as default };
