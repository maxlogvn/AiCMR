/**
 * Badge Component
 *
 * Small status or label component with variants.
 * Supports icon prop and multiple color variants.
 *
 * @see {@link https://ui.shadcn.com/docs/components/badge}
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300",
        primary: "border-transparent bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400",
        success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning: "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
        info: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
        outline: "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional icon to display before text */
  icon?: string | React.ReactNode;
}

/**
 * Badge Component
 *
 * @example
 * // Basic badge
 * <Badge>Badge</Badge>
 *
 * @example
 * // With variant
 * <Badge variant="success">Published</Badge>
 *
 * @example
 * // With icon
 * <Badge variant="success" icon="✅">Published</Badge>
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props}>
        {icon && <span>{icon}</span>}
        {children}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
