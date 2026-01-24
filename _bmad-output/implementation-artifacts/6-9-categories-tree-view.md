# Story 6.9: Categories Tree View

Status: review

## Story

As a moderator,
I want categories displayed as a tree with dotted connectors,
So that I can see the hierarchy at a glance.

## Acceptance Criteria

1. **Given** I am on `/dashboard/categories`
   **When** I view the categories list
   **Then** I see a tree structure with dotted line connectors

2. **Given** I am viewing a category node
   **When** I examine the node
   **Then** I see folder icon, name, and post count

3. **Given** I am viewing the tree
   **When** I interact with branches
   **Then** I can expand/collapse branches

4. **Given** I am reordering categories
   **When** I view the tree
   **Then** I see drag handles for reordering

5. **Given** I select a category
   **When** I view the node
   **Then** selected nodes have orange border

## Tasks / Subtasks

- [x] **Task 1: Add Dotted Line Connectors** (AC: 1)
  - [x] Add vertical dotted line from parent to children
  - [x] Add horizontal dotted line for nested nodes
  - [x] Use border-dotted CSS

- [x] **Task 2: Verify Node Content** (AC: 2)
  - [x] Folder icon for each node
  - [x] Category name
  - [x] Post count badge

- [x] **Task 3: Verify Expand/Collapse** (AC: 3)
  - [x] Chevron icon toggles on expand/collapse
  - [x] Children show/hide based on state

- [x] **Task 4: Add Drag Handles** (AC: 4)
  - [x] GripVertical icon for drag handle
  - [x] Visual feedback on hover/drag

- [x] **Task 5: Add Selected State** (AC: 5)
  - [x] Orange border when selected
  - [x] Orange background tint

## Dev Notes

### Current Implementation Check

**CategoryTree Component** (`frontend/src/components/category/CategoryTree.tsx`):
- ✅ Has folder icon, name, post count
- ✅ Has expand/collapse functionality
- ❌ Missing: dotted line connectors
- ❌ Missing: drag handles
- ❌ Missing: selected state with orange border

### Dotted Line Styles

**Vertical line:**
```tsx
className="absolute left-[11px] top-8 bottom-0 w-px border-l border-dashed border-gray-300 dark:border-gray-600"
```

**Horizontal connector:**
```tsx
className="absolute left-0 top-1/2 -translate-x-full w-4 border-t border-dashed border-gray-300 dark:border-gray-600"
```

### Drag Handle Styles

**Grip handle:**
```tsx
<GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
```

### Selected State Styles

**Orange border:**
```tsx
className="border-orange-500/50 bg-orange-500/5"
```

### Integration Points
- `/dashboard/categories` - Uses CategoryTree component
- Reusable pattern for other hierarchical data

### Design Tokens Used
- `border-orange-500/50` for selected border
- `bg-orange-500/5` for selected background
- `border-dashed border-gray-300` for dotted lines

### References
- [Source: epics.md Story 6.9](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Updated CategoryTree component with dotted line connectors
- Added GripVertical drag handles (visible on hover)
- Added folder icon with orange background
- Added selected state with orange border and background tint
- Actions (Edit, Delete) reveal on hover
- Vietnamese labels for better UX

**Features Implemented:**
1. ✅ Tree structure with dotted line connectors (border-dashed)
2. ✅ Folder icon with orange background, name, post count badge
3. ✅ Expand/collapse with chevron icons
4. ✅ Drag handles (GripVertical) with cursor-grab
5. ✅ Selected nodes have orange border (border-orange-500/50) and bg-orange-500/5

**Files Modified:**
- `frontend/src/components/category/CategoryTree.tsx` - Added connectors, drag handles, selected state

**Build Status:** ✅ PASS

### File List

- `frontend/src/components/category/CategoryTree.tsx` (MODIFIED - added connectors, drag handles, selected state)
