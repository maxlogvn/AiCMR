/**
 * CardSkeleton Component
 *
 * Loading skeleton for card-based content.
 * Shows image placeholder, title placeholder, and text line placeholders
 * while data is being loaded.
 *
 * @see {@link https://ui.shadcn.com/docs/components/skeleton}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * CardSkeleton - Loading skeleton for card content
 *
 * @example
 * <CardSkeleton />
 * <CardSkeleton showImage={false} />
 */
export function CardSkeleton({
  className,
  showImage = true,
  ...props
}: React.ComponentProps<"div"> & {
  showImage?: boolean;
}) {
  return (
    <div
      data-slot="card-skeleton"
      className={cn(
        // Card styling
        "border rounded-lg p-5",
        // Background
        "bg-card",
        // Layout
        "flex flex-col",
        className,
      )}
      {...props}
    >
      {/* Image Placeholder */}
      {showImage && (
        <div
          className={cn(
            // Aspect ratio
            "aspect-video w-full",
            // Shape
            "rounded-md",
            // Animation and color
            "animate-pulse bg-muted/50",
            // Spacing
            "mb-3",
          )}
        />
      )}

      {/* Title Placeholder */}
      <div
        className={cn(
          // Size
          "h-5 w-3/4",
          // Animation and color
          "animate-pulse bg-muted/50 rounded",
          // Spacing
          "mb-2",
        )}
      />

      {/* Text Line Placeholders */}
      <div className="space-y-1.5">
        <div
          className={cn(
            // Size
            "h-4 w-full",
            // Animation and color
            "animate-pulse bg-muted/50 rounded",
          )}
        />
        <div
          className={cn(
            // Size
            "h-4 w-5/6",
            // Animation and color
            "animate-pulse bg-muted/50 rounded",
          )}
        />
        <div
          className={cn(
            // Size
            "h-4 w-2/3",
            // Animation and color
            "animate-pulse bg-muted/50 rounded",
          )}
        />
      </div>

      {/* Action Placeholder */}
      <div
        className={cn(
          // Size
          "h-8 w-24 mt-4",
          // Animation and color
          "animate-pulse bg-muted/50 rounded",
        )}
      />
    </div>
  );
}

export { CardSkeleton as default };
