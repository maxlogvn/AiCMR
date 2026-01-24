# Story 5.8: Bulk Delete with Confirmation

Status: review

## Story

As a moderator,
I want to delete multiple posts at once,
so that I can efficiently remove inappropriate content.

## Acceptance Criteria

1. **Given** I have selected multiple posts
   **When** I click "Delete" bulk action
   **Then** a warning dialog appears with red styling

2. **Given** I am viewing the delete confirmation dialog
   **When** I view the dialog content
   **Then** dialog shows count of posts to be permanently deleted

3. **Given** I am viewing the delete confirmation dialog
   **When** I view the confirmation requirement
   **Then** dialog requires typing "DELETE" to confirm

4. **Given** I type "DELETE" and confirm
   **When** the API call completes
   **Then** all selected posts are deleted

5. **Given** the delete action completes
   **When** I view the result
   **Then** I see success toast notification

6. **Given** the delete action completes
   **When** I view the table
   **Then** deleted posts no longer appear in table

## Tasks / Subtasks

- [ ] **Task 1: Add Delete Button to Bulk Bar** (AC: 1)
  - [ ] Add "Delete" button to BulkActionsBar
  - [ ] Style with destructive variant (red)
  - [ ] Always visible when posts selected

- [ ] **Task 2: Create Delete Confirmation Dialog** (AC: 2, 3, 4)
  - [ ] Create `BulkDeleteDialog` component
  - [ ] Use danger variant styling (red borders, text)
  - [ ] Display count of posts to delete
  - [ ] Add text input for "DELETE" confirmation
  - [ ] Enable Confirm button only when "DELETE" typed

- [ ] **Task 3: Implement Bulk Delete API Call** (AC: 4, 5, 6)
  - [ ] Create API endpoint call: `DELETE /api/v1/posts/bulk-delete/`
  - [ ] Send selected post IDs in request body
  - [ ] Handle success response
  - [ ] Handle error response with user feedback

- [ ] **Task 4: Show Success Notification** (AC: 5)
  - [ ] Use `Toast` component with success variant
  - [ ] Display: "Successfully deleted {n} posts"
  - [ ] Auto-dismiss after 3 seconds

- [ ] **Task 5: Refresh Table State** (AC: 6)
  - [ ] Invalidate TanStack Query cache for posts
  - [ ] Clear selection state
  - [ ] Hide bulk actions bar
  - [ ] Navigate to page 1 if current page becomes empty

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

### File List

- `frontend/src/components/dashboard/BulkDeleteDialog.tsx`
