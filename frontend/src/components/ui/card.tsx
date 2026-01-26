"use client"

/**
 * Card Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Import { Card, CardHeader, CardBody, CardFooter } từ '@/components/ui/card'
 * 2. Wrap content với các sub-components phù hợp
 * 3. Tất cả sections đều optional (trừ Card)
 *
 * @example
 * ```tsx
 * import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
 * import { Button } from '@/components/ui/button'
 *
 * function Example() {
 *   return (
 *     <Card>
 *       <CardHeader title="Card Title" description="Optional description" />
 *       <CardBody>
 *         <p>Card content goes here.</p>
 *       </CardBody>
 *       <CardFooter>
 *         <Button>Action</Button>
 *       </CardFooter>
 *     </Card>
 *   )
 * }
 * ```
 *
 * Design System Principles:
 * - "Eliminate Choices" - Chỉ 1 card style, không có variants
 * - Opinionated - Spacing cố định (p-6), hover effect cố định
 * - Documentation = Code - Examples inline, no separate docs
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card - Container component với hover effect
 *
 * Props:
 * - className: Optional Tailwind classes
 * - ...props: All standard div attributes
 *
 * Styling:
 * - Background: bg-card (design token)
 * - Border: border + rounded-lg
 * - Shadow: shadow-sm → shadow-md on hover
 * - Animation: duration-200
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        "hover:shadow-md transition-all duration-200",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

/**
 * CardHeader - Header với title và description
 *
 * Props:
 * - title: Tiêu đề chính (optional)
 * - description: Mô tả phụ (optional)
 * - className: Optional Tailwind classes
 * - ...props: All standard div attributes
 *
 * Styling:
 * - Padding: p-6 (24px)
 * - Title: text-2xl font-semibold
 * - Description: text-sm text-muted-foreground
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      >
        {title && (
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    )
  }
)
CardHeader.displayName = "CardHeader"

/**
 * CardBody - Content area chính
 *
 * Props:
 * - className: Optional Tailwind classes
 * - ...props: All standard div attributes
 *
 * Styling:
 * - Padding: p-6 pt-0 (no top padding to avoid gap with header)
 */
const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
})
CardBody.displayName = "CardBody"

/**
 * CardFooter - Footer với action buttons
 *
 * Props:
 * - className: Optional Tailwind classes
 * - ...props: All standard div attributes
 *
 * Styling:
 * - Padding: p-6 pt-0
 * - Layout: flex items-center
 * - Border: border-t (optional separator)
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
};
