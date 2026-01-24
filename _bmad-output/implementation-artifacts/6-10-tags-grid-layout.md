# Story 6.10: Tags Grid Layout

Status: ready-for-dev

## Story

As a moderator,
I want tags displayed as minimal grid cards with color badges,
So that I can quickly scan all tags.

## Acceptance Criteria

1. **Given** I am on `/dashboard/tags`
   **When** I view the tags list
   **Then** I see a responsive grid of cards (3 columns on desktop, 2 on tablet, 1 on mobile)

2. **Given** I am viewing a tag card
   **When** I examine the card
   **Then** card shows tag name, post count, and colored badge
   **And** badge uses the tag's assigned color

3. **Given** I hover over a tag card
   **When** I want to take action
   **Then** card shows post actions (Edit, Delete) on hover

4. **Given** there are no tags
   **When** I view the page
   **Then** empty state prompts me to create first tag

## Tasks / Subtasks

- [x] **Task 1: Verify Responsive Grid** (AC: 1)
  - [x] 3 columns on desktop (lg:grid-cols-3)
  - [x] 2 columns on tablet (sm:grid-cols-2)
  - [x] 1 column on mobile (grid-cols-1)

- [x] **Task 2: Verify Card Content** (AC: 2)
  - [x] Tag name displayed
  - [x] Post count badge
  - [x] Colored badge using tag's assigned color

- [x] **Task 3: Verify Hover Actions** (AC: 3)
  - [x] Edit button reveals on hover
  - [x] Delete button reveals on hover
  - [x] Smooth transition for opacity

- [x] **Task 4: Verify Empty State** (AC: 4)
  - [x] EmptyState component shown when no tags
  - [x] Icon, title, description, and CTA button
  - [x] "Tạo tag mới" button

## Dev Notes

### Current Implementation Check

**TagList Component** (`frontend/src/components/tag/TagList.tsx`):
- ✅ Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- ✅ Cards show tag name, post count, colored badge
- ✅ Badge uses tag's assigned color ( getColorBadgeStyle function)
- ✅ Actions (Edit, Delete) reveal on hover with opacity transition
- ✅ EmptyState with CTA button

### Card Layout Specifications

**Current implementation:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="group relative overflow-hidden rounded-lg border bg-card p-5 transition-all duration-200 hover:border-orange-500/30">
    {/* Color badge with tag's assigned color */}
    <span style={getColorBadgeStyle(tag.color)}>{tag.name}</span>
    {/* Actions reveal on hover */}
    <div className="opacity-0 group-hover:opacity-100">
      <Edit/Delete buttons />
    </div>
  </div>
</div>
```

### Color Badge Function
```tsx
const getColorBadgeStyle = (color: string | null): React.CSSProperties => {
  if (!color) return { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' };
  return { backgroundColor: color, color: '#fff' };
};
```

### Integration Points
- `/dashboard/tags` - Uses TagList component
- Reusable pattern for other tag displays

### Design Tokens Used
- `hover:border-orange-500/30` for hover effect (CSS variable)
- `hover:shadow-lg hover:shadow-orange-500/5` for hover shadow
- Orange focus states for consistency

### References
- [Source: epics.md Story 6.10](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- TagList component already exists and meets all requirements
- Responsive grid with 3/2/1 columns
- Colored badges using tag's assigned color
- Actions reveal on hover with smooth transitions
- Empty state with CTA button

**Features Verified:**
1. ✅ Responsive grid: 3 cols desktop, 2 tablet, 1 mobile
2. ✅ Cards show tag name, post count, colored badge
3. ✅ Badge uses tag's assigned color
4. ✅ Actions (Edit, Delete) show on hover
5. ✅ Empty state with CTA to create first tag

**Build Status:** ✅ PASS (no changes needed)

### File List

- `frontend/src/components/tag/TagList.tsx` (ALREADY EXISTS - meets all requirements)
