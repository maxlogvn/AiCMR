"use client"

/**
 * Badge Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Import { Badge } từ '@/components/ui/badge'
 * 2. Sử dụng variant prop để chọn style (primary, success, warning, error, info)
 * 3. Default variant: primary
 *
 * @example
 * ```tsx
 * import { Badge } from '@/components/ui/badge'
 *
 * function Example() {
 *   return (
 *     <div>
 *       <Badge variant="primary">Admin</Badge>
 *       <Badge variant="success">Published</Badge>
 *       <Badge variant="warning">Draft</Badge>
 *       <Badge variant="error">Archived</Badge>
 *       <Badge variant="info">Guest</Badge>
 *     </div>
 *   )
 * }
 * ```
 *
 * Design System Principles:
 * - "Eliminate Choices" - Chỉ 5 semantic variants, không có outline, ghost, etc.
 * - Opinionated - Pill shape (rounded-full), font-semibold, text-xs
 * - Documentation = Code - Examples inline, no separate docs
 */

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Badge Variants
 *
 * Color Mapping:
 * - primary: Orange (F97316) - Primary actions, important items
 * - success: Green (16 185 129) - Success, published, active
 * - warning: Yellow (245 158 11) - Warning, draft, pending
 * - error: Red (239 68 68) - Error, archived, inactive
 * - info: Blue (59 130 246) - Information, neutral
 */
type BadgeVariant = "primary" | "success" | "warning" | "error" | "info"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Badge variant - Xác định màu sắc
   * @default "primary"
   */
  variant?: BadgeVariant
}

/**
 * Badge Component - Status/label component
 *
 * Props:
 * - variant: primary | success | warning | error | info (default: primary)
 * - className: Optional Tailwind classes
 * - children: Badge content (text, numbers, etc.)
 * - ...props: All standard div attributes
 *
 * Styling:
 * - Shape: rounded-full (pill shape)
 * - Padding: px-2.5 py-0.5 (horizontal 10px, vertical 2px)
 * - Font: text-xs (12px), font-semibold (600)
 * - Colors: Solid backgrounds with white text
 * - Hover: Darker background color
 * - Focus: ring-2 ring-ring ring-offset-2
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variantClasses = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      success: "bg-green-500 text-white hover:bg-green-600",
      warning: "bg-yellow-500 text-white hover:bg-yellow-600",
      error: "bg-red-500 text-white hover:bg-red-600",
      info: "bg-blue-500 text-white hover:bg-blue-600",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"

export { Badge }

/**
 * Helper: Rank Badge - Hiển thị rank user
 *
 * Rank Levels:
 * - 0: Guest (info - blue)
 * - 1-2: Member (primary - orange)
 * - 3-4: Editor (success - green)
 * - 5: Moderator (warning - yellow)
 * - 10: Admin (error - red)
 *
 * @example
 * ```tsx
 * import { Badge } from '@/components/ui/badge'
 *
 * function RankBadge({ rank }: { rank: number }) {
 *   const getRankLabel = (rank: number) => {
 *     if (rank === 0) return "Guest"
 *     if (rank <= 2) return "Member"
 *     if (rank <= 4) return "Editor"
 *     if (rank === 5) return "Moderator"
 *     if (rank === 10) return "Admin"
 *     return `Rank ${rank}`
 *   }
 *
 *   const getRankVariant = (rank: number): BadgeVariant => {
 *     if (rank === 0) return "info"
 *     if (rank <= 2) return "primary"
 *     if (rank <= 4) return "success"
 *     if (rank === 5) return "warning"
 *     if (rank === 10) return "error"
 *     return "primary"
 *   }
 *
 *   return (
 *     <Badge variant={getRankVariant(rank)}>
 *       {getRankLabel(rank)}
 *     </Badge>
 *   )
 * }
 *
 * // Usage
 * <RankBadge rank={0} />  {/* Guest - blue *\/}
 * <RankBadge rank={1} />  {/* Member - orange *\/}
 * <RankBadge rank={5} />  {/* Moderator - yellow *\/}
 * <RankBadge rank={10} /> {/* Admin - red *\/}
 * ```
 */
/**
 * Helper: Status Badge - Hiển thị post status
 *
 * Status Types:
 * - draft: warning (yellow)
 * - published: success (green)
 * - archived: error (red)
 *
 * @example
 * ```tsx
 * import { Badge } from '@/components/ui/badge'
 *
 * function StatusBadge({ status }: { status: "draft" | "published" | "archived" }) {
 *   const variantMap = {
 *     draft: "warning" as const,
 *     published: "success" as const,
 *     archived: "error" as const,
 *   }
 *
 *   const labelMap = {
 *     draft: "Draft",
 *     published: "Published",
 *     archived: "Archived",
 *   }
 *
 *   return (
 *     <Badge variant={variantMap[status]}>
 *       {labelMap[status]}
 *     </Badge>
 *   )
 * }
 *
 * // Usage
 * <StatusBadge status="draft" />      {/* Draft - yellow *\/}
 * <StatusBadge status="published" />  {/* Published - green *\/}
 * <StatusBadge status="archived" />   {/* Archived - red *\/}
 * ```
 */
/**
 * Inline with Text - Badge trong text
 *
 * @example
 * ```tsx
 * <p>
 *   User: <Badge variant="success">Active</Badge>
 * </p>
 *
 * <p>
 *   Status: <Badge variant="warning">Pending Review</Badge>
 * </p>
 *
 * <div className="flex items-center gap-2">
 *   <span>Post status:</span>
 *   <Badge variant="success">Published</Badge>
 * </div>
 * ```
 */
