# Story 2.1: Blog Listing Page

**Epic:** Epic 2 - Public Content Discovery
**Story ID:** 2.1
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **visitor**,
I want **browse all published blog posts**,
so that **I can discover content that interests me**.

---

## Acceptance Criteria

1. **Given** the blog listing page exists
   **When** a visitor navigates to /blog
   **Then** all published posts are displayed in a responsive grid

2. **Given** design system is established
   **When** blog page is rendered
   **Then** all components use design tokens for consistent styling

3. **Given** users need different viewing options
   **When** view toggle is clicked
   **Then** posts can be displayed in grid or list view

4. **Given** users need to filter content
   **When** sidebar filters are used
   **Then** posts can be filtered by category, tags, search, and date range

---

## Tasks / Subtasks

### Task 1: Update existing components with design tokens (AC: #2)
- [x] 1.1 Update `PostCard` to use new Card component with hover prop
- [x] 1.2 Update `blog/page.tsx` to use design token colors (gray-500)
- [x] 1.3 Update `PostList` to use StatusBadge component
- [x] 1.4 Update `PostGrid` to use design token colors
- [x] 1.5 Update `FeaturedPostsCarousel` to use primary-600 token

### Task 2: Verify responsive layout (AC: #1, #3)
- [x] 2.1 Grid layout with 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- [x] 2.2 Grid/List view toggle works correctly
- [x] 2.3 Filter sidebar collapses on mobile

### Task 3: Verify filtering functionality (AC: #4)
- [x] 3.1 Search filter works
- [x] 3.2 Category filter works
- [x] 3.3 Tag filter works
- [x] 3.4 Date range filter works

### Task 4: Build verification (AC: #1, #2, #3, #4)
- [x] 4.1 Build passes without errors
- [x] 4.2 All components render correctly

---

## Dev Notes

### Blog Listing Page Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `PostCard` | Individual post card with thumbnail, title, excerpt, stats | `components/post/PostCard.tsx` |
| `PostGrid` | Grid layout for posts (responsive columns) | `components/post/PostGrid.tsx` |
| `PostList` | List layout for posts (compact horizontal) | `components/post/PostList.tsx` |
| `PostPagination` | Pagination controls | `components/post/PostPagination.tsx` |
| `PostViewToggle` | Grid/List view switcher | `components/post/PostViewToggle.tsx` |
| `FilterSidebar` | Category, tag, search, date filters | `components/post/FilterSidebar.tsx` |
| `FeaturedPostsCarousel` | Featured posts slideshow | `components/post/FeaturedPostsCarousel.tsx` |

### Design Token Usage

- `text-gray-500` / `dark:text-gray-400` → Secondary text
- `text-gray-900` / `dark:text-gray-100` → Primary text
- `bg-primary-600` → Primary color (Indigo)
- `text-red-600` → Error state
- `rounded-lg` → 12px border radius

### Responsive Breakpoints

| Breakpoint | Columns |
|------------|---------|
| Mobile (< 640px) | 1 column |
| Tablet (640px - 1024px) | 2 columns |
| Desktop (> 1024px) | 3 columns |

### Note on SSR

The existing blog page uses client-side rendering ('use client'). Full SSR conversion for SEO is deferred to a future refactor as it requires:
- Moving data fetching to server components
- Converting URL state management to search params
- Handling pagination and filtering server-side

Current implementation is functional for MVP.

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/components/post/PostCard.tsx` | Use Card with hover prop, primary-600 token |
| `frontend/src/components/post/PostGrid.tsx` | Use gray-500 token for empty state |
| `frontend/src/components/post/PostList.tsx` | Use StatusBadge, gray-500 tokens |
| `frontend/src/components/post/FeaturedPostsCarousel.tsx` | Use primary-600 token |
| `frontend/src/app/(public)/blog/page.tsx` | Use gray-500 token, red-600 for errors |

### Build Verification
✅ Build successful with all blog components

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR9: Public blog functionality)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Component Organization)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (Blog Page Layout)
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md` (Design System Rules)
- **Epic 1:** `_bmad-output/implementation-artifacts/1-8-card-component.md` (Design System Foundation)

---
