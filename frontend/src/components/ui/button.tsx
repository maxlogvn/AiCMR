/**
 * Button Component
 *
 * Reusable button with variants using class-variance-authority.
 * Supports Radix UI Slot composition via asChild prop.
 *
 * @see {@link https://ui.shadcn.com/docs/components/button}
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button variant definitions using CVA
 *
 * Variants: primary, secondary, ghost, destructive, outline, link
 * Sizes: sm, md, lg, icon
 */
const buttonVariants = cva(
  // Base classes: inline-flex, centered, transition, focus ring
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600",
  {
    variants: {
      variant: {
        // Primary - Indigo background, white text
        default: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600",
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600",
        // Secondary - Gray background
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost - Transparent background, hover effect
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        // Destructive - Red background for dangerous actions
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-700",
        // Outline - Border only
        outline:
          "border border-gray-200 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:border-gray-700",
        // Link - Text only with underline
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs has-[>svg]:px-2",
        md: "h-10 px-4 py-2 has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-6 text-base has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child component (for Radix Slot composition) */
  asChild?: boolean;
}

/**
 * Button Component
 *
 * @example
 * // Primary button
 * <Button>Click me</Button>
 *
 * @example
 * // With variant
 * <Button variant="secondary">Cancel</Button>
 *
 * @example
 * // With size
 * <Button size="lg">Large Button</Button>
 *
 * @example
 * // As link (via Radix Slot)
 * <Button asChild>
 *   <a href="/page">Link Button</a>
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
