# Story 4.5: Save as Draft

**Epic:** Epic 4 - Content Creation
**Story ID:** 4.5
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **content creator**,
I want **save my post as draft**,
so that **I can continue editing later**.

---

## Acceptance Criteria

1. **Given** user is editing post
   **When** user clicks "Save as Draft"
   **Then** post is saved without being published

2. **Given** draft is saved
   **When** save completes
   **Then** success message is displayed and user is redirected

---

## Tasks / Subtasks

### Task 1: Verify save draft functionality (AC: #1, #2)
- [x] 1.1 "Lưu Bản Nháp" button exists
- [x] 1.2 Calls API with `publish_now: false`
- [x] 1.3 Shows toast notification on success
- [x] 1.4 Redirects to posts list

### Task 2: Build verification (AC: #1, #2)
- [x] 2.1 Build passes without errors
- [x] 2.2 Save draft works correctly

---

## Dev Notes

### Save Draft Flow

1. User fills post form
2. User clicks "Lưu Bản Nháp" button
3. API call with `publish_now: false`
4. Success toast: "Post saved as draft"
5. Redirect to `/user/posts`

### Button Styling

- Variant: `outline`
- Icon: `Save` from Lucide
- Disabled during API call

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Reviewed

| File | Status |
|------|--------|
| `frontend/src/app/user/posts/new/page.tsx` | ✅ Save draft implemented |

### Build Verification
✅ Build successful

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR19: Draft posts)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Post CRUD)

---
