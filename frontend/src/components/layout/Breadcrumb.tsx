"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();

  // Map paths to breadcrumb labels
  const breadcrumbMap: Record<string, string> = {
    "/user/profile": "Hồ sơ cá nhân",
    "/user/change-password": "Đổi mật khẩu",
    "/user/posts": "Các bài đăng của tôi",
    "/user/posts/new": "Tạo bài đăng",
    "/dashboard": "Bảng điều khiển",
    "/dashboard/stats": "Thống kê",
    "/dashboard/users-manager": "Quản lý người dùng",
    "/dashboard/posts": "Quản lý bài đăng",
    "/dashboard/settings": "Cài đặt hệ thống",
    "/(public)/blog": "Blog",
  };

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === "/" || pathname === "") {
      return [];
    }

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always add home
    breadcrumbs.push({
      label: "Trang chủ",
      href: "/",
    });

    // Build path progressively
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip if it's an ID or dynamic segment
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return;
      }

      // Skip internal path segments like (auth), (public), etc.
      if (segment.startsWith("(") && segment.endsWith(")")) {
        return;
      }

      // Find label from map or use segment
      let label = breadcrumbMap[currentPath] || segment;

      // Format label (capitalize, replace hyphens)
      label = label
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb on home page
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          {index === 0 && (
            <>
              <Link
                href={crumb.href}
                className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}

          {index > 0 && (
            <>
              <Link
                href={crumb.href}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </>
          )}

          {index === breadcrumbs.length - 1 && index > 0 && (
            <span className="text-zinc-900 dark:text-white font-medium">
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
