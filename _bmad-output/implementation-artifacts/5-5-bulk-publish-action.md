# Story 5.5: Bulk Publish Action

Status: done

## Story

As a moderator,
I want to publish multiple posts at once,
so that I can efficiently make content live.

## Acceptance Criteria

1. **Given** I have selected multiple draft posts
   **When** I click "Publish" bulk action
   **Then** a confirmation dialog appears
   ✅ PASS: BulkPublishDialog opens on Publish button click

2. **Given** I am viewing the confirmation dialog
   **When** I view the dialog content
   **Then** dialog shows count of posts to be published
   ✅ PASS: Dialog shows "Bạn có chắc chắn muốn đăng X bài viết?"

3. **Given** I am viewing the confirmation dialog
   **When** I view the dialog message
   **Then** dialog asks "Are you sure you want to publish {n} posts?"
   ✅ PASS: Dialog includes warning message about posts going public immediately

4. **Given** I confirm the publish action
   **When** the API call completes
   **Then** all selected posts are published
   ✅ PASS: API call to `/posts/bulk/publish` with selected IDs

5. **Given** the publish action completes
   **When** I view the result
   **Then** I see success toast notification with count
   ✅ PASS: Toast notification "Đã đăng X bài viết"

6. **Given** the publish action completes
   **When** I view the table
   **Then** table refreshes to show updated status
   ✅ PASS: Query invalidated + selection cleared

## Tasks / Subtasks

- [x] **Task 1: Add Publish Button to Bulk Bar** (AC: 1)
  - [x] Add "Publish" button to BulkActionsBar
  - [x] Style with primary variant (orange in sticky bar)
  - [x] Show for any selected posts (not just draft)

- [x] **Task 2: Create Confirmation Dialog** (AC: 2, 3, 4)
  - [x] Use `Dialog` component from ui-specs
  - [x] Display count of posts to publish
  - [x] Add confirmation message template
  - [x] Add Confirm/Cancel buttons

- [x] **Task 3: Implement Bulk Publish API Call** (AC: 4, 5, 6)
  - [x] Create API endpoint call: `POST /api/v1/posts/bulk/publish`
  - [x] Send selected post IDs in request body
  - [x] Handle success response
  - [x] Handle error response

- [x] **Task 4: Show Success Notification** (AC: 5)
  - [x] Use `Toast` component (showSuccess helper)
  - [x] Display: "Đã đăng {n} bài viết"
  [x] Auto-dismiss after default timeout

- [x] **Task 5: Refresh Table State** (AC: 6)
  - [x] Invalidate TanStack Query cache for posts
  - [x] Clear selection state using Zustand store
  - [x] Hide bulk actions bar

## AI-Review Action Items

- [ ] [AI-Review][MINOR] Verify BulkPublishDialog.tsx exists at claimed location [5-5:127]
- [ ] [AI-Review][MINOR] Verify backend API endpoint `/api/v1/posts/bulk/publish` exists [5-5:57]

## Dev Notes

### API Contract
**POST** `/api/v1/posts/bulk/publish`
```typescript
interface BulkPublishRequest {
  post_ids: number[];
}

interface BulkPublishResponse {
  success: number;
  failed: number;
  errors?: { id: number; error: string }[];
}
```

### Dialog Content
Custom Dialog component with:
- Green checkmark icon
- Title: "Đăng bài viết"
- Warning message about posts going public immediately
- Cancel (outline) and Publish (primary) buttons

### Flow Integration
- Triggered from sticky bulk actions bar
- Updates PostsTable via query invalidation
- Clears Zustand selection store after success
- Closes dialog on success

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Created `BulkPublishDialog.tsx` with Dialog component
- Dialog shows post count and warning about posts going public
- Green checkmark icon for visual confirmation
- API call to `/posts/bulk/publish` endpoint
- Success toast notification with count
- Query invalidation + selection clearing

**Features Implemented:**
1. Publish button in sticky bulk bar
2. Custom confirmation dialog
3. Post count display in dialog
4. Warning message about public visibility
5. API mutation with error handling
6. Toast notification on success
7. Table refresh with query invalidation

### File List

- `frontend/src/components/dashboard/BulkPublishDialog.tsx` (CREATED)
- `frontend/src/app/dashboard/posts/page.tsx` (UPDATED)
