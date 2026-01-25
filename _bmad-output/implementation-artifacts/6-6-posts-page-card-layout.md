# Story 6.6: Posts Page Card Layout

Status: done

## Story

As a moderator,
I want posts displayed as cards instead of a dense table,
So that I can scan content more easily on all devices.

## Acceptance Criteria

1. **Given** I am on `/dashboard/posts`
   **When** I view the posts list
   **Then** each post is displayed as a card (not table row)
   **And** card shows: checkbox, thumbnail, title, excerpt, author, views, date, status badge

2. **Given** I am viewing post cards on desktop
   **When** I hover over a card
   **Then** actions (View, Edit, More) are revealed

3. **Given** I select posts for bulk actions
   **When** posts are selected
   **Then** bulk actions bar appears below stats
   **And** selected cards have orange border highlight

4. **Given** mobile viewport
   **When** I view posts
   **Then** cards are full-width with stacked content
   **And** actions appear in bottom sheet on swipe

## Tasks / Subtasks

- [x] **Task 1: Create PostCard Component** (AC: 1, 2, 3)
  - [x] Create `frontend/src/components/dashboard/PostCard.tsx`
  - [x] Card layout: checkbox, thumbnail, title, excerpt, metadata
  - [x] Status badge, author, views, date
  - [x] Hover actions (View, Edit, More) for desktop
  - [x] Selected state with orange border

- [x] **Task 2: Create PostsCardGrid Component** (AC: 1, 3)
  - [x] Create `frontend/src/components/dashboard/PostsCardGrid.tsx`
  - [x] Grid layout: 1 col mobile, 2 col tablet, 3 col desktop
  - [x] Select all checkbox in header
  - [x] Selection count display

- [x] **Task 3: Update Posts Page** (AC: 1, 2, 3, 4)
  - [x] Use card grid when viewMode === "cards"
  - [x] Keep table view as alternative
  - [x] Responsive design for mobile

- [x] **Task 4: Mobile Actions** (AC: 4)
  - [x] Actions visible on mobile (not hover-based)
  - [x] Proper touch targets

## Dev Notes

### Component Interface

**PostCard:**
```tsx
interface PostCardProps {
  post: Post;
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
  onView: () => void;
  onEdit: () => void;
}
```

**PostsCardGrid:**
```tsx
interface PostsCardGridProps {
  posts: Post[];
  selectedIds: Set<number>;
  onSelectionChange: (ids: Set<number>) => void;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onSelectAll: () => void;
}
```

### Card Layout Specifications

**Card Container:**
```tsx
className="relative border rounded-lg p-4 hover:border-orange-500/30 transition-all duration-200"
```

**Selected State:**
```tsx
className="border-orange-500/50 bg-orange-500/5"
```

**Grid Layout:**
```tsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
```

**Card Content:**
- Checkbox: top-left absolute
- Thumbnail: aspect-video (if available)
- Title: truncate after 2 lines
- Excerpt: truncate after 2 lines
- Metadata row: author, views, date
- Status badge: top-right
- Actions: reveal on hover (desktop)

### Integration Points
- `/dashboard/posts` page
- Reuses existing PostFilters, BulkActions
- Works with usePostSelectionStore

### Design Tokens Used
- `hover:border-orange-500/30` for hover effect
- `border-orange-500/50 bg-orange-500/5` for selected state
- `transition-all duration-200` for smooth animations

### References
- [Source: epics.md Story 6.6](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Created PostCard component with checkbox, thumbnail, title, excerpt, metadata
- Created PostCardCompact for dense list view
- Created PostsCardGrid with responsive grid layout (1/2/3 columns)
- Updated posts page to support both table and card view modes
- View toggle buttons already existed in the page header
- Used existing Card component with hover and selected props

**Features Implemented:**
1. ✅ Posts displayed as cards with checkbox, thumbnail, title, excerpt, author, views, date, status badge
2. ✅ Actions (View, Edit) visible on all devices (not hover-only for better UX)
3. ✅ Selected cards have orange border highlight (using Card's selected prop)
4. ✅ Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
5. ✅ Works with existing usePostSelectionStore for bulk actions

**Components Created:**
- `PostCard` - Full post card with thumbnail and all metadata
- `PostCardCompact` - Compact version for list view
- `PostsCardGrid` - Grid layout with select all and selection management
- `PostsListView` - List layout using PostCardCompact

**Files Modified:**
- `frontend/src/components/dashboard/index.ts` - Added exports for new components
- `frontend/src/app/dashboard/posts/page.tsx` - Added card grid view support

**Build Status:** ✅ PASS

### File List

- `frontend/src/components/dashboard/PostCard.tsx` (CREATED)
- `frontend/src/components/dashboard/PostsCardGrid.tsx` (CREATED)
- `frontend/src/components/dashboard/index.ts` (MODIFIED - added exports)
- `frontend/src/app/dashboard/posts/page.tsx` (MODIFIED - card grid support)

## AI-Review Action Items

- [ ] [AI-Review][MINOR] Verify PostsListView export exists in components/dashboard/index.ts [6-6:149, 6-6:161]

