/**
 * Label Component
 *
 * Accessible label for form inputs.
 * Associates with inputs via htmlFor attribute.
 *
 * @see {@link https://ui.shadcn.com/docs/components/label}
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Mark label as required */
  required?: boolean;
}

/**
 * Label Component
 *
 * @example
 * // Basic label
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" />
 *
 * @example
 * // Required label
 * <Label htmlFor="password" required>Password</Label>
 * <Input id="password" type="password" />
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none text-gray-700 dark:text-gray-300",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  ),
);

Label.displayName = "Label";

export { Label };
