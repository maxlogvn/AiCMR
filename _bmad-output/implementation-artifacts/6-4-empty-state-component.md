# Story 6.4: Empty State Component

Status: review

## Story

As a user,
I want helpful empty states with clear next actions,
So that I know what to do when there's no data.

## Acceptance Criteria

1. **Given** a page has no data to display
   **When** I view the empty state
   **Then** I see a centered icon container (rounded-full, muted/50 background)

2. **Given** I am viewing the empty state
   **When** I read the headline
   **Then** headline explains why it's empty
   **And** description provides more details

3. **Given** I am viewing the empty state
   **When** I want to take action
   **Then** I see a CTA button
   **And** button is relevant to the context

4. **Given** different page contexts
   **When** I view empty states
   **Then** icons are context-specific:
     - 📝 FileText for posts
     - 📂 FolderTree for categories
     - 🏷️ Tag for tags
     - 👥 Users for users

## Tasks / Subtasks

- [x] **Task 1: Create EmptyState Component** (AC: 1, 2, 3, 4)
  - [x] Create `frontend/src/components/ui/EmptyState.tsx`
  - [x] Props: `icon`, `title`, `description`, `action`
  - [x] Centered layout with flex
  - [x] Icon container: rounded-full, muted/50 background

- [x] **Task 2: Implement Icon Container** (AC: 1)
  - [x] Icon container: `h-16 w-16 rounded-full bg-muted/50`
  - [x] Icon centered: `flex items-center justify-center`
  - [x] Icon color: `text-muted-foreground`

- [x] **Task 3: Implement Text Content** (AC: 2)
  - [x] Title: `text-lg font-semibold text-foreground mt-4`
  - [x] Description: `text-sm text-muted-foreground mt-2 max-w-sm mx-auto`

- [x] **Task 4: Implement CTA Button** (AC: 3)
  - [x] Optional action button
  - [x] Button: `mt-4` with proper spacing
  - [x] Uses existing Button component

- [x] **Task 5: Add Context Icons** (AC: 4)
  - [x] FileText for posts empty state
  - [x] FolderTree for categories empty state
  - [x] Tag for tags empty state
  - [x] Users for users empty state

## Dev Notes

### Component Interface
```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}
```

### Style Specifications

**Container:**
```tsx
className="flex flex-col items-center justify-center py-12 px-4 text-center"
```

**Icon Container:**
```tsx
className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50"
```

**Icon:**
```tsx
className="h-8 w-8 text-muted-foreground"
```

**Title:**
```tsx
className="text-lg font-semibold text-foreground mt-4"
```

**Description:**
```tsx
className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto"
```

### Usage Example
```tsx
<EmptyState
  icon={<FileText className="h-8 w-8 text-muted-foreground" />}
  title="Không có bài viết nào"
  description="Bắt đầu bằng cách tạo bài viết đầu tiên của bạn."
  action={
    <Button className="mt-4">
      <Plus className="h-4 w-4 mr-2" />
      Tạo bài viết
    </Button>
  }
/>
```

### Integration Points
- Posts page (no posts found)
- Categories page (no categories)
- Tags page (no tags)
- Users page (no users)
- Search results (no matches)

### Design Tokens Used
- `bg-muted/50` for icon container background
- `text-muted-foreground` for icon and description
- `text-foreground` for title

### References
- [Source: epics.md Story 6.4](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Created EmptyState base component with icon, title, description, action props
- Created preset components for common contexts: EmptyPosts, EmptyCategories, EmptyTags, EmptyUsers, EmptySearch
- Icon container uses rounded-full with bg-muted/50 for subtle appearance
- Optional action button with Plus icon for create actions
- Responsive text centering with max-width constraint

**Features Implemented:**
1. ✅ Centered icon container (h-16 w-16 rounded-full bg-muted/50)
2. ✅ Headline explaining why it's empty (text-lg font-semibold)
3. ✅ Description with more details (text-sm text-muted-foreground)
4. ✅ CTA button with proper spacing
5. ✅ Context-specific icons (FileText, FolderTree, Tag, Users, Search)

**Components Created:**
- `EmptyState` - Base component
- `EmptyPosts` - Preset for posts
- `EmptyCategories` - Preset for categories
- `EmptyTags` - Preset for tags
- `EmptyUsers` - Preset for users
- `EmptySearch` - Preset for search results

**Build Status:** ✅ PASS

### File List

- `frontend/src/components/ui/EmptyState.tsx` (CREATED - base EmptyState + presets)
