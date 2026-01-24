/**
 * RankBadge Component
 *
 * Badge for displaying user rank (Guest, Member, Editor, Moderator, Admin).
 * Each rank has distinct styling and displays rank name with numeric value.
 *
 * @see {@link https://ui.shadcn.com/docs/components/badge}
 */

import * as React from "react";

import { Badge } from "./badge";

export type UserRank = 0 | 1 | 2 | 3 | 4 | 5 | 10;

export interface RankBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** User rank value */
  rank: UserRank;
  /** Hide icon */
  hideIcon?: boolean;
  /** Show numeric value */
  showValue?: boolean;
}

const rankConfig = {
  0: { icon: "👤", label: "Guest", variant: "default" as const },
  1: { icon: "👥", label: "Member", variant: "default" as const },
  2: { icon: "👥", label: "Member", variant: "default" as const },
  3: { icon: "✍️", label: "Editor", variant: "info" as const },
  4: { icon: "✍️", label: "Editor", variant: "info" as const },
  5: { icon: "🔧", label: "Moderator", variant: "warning" as const },
  10: { icon: "👑", label: "Admin", variant: "destructive" as const },
} as const;

/**
 * RankBadge Component
 *
 * @example
 * <RankBadge rank={0} />  // 👤 Guest
 * <RankBadge rank={1} />  // 👥 Member
 * <RankBadge rank={5} />  // 🔧 Moderator
 * <RankBadge rank={10} /> // 👑 Admin
 *
 * @example
 * // With numeric value
 * <RankBadge rank={5} showValue />
 * // 🔧 Moderator (5)
 */
const RankBadge = React.forwardRef<HTMLDivElement, RankBadgeProps>(
  ({ rank, hideIcon = false, showValue = false, className, ...props }, ref) => {
    const config = rankConfig[rank] || rankConfig[0];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        icon={hideIcon ? undefined : config.icon}
        className={className}
        {...props}
      >
        {config.label}
        {showValue && <span className="opacity-70">({rank})</span>}
      </Badge>
    );
  },
);

RankBadge.displayName = "RankBadge";

export { RankBadge };
