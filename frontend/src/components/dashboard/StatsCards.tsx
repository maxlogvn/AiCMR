"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Send, File, Users, UserCheck } from "lucide-react";
import { StatCard } from "./StatCard";

interface DashboardStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  archived_posts: number;
  total_users: number;
  active_users: number;
  posts_change_percent: number;
  users_change_percent: number;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch("/api/v1/stats/dashboard", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.json();
}

export function StatsCards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  if (error) {
    console.error("Failed to load dashboard stats:", error);
  }

  const stats = data || {
    total_posts: 0,
    published_posts: 0,
    draft_posts: 0,
    archived_posts: 0,
    total_users: 0,
    active_users: 0,
    posts_change_percent: 0,
    users_change_percent: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Tổng bài viết"
        value={stats.total_posts}
        changePercent={stats.posts_change_percent}
        href="/dashboard/posts"
        icon={<FileText className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <StatCard
        title="Đã đăng"
        value={stats.published_posts}
        changePercent={stats.posts_change_percent}
        href="/dashboard/posts?status=published"
        icon={<Send className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <StatCard
        title="Nháp"
        value={stats.draft_posts}
        href="/dashboard/posts?status=draft"
        icon={<File className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <StatCard
        title="Người dùng"
        value={stats.total_users}
        changePercent={stats.users_change_percent}
        href="/dashboard/users"
        icon={<Users className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <StatCard
        title="Người dùng hoạt động"
        value={stats.active_users}
        href="/dashboard/users?status=active"
        icon={<UserCheck className="h-5 w-5" />}
        isLoading={isLoading}
      />
    </div>
  );
}

export default StatsCards;
