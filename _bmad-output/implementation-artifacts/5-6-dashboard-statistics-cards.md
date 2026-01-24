# Story 5.6: Dashboard Statistics Cards

Status: review

## Story

As a moderator,
I want to see key statistics on my dashboard,
so that I can understand system activity.

## Acceptance Criteria

1. **Given** I am a Moderator+ (rank >= 5)
   **When** I navigate to `/dashboard`
   **Then** I see statistics cards at top of page

2. **Given** I am viewing the statistics cards
   **When** I view the card metrics
   **Then** cards show: Total Posts, Published Posts, Draft Posts, Total Users

3. **Given** I am viewing a statistics card
   **When** I view the trend indicator
   **Then** each card shows trend indicator (↑ or ↓ with percentage)

4. **Given** I am viewing a statistics card
   **When** I click the card
   **Then** card is clickable to view detailed stats

5. **Given** I am viewing the statistics cards
   **When** I view the displayed stats
   **Then** stats are filtered based on my rank

## Tasks / Subtasks

- [ ] **Task 1: Create Stats Cards Grid** (AC: 1)
  - [ ] Create `StatsCards` component
  - [ ] Layout: 4 columns on desktop, 2 on tablet, 1 on mobile
  - [ ] Add to dashboard home page

- [ ] **Task 2: Implement Individual Stat Card** (AC: 2, 3)
  - [ ] Create `StatCard` component
  - [ ] Display metric label and value
  - [ ] Display trend indicator (↑/↓ + percentage)
  - [ ] Style trend green (up) or red (down)

- [ ] **Task 3: Fetch Stats Data** (AC: 2, 5)
  - [ ] Create API endpoint or use existing: `GET /api/v1/stats/dashboard/`
  - [ ] Fetch stats on component mount
  - [ ] Filter data based on user rank
  - [ ] Cache with TanStack Query (5min staleTime)

- [ ] **Task 4: Make Cards Clickable** (AC: 4)
  - [ ] Wrap card in Link component
  - [ ] Navigate to relevant detail page:
    - Total Posts → /dashboard/posts
    - Published Posts → /dashboard/posts?status=published
    - Draft Posts → /dashboard/posts?status=draft
    - Total Users → /dashboard/users

- [ ] **Task 5: Handle Loading and Empty States**
  - [ ] Show skeleton cards while loading
  - [ ] Show error state if API fails
  - [ ] Show 0 values for empty stats

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

### File List

- `frontend/src/app/dashboard/page.tsx` (update)
- `frontend/src/components/dashboard/StatsCards.tsx`
- `frontend/src/components/dashboard/StatCard.tsx`
