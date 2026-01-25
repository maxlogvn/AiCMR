/**
 * Form Layout Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Wrap form fields với FormLayout
 * 2. Consistent spacing tự động (gap-4 = 16px)
 * 3. Responsive columns support
 *
 * Design System Principles:
 * - "Opinionated" - Spacing tự động, không cần config
 * - "Optimize for 90%" - Form layout cho 90% CMS forms
 * - "Eliminate Choices" - Chỉ dùng gap-4 (16px) cho form fields
 *
 * @example
 * // Single column form
 * <FormLayout>
 *   <FormField label="Email" name="email" type="email" required />
 *   <FormField label="Password" name="password" type="password" required />
 * </FormLayout>
 *
 * @example
 * // Two column form (responsive)
 * <FormLayout columns={2}>
 *   <FormField label="First Name" name="first_name" required />
 *   <FormField label="Last Name" name="last_name" required />
 *   <FormField label="Email" name="email" type="email" required />
 * </FormLayout>
 *
 * @example
 * // With actions
 * <FormLayout
 *   actions={
 *     <>
 *       <Button type="submit">Lưu</Button>
 *       <Button variant="secondary" type="button">Hủy</Button>
 *     </>
 *   }
 * >
 *   <FormField label="Tên" name="name" required />
 * </FormLayout>
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormLayoutProps {
  /** Form fields */
  children: React.ReactNode;
  /** Number of columns (responsive) */
  columns?: 1 | 2 | 3;
  /** Actions section (submit, cancel buttons) */
  actions?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Form Layout Component
 *
 * Pattern xuất hiện trong: Post Edit Page, Category Form, User Profile Form
 *
 * Reusable form layout với:
 * - Consistent spacing (gap-4 = 16px)
 * - Responsive columns (1 col mobile, 2+ cols desktop)
 * - Actions section at bottom
 * - Design tokens (text-foreground)
 *
 * Spacing Scale (Design System):
 * - gap-4 = 16px (form fields)
 * - gap-8 = 32px (sections)
 */
export const FormLayout = React.forwardRef<HTMLDivElement, FormLayoutProps>(
  ({ children, columns = 1, actions, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
      >
        {/* Form Fields */}
        <div
          className={cn(
            // Responsive grid columns
            columns === 1 && "grid grid-cols-1",
            columns === 2 && "grid grid-cols-1 md:grid-cols-2",
            columns === 3 && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            // Consistent spacing between fields
            "gap-4"
          )}
        >
          {children}
        </div>

        {/* Actions Section */}
        {actions && (
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

FormLayout.displayName = "FormLayout";
