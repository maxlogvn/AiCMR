# Story 4.6: Publish Post

**Epic:** Epic 4 - Content Creation
**Story ID:** 4.6
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **content creator**,
I want **publish my post**,
so that **it becomes visible to public users**.

---

## Acceptance Criteria

1. **Given** user is editing post
   **When** user clicks "Xuất Bản"
   **Then** post is published and becomes public

2. **Given** post is published
   **When** publish completes
   **Then** success message is displayed and user is redirected

---

## Tasks / Subtasks

### Task 1: Verify publish functionality (AC: #1, #2)
- [x] 1.1 "Xuất Bản" button exists
- [x] 1.2 Calls API with `publish_now: true`
- [x] 1.3 Shows toast notification on success
- [x] 1.4 Redirects to posts list

### Task 2: Build verification (AC: #1, #2)
- [x] 2.1 Build passes without errors
- [x] 2.2 Publish works correctly

---

## Dev Notes

### Publish Flow

1. User fills post form
2. User clicks "Xuất Bản" button
3. API call with `publish_now: true`
4. Success toast: "Post published successfully"
5. Redirect to `/user/posts`

### Button Styling

- Variant: `default` (primary color)
- Icon: `FileText` from Lucide
- Disabled during API call

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Reviewed

| File | Status |
|------|--------|
| `frontend/src/app/user/posts/new/page.tsx` | ✅ Publish implemented |

### Build Verification
✅ Build successful

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR20: Publish posts)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Post CRUD)

---
