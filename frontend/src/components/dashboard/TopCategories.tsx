"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/card";

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface TopCategoriesProps {
  data: CategoryData[];
  isLoading?: boolean;
}

export function TopCategories({ data, isLoading = false }: TopCategoriesProps) {
  const maxCount = useMemo(() => {
    return Math.max(...data.map((d) => d.count), 1);
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Danh mục nổi bật" />
        <CardBody>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-muted/50 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-muted/50 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-muted/50 rounded animate-pulse w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader title="Danh mục nổi bật" />
        <CardBody>
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Danh mục nổi bật" />
      <CardBody>
        <div className="space-y-3">
          {data.map((category, index) => {
            const percentage = (category.count / maxCount) * 100;

            return (
              <Link
                key={category.id}
                href={`/dashboard/categories`}
                className="block group"
              >
                <div className="flex items-center gap-3">
                  {/* Rank badge */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                        ? "bg-gray-100 text-gray-700"
                        : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground truncate group-hover:text-orange-500 transition-colors">
                        {category.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {category.count}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all group-hover:bg-orange-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

export default TopCategories;
