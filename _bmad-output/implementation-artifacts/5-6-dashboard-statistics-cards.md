# Story 5.6: Dashboard Statistics Cards

Status: done

## Story

As a moderator,
I want to see key statistics on my dashboard,
so that I can understand system activity.

## Acceptance Criteria

1. **Given** I am a Moderator+ (rank >= 5)
   **When** I navigate to `/dashboard`
   **Then** I see statistics cards at top of page
   ✅ PASS: StatsCards component displayed on dashboard home page

2. **Given** I am viewing the statistics cards
   **When** I view the card metrics
   **Then** cards show: Total Posts, Published Posts, Draft Posts, Total Users
   ✅ PASS: 4 stat cards showing totals and trends

3. **Given** I am viewing a statistics card
   **When** I view the trend indicator
   **Then** each card shows trend indicator (↑ or ↓ with percentage)
   ✅ PASS: changePercent prop with visual indicators

4. **Given** I am viewing a statistics card
   **When** I click the card
   **Then** card is clickable to view detailed stats
   ✅ PASS: Cards wrapped in Link with href to relevant pages

5. **Given** I am viewing the statistics cards
   **When** I view the displayed stats
   **Then** stats are filtered based on my rank
   ✅ PASS: Backend API requires MODERATOR_RANK (5+)

## Tasks / Subtasks

- [x] **Task 1: Create Stats Cards Grid** (AC: 1)
  - [x] Create `StatsCards` component at `frontend/src/components/dashboard/StatsCards.tsx`
  - [x] Layout: 4 columns on desktop, 2 on tablet, 1 on mobile
  - [x] Add to dashboard home page

- [x] **Task 2: Implement Individual Stat Card** (AC: 2, 3)
  - [x] Create `StatCard` component at `frontend/src/components/dashboard/StatCard.tsx`
  - [x] Display metric label and value
  - [x] Display trend indicator (↑/↓ + percentage)
  - [x] Style trend green (up) or red (down)

- [x] **Task 3: Fetch Stats Data** (AC: 2, 5)
  - [x] Backend API exists: `GET /api/v1/stats/dashboard/`
  - [x] Fetch stats on component mount with TanStack Query
  - [x] Filter data based on user rank (MODERATOR_RANK required)
  - [x] Cache with TanStack Query (5min staleTime)

- [x] **Task 4: Make Cards Clickable** (AC: 4)
  - [x] Cards wrapped in Link component with href
  - [x] Navigate to relevant detail page:
    - Total Posts → /dashboard/posts
    - Published Posts → /dashboard/posts?status=published
    - Draft Posts → /dashboard/posts?status=draft
    - Total Users → /dashboard/users-manager

- [x] **Task 5: Handle Loading and Empty States**
  - [x] Show skeleton/loading state while fetching
  - [x] Show error state if API fails
  - [x] Show 0 values for empty stats

## AI-Review Action Items

- [x] [AI-Review][MAJOR] Story has all unchecked tasks - implementation not started [5-6:35-63] ✅ RESOLVED - Implementation verified complete

## Dev Notes

### Stats API Contract
**GET** `/api/v1/stats/dashboard/`
```typescript
interface DashboardStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_users: number;
  trends: {
    posts_change: number; // percentage
    users_change: number; // percentage
  };
}
```

### Stat Card Design
```
┌─────────────────────────────────┐
│  Total Posts        ↑ 12%       │
│  ─────────────────────────      │
│         1,247                   │
└─────────────────────────────────┘
```

### Component Structure
```
/dashboard/page.tsx
└── StatsCards
    ├── StatCard (Total Posts)
    ├── StatCard (Published Posts)
    ├── StatCard (Draft Posts)
    └── StatCard (Total Users)
```

### Rank-Based Display
- Moderators (5): See all stats
- Admins (10): See all stats + additional admin-only metrics
- Editor (3): Redirected to /user/posts (not /dashboard)

### Component Reuse
- Use `Card` from Story 1.8
- Use `Spinner` for loading state
- Use Link from Next.js

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.6](../../planning-artifacts/epics.md)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- All components already existed from previous dashboard redesign
- Backend API `/api/v1/stats/dashboard` fully implemented with:
  - Total posts, published posts, draft posts counts
  - Total users count
  - Trends calculation (30-day comparison)
- StatsCards component integrates with backend via TanStack Query
- All stat cards clickable with proper hrefs to detail pages

**Features Implemented:**
1. ✅ Stats cards grid (4/2/1 columns responsive)
2. ✅ StatCard component with trend indicators
3. ✅ Backend API with rank filtering (MODERATOR_RANK required)
4. ✅ TanStack Query integration with 5min cache
5. ✅ Loading states with isLoading prop
6. ✅ Clickable cards to relevant pages

**Build Status:** ✅ PASS - Implementation verified complete

### File List

- `frontend/src/app/dashboard/page.tsx` (EXISTING - uses StatsCards)
- `frontend/src/components/dashboard/StatsCards.tsx` (EXISTING - full implementation)
- `frontend/src/components/dashboard/StatCard.tsx` (EXISTING - full implementation)
- `backend/app/api/v1/stats.py` (EXISTING - /dashboard endpoint)

