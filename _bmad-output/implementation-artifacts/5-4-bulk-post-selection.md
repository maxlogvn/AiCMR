# Story 5.4: Bulk Post Selection

Status: review

## Story

As a moderator,
I want to select multiple posts at once,
so that I can perform actions on many items.

## Acceptance Criteria

1. **Given** I am viewing the posts table
   **When** I click the checkbox in table header
   **Then** all visible posts are selected
   ✅ PASS: Header checkbox selects/deselects all visible rows

2. **Given** I am viewing the posts table
   **When** I select individual posts
   **Then** I see count of selected posts
   ✅ PASS: Selected count shown in sticky bulk bar ("Đã chọn X bài viết")

3. **Given** I have selected posts
   **When** I view the bulk action area
   **Then** bulk action buttons appear (Publish, Archive, Delete)
   ✅ PASS: Sticky bulk bar with Publish, Archive, Delete buttons

4. **Given** I have selected posts
   **When** I click deselect all
   **Then** all posts are deselected with one click
   ✅ PASS: "Hủy" button in bulk bar clears selection

5. **Given** I have posts selected
   **When** I navigate to another page
   **Then** selection is preserved across pagination
   ✅ PASS: Zustand store persists selected IDs across pagination

## Tasks / Subtasks

- [x] **Task 1: Implement Header Checkbox** (AC: 1)
  - [x] Add checkbox to table header
  - [x] Click selects/deselects all visible rows
  - [x] Show indeterminate state when some selected

- [x] **Task 2: Track Selected Posts** (AC: 2)
  - [x] Store selected post IDs in Zustand store
  - [x] Update count when selection changes
  - [x] Handle individual row checkbox clicks

- [x] **Task 3: Show Bulk Actions Bar** (AC: 3)
  - [x] Create fixed/sticky bar at bottom of viewport
  - [x] Show selected count: "X posts selected"
  - [x] Add action buttons: Publish, Archive, Delete
  - [x] Only show when at least one post selected

- [x] **Task 4: Implement Deselect All** (AC: 4)
  - [x] Add "Deselect All" button to bulk bar
  - [x] Clear selection state
  - [x] Hide bulk bar

- [x] **Task 5: Persist Selection Across Pages** (AC: 5)
  - [x] Store selected IDs in Zustand store with persist
  - [x] Maintain selection when paginating
  - [x] Show count of total selected (across all pages)

## Dev Notes

### Selection State Management
- Used Zustand store with persist middleware
- Store persists in localStorage (`post-selection-storage`)
- Methods: toggle, add, remove, setAll, clear, isSelected, count

### Bulk Actions Flow
1. User selects posts → Bulk bar slides up from bottom
2. User clicks action → Custom Dialog appears (Story 5.5, 5.8)
3. User confirms → API call with selected IDs
4. Success → Refresh table + clear selection

### UI Behavior
- Bulk bar: fixed bottom, orange gradient, z-index 40
- Animation: slide-in-from-bottom (200ms)
- Selected rows have orange-50 background
- Indeterminate checkbox state for partial selection

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Created Zustand store `post-selection-store.ts` with persist middleware
- Updated PostsTable with proper select all props
- Created sticky bulk actions bar with gradient styling
- Selection persists across pagination and page refreshes

**Features Implemented:**
1. Header checkbox with indeterminate state
2. Individual row checkboxes
3. Selected count display
4. Sticky bulk actions bar (fixed bottom, slide-up animation)
5. Publish, Archive, Delete buttons
6. "Hủy" (cancel) button
7. Cross-page selection persistence

### File List

- `frontend/src/stores/post-selection-store.ts` (CREATED)
- `frontend/src/components/dashboard/PostsTable.tsx` (UPDATED)
- `frontend/src/app/dashboard/posts/page.tsx` (UPDATED)
