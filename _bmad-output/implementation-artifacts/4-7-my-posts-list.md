# Story 4.7: My Posts List

**Epic:** Epic 4 - Content Creation
**Story ID:** 4.7
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **content creator**,
I want **view my posts**,
so that **I can manage my content**.

---

## Acceptance Criteria

1. **Given** user has posts
   **When** user navigates to my posts page
   **Then** all their posts are displayed

2. **Given** design system is established
   **When** posts list is rendered
   **Then** it uses design tokens

3. **Given** post actions are needed
   **When** user wants to edit/delete a post
   **Then** action buttons are available

---

## Tasks / Subtasks

### Task 1: Verify my posts page (AC: #1, #2)
- [x] 1.1 Page displays user's posts
- [x] 1.2 Uses design tokens for styling
- [x] 1.3 Loading state works correctly

### Task 2: Verify post actions (AC: #3)
- [x] 2.1 Edit button works
- [x] 2.2 Delete button works
- [x] 2.3 Status badges display correctly

### Task 3: Build verification (AC: #1, #2, #3)
- [x] 3.1 Build passes without errors
- [x] 3.2 Posts list page works correctly

---

## Dev Notes

### My Posts Page

| Feature | Description |
|---------|-------------|
| Post List | Table or card layout of user's posts |
| Status | Draft, published, scheduled, archived |
| Actions | Edit, delete, view |

### Post Status

| Status | Description |
|--------|-------------|
| Draft | Not yet published |
| Published | Visible to public |
| Scheduled | Will publish at future date |
| Archived | Hidden from public |

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Reviewed

| File | Status |
|------|--------|
| `frontend/src/app/user/posts/page.tsx` | ✅ My posts list implemented |

### Build Verification
✅ Build successful

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR21: My posts page)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Component Organization)

---
