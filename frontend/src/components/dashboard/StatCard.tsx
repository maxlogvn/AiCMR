"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number | string;
  changePercent?: number;
  href?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  changePercent = 0,
  href,
  icon,
  isLoading = false,
}: StatCardProps) {
  const cardContent = (
    <Card
      hover={!!href}
      className="relative overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          {icon && <div className="text-muted-foreground/60">{icon}</div>}
        </div>

        {isLoading ? (
          <div className="h-8 bg-muted/50 rounded animate-pulse w-24" />
        ) : (
          <p className="text-3xl font-bold text-foreground">
            {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
          </p>
        )}

        {!isLoading && changePercent !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {changePercent > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : changePercent < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Minus className="h-4 w-4 text-muted-foreground" />
            )}
            <span
              className={`text-sm font-medium ${
                changePercent > 0
                  ? "text-green-500"
                  : changePercent < 0
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {changePercent > 0 ? "+" : ""}
              {changePercent}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">so với tháng trước</span>
          </div>
        )}
      </div>

      {/* Subtle gradient accent */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-500/5 to-transparent rounded-tl-full pointer-events-none" />
    </Card>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}

export default StatCard;
