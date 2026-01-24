# Story 4.4: Image Upload with Progress

**Epic:** Epic 4 - Content Creation
**Story ID:** 4.4
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **content creator**,
I want **upload post thumbnail images**,
so that **my posts have visual appeal**.

---

## Acceptance Criteria

1. **Given** thumbnail upload exists
   **When** user selects image
   **Then** image is uploaded and previewed

2. **Given** upload happens
   **When** upload is in progress
   **Then** loading state is shown

3. **Given** thumbnail is set
   **When** user wants to remove it
   **Then** they can remove the thumbnail

---

## Tasks / Subtasks

### Task 1: Verify upload functionality (AC: #1, #2)
- [x] 1.1 File input accepts images
- [x] 1.2 Upload API is called
- [x] 1.3 Loading state shows during upload
- [x] 1.4 Success/error toast notifications

### Task 2: Verify thumbnail preview (AC: #1, #3)
- [x] 2.1 Preview displays after upload
- [x] 2.2 Remove button works
- [x] 2.3 Image ID is stored in form state

### Task 3: Build verification (AC: #1, #2, #3)
- [x] 3.1 Build passes without errors
- [x] 3.2 Upload functionality works

---

## Dev Notes

### Upload Flow

1. User clicks upload area or selects file
2. File is read with `FileReader` for preview
3. File is uploaded via `uploadsApi.uploadFile()`
4. Uploaded file ID is stored in `thumbnail_image_id`
5. Preview image is displayed using `getFileUrl()`

### UI Components

- Upload area with dashed border
- Upload icon (Lucide `Upload`)
- Loading text: "Đang tải lên..."
- Preview image with remove button (X icon)

### Error Handling

- Toast notification on success: "Thumbnail uploaded successfully"
- Toast notification on error: "Failed to upload thumbnail"

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Reviewed

| File | Status |
|------|--------|
| `frontend/src/app/user/posts/new/page.tsx` | ✅ Upload with preview implemented |

### Build Verification
✅ Build successful

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR18: Image uploads)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (File Upload API)

---
