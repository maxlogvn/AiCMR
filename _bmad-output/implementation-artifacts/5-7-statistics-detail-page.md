# Story 5.7: Statistics Detail Page

Status: review

## Story

As a moderator,
I want to see detailed analytics,
so that I can make informed decisions.

## Acceptance Criteria

1. **Given** I am a Moderator+ (rank >= 5)
   **When** I navigate to `/dashboard/stats`
   **Then** I see time range selector (7 days, 30 days, 90 days, All time)

2. **Given** I am viewing the stats page
   **When** I view the charts
   **Then** I see line chart of posts created over time

3. **Given** I am viewing the stats page
   **When** I view the breakdown section
   **Then** I see breakdown of posts by status

4. **Given** I am viewing the stats page
   **When** I view the top content section
   **Then** I see top categories by post count

5. **Given** I am viewing the stats page
   **When** I view the top authors section
   **Then** I see top authors by post count

6. **Given** I am viewing the stats page
   **When** I click the export button
   **Then** I can export stats as CSV

## Tasks / Subtasks

- [ ] **Task 1: Create Stats Page** (AC: 1)
  - [ ] Create `frontend/src/app/dashboard/stats/page.tsx`
  - [ ] Add ModeratorGuard
  - [ ] Create page layout with sections

- [ ] **Task 2: Implement Time Range Selector** (AC: 1)
  - [ ] Add tabs/buttons: 7 days, 30 days, 90 days, All time
  - [ ] Store selected range in state
  - [ ] Refetch data when range changes
  - [ ] Persist selection in URL

- [ ] **Task 3: Create Posts Over Time Chart** (AC: 2)
  - [ ] Integrate chart library (Recharts)
  - [ ] Create line chart with posts per day
  - [ ] Add tooltips for data points
  - [ ] Handle empty data state

- [ ] **Task 4: Create Status Breakdown** (AC: 3)
  - [ ] Create pie/donut chart or stat cards
  - [ ] Show count for each status
  - [ ] Add color coding matching status badges

- [ ] **Task 5: Create Top Categories List** (AC: 4)
  - [ ] Fetch category stats from API
  - [ ] Display as ranked list with counts
  - [ ] Add bar visualization for relative counts

- [ ] **Task 6: Create Top Authors List** (AC: 5)
  - [ ] Fetch author stats from API
  - [ ] Display as ranked list with avatars
  - [ ] Show post counts and trend

- [ ] **Task 7: Implement CSV Export** (AC: 6)
  - [ ] Add "Export CSV" button
  - [ ] Generate CSV from stats data
  - [ ] Trigger download with timestamp filename

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

### File List

- `frontend/src/app/dashboard/stats/page.tsx`
- `frontend/src/components/dashboard/PostsChart.tsx`
- `frontend/src/components/dashboard/StatusBreakdown.tsx`
- `frontend/src/components/dashboard/TopCategories.tsx`
- `frontend/src/components/dashboard/TopAuthors.tsx`
- `frontend/src/lib/exportToCsv.ts`
