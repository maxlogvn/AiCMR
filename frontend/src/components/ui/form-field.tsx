/**
 * Form Field Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Copy template bên dưới
 * 2. Thay label, name, placeholder
 * 3. Thêm validation nếu cần
 *
 * Design System Principles:
 * - "Opinionated" - Chỉ 1 cách đúng
 * - "Optimize for 90%" - Form field cho 90% CMS use cases
 * - "Eliminate Choices" - Không cần suy nghĩ về spacing, layout
 *
 * @example
 * // Basic text input
 * <FormField
 *   label="Email"
 *   name="email"
 *   placeholder="user@example.com"
 *   type="email"
 *   required
 * />
 *
 * @example
 * // Textarea
 * <FormField
 *   label="Mô tả"
 *   name="description"
 *   type="textarea"
 *   placeholder="Nhập mô tả..."
 * />
 *
 * @example
 * // With error message
 * <FormField
 *   label="Tên danh mục"
 *   name="name"
 *   error="Tên danh mục không được để trống"
 *   required
 * />
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  /** Label text hiển thị above field */
  label: string;
  /** Field name (cho form submission) */
  name: string;
  /** Error message (nếu có validation error) */
  error?: string;
  /** Input type: text, email, password, textarea, etc. */
  type?: "text" | "email" | "password" | "number" | "textarea" | string;
  /** Placeholder text */
  placeholder?: string;
  /** Required field indicator */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width or not */
  fullWidth?: boolean;
}

/**
 * Form Field Component
 *
 * Pattern xuất hiện trong: User Profile Page, Post Edit Page, Category Form
 *
 * Reusable form field với:
 * - Label (required indicator)
 * - Input (text, email, password, textarea)
 * - Error message
 * - Consistent spacing (gap-4 = 16px)
 * - Design tokens (border-border, text-foreground)
 */
export const FormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(
  (
    {
      label,
      name,
      error,
      type = "text",
      placeholder,
      required = false,
      disabled = false,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const fieldId = id || `field-${name}`;

    return (
      <div className={cn("space-y-2", fullWidth && "w-full", className)}>
        {/* Label */}
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>

        {/* Input */}
        {type === "textarea" ? (
          <textarea
            id={fieldId}
            name={name}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              // Base styles
              "w-full px-3 py-2 rounded-md border text-sm",
              // Design tokens
              "bg-background text-foreground",
              "border-border",
              "placeholder:text-muted-foreground",
              // Focus states
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed",
              // Error state
              error && "border-destructive focus:ring-destructive",
              // Transitions
              "transition-all duration-150"
            )}
            {...props}
          />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={type}
            ref={ref as React.RefObject<HTMLInputElement>}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              // Base styles
              "w-full px-3 py-2 rounded-md border text-sm",
              // Design tokens
              "bg-background text-foreground",
              "border-border",
              "placeholder:text-muted-foreground",
              // Focus states
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed",
              // Error state
              error && "border-destructive focus:ring-destructive",
              // Transitions
              "transition-all duration-150"
            )}
            {...props}
          />
        )}

        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
