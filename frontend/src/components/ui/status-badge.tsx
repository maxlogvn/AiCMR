/**
 * StatusBadge Component
 *
 * Badge for displaying content status (published, draft, scheduled, archived).
 * Each status has distinct color and optional icon.
 *
 * @see {@link https://ui.shadcn.com/docs/components/badge}
 */

import * as React from "react";

import { Badge } from "./badge";

export type PostStatus = "published" | "draft" | "scheduled" | "archived";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content status */
  status: PostStatus;
  /** Hide icon */
  hideIcon?: boolean;
}

const statusConfig = {
  published: {
    icon: "✅",
    label: "Published",
    variant: "success" as const,
  },
  draft: {
    icon: "⏳",
    label: "Draft",
    variant: "warning" as const,
  },
  scheduled: {
    icon: "📅",
    label: "Scheduled",
    variant: "info" as const,
  },
  archived: {
    icon: "🗑️",
    label: "Archived",
    variant: "default" as const,
  },
} as const;

/**
 * StatusBadge Component
 *
 * @example
 * <StatusBadge status="published" />
 * <StatusBadge status="draft" />
 * <StatusBadge status="scheduled" />
 * <StatusBadge status="archived" />
 */
const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, hideIcon = false, className, ...props }, ref) => {
    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        icon={hideIcon ? undefined : config.icon}
        className={className}
        {...props}
      >
        {config.label}
      </Badge>
    );
  },
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
