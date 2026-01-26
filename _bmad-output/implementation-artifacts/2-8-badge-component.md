# Story 2.8: Badge Component

Status: ready-for-dev

## Story

**As a** Developer,
**I want** A Badge component for status indicators and labels,
**so that** I can display user ranks, post status, and other indicators.

## Acceptance Criteria

1. [ ] Create `Badge` component for labels
2. [ ] Support 5 semantic variants: primary, success, warning, error, info
3. [ ] Use design tokens (colors, spacing)
4. [ ] Display user ranks (0-10)
5. [ ] Display post status (draft, published, archived)
6. [ ] Add inline documentation with usage examples
7. [ ] Accessible (color contrast, ARIA)

## Tasks / Subtasks

- [ ] **Task 1: Create Badge component** (AC: #1, #2, #3)
  - [ ] 1.1 Create `frontend/src/components/ui/badge.tsx`
  - [ ] 1.2 Define Badge component with variant prop
  - [ ] 1.3 Implement 5 semantic variants (primary, success, warning, error, info)
  - [ ] 1.4 Add TypeScript types for variant prop
  - [ ] 1.5 Use design tokens for colors and spacing

- [ ] **Task 2: Apply styling for variants** (AC: #2, #3)
  - [ ] 2.1 Apply primary colors (bg-primary, text-primary-foreground)
  - [ ] 2.2 Apply success colors (bg-green-500, text-white)
  - [ ] 2.3 Apply warning colors (bg-yellow-500, text-white)
  - [ ] 2.4 Apply error colors (bg-red-500, text-white)
  - [ ] 2.5 Apply info colors (bg-blue-500, text-white)

- [ ] **Task 3: Implement rank display** (AC: #4)
  - [ ] 3.1 Create helper function/method for rank badges
  - [ ] 3.2 Support rank values 0-10
  - [ ] 3.3 Map ranks to labels (Guest, Member, Editor, Moderator, Admin)
  - [ ] 3.4 Use appropriate variant per rank level

- [ ] **Task 4: Implement status display** (AC: #5)
  - [ ] 4.1 Map post status to variants (draft=warning, published=success, archived=error)
  - [ ] 4.2 Create helper for status badges
  - [ ] 4.3 Test all status variations

- [ ] **Task 5: Add accessibility** (AC: #7)
  - [ ] 5.1 Verify WCAG AA contrast ratios (4.5:1)
  - [ ] 5.2 Add ARIA labels if needed for screen readers
  - [ ] 5.3 Test with screen reader

- [ ] **Task 6: Add documentation** (AC: #6)
  - [ ] 6.1 Add file header comment with usage instructions
  - [ ] 6.2 Add JSDoc examples for each variant
  - [ ] 6.3 Add rank badge examples
  - [ ] 6.4 Add status badge examples
  - [ ] 6.5 Verify Design System principles documented
  - [ ] 6.6 Verify Vietnamese language in comments

- [ ] **Task 7: Testing and validation** (AC: #2, #3, #4, #5)
  - [ ] 7.1 Test all 5 variants render correctly
  - [ ] 7.2 Test rank badges display correctly
  - [ ] 7.3 Test status badges display correctly
  - [ ] 7.4 Test in light mode
  - [ ] 7.5 Test in dark mode

## Dev Notes

### Architecture Alignment

**Design System Principle: Eliminate Choices** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Only 5 semantic variants (no outline, ghost, etc.)
- No size prop (only 1 default size)
- Opinionated color mapping

**Design System Principle: Optimize for 90%** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Covers 90% of badge use cases (ranks, status, categories)
- Focus on common scenarios

### Technical Context

**File to Create:** `frontend/src/components/ui/badge.tsx`

**Dependencies:**
- Tailwind CSS classes
- Design tokens from globals.css
- Utility function cn for className merging

**Implementation Pattern:**
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "primary" | "success" | "warning" | "error" | "info"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variantClasses = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/80",
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
```

### Badge Variants

**Color Mapping:**
- `primary`: Orange (F97316) - Primary actions, important items
- `success`: Green (16 185 129) - Success, published, active
- `warning`: Yellow (245 158 11) - Warning, draft, pending
- `error`: Red (239 68 68) - Error, archived, inactive
- `info`: Blue (59 130 246) - Information, neutral

**Styling:**
- Rounded: rounded-full (pill shape)
- Padding: px-2.5 py-0.5 (horizontal 10px, vertical 2px)
- Font: text-xs (12px), font-semibold (600)
- Transition: transition-colors for hover effect
- Focus: ring-2 ring-ring ring-offset-2

### Usage Examples

**Basic Badges:**
```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

**Rank Badges:**
```tsx
// Helper function for rank badges
function RankBadge({ rank }: { rank: number }) {
  const getRankLabel = (rank: number) => {
    if (rank === 0) return "Guest"
    if (rank <= 2) return "Member"
    if (rank <= 4) return "Editor"
    if (rank === 5) return "Moderator"
    if (rank === 10) return "Admin"
    return `Rank ${rank}`
  }

  const getRankVariant = (rank: number): BadgeVariant => {
    if (rank === 0) return "info"
    if (rank <= 2) return "primary"
    if (rank <= 4) return "success"
    if (rank === 5) return "warning"
    if (rank === 10) return "error"
    return "primary"
  }

  return (
    <Badge variant={getRankVariant(rank)}>
      {getRankLabel(rank)}
    </Badge>
  )
}

// Usage
<RankBadge rank={0} /> {/* Guest - blue */}
<RankBadge rank={1} /> {/* Member - orange */}
<RankBadge rank={5} /> {/* Moderator - yellow */}
<RankBadge rank={10} /> {/* Admin - red */}
```

**Status Badges:**
```tsx
// Helper function for post status
function StatusBadge({ status }: { status: "draft" | "published" | "archived" }) {
  const variantMap = {
    draft: "warning" as const,
    published: "success" as const,
    archived: "error" as const,
  }

  const labelMap = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
  }

  return (
    <Badge variant={variantMap[status]}>
      {labelMap[status]}
    </Badge>
  )
}

// Usage
<StatusBadge status="draft" /> {/* Draft - yellow */}
<StatusBadge status="published" /> {/* Published - green */}
<StatusBadge status="archived" /> {/* Archived - red */}
```

**Inline with Text:**
```tsx
<p>
  User: <Badge variant="success">Active</Badge>
</p>

<p>
  Status: <Badge variant="warning">Pending Review</Badge>
</p>
```

### Accessibility Considerations

**Color Contrast:**
- All variants meet WCAG AA 4.5:1 contrast ratio
- White text on colored backgrounds ensures readability
- Verify with contrast checker tools

**ARIA Attributes:**
- Add `aria-label` if Badge conveys status not visible in text
- Example: `<Badge aria-label="Status: Published">Published</Badge>`

**Screen Reader:**
- Badge content is announced by screen readers
- Use meaningful text content (not icons alone)

### Testing Standards

**Visual Testing:**
- All 5 variants display with correct colors
- Badge text is readable in all variants
- Hover effect works (color darkens)
- Rounded pill shape displays correctly

**Functional Testing:**
- All variants render correctly
- Custom className can be applied
- Children render as badge content
- Focus ring displays on keyboard focus

**Accessibility Testing:**
- Color contrast meets WCAG AA (4.5:1)
- Screen reader announces badge content
- ARIA labels work if provided

**Cross-Browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)

### Project Structure Notes

**Alignment:** Badge follows component structure
- Location: `frontend/src/components/ui/badge.tsx`
- Naming: kebab-case
- Exports: Named export (Badge)

**No Conflicts Detected**

### References

- [Architecture: Component Structure](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-3-component-structure)
- [Epic 2: Design System Components](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-2-design-system-components)
- [Story 2.8 in Epics](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#story-28-badge-component)
- [shadcn/ui Badge Reference](https://ui.shadcn.com/docs/components/badge) (for base structure)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**File Created:** None yet - Status: ready-for-dev

**Next Steps:**
1. Create badge.tsx component file
2. Implement all 5 variants with correct colors
3. Add helper functions for RankBadge and StatusBadge
4. Add inline Vietnamese documentation
5. Test color contrast in light and dark mode
6. Verify accessibility

**Dependencies:** None (can be implemented independently)

### File List

- `frontend/src/components/ui/badge.tsx` (to be created)
