/**
 * Textarea Component
 *
 * Multi-line text input with consistent styling and validation states.
 * Supports default, focus, error, and disabled states.
 *
 * @see {@link https://ui.shadcn.com/docs/components/textarea}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message to display */
  error?: string;
}

/**
 * Textarea Component
 *
 * @example
 * // Basic textarea
 * <Textarea placeholder="Enter description..." />
 *
 * @example
 * // With error
 * <Textarea error="Description is required" />
 *
 * @example
 * // With fixed rows
 * <Textarea rows={5} />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          data-slot="textarea"
          aria-invalid={error ? "true" : undefined}
          className={cn(
            // Base styles
            "flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm",
            "text-gray-900 placeholder:text-gray-400",
            "transition-all duration-150",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Resize
            "resize-y",
            // Focus state - ring indicator
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:border-primary-600",
            // Error state - red border and ring
            "aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500",
            // Dark mode
            "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:placeholder:text-gray-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
