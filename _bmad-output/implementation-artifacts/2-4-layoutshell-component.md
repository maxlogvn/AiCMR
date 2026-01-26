# Story 2.4: LayoutShell Component

Status: ready-for-dev

## Story

**As a** Developer,
**I want** A LayoutShell component for consistent page headers and layouts,
**so that** All pages have uniform structure and navigation.

## Acceptance Criteria

1. [ ] Create `LayoutShell` component for page layout
2. [ ] Display page title and subtitle (optional)
3. [ ] Display page icon (optional)
4. [ ] Display action buttons (top-right aligned)
5. [ ] Support back button (optional)
6. [ ] Content wrapper with max-width
7. [ ] Responsive design (mobile-friendly)
8. [ ] Add inline documentation with usage examples

## Tasks / Subtasks

- [ ] **Task 1: Create LayoutShell component** (AC: #1, #6)
  - [ ] 1.1 Create `frontend/src/components/ui/layout-shell.tsx`
  - [ ] 1.2 Define LayoutShell component with header and content sections
  - [ ] 1.3 Add content wrapper with max-width container
  - [ ] 1.4 Add TypeScript props interface

- [ ] **Task 2: Implement header section** (AC: #2, #3, #4, #5)
  - [ ] 2.1 Add title prop (required)
  - [ ] 2.2 Add subtitle prop (optional)
  - [ ] 2.3 Add icon prop (optional - Lucide icon)
  - [ ] 2.4 Add actions prop (optional - React nodes for buttons)
  - [ ] 2.5 Add showBackButton prop (optional)
  - [ ] 2.6 Implement back button with navigation

- [ ] **Task 3: Apply styling and spacing** (AC: #6, #7)
  - [ ] 3.1 Use spacing tokens (gap-4 for header elements)
  - [ ] 3.2 Add max-width container (mx-auto, max-w-7xl)
  - [ ] 3.3 Add responsive padding (px-4 mobile, px-6 desktop)
  - [ ] 3.4 Add vertical spacing (py-8 for page top/bottom)

- [ ] **Task 4: Implement back button** (AC: #5)
  - [ ] 4.1 Add back button icon (ArrowLeft from lucide-react)
  - [ ] 4.2 Wrap in Button component with variant="ghost"
  - [ ] 4.3 Implement router.back() on click
  - [ ] 4.4 Position left of title

- [ ] **Task 5: Add responsive design** (AC: #7)
  - [ ] 5.1 Test on mobile viewport (375px)
  - [ ] 5.2 Test on tablet viewport (768px)
  - [ ] 5.3 Test on desktop viewport (1024px+)
  - [ ] 5.4 Verify actions stack correctly on mobile

- [ ] **Task 6: Add documentation** (AC: #8)
  - [ ] 6.1 Add file header comment with usage instructions
  - [ ] 6.2 Add JSDoc examples for all props
  - [ ] 6.3 Add back button example
  - [ ] 6.4 Add actions example
  - [ ] 6.5 Verify Design System principles documented
  - [ ] 6.6 Verify Vietnamese language in comments

- [ ] **Task 7: Testing and validation** (AC: #2, #3, #4, #5, #7)
  - [ ] 7.1 Test title and subtitle render correctly
  - [ ] 7.2 Test icon displays correctly
  - [ ] 7.3 Test actions align to right
  - [ ] 7.4 Test back button navigates back
  - [ ] 7.5 Test responsive behavior

## Dev Notes

### Architecture Alignment

**Design System Principle: Eliminate Choices** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- No layout variants (only 1 shell structure)
- Opinionated spacing and max-width
- Consistent header pattern across all pages

**Design System Principle: Documentation = Code** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Inline examples in component comments
- Copy-paste ready templates
- No separate layout documentation needed

### Technical Context

**File to Create:** `frontend/src/components/ui/layout-shell.tsx`

**Dependencies:**
- React (forwardRef, ReactNode)
- lucide-react (ArrowLeft icon for back button)
- Button component (for back button and actions)
- Next.js router (useRouter for back navigation)
- Design tokens (spacing, colors)
- Utility function cn for className merging

**Implementation Pattern:**
```tsx
import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LayoutShellProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  showBackButton?: boolean
}

const LayoutShell = React.forwardRef<HTMLDivElement, LayoutShellProps>(
  ({ className, title, subtitle, icon, actions, showBackButton = false, children, ...props }, ref) => {
    const router = useRouter()

    return (
      <div ref={ref} className={cn("container mx-auto px-4 py-8", className)} {...props}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Back Button + Title + Icon */}
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}

              <div className="flex items-center gap-3">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                  {subtitle && (
                    <p className="text-muted-foreground mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            {actions && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div>{children}</div>
      </div>
    )
  }
)

LayoutShell.displayName = "LayoutShell"

export { LayoutShell }
```

### Component Structure

**LayoutShell Sections:**
1. **Header** - Contains title, subtitle, icon, back button, actions
2. **Content** - Page content area

**Props:**
- `title` (required) - Page title (h1 heading)
- `subtitle` (optional) - Page subtitle/description
- `icon` (optional) - Lucide icon or custom ReactNode
- `actions` (optional) - Action buttons (ReactNodes)
- `showBackButton` (optional, default: false) - Show back navigation button

**Layout Pattern:**
```
┌─────────────────────────────────────────┐
│ ← [Icon] Title            [Actions]    │
│         Subtitle                          │
├─────────────────────────────────────────┤
│                                         │
│  Content                                │
│                                         │
└─────────────────────────────────────────┘
```

**Styling:**
- Container: mx-auto (centered), max-w-7xl (1280px max width)
- Padding: px-4 (mobile), px-6 (desktop)
- Vertical spacing: py-8 (32px top/bottom)
- Header spacing: gap-4 between elements
- Header margin: mb-8 (32px) below header

### Usage Examples

**Basic Page:**
```tsx
import { LayoutShell } from '@/components/ui/layout-shell'

export default function UsersPage() {
  return (
    <LayoutShell title="Users">
      <p>Page content goes here.</p>
    </LayoutShell>
  )
}
```

**Page with Subtitle:**
```tsx
<LayoutShell
  title="User Management"
  subtitle="Manage user accounts and permissions"
>
  <p>Page content...</p>
</LayoutShell>
```

**Page with Icon:**
```tsx
import { Users } from 'lucide-react'

<LayoutShell
  title="Users"
  icon={<Users className="h-8 w-8" />}
>
  <p>Page content...</p>
</LayoutShell>
```

**Page with Actions:**
```tsx
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

<LayoutShell
  title="Posts"
  actions={
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      New Post
    </Button>
  }
>
  <p>Page content...</p>
</LayoutShell>
```

**Page with Back Button:**
```tsx
<LayoutShell
  title="Edit User"
  showBackButton={true}
>
  <p>Edit form goes here...</p>
</LayoutShell>
```

**Complete Example:**
```tsx
import { LayoutShell } from '@/components/ui/layout-shell'
import { Button } from '@/components/ui/button'
import { Users, Plus } from 'lucide-react'

export default function UsersPage() {
  return (
    <LayoutShell
      title="Users"
      subtitle="Manage user accounts and permissions"
      icon={<Users className="h-8 w-8 text-primary" />}
      showBackButton={true}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      }
    >
      {/* User table or content */}
      <div>Table goes here...</div>
    </LayoutShell>
  )
}
```

### Responsive Behavior

**Mobile (< 768px):**
- Header elements stack vertically
- Actions move below title
- Padding: px-4 (16px)
- Icon size: h-6 w-6 (24px)
- Title size: text-2xl (24px)

**Tablet (768px - 1024px):**
- Header elements in single row
- Actions right-aligned
- Padding: px-6 (24px)

**Desktop (> 1024px):**
- Full LayoutShell layout
- Max-width: 1280px (max-w-7xl)
- Actions right-aligned

### Accessibility Considerations

**Semantic HTML:**
- Use `<h1>` for page title (only one h1 per page)
- Use `<button>` for back button
- Use proper heading hierarchy

**ARIA Attributes:**
- Back button: `aria-label="Go back"`
- Icon: Add `aria-hidden="true"` if decorative

**Keyboard Navigation:**
- Back button focusable with Tab
- Actions focusable with Tab
- Logical tab order: Back button → Title link (if any) → Actions

### Testing Standards

**Visual Testing:**
- Title displays correctly with proper styling
- Subtitle displays below title
- Icon displays with correct size
- Actions align to right
- Back button displays when enabled

**Functional Testing:**
- Back button navigates to previous page
- Actions render correctly
- Children render in content section
- Props are optional (except title)

**Responsive Testing:**
- Mobile: Actions stack below title
- Tablet+: Actions right-aligned
- All viewports: Proper padding and spacing

**Accessibility Testing:**
- Screen reader announces page title (h1)
- Back button accessible via keyboard
- Focus order logical

### Project Structure Notes

**Alignment:** LayoutShell follows component structure
- Location: `frontend/src/components/ui/layout-shell.tsx`
- Naming: kebab-case
- Exports: Named export (LayoutShell)

**Integration Points:**
- Used in all dashboard pages
- Used in user pages (profile, settings)
- Optional in public pages (blog listing, etc.)

**No Conflicts Detected**

### References

- [Architecture: Component Structure](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-3-component-structure)
- [Epic 2: Design System Components](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-2-design-system-components)
- [Story 2.4 in Epics](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#story-24-layoutshell-component)
- [Button Component](d:/code/AiCMR/frontend/src/components/ui/button.tsx)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**File Created:** None yet - Status: ready-for-dev

**Next Steps:**
1. Create layout-shell.tsx component file
2. Implement header section with title, subtitle, icon, actions
3. Implement back button with router.back()
4. Add responsive design (mobile-first approach)
5. Add inline Vietnamese documentation
6. Test on mobile, tablet, desktop viewports

**Dependencies:**
- Button component (already exists)
- Next.js router (useRouter)

### File List

- `frontend/src/components/ui/layout-shell.tsx` (to be created)
