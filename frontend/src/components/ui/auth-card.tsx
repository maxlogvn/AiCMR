/**
 * Auth Card - Specialized card component for authentication pages
 *
 * Provides centered layout with proper spacing for login, register, and password reset pages.
 * This is a Class A component (Universal Citizen) - works anywhere without assumptions.
 *
 * @see {@link https://aicmr.design/system/citizenship}
 *
 * @example
 * <AuthCard>
 *   <AuthCardHeader>
 *     <AuthCardTitle>Đăng nhập</AuthCardTitle>
 *     <AuthCardDescription>Chào mừng trở lại</AuthCardDescription>
 *   </AuthCardHeader>
 *   <AuthCardContent>
 *     <form>...</form>
 *   </AuthCardContent>
 * </AuthCard>
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * AuthCard - Full-page centered container for authentication pages
 *
 * Features:
 * - Centered layout (vertical + horizontal)
 * - Responsive max-width (md breakpoint)
 * - Min-height viewport for proper centering
 * - Background with proper dark mode support
 */
export function AuthCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Layout - centered on viewport
        "min-h-screen flex items-center justify-center",
        // Background - using design tokens
        "bg-background",
        // Padding for mobile
        "px-4",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

/**
 * AuthCardInner - The actual card component (styled like dashboard Card)
 *
 * Use this inside AuthCard for the card container with borders, shadows, etc.
 */
export function AuthCardInner({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Base card styles - using design tokens
        "bg-card",
        "border border-border",
        "rounded-lg shadow-sm",
        // Compact padding for auth cards
        "p-6 sm:p-8",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AuthCardHeader - Header section with centered title
 */
export function AuthCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 mb-6",
        "text-center",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AuthCardTitle - Centered title text
 */
export function AuthCardTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-2xl font-bold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AuthCardDescription - Centered description text
 */
export function AuthCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-sm text-muted-foreground",
        "mt-1",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AuthCardContent - Main content area with form spacing
 */
export function AuthCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-4", className)} {...props} />
  );
}

/**
 * AuthCardFooter - Footer section with centered actions (links, buttons)
 */
export function AuthCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-6 pt-6",
        "border-t border-border",
        "text-center text-sm",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Helper component - Combines all parts into single component for simpler usage
 *
 * @example
 * <AuthCardWrapper title="Đăng nhập" description="Chào mừng trở lại">
 *   <form>...</form>
 *   <AuthCardWrapperFooter>
 *     Chưa có tài khoản? <a href="/register">Đăng ký</a>
 *   </AuthCardWrapperFooter>
 * </AuthCardWrapper>
 */
export function AuthCardWrapper({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AuthCard className={className}>
      <AuthCardInner>
        {(title || description) && (
          <AuthCardHeader>
            {title && <AuthCardTitle>{title}</AuthCardTitle>}
            {description && <AuthCardDescription>{description}</AuthCardDescription>}
          </AuthCardHeader>
        )}
        <AuthCardContent>{children}</AuthCardContent>
      </AuthCardInner>
    </AuthCard>
  );
}

export function AuthCardWrapperFooter({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <AuthCardFooter className={className}>
      {children}
    </AuthCardFooter>
  );
}
