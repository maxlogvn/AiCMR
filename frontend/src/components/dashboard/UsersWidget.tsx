"use client";

/**
 * Users Widget - Admin-only dashboard widget
 *
 * Story 4.6: Users Dashboard Widget
 *
 * Features:
 * - Display: Total users, Active users, New this month
 * - Use Card component with icon and number
 * - Click to navigate to User listing
 * - Real-time data (fetch on load)
 * - Respect permissions (Admin only)
 *
 * Design System Components:
 * - Card: Main container with hover effect
 * - Badge: Status indicators
 * - Icon: Visual indicators
 */

import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserPlus, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

interface UsersStats {
  total_users: number;
  active_users: number;
  new_this_month: number;
}

async function fetchUsersStats(): Promise<UsersStats> {
  // Fetch dashboard stats
  const response = await fetch("/api/v1/stats/dashboard", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users stats");
  }

  const data = await response.json();

  // Calculate new_this_month from users_change_percent
  // If users_change_percent is 10% and we have 100 users, then:
  // recent_users = previous_users * (1 + 10/100)
  // recent_users / (1 + 10/100) = previous_users
  // new_this_month = recent_users

  // For simplicity, we'll fetch active_users from dashboard stats
  // and estimate new_this_month from the percentage

  return {
    total_users: data.total_users || 0,
    active_users: data.active_users || 0,
    new_this_month: Math.round((data.total_users * data.users_change_percent) / 100) || 0,
  };
}

export function UsersWidget() {
  const { user: currentUser } = useUser();
  const isAdmin = currentUser?.rank === 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["users-stats"],
    queryFn: fetchUsersStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: isAdmin, // Only fetch if admin
  });

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  if (error) {
    console.error("Failed to load users stats:", error);
  }

  const stats = data || {
    total_users: 0,
    active_users: 0,
    new_this_month: 0,
  };

  return (
    <Link href="/dashboard/users">
      <Card hover className="group">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Người dùng</h3>
                <p className="text-sm text-muted-foreground">Tổng quan hệ thống</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Total Users */}
            <div className="text-center">
              {isLoading ? (
                <div className="h-8 bg-muted/50 rounded animate-pulse w-16 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {stats.total_users.toLocaleString("vi-VN")}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Tổng số</p>
            </div>

            {/* Active Users */}
            <div className="text-center">
              {isLoading ? (
                <div className="h-8 bg-muted/50 rounded animate-pulse w-16 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  {stats.active_users.toLocaleString("vi-VN")}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Hoạt động</p>
            </div>

            {/* New This Month */}
            <div className="text-center">
              {isLoading ? (
                <div className="h-8 bg-muted/50 rounded animate-pulse w-16 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-orange-600">
                  {stats.new_this_month.toLocaleString("vi-VN")}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Tháng này</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <Badge variant="success">
              <UserCheck className="h-3 w-3 mr-1" />
              {stats.total_users > 0
                ? Math.round((stats.active_users / stats.total_users) * 100)
                : 0}% hoạt động
            </Badge>
            <span className="text-xs text-muted-foreground">Xem chi tiết →</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default UsersWidget;
