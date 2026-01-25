/**
 * Layout Shell Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Wrap page content với LayoutShell
 * 2. Title + subtitle hiển thị tự động
 * 3. Actions buttons ở top-right
 * 4. Back button tự động nếu có backUrl
 *
 * Design System Principles:
 * - "Opinionated" - Layout tự động, không cần think về spacing
 * - "Optimize for 90%" - Page layout cho 90% CMS pages
 * - "Eliminate Choices" - Chỉ 1 cách đúng để layout page
 *
 * @example
 * // Basic page with title
 * <LayoutShell
 *   title="Quản lý bài đăng"
 *   subtitle="Quản lý tất cả bài viết trong hệ thống"
 * >
 *   <p>Page content here</p>
 * </LayoutShell>
 *
 * @example
 * // With actions button
 * <LayoutShell
 *   title="Danh mục"
 *   actions={
 *     <Button onClick={handleCreate}>
 *       Tạo danh mục
 *     </Button>
 *   }
 * >
 *   <p>Page content here</p>
 * </LayoutShell>
 *
 * @example
 * // With back button
 * <LayoutShell
 *   title="Chỉnh sửa bài viết"
 *   backUrl="/dashboard/posts"
 * >
 *   <p>Page content here</p>
 * </LayoutShell>
 *
 * @example
 * // With icon
 * <LayoutShell
 *   title="Hồ sơ của tôi"
 *   subtitle="Quản lý thông tin cá nhân"
 *   icon={User}
 * >
 *   <p>Page content here</p>
 * </LayoutShell>
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface LayoutShellProps {
  /** Page title */
  title: string;
  /** Page subtitle (optional) */
  subtitle?: string;
  /** Page icon (Lucide icon component) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Actions buttons (top-right) */
  actions?: React.ReactNode;
  /** Back button URL */
  backUrl?: string;
  /** Page content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Max width container */
  container?: boolean;
}

/**
 * Layout Shell Component
 *
 * Pattern xuất hiện trong: TẤT CẢ dashboard/user pages
 *
 * Reusable page layout với:
 * - Header section (title + subtitle + icon + actions)
 * - Back button (optional)
 * - Content area với consistent spacing
 * - Design tokens (text-foreground, bg-background, border-border)
 *
 * Spacing Scale (Design System):
 * - mb-8 = 32px (below header)
 * - gap-4 = 16px (between title and subtitle)
 * - p-6 = 24px (content padding)
 */
export const LayoutShell = React.forwardRef<HTMLDivElement, LayoutShellProps>(
  ({
    title,
    subtitle,
    icon: Icon,
    actions,
    backUrl,
    children,
    className,
    container = true,
    ...props
  }, ref) => {
    const router = useRouter();

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen bg-background",
          container && "container mx-auto px-4 py-6 md:py-8",
          className
        )}
        {...props}
      >
        {/* Page Header */}
        <div className="mb-8">
          {/* Back Button (optional) */}
          {backUrl && (
            <div className="mb-4">
              <Button
                variant="secondary"
                onClick={() => router.push(backUrl)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </div>
          )}

          {/* Title + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Title + Icon + Subtitle */}
            <div className="flex items-start gap-3">
              {Icon && (
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Actions (top-right) */}
            {actions && (
              <div className="shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="text-foreground">
          {children}
        </div>
      </div>
    );
  }
);

LayoutShell.displayName = "LayoutShell";
