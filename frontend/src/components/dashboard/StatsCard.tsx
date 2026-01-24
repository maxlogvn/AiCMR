'use client';

/**
 * StatsCard Component
 *
 * Linear/Vercel style statistics card with subtle borders,
 * smooth hover effects, and clean typography.
 *
 * @example
 * <StatsCard
 *   title="Total Users"
 *   value="1,234"
 *   change="+12.5%"
 *   icon={<Users className="h-5 w-5" />}
 * />
 */

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  className,
  trend,
}: StatsCardProps) {
  // Auto-detect trend from change value if not specified
  const detectedTrend = trend ?? (change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : 'neutral');

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card p-5',
        'transition-all duration-200',
        'hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5',
        'dark:hover:border-orange-400/30 dark:hover:shadow-orange-400/5',
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-orange-400/0 dark:to-orange-400/0" />

      <div className="relative">
        {/* Header with icon and title */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
          </div>
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background transition-colors group-hover:border-orange-500/50 group-hover:bg-orange-500/10">
              <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-orange-500 dark:group-hover:text-orange-400" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Change indicator */}
        {change !== undefined && (
          <div className="mt-4 flex items-center gap-1.5 text-sm">
            {detectedTrend === 'up' && (
              <>
                <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="font-medium">+{change}%</span>
                </div>
              </>
            )}
            {detectedTrend === 'down' && (
              <>
                <div className="flex items-center gap-0.5 text-red-600 dark:text-red-400">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span className="font-medium">{change}%</span>
                </div>
              </>
            )}
            {detectedTrend === 'neutral' && (
              <span className="font-medium text-muted-foreground">{change}%</span>
            )}
            <span className="text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for use in smaller grids
export function StatsCardCompact({
  title,
  value,
  change,
  icon: Icon,
  className,
}: StatsCardProps) {
  const detectedTrend = change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : 'neutral';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-md border bg-card p-4',
        'transition-all duration-200',
        'hover:border-orange-500/30',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background">
            <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-lg font-bold tracking-tight text-foreground truncate">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        {change !== undefined && (
          <div className="shrink-0">
            <span
              className={cn(
                'text-xs font-medium',
                detectedTrend === 'up' && 'text-emerald-600 dark:text-emerald-400',
                detectedTrend === 'down' && 'text-red-600 dark:text-red-400',
                detectedTrend === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
