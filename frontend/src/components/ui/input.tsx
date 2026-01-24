/**
 * Input Component
 *
 * Text input with consistent styling and validation states.
 * Supports default, focus, error, and disabled states.
 *
 * @see {@link https://ui.shadcn.com/docs/components/input}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

// Export input classes for reuse in other components
export const inputClasses = cn(
  // Base styles
  "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm",
  "text-gray-900 placeholder:text-gray-400",
  "transition-all duration-150",
  "disabled:cursor-not-allowed disabled:opacity-50",
  // Focus state - ring indicator
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:border-primary-600",
  // Error state - red border and ring
  "aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500",
  // Dark mode
  "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:placeholder:text-gray-500"
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message to display */
  error?: string;
  /** Label text to display above the input */
  label?: string;
  /** Helper text to display below the input */
  helperText?: string;
}

/**
 * Input Component
 *
 * @example
 * // Basic input
 * <Input placeholder="Enter email..." />
 *
 * @example
 * // With label
 * <Input label="Email" placeholder="Enter email..." />
 *
 * @example
 * // With error
 * <Input error="Invalid email address" />
 *
 * @example
 * // Disabled
 * <Input disabled />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          data-slot="input"
          aria-invalid={error ? "true" : undefined}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm",
            "text-gray-900 placeholder:text-gray-400",
            "transition-all duration-150",
            "disabled:cursor-not-allowed disabled:opacity-50",
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
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
