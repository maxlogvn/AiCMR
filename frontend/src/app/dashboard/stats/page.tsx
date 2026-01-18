"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Users, UserPlus, Activity, TrendingUp, Shield } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { StatsOverview } from "@/types";

const Card = dynamic(() =>
  import("@/components/ui/card-wrapped").then((mod) => ({ default: mod.Card })),
);

export default function DashboardStatsPage() {
  const { isLoading } = useUser();

  const {
    data: stats,
    isLoading: statsLoading,
    error,
  } = useQuery<StatsOverview>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { statsApi } = await import("@/lib/api");
      const response = await statsApi.getStatsOverview();
      return response.data;
    },
  });

  if (isLoading || statsLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-red-500 p-8 text-center">
        Đã xảy ra lỗi khi tải thống kê.
      </div>
    );

  const getRankLabel = (rank: number): string => {
    const labels: Record<number, string> = {
      0: "Guest",
      1: "Member",
      3: "Moderator",
      5: "Admin",
    };
    return labels[rank] || "Unknown";
  };

  const getRankColor = (rank: number): string => {
    const colors: Record<number, string> = {
      0: "bg-zinc-200 text-zinc-800",
      1: "bg-blue-100 text-blue-800",
      3: "bg-orange-100 text-orange-800",
      5: "bg-red-100 text-red-800",
    };
    return colors[rank] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-zinc-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Tổng quan hệ thống
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Tổng người dùng
              </div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                {stats?.total_users || 0}
              </div>
            </div>
            <Users className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Đang hoạt động
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats?.active_users || 0}
              </div>
            </div>
            <Activity className="h-10 w-10 text-green-400 dark:text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Không hoạt động
              </div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats?.inactive_users || 0}
              </div>
            </div>
            <TrendingUp className="h-10 w-10 text-red-400 dark:text-red-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Tỷ lệ hoạt động
              </div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                {stats && stats.total_users > 0
                  ? ((stats.active_users / stats.total_users) * 100).toFixed(1)
                  : "0"}
                %
              </div>
            </div>
            <UserPlus className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Phân bố theo Rank">
          <div className="space-y-3">
            {Object.entries(stats?.by_rank || {}).map(([rank, count]) => (
              <div key={rank} className="flex items-center justify-between">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {getRankLabel(Number(rank))}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {count}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRankColor(Number(rank))}`}
                  >
                    {getRankLabel(Number(rank))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Người dùng mới nhất">
          <div className="space-y-3">
            {stats?.recent_users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user.email}
                  </div>
                  <div className="text-xs text-zinc-500">{user.username}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRankColor(user.rank)}`}
                  >
                    {getRankLabel(user.rank)}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(user.created_at).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
