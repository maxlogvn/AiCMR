"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardBody } from "@/components/ui/card";

interface PostsChartData {
  date: string;
  count: number;
}

interface PostsChartProps {
  data: PostsChartData[];
  isLoading?: boolean;
}

export function PostsChart({ data, isLoading = false }: PostsChartProps) {
  // Format data for display - convert date to readable format
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: formatDateLabel(item.date),
    }));
  }, [data]);

  const maxCount = useMemo(() => {
    return Math.max(...data.map((d) => d.count), 10);
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Bài viết theo thời gian" />
        <CardBody>
          <div className="h-64 bg-muted/50 rounded animate-pulse" />
        </CardBody>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader title="Bài viết theo thời gian" />
        <CardBody>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Bài viết theo thời gian" />
      <CardBody>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="displayDate"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              domain={[0, Math.ceil(maxCount * 1.1) || 10]}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value?: number) => [`${value || 0} bài viết`, "Số lượng"]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--orange-500))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--orange-500))", r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--orange-500))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

function formatDateLabel(dateStr: string): string {
  // Check if date is in YYYY-MM format (for "all" range)
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [year, month] = dateStr.split("-");
    const monthNames = [
      "T1", "T2", "T3", "T4", "T5", "T6",
      "T7", "T8", "T9", "T10", "T11", "T12"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }

  // Regular date format
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

export default PostsChart;
