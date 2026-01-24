# Story 4.1: Post Editor Layout

**Epic:** Epic 4 - Content Creation
**Story ID:** 4.1
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **content creator**,
I want **a well-organized post editor**,
so that **I can easily create and edit blog posts**.

---

## Acceptance Criteria

1. **Given** post editor exists
   **When** user navigates to create/edit post
   **Then** editor has proper layout with main content and sidebar

2. **Given** design system is established
   **When** editor is rendered
   **Then** all components use design tokens

3. **Given** preview functionality
   **When** user clicks preview
   **Then** post is displayed in preview mode

---

## Tasks / Subtasks

### Task 1: Update post editor with design tokens (AC: #2)
- [x] 1.1 Replace zinc colors with gray colors
- [x] 1.2 Use Card components for layout sections
- [x] 1.3 Use Button components for actions
- [x] 1.4 Use Input, Textarea components for form fields

### Task 2: Verify editor layout (AC: #1, #3)
- [x] 2.1 Main content area with title, slug, excerpt, content
- [x] 2.2 Sidebar with thumbnail, category, tags
- [x] 2.3 SEO metadata section
- [x] 2.4 Preview mode works correctly

### Task 3: Build verification (AC: #1, #2, #3)
- [x] 3.1 Build passes without errors
- [x] 3.2 Editor renders correctly

---

## Dev Notes

### Post Editor Structure

| Section | Description |
|---------|-------------|
| Header | Back button, title, preview toggle, save/publish buttons |
| Main Content | Title, slug, excerpt, content fields |
| Thumbnail | Image upload with preview |
| Category & Tags | Dropdown and tag selection |
| SEO Metadata | Title, description, keywords |

### Design Token Usage

- `text-gray-900` / `dark:text-gray-100` → Primary text
- `text-gray-500` / `dark:text-gray-400` → Secondary text
- `text-gray-400` → Muted text
- `bg-primary-600` → Primary button background
- `rounded-lg` → 12px border radius

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/app/user/posts/new/page.tsx` | Update colors with design tokens |

### Build Verification
✅ Build successful with updated editor

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR15: Post creation)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Component Organization)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (Editor Layout)

---
