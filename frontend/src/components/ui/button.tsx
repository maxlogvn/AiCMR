/**
 * Button Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Copy template bên dưới
 * 2. Chỉ dùng 3 variants: primary, secondary, destructive
 * 3. Không có size prop - chỉ 1 kích thước mặc định
 *
 * Design System Principles:
 * - "Eliminate Choices" - Chỉ 1 cách đúng
 * - Opinionated - Không cần suy nghĩ
 * - Consistency - Tự đồng nhất
 *
 * @example
 * // Primary (mặc định)
 * <Button>Lưu</Button>
 *
 * @example
 * // Secondary
 * <Button variant="secondary">Hủy</Button>
 *
 * @example
 * // Destructive (Xóa)
 * <Button variant="destructive">Xóa</Button>
 *
 * @example
 * // As link (via Radix Slot)
 * <Button asChild>
 *   <a href="/page">Link Button</a>
 * </Button>
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button variant definitions using CVA
 *
 * Design System: Chỉ 3 variants - primary, secondary, destructive
 * Không có size prop - chỉ 1 kích thước mặc định (h-10, px-4)
 */
const buttonVariants = cva(
  // Base classes: inline-flex, centered, transition, focus ring
  // Kích thước mặc định: h-10 (40px), px-4 (16px padding)
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary h-10 px-4 py-2",
  {
    variants: {
      variant: {
        // Primary - Orange background, white text (mặc định)
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
        // Secondary - Gray background
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Destructive - Red background for dangerous actions
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
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
 * Button Component - Design System Compliant
 *
 * @example
 * // Primary button (default)
 * <Button>Lưu</Button>
 *
 * @example
 * // Secondary button
 * <Button variant="secondary">Hủy</Button>
 *
 * @example
 * // Destructive button
 * <Button variant="destructive">Xóa</Button>
 *
 * @example
 * // As link (via Radix Slot)
 * <Button asChild>
 *   <a href="/page">Link Button</a>
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
