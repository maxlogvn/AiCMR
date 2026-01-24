/**
 * Checkbox Component
 *
 * Checkbox input with consistent styling.
 * Supports checked, unchecked, indeterminate, and disabled states.
 *
 * @see {@link https://ui.shadcn.com/docs/components/checkbox}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Indeterminate state (e.g., some but not all items selected) */
  indeterminate?: boolean;
}

/**
 * Checkbox Component
 *
 * @example
 * // Basic checkbox
 * <Checkbox />
 *
 * @example
 * // With label
 * <div className="flex items-center gap-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">Accept terms</Label>
 * </div>
 *
 * @example
 * // Controlled
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 *
 * @example
 * // Indeterminate
 * <Checkbox indeterminate />
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, checked, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Handle indeterminate state
    React.useEffect(() => {
      if (resolvedRef && "current" in resolvedRef && resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate, resolvedRef]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        checked={checked}
        data-state={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
        className={cn(
          // Base styles
          "aspect-square size-4 rounded border border-gray-300",
          "bg-white dark:bg-gray-800",
          "cursor-pointer",
          "transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Focus state
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
          // Checked state
          "data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600",
          "data-[state=checked]:dark:bg-primary-500 data-[state=checked]:dark:border-primary-500",
          // Indeterminate state
          "data-[state=indeterminate]:bg-primary-600 data-[state=indeterminate]:border-primary-600",
          // Hover state
          "hover:border-primary-400 data-[state=checked]:hover:bg-primary-700",
          // Checkbox appearance
          "appearance-none",
          // Checkmark using CSS
          [
            "checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBkPSJNMiAxNGw1IDUgMTQtMTQiLz48L3N2Zz4=')]",
            "checked:bg-[length:60%] checked:bg-[center] checked:bg-[no-repeat]",
            "dark:checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBkPSJNMiAxNGw1IDUgMTQtMTQiLz48L3N2Zz4=')]",
          ],
          className,
        )}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
