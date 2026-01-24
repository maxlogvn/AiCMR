# Story 6.5: Loading Skeleton Components

Status: review

## Story

As a user,
I want loading states that preview the content structure,
So that I know what's coming and perceive faster load.

## Acceptance Criteria

1. **Given** a page is loading data
   **When** I view the skeleton state
   **Then** stats cards show skeleton with icon placeholder and value placeholder

2. **Given** a card list is loading
   **When** I view the skeleton state
   **Then** skeleton shows rounded image placeholder
   **And** skeleton shows multiple text line placeholders

3. **Given** skeleton is displayed
   **When** I view the animation
   **Then** skeleton uses animate-pulse for smooth animation
   **And** skeleton color is muted/50 (not distracting)

## Tasks / Subtasks

- [x] **Task 1: Create StatCardSkeleton Component** (AC: 1)
  - [x] Create `frontend/src/components/ui/StatCardSkeleton.tsx`
  - [x] Icon placeholder: rounded square
  - [x] Value placeholder: horizontal bar
  - [x] Label placeholder: smaller horizontal bar

- [x] **Task 2: Create CardSkeleton Component** (AC: 2)
  - [x] Create `frontend/src/components/ui/CardSkeleton.tsx`
  - [x] Image placeholder: rounded aspect ratio container
  - [x] Title placeholder: wide bar
  - [x] Text line placeholders: multiple bars
  - [x] Action placeholder: small bar at bottom

- [x] **Task 3: Create TableSkeleton Component** (AC: 2)
  - [x] Create `frontend/src/components/ui/TableSkeleton.tsx`
  - [x] Header row with multiple cell placeholders
  - [x] Multiple data rows with cell placeholders
  - [x] Configurable row count

- [x] **Task 4: Implement Skeleton Styling** (AC: 3)
  - [x] Use `animate-pulse` for animation
  - [x] Use `bg-muted/50` for skeleton color
  - [x] Use `rounded-md` for corner radius
  - [x] Smooth transitions

- [x] **Task 5: Export Index** (AC: 1, 2, 3)
  - [x] Export all skeleton components from ui/index.ts
  - [x] Ensure easy imports for pages

## Dev Notes

### Component Interfaces

**StatCardSkeleton:**
```tsx
interface StatCardSkeletonProps {
  className?: string;
}
```

**CardSkeleton:**
```tsx
interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
}
```

**TableSkeleton:**
```tsx
interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  className?: string;
}
```

### Style Specifications

**Skeleton Base:**
```tsx
className="animate-pulse bg-muted/50 rounded-md"
```

**StatCardSkeleton:**
```tsx
// Container: h-24 w-full border rounded-lg p-4
// Icon: h-10 w-10 rounded-md bg-muted/50
// Value: h-6 w-24 bg-muted/50 mt-2
// Label: h-4 w-32 bg-muted/50 mt-2
```

**CardSkeleton:**
```tsx
// Container: border rounded-lg p-4
// Image: aspect-video rounded-md bg-muted/50 mb-3
// Title: h-5 w-3/4 bg-muted/50 mb-2
// Text: h-4 w-full bg-muted/50 mb-1.5
// Text: h-4 w-2/3 bg-muted/50
```

**TableSkeleton:**
```tsx
// Header: h-10 border-b
// Cells: h-4 w-full bg-muted/50 rounded
// Row: h-14 border-b last:border-0
```

### Integration Points
- Stats page loading (StatCardSkeleton)
- Posts page loading (CardSkeleton or TableSkeleton)
- Categories page loading (CardSkeleton)
- Tags page loading (CardSkeleton)
- Users page loading (TableSkeleton)

### Design Tokens Used
- `bg-muted/50` for skeleton color
- `animate-pulse` for loading animation

### References
- [Source: epics.md Story 6.5](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Created StatCardSkeleton for stat card loading states
- Created CardSkeleton for card-based content loading
- Created TableSkeleton with configurable rows/columns for data tables
- Created TableSkeletonCompact for smaller table displays
- All skeletons use animate-pulse with bg-muted/50 for consistent appearance

**Features Implemented:**
1. ✅ Stat cards show skeleton with icon placeholder and value placeholder
2. ✅ Card lists show skeleton with rounded image and text lines
3. ✅ Skeletons use animate-pulse for smooth animation
4. ✅ Skeleton color is muted/50 (not distracting)
5. ✅ Configurable row/column count for TableSkeleton

**Components Created:**
- `StatCardSkeleton` - Loading skeleton for stat cards
- `CardSkeleton` - Loading skeleton for card content (with showImage prop)
- `TableSkeleton` - Loading skeleton for data tables (with rowCount, columnCount props)
- `TableSkeletonCompact` - Compact version for smaller displays

**Build Status:** ✅ PASS

### File List

- `frontend/src/components/ui/StatCardSkeleton.tsx` (CREATED)
- `frontend/src/components/ui/CardSkeleton.tsx` (CREATED)
- `frontend/src/components/ui/TableSkeleton.tsx` (CREATED - includes TableSkeletonCompact)
