/**
 * Loading Indicators
 *
 * Visual feedback during async operations.
 * Includes Spinner for inline loading and Skeleton for content loading.
 *
 * @see {@link https://ui.shadcn.com/docs/components/skeleton}
 */

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

// ============================================================================
// SPINNER COMPONENT
// ============================================================================

export interface SpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Custom className */
  className?: string;
}

/**
 * Spinner Component - Inline loading indicator
 *
 * @example
 * <Spinner />
 * <Spinner size="lg" />
 */
export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-8 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-500",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================================================
// FULL PAGE LOADING
// ============================================================================

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Custom className */
  className?: string;
  /** Minimum height */
  minHeight?: string;
}

/**
 * LoadingSpinner Component - Full page loading
 *
 * @example
 * <LoadingSpinner />
 */
export function LoadingSpinner({
  size = "md",
  className,
  minHeight = "min-h-screen",
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", minHeight, className)}>
      <Spinner size={size} />
    </div>
  );
}

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of skeleton */
  width?: string;
  /** Height of skeleton */
  height?: string;
  /** Variant shape */
  variant?: "text" | "circular" | "rectangular";
}

/**
 * Skeleton Component - Content placeholder
 *
 * @example
 * <Skeleton className="h-4 w-32" />
 * <Skeleton variant="circular" className="size-10" />
 */
export function Skeleton({
  className,
  width,
  height,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded-md h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        variantClasses[variant],
        className,
      )}
      style={{ width, height }}
      {...props}
    />
  );
}

// ============================================================================
// LOADING BUTTON
// ============================================================================

export interface LoadingButtonProps extends ButtonProps {
  /** Loading state */
  loading?: boolean;
  /** Children to show when not loading */
  children: React.ReactNode;
}

/**
 * LoadingButton Component - Button with loading state
 *
 * @example
 * <LoadingButton loading={isLoading} onClick={handleSubmit}>
 *   Submit
 * </LoadingButton>
 */
export function LoadingButton({
  loading = false,
  disabled,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn("relative", className)}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </Button>
  );
}

// ============================================================================
// CARD SKELETON COMPONENT
// ============================================================================

/**
 * CardSkeleton - Card placeholder
 *
 * @example
 * <CardSkeleton />
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-4">
        {/* Avatar skeleton */}
        <Skeleton variant="circular" className="size-12" />
        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-5/12" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TABLE SKELETON COMPONENT
// ============================================================================

export interface TableSkeletonProps {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
}

/**
 * TableSkeleton - Table placeholder
 *
 * @example
 * <TableSkeleton rows={5} columns={4} />
 */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full space-y-3">
      {/* Header skeleton */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
