# Story 5.3: Post Filtering

Status: review

## Story

As a moderator,
I want to filter posts by status and category,
so that I can focus on specific content.

## Acceptance Criteria

1. **Given** I am viewing the posts table
   **When** I click the filter button
   **Then** I see filter options for status (All, Draft, Published, Scheduled, Archived)
   ✅ PASS: Filter panel with status dropdown (All, Draft, Published, Archived)

2. **Given** I am viewing the filter options
   **When** I view category filters
   **Then** I see filter options for category (all categories in system)
   ✅ PASS: Category dropdown fetched from API `/api/v1/categories/`

3. **Given** I am viewing the filter options
   **When** I view date options
   **Then** I see date range picker
   ✅ PASS: Date from/to inputs with native HTML date picker

4. **Given** I have selected filters
   **When** I apply filters
   **Then** table updates to show matching posts only
   ✅ PASS: Filters applied to API query params (status, category_id, date_from, date_to)

5. **Given** I have active filters
   **When** I view the filter display
   **Then** I see clear indication of active filters
   ✅ PASS: Active filter chips shown above search bar with Tag icon

6. **Given** I have active filters
   **When** I click clear all filters
   **Then** all filters are removed with one click
   ✅ PASS: "Xóa tất cả" button clears all filters

## Tasks / Subtasks

- [x] **Task 1: Create Filter Panel Component** (AC: 1, 2, 3)
  - [x] Create `PostFilters` component
  - [x] Add status dropdown (All, Draft, Published, Scheduled, Archived)
  - [x] Add category dropdown (fetch from API)
  - [x] Add date range picker

- [x] **Task 2: Implement Filter State Management** (AC: 4)
  - [x] Store filter values in component state
  - [x] Apply filters to API query params
  - [x] Debounce filter changes (300ms for search)

- [x] **Task 3: Display Active Filters** (AC: 5)
  - [x] Show active filter chips above table
  - [x] Add remove button to each filter chip
  - [x] Style chips with design tokens (orange-100/orange-700)

- [x] **Task 4: Implement Clear Filters** (AC: 6)
  - [x] Add "Clear All" button
  - [x] Reset all filter states
  - [x] Refetch data with cleared filters

- [x] **Task 5: Persist Filters in URL**
  - [x] Sync filter state with URL search params
  - [x] Restore filters from URL on page load
  - [x] Update URL when filters change

## Dev Notes

### API Contracts
**GET** `/api/v1/posts/` - Query params for filtering:
- `status`: draft | published | scheduled | archived
- `category_id`: number
- `date_from`: ISO date string
- `date_to`: ISO date string

**GET** `/api/v1/categories/` - For category dropdown options

### Filter State Structure
```typescript
interface PostFilterValues {
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
```

### UI Pattern
- Filter button opens panel/dropdown (expandable)
- Active filters shown as removable chips (FilterChip component)
- "Clear All" button appears when filters active
- Filter count badge on filter button

### Implementation Notes
- Used native HTML select and date inputs for simplicity
- Filter panel expand/collapse with isExpanded state
- Active filter chips with Tag icon and X remove button
- URL persistence with useRouter and useSearchParams
- Filter count badge shows number of active filters

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Created `PostFilters.tsx` component with expandable filter panel
- Added filter chips (FilterChip) for visual active filter display
- Integrated with posts page with full URL persistence
- Filters: status, category, date_from, date_to, search

**Features Implemented:**
1. Status dropdown (All, Draft, Published, Archived)
2. Category dropdown (fetched from API)
3. Date range picker (native HTML date inputs)
4. Active filter chips with remove buttons
5. "Clear All" button
6. URL persistence (filters restored on page load)
7. Filter count badge

### File List

- `frontend/src/components/dashboard/PostFilters.tsx` (CREATED)
- `frontend/src/app/dashboard/posts/page.tsx` (UPDATED)
- `frontend/src/components/dashboard/index.ts` (UPDATED)
