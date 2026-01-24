"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatusData {
  status: string;
  count: number;
}

interface StatusBreakdownProps {
  data: StatusData[];
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  published: "hsl(142, 76%, 36%)", // green-700
  draft: "hsl(30, 95%, 40%)", // orange-600
  archived: "hsl(215, 25%, 27%)", // slate-700
};

const STATUS_LABELS: Record<string, string> = {
  published: "Đã đăng",
  draft: "Nháp",
  archived: "Lưu trữ",
};

export function StatusBreakdown({ data, isLoading = false }: StatusBreakdownProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    status: item.status,
  }));

  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bài viết theo trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/50 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0 || total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bài viết theo trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bài viết theo trạng thái</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={90}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] || "#888"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value?: number, name?: string) => [
                `${value || 0} bài viết`,
                name || "",
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Text summary below chart */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {data.map((item) => (
            <div key={item.status} className="text-sm">
              <div className="font-medium text-foreground">
                {STATUS_LABELS[item.status] || item.status}
              </div>
              <div className="text-muted-foreground">
                {item.count} ({total > 0 ? ((item.count / total) * 100).toFixed(0) : 0}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatusBreakdown;
