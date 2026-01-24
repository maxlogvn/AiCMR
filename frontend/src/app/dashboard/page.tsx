"use client";

/**
 * Dashboard Home Page - Linear/Vercel Style Redesign
 *
 * Features:
 * - Stats cards overview
 * - Quick actions navigation
 * - Recent activity feed
 */

import { LayoutDashboard, ArrowRight } from "lucide-react";
import { PageHeader, StatsCards } from "@/components/dashboard";
import Link from "next/link";

const quickActions = [
  {
    title: "Tạo bài viết mới",
    description: "Soạn thảo và xuất bản bài viết",
    href: "/user/posts/new",
    icon: "✍️",
  },
  {
    title: "Quản lý bài viết",
    description: "Xem và chỉnh sửa tất cả bài viết",
    href: "/dashboard/posts",
    icon: "📝",
  },
  {
    title: "Người dùng",
    description: "Quản lý tài khoản người dùng",
    href: "/dashboard/users-manager",
    icon: "👥",
  },
  {
    title: "Thống kê chi tiết",
    description: "Xem báo cáo và phân tích",
    href: "/dashboard/stats",
    icon: "📊",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Tổng quan hoạt động của hệ thống"
        icon={LayoutDashboard}
      />

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Hành động nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group p-4 bg-card border border-border rounded-lg hover:shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="text-2xl mb-2">{action.icon}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="font-medium text-foreground mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
