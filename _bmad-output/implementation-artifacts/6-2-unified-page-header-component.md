# Story 6.2: Unified Page Header Component

Status: done

## Story

As a user,
I want consistent page headers across all dashboard pages,
So that I always know where I am in the system.

## Acceptance Criteria

1. **Given** I am on any dashboard page
   **When** I view the page header
   **Then** I see a gradient icon container (orange for content, yellow for settings)

2. **Given** I am viewing the page header
   **When** I view the title text
   **Then** title uses `text-2xl font-bold tracking-tight`

3. **Given** I am viewing the page header
   **When** I view the subtitle
   **Then** subtitle uses `text-sm text-muted-foreground`

4. **Given** I am on a settings page
   **When** I view the page header
   **Then** header uses yellow accent (not orange) to indicate "care required"
   **And** I see a warning badge "⚠️ Requires Care"

5. **Given** I am on mobile viewport
   **When** I view the page header
   **Then** header stacks vertically (icon above title)

## Tasks / Subtasks

- [ ] **Task 1: Create PageHeader Component** (AC: 1, 2, 3)
  - [ ] Create `frontend/src/components/layout/PageHeader.tsx`
  - [ ] Props: `icon`, `title`, `subtitle`
  - [ ] Props: `variant` ("content" | "settings")
  - [ ] Gradient icon container: `bg-gradient-to-br from-orange-500 to-orange-600`
  - [ ] Settings variant: yellow gradient instead of orange

- [ ] **Task 2: Implement Content Header Style** (AC: 1, 2, 3)
  - [ ] Title: `text-2xl font-bold tracking-tight text-foreground`
  - [ ] Subtitle: `text-sm text-muted-foreground`
  - [ ] Container: `flex items-center gap-3 mb-8`

- [ ] **Task 3: Implement Settings Header Style** (AC: 4)
  - [ ] Yellow gradient for settings: `from-yellow-500 to-yellow-600`
  - [ ] Warning badge: "⚠️ Requires Care"
  - [ ] Badge styling: `rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`

- [ ] **Task 4: Mobile Responsiveness** (AC: 5)
  - [ ] Mobile: `flex-col items-start gap-2` instead of `flex-row items-center gap-3`
  - [ ] Icon and title stack vertically on small screens
  - [ ] Use responsive classes: `sm:flex-row sm:items-center sm:gap-3`

- [ ] **Task 5: Integrate into Dashboard Pages** (AC: 1-5)
  - [ ] Replace existing headers in `/dashboard/posts`
  - [ ] Replace existing headers in `/dashboard/categories`
  - [ ] Replace existing headers in `/dashboard/tags`
  - [ ] Replace existing headers in `/dashboard/users-manager`
  - [ ] Replace existing headers in `/dashboard/settings` (with settings variant)

## Dev Notes

### Component Interface
```typescript
interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  variant?: "content" | "settings";
}
```

### Style Reference (from Stats Page)
**Content Page Header:**
```tsx
<div className="flex items-center gap-3 mb-8">
  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
    <Icon className="h-5 w-5 text-white" />
  </div>
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-foreground">
      {title}
    </h1>
    <p className="text-sm text-muted-foreground">
      {subtitle}
    </p>
  </div>
</div>
```

**Settings Page Header:**
```tsx
<div className="flex items-center gap-3 mb-8">
  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
    <Icon className="h-5 w-5 text-white" />
  </div>
  <div>
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        ⚠️ Requires Care
      </span>
    </div>
    <p className="text-sm text-muted-foreground">
      Thay đổi cài đặt sẽ ảnh hưởng đến toàn bộ hệ thống
    </p>
  </div>
</div>
```

### Page Icons Mapping
| Page | Icon | Variant |
|------|------|---------|
| `/dashboard/posts` | FileText | content |
| `/dashboard/categories` | FolderTree | content |
| `/dashboard/tags` | Tag | content |
| `/dashboard/users-manager` | Users | content |
| `/dashboard/settings` | Settings | settings |
| `/dashboard/stats` | BarChart3 | content |

### Component Reuse
- Use existing lucide-react icons
- Follow gradient pattern from stats page
- Maintain consistent spacing and typography

### References
- [Source: epics.md Story 6.2](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- PageHeader component already existed in `components/dashboard/` (not created in `components/layout/` as spec suggested)
- Added mobile responsiveness: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0`
- Updated settings page to always show "⚠️ Requires Care" badge
- All dashboard pages already use PageHeader correctly

**Features Implemented:**
1. ✅ Gradient icon container (orange for content, yellow for settings)
2. ✅ Title styling: `text-2xl font-bold tracking-tight text-foreground`
3. ✅ Subtitle styling: `text-sm text-muted-foreground`
4. ✅ Settings variant with yellow gradient
5. ✅ "⚠️ Requires Care" badge on settings page
6. ✅ Mobile responsiveness (stacking on small screens)

**Files Modified:**
- `frontend/src/components/dashboard/PageHeader.tsx` - Added responsive classes
- `frontend/src/app/dashboard/settings/page.tsx` - Updated badge to always show warning

**Build Status:** ✅ PASS

### File List

- `frontend/src/components/dashboard/PageHeader.tsx` (MODIFIED - added mobile responsiveness)
- `frontend/src/app/dashboard/settings/page.tsx` (MODIFIED - added warning badge)
- `frontend/src/app/dashboard/posts/page.tsx` (NO CHANGE - already uses PageHeader)
- `frontend/src/app/dashboard/categories/page.tsx` (NO CHANGE - already uses PageHeader)
- `frontend/src/app/dashboard/tags/page.tsx` (NO CHANGE - already uses PageHeader)
- `frontend/src/app/dashboard/users-manager/page.tsx` (NO CHANGE - already uses PageHeader)

## AI-Review Action Items

- [ ] [AI-Review][MINOR] PageHeader.tsx is in `components/dashboard/` not `components/layout/` as spec suggested [6-2:144]
