/**
 * Select Component
 *
 * Dropdown select with consistent styling.
 * Supports default, focus, error, and disabled states.
 *
 * @see {@link https://ui.shadcn.com/docs/components/select}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Error message to display */
  error?: string;
  /** Placeholder option text */
  placeholder?: string;
}

/**
 * Select Component
 *
 * @example
 * // Basic select
 * <Select>
 *   <option value="">Select an option</option>
 *   <option value="1">Option 1</option>
 *   <option value="2">Option 2</option>
 * </Select>
 *
 * @example
 * // With error
 * <Select error="Please select an option" />
 *
 * @example
 * // Disabled
 * <Select disabled />
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <select
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            className={cn(
              // Base styles
              "flex h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-sm",
              "text-gray-900",
              "transition-all duration-150",
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Focus state - ring indicator
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:border-primary-600",
              // Error state - red border and ring
              "aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500",
              // Dark mode
              "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          {/* Custom arrow icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="size-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
