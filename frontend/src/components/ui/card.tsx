/**
 * Card Components
 *
 * Consistent content containers with header, content, and footer sections.
 * Supports hover elevation effect and uses design tokens for all styling.
 *
 * @see {@link https://ui.shadcn.com/docs/components/card}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card - Main container component
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 */
function Card({
  className,
  hover = false,
  selected = false,
  compact = false,
  ...props
}: React.ComponentProps<"div"> & { hover?: boolean; selected?: boolean; compact?: boolean }) {
  return (
    <div
      data-slot="card"
      data-selected={selected}
      className={cn(
        // Base styles
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "rounded-lg shadow-sm",
        // Transition for hover
        "transition-all duration-200",
        // Hover elevation effect with orange tint
        hover && "hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 dark:hover:border-orange-400/30 dark:hover:shadow-orange-400/5",
        // Selected state
        selected && "border-orange-500/50 bg-orange-500/5 dark:border-orange-400/50 dark:bg-orange-400/5",
        // Layout
        "flex flex-col",
        // Mobile compact padding
        compact ? "p-4 sm:p-5" : "p-5",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardHeader - Header section with title and optional action
 */
function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 px-6 pt-6",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardTitle - Title text
 */
function CardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-lg font-semibold text-gray-900 dark:text-gray-100",
        "leading-tight",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardDescription - Subtitle or description text
 */
function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-sm text-gray-500 dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardAction - Action button/icon in header
 */
function CardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto shrink-0", className)}
      {...props}
    />
  );
}

/**
 * CardContent - Main content area
 */
function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

/**
 * CardFooter - Footer section with actions
 */
function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 px-6 pt-6",
        "border-t border-gray-200 dark:border-gray-700",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
 CardContent,
};
