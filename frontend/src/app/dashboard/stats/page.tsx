"use client";

/**
 * Stats Page - Linear/Vercel Style Redesign
 *
 * Features:
 * - Statistics overview cards
 * - Charts for visual data
 * - Time range filter
 * - Export functionality
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Download, BarChart3, TrendingUp, Users, FileText, Eye } from "lucide-react";
import { PageHeader, StatsCard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { PostsChart } from "@/components/dashboard/PostsChart";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { TopCategories } from "@/components/dashboard/TopCategories";
import { TopAuthors } from "@/components/dashboard/TopAuthors";
import { exportToCsv, getCsvFilename } from "@/lib/exportToCsv";

type TimeRange = "7d" | "30d" | "90d" | "all";

interface PostsTimeData {
  date: string;
  count: number;
}

interface StatusData {
  status: string;
  count: number;
}

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface AuthorData {
  id: number;
  username: string;
  full_name: string | null;
  avatar: string | null;
  count: number;
}

interface StatsDetailsResponse {
  posts_over_time: PostsTimeData[];
  posts_by_status: StatusData[];
  top_categories: CategoryData[];
  top_authors: AuthorData[];
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "90d", label: "90 ngày" },
  { value: "all", label: "Tất cả" },
];

async function fetchStatsDetails(range: TimeRange): Promise<StatsDetailsResponse> {
  const response = await fetch(`/api/v1/stats/details?range=${range}`);

  if (!response.ok) {
    throw new Error("Failed to fetch stats details");
  }

  return response.json();
}

export default function DashboardStatsPage() {
  const searchParams = useSearchParams();
  const rangeFromUrl = searchParams.get("range") as TimeRange | null;

  const [selectedRange, setSelectedRange] = useState<TimeRange>(
    rangeFromUrl && ["7d", "30d", "90d", "all"].includes(rangeFromUrl)
      ? rangeFromUrl
      : "30d"
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["stats-details", selectedRange],
    queryFn: () => fetchStatsDetails(selectedRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate summary stats
  const totalPosts = data?.posts_over_time.reduce((sum, item) => sum + item.count, 0) || 0;
  const publishedPosts = data?.posts_by_status.find(s => s.status === "published")?.count || 0;
  const draftPosts = data?.posts_by_status.find(s => s.status === "draft")?.count || 0;
  const totalCategories = data?.top_categories.length || 0;

  const handleRangeChange = (newRange: TimeRange) => {
    setSelectedRange(newRange);
    // Update URL without refreshing
    const url = new URL(window.location.href);
    url.searchParams.set("range", newRange);
    window.history.replaceState({}, "", url.toString());
  };

  const handleExport = () => {
    if (!data) return;

    // Export posts over time
    const postsTimeData = data.posts_over_time.map((item) => ({
      Ngày: item.date,
      "Số bài viết": item.count,
    }));
    exportToCsv(postsTimeData, getCsvFilename("posts_over_time"));

    // Export posts by status
    const statusData = data.posts_by_status.map((item) => ({
      Trạng_thái: item.status,
      "Số bài viết": item.count,
    }));
    exportToCsv(statusData, getCsvFilename("posts_by_status"));

    // Export top categories
    const categoryData = data.top_categories.map((item) => ({
      ID: item.id,
      Danh_muc: item.name,
      "Số bài viết": item.count,
    }));
    exportToCsv(categoryData, getCsvFilename("top_categories"));

    // Export top authors
    const authorData = data.top_authors.map((item) => ({
      ID: item.id,
      Username: item.username,
      "Họ tên": item.full_name || "",
      "Số bài viết": item.count,
    }));
    exportToCsv(authorData, getCsvFilename("top_authors"));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Thống kê"
        subtitle="Phân tích bài viết và hoạt động của người dùng"
        icon={BarChart3}
        actions={
          <div className="flex items-center gap-2">
            {/* Time range selector */}
            <div className="inline-flex rounded-lg border bg-card p-1">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleRangeChange(range.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedRange === range.value
                      ? "bg-orange-500 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Export button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!data || isLoading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            Đã xảy ra lỗi khi tải dữ liệu thống kê. Vui lòng thử lại.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Tổng bài viết"
          value={totalPosts}
          icon={FileText}
          changeLabel="bài viết"
        />
        <StatsCard
          title="Đã đăng"
          value={publishedPosts}
          icon={TrendingUp}
          changeLabel="công khai"
          trend="up"
        />
        <StatsCard
          title="Bản nháp"
          value={draftPosts}
          icon={Eye}
          changeLabel="chưa đăng"
          trend="neutral"
        />
        <StatsCard
          title="Danh mục"
          value={totalCategories}
          icon={BarChart3}
          changeLabel="danh mục"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Posts Over Time Chart - Full width */}
        <PostsChart data={data?.posts_over_time || []} isLoading={isLoading} />

        {/* Second row: Status Breakdown and Top Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusBreakdown data={data?.posts_by_status || []} isLoading={isLoading} />
          <TopCategories data={data?.top_categories || []} isLoading={isLoading} />
        </div>

        {/* Top Authors - Full width */}
        <TopAuthors data={data?.top_authors || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
