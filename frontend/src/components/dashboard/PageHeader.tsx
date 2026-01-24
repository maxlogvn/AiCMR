'use client';

/**
 * PageHeader Component
 *
 * Linear/Vercel style page header with gradient icon, title, and subtitle.
 * Used within dashboard pages to identify page content.
 *
 * @example
 * <PageHeader
 *   title="Statistics"
 *   subtitle="Overview of your system metrics and user activity"
 *   icon={BarChart3}
 * />
 */

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: 'default' | 'settings';
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  variant = 'default',
  badge,
  actions,
}: PageHeaderProps) {
  const isSettings = variant === 'settings';

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Icon and title - stack vertically on mobile */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          {/* Gradient icon container */}
          <div
            className={cn(
              'flex h-12 w-12 sm:h-10 sm:w-10 items-center justify-center rounded-lg shadow-lg',
              'bg-gradient-to-br transition-all duration-200',
              // Orange for content pages, yellow for settings (warning)
              isSettings
                ? 'from-yellow-500 to-yellow-600 shadow-yellow-500/20'
                : 'from-orange-500 to-orange-600 shadow-orange-500/20'
            )}
          >
            <Icon className="h-6 w-6 sm:h-5 sm:w-5 text-white" strokeWidth={1.5} />
          </div>

          {/* Title and subtitle */}
          <div className="flex flex-col">
            {badge ? (
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
                {badge}
              </div>
            ) : (
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            <p className="text-sm text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Optional actions on right */}
        {actions && (
          <div className="flex items-center gap-2 sm:justify-end">{actions}</div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact page header for smaller spaces
 */
interface PageHeaderCompactProps {
  title: string;
  icon: LucideIcon;
}

export function PageHeaderCompact({ title, icon: Icon }: PageHeaderCompactProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20">
          <Icon className="h-4 w-4 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
    </div>
  );
}
