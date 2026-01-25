# Story 5.7: Statistics Detail Page

Status: done

## Story

As a moderator,
I want to see detailed analytics,
so that I can make informed decisions.

## Acceptance Criteria

1. **Given** I am a Moderator+ (rank >= 5)
   **When** I navigate to `/dashboard/stats`
   **Then** I see time range selector (7 days, 30 days, 90 days, All time)
   ✅ PASS: Time range buttons with orange active state

2. **Given** I am viewing the stats page
   **When** I view the charts
   **Then** I see line chart of posts created over time
   ✅ PASS: PostsChart component displays line chart

3. **Given** I am viewing the stats page
   **When** I view the breakdown section
   **Then** I see breakdown of posts by status
   ✅ PASS: StatusBreakdown component shows status distribution

4. **Given** I am viewing the stats page
   **When** I view the top content section
   **Then** I see top categories by post count
   ✅ PASS: TopCategories component shows ranked list

5. **Given** I am viewing the stats page
   **When** I view the top authors section
   **Then** I see top authors by post count
   ✅ PASS: TopAuthors component shows ranked list with avatars

6. **Given** I am viewing the stats page
   **When** I click the export button
   **Then** I can export stats as CSV
   ✅ PASS: Export button downloads 4 CSV files with timestamps

## Tasks / Subtasks

- [x] **Task 1: Create Stats Page** (AC: 1)
  - [x] Create `frontend/src/app/dashboard/stats/page.tsx` - EXISTS
  - [x] Add ModeratorGuard (via layout.tsx)
  - [x] Page layout with PageHeader, charts, and stats

- [x] **Task 2: Implement Time Range Selector** (AC: 1)
  - [x] Tabs/buttons: 7 ngày, 30 ngày, 90 ngày, Tất cả
  - [x] Store selected range in state
  -x] Refetch data when range changes (TanStack Query)
  - [x] Persist selection in URL (searchParams)

- [x] **Task 3: Create Posts Over Time Chart** (AC: 2)
  - [x] PostsChart component at `frontend/src/components/dashboard/PostsChart.tsx`
  - [x] Line chart with posts per day (using Recharts)
  - [x] Tooltips and responsive design
  - [x] Handles empty data state

- [x] **Task 4: Create Status Breakdown** (AC: 3)
  - [x] StatusBreakdown component at `frontend/src/components/dashboard/StatusBreakdown.tsx`
  - [x] Visual breakdown of posts by status
  - [x] Color coding matching status badges

- [x] **Task 5: Create Top Categories List** (AC: 4)
  -x] Backend API provides top_categories data
  - [x] TopCategories component displays ranked list
  - [x] Bar visualization for relative counts

- [x] **Task 6: Create Top Authors List** (AC: 5)
  -x] Backend API provides top_authors data
  - [x] TopAuthors component displays ranked list with avatars
  - [x] Shows post counts for each author

- [x] **Task 7: Implement CSV Export** (AC: 6)
  - [x] "Export" button with Download icon
  - [x] exportToCsv function in `lib/exportToCsv.ts`
  - [x] Downloads 4 CSV files: posts_over_time, posts_by_status, top_categories, top_authors
  - [x] Timestamp filenames generated automatically

## AI-Review Action Items

- [x] [AI-Review][MAJOR] Story has all unchecked tasks - implementation not started [5-7:39-74] ✅ RESOLVED - Implementation verified complete

## Dev Notes

### Stats API Contract
**GET** `/api/v1/stats/details/`
```typescript
interface StatsDetailsParams {
  range: '7d' | '30d' | '90d' | 'all';
}

interface StatsDetailsResponse {
  posts_over_time: {
    date: string;
    count: number;
  }[];
  posts_by_status: {
    status: string;
    count: number;
  }[];
  top_categories: {
    id: number;
    name: string;
    count: number;
  }[];
  top_authors: {
    id: number;
    username: string;
    full_name: string;
    avatar?: string;
    count: number;
  }[];
}
```

### Chart Library
- Use **Recharts** (already in frontend dependencies)
- Responsive charts by default
- Supports SSR (Next.js compatible)

### Page Layout
```
┌─────────────────────────────────────────────┐
│  Statistics           [7d|30d|90d|All] [Export]│
├─────────────────────────────────────────────┤
│                                             │
│  Posts Over Time                            │
│  ┌─────────────────────────────────────┐   │
│  │        Line Chart                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Posts by Status    Top Categories          │
│  ┌──────────┐      ┌──────────────────┐    │
│  │Donut/Bar │      │ Ranked List      │    │
│  └──────────┘      └──────────────────┘    │
│                                             │
│  Top Authors                               │
│  ┌─────────────────────────────────────┐   │
│  │  Author list with avatars           │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Component Reuse
- Use `Card` for chart containers
- Use `Tabs` for time range selector
- Use `Button` for export

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.7](../../planning-artifacts/epics.md)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- All components already existed from previous dashboard redesign
- Backend API `/api/v1/stats/details` fully implemented with:
  - Range parameter support (7d, 30d, 90d, all)
  - posts_over_time data for chart visualization
  - posts_by_status breakdown
  - top_categories and top_authors rankings
- Stats page fully functional with time range selector, charts, and export

**Features Implemented:**
1. ✅ Time range selector (7d, 30d, 90d, all) with URL persistence
2. ✅ PostsChart component with Recharts line chart
3. ✅ StatusBreakdown component with visual status distribution
4. ✅ TopCategories component with ranked list and bars
5. ✅ TopAuthors component with avatars and post counts
6. ✅ CSV export functionality (4 files with timestamps)
7. ✅ PageHeader with actions section

**Build Status:** ✅ PASS - Implementation verified complete

### File List

- `frontend/src/app/dashboard/stats/page.tsx` (EXISTING - full implementation)
- `frontend/src/components/dashboard/PostsChart.tsx` (EXISTING)
- `frontend/src/components/dashboard/StatusBreakdown.tsx` (EXISTING)
- `frontend/src/components/dashboard/TopCategories.tsx` (EXISTING)
- `frontend/src/components/dashboard/TopAuthors.tsx` (EXISTING)
- `frontend/src/lib/exportToCsv.ts` (EXISTING)
- `backend/app/api/v1/stats.py` (EXISTING - /details endpoint)
