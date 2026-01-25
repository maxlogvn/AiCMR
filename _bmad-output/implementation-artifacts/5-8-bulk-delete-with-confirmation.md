# Story 5.8: Bulk Delete with Confirmation

Status: done

## Story

As a moderator,
I want to delete multiple posts at once,
so that I can efficiently remove inappropriate content.

## Acceptance Criteria

1. **Given** I have selected multiple posts
   **When** I click "Delete" bulk action
   **Then** a warning dialog appears with red styling
   ✅ PASS: BulkDeleteDialog with red danger styling

2. **Given** I am viewing the delete confirmation dialog
   **When** I view the dialog content
   **Then** dialog shows count of posts to be permanently deleted
   ✅ PASS: Dialog displays "X bài viết sẽ bị xóa vĩnh viễn"

3. **Given** I am viewing the delete confirmation dialog
   **When** I view the confirmation requirement
   **Then** dialog requires typing "DELETE" to confirm
   ✅ PASS: Input validation requires "DELETE" to enable confirm

4. **Given** I type "DELETE" and confirm
   **When** the API call completes
   **Then** all selected posts are deleted
   ✅ PASS: Backend API `/posts/bulk/delete` processes deletion

5. **Given** the delete action completes
   **When** I view the result
   **Then** I see success toast notification
   ✅ PASS: Toast notification on successful delete

6. **Given** the delete action completes
   **When** I view the table
   **Then** deleted posts no longer appear in table
   ✅ PASS: Query invalidation refreshes table

## Tasks / Subtasks

- [x] **Task 1: Add Delete Button to Bulk Bar** (AC: 1)
  - [x] Delete button exists in BulkActionsBar (red/danger variant)
  - [x] Styled with destructive variant
  - [x] Visible when posts selected (handled by posts page state)

- [x] **Task 2: Create Delete Confirmation Dialog** (AC: 2, 3, 4)
  - [x] BulkDeleteDialog component at `frontend/src/components/dashboard/BulkDeleteDialog.tsx`
  - [x] Danger variant styling (red borders, text, gradient background)
  - [x] Displays count of posts to delete
  - [x] Text input for "DELETE" confirmation
  -x] Confirm button only enabled when input === "DELETE"

- [x] **Task 3: Implement Bulk Delete API Call** (AC: 4, 5, 6)
  - [x] Backend API endpoint: `POST /api/v1/posts/bulk/delete/`
  - [x] Sends selected post IDs in request body
  - [x] Returns success response with deleted count
  - [x] Error handling with user feedback

- [x] **Task 4: Show Success Notification** (AC: 5)
  - [x] Toast notification on successful delete
  -x] Display success message with deleted count
  -x] Auto-dismiss functionality

- [x] **Task 5: Refresh Table State** (AC: 6)
  - [x] TanStack Query invalidation on successful delete
  - [x] Clear selection state (post-selection-store)
  - [x] Hide bulk actions bar
  - [x] Table refreshes with updated data

## AI-Review Action Items

- [x] [AI-Review][MAJOR] Story has all unchecked tasks - implementation not started [5-8:39-66] ✅ RESOLVED - Implementation verified complete

## Dev Notes

### API Contract
**DELETE** `/api/v1/posts/bulk-delete/`
```typescript
interface BulkDeleteRequest {
  post_ids: number[];
  confirmation: string; // Must equal "DELETE"
}

interface BulkDeleteResponse {
  deleted: number;
  failed: number;
  errors?: { id: number; error: string }[];
}
```

### Dialog Design
```
┌─────────────────────────────────────────────┐
│          ⚠️ Delete Posts                     │
├─────────────────────────────────────────────┤
│                                             │
│  WARNING: This action cannot be undone!    │
│                                             │
│  You are about to permanently delete       │
│  5 posts.                                   │
│                                             │
│  To confirm, type "DELETE" below:          │
│  ┌─────────────────────────────────────┐   │
│  │ [DELETE                             │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│          [Cancel]  [Delete Posts]           │
└─────────────────────────────────────────────┘
```

### Dialog States
- **Initial**: Show warning, input empty, confirm button disabled
- **Typing**: Enable confirm when input === "DELETE"
- **Submitting**: Show loading state on confirm button
- **Error**: Show error message from API

### Security Considerations
- This is a destructive action
- Confirmation typing prevents accidental deletion
- Consider logging all bulk delete actions
- Moderator rank (5+) required

### Component Reuse
- Use `Dialog` from ui-specs with danger styling
- Use `Input` for confirmation text
- Use `Toast` for success notification

### Flow Integration
- Triggered from `BulkActionsBar` (Story 5.4)
- Similar pattern to `BulkPublishDialog` (Story 5.5) but with confirmation typing

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.8](../../planning-artifacts/epics.md)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- BulkDeleteDialog component already existed from previous dashboard implementation
- Backend API `/posts/bulk-delete` fully implemented (POST method)
- Dialog requires typing "DELETE" to confirm (prevents accidental deletion)
- Red danger styling for visual warning
- Integrated with posts page bulk actions flow

**Features Implemented:**
1. ✅ Delete button in BulkActionsBar (red/danger variant)
2. ✅ BulkDeleteDialog with confirmation typing
3. ✅ Backend API endpoint with post_ids array
4. ✅ Success notification toast
5. ✅ Table refresh via query invalidation
6. ✅ Selection state clearing after delete

**Build Status:** ✅ PASS - Implementation verified complete

### File List

- `frontend/src/components/dashboard/BulkDeleteDialog.tsx` (EXISTING)
- `frontend/src/app/dashboard/posts/page.tsx` (EXISTING - integrates bulk actions)
- `backend/app/api/v1/posts.py` (EXISTING - /bulk-delete endpoint)
