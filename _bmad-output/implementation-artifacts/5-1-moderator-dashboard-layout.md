# Story 5.1: Moderator Dashboard Layout

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a moderator,
I want a dashboard with sidebar navigation,
so that I can access all moderation tools.

## Acceptance Criteria

1. **Given** I am a Moderator+ (rank >= 5)
   **When** I navigate to `/dashboard`
   **Then** I see a sidebar on the left (240px width)
   ✅ PASS: Sidebar width set to `w-60` (240px) in Sidebar.tsx

2. **Given** I am viewing the dashboard
   **When** I view the sidebar
   **Then** sidebar shows navigation items based on my rank
   ✅ PASS: `visibleItems = NAV_ITEMS.filter((item) => item.minRank <= userRank)`

3. **Given** I am viewing the dashboard
   **When** I view the sidebar sections
   **Then** I see: My Profile, My Posts, All Posts, Categories, Tags, Users, Settings
   ✅ PASS: All nav items defined in navigation.tsx with proper minRank values

4. **Given** I am viewing the dashboard
   **When** I view the top bar
   **Then** I see breadcrumb and user menu
   ✅ PASS: TopBar.tsx includes breadcrumb and UserMenu component

5. **Given** I am viewing the dashboard
   **When** I view the layout
   **Then** main content area displays on right of sidebar
   ✅ PASS: layout.tsx structure has Sidebar + main content div

## Tasks / Subtasks

- [x] **Task 1: Create Dashboard Layout Component** (AC: 1, 5)
  - [x] Create `frontend/src/app/dashboard/layout.tsx` with sidebar + main content structure
  - [x] Set sidebar width to 240px fixed on desktop
  - [x] Create responsive layout with mobile sidebar toggle

- [x] **Task 2: Create Sidebar Component** (AC: 2, 3)
  - [x] Create `Sidebar` component at `frontend/src/components/layout/Sidebar.tsx`
  - [x] Implement rank-based nav item filtering
  - [x] Add navigation sections with dividers

- [x] **Task 3: Create TopBar Component** (AC: 4)
  - [x] Create `TopBar` component at `frontend/src/components/layout/TopBar.tsx`
  - [x] Add breadcrumb navigation
  - [x] Add user menu dropdown

- [x] **Task 4: Create Dashboard Pages Structure** (AC: 1)
  - [x] Create placeholder pages for /dashboard/posts, /dashboard/categories, etc.
  - [x] Implement route guards using ModeratorGuard

- [x] **Task 5: Implement Responsive Design**
  - [x] Add mobile sidebar toggle (hamburger menu)
  - [x] Add collapsed sidebar state
  - [x] Test on tablet and mobile viewports

## Dev Notes

### Epic 5 Context - Content Moderation
**Goal:** Enable moderators to review, filter, manage bulk actions, and view statistics.

**FRs covered:** FR15-19 (Content Management), FR24-25 (Dashboard Analytics), FR26-29 (Data Display), FR30-32 (Feedback)

### Navigation Items by Rank
| Item | Path | Min Rank |
|------|------|----------|
| My Profile | /user/profile | 1 |
| My Posts | /user/posts | 3 |
| **All Posts** | /dashboard/posts | 5 |
| **Categories** | /dashboard/categories | 5 |
| **Tags** | /dashboard/tags | 5 |
| **Users** | /dashboard/users | 5 |
| **Statistics** | /dashboard/stats | 5 |
| **Settings** | /dashboard/settings | 10 |

### Project Structure Notes
- Dashboard pages use SPA rendering (not SSR)
- Route group: `(public)` for public, `dashboard/` for moderator pages
- Use existing `AuthGuard` and `ModeratorGuard` from `frontend/src/components/guards/`

### Architecture Compliance
**File Locations:**
- Layout: `frontend/src/app/dashboard/layout.tsx`
- Pages: `frontend/src/app/dashboard/{page}/page.tsx`
- Components: `frontend/src/components/layout/`

**State Management:**
- Use Zustand store for sidebar collapse state
- Use TanStack Query for user rank data

**Design Tokens:**
- Sidebar width: 240px (desktop), 64px (collapsed)
- TopBar height: 64px
- Colors from `ui-component-specifications.md`

### Testing Requirements
- Test rank-based nav visibility
- Test responsive sidebar toggle
- Test navigation links work correctly
- Test ModeratorGuard redirects

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-5](../../planning-artifacts/epics.md)
- [Source: _bmad-output/planning-artifacts/ui-component-specifications.md#Sidebar](../../planning-artifacts/ui-component-specifications.md)
- [Source: frontend/src/app/dashboard/layout.tsx](../../../../frontend/src/app/dashboard/layout.tsx)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

### Completion Notes List

**Implementation Summary:**
- Created Zustand store `sidebar-store.ts` for sidebar state management
- Created `navigation.tsx` with NAV_ITEMS array including rank-based access control
- Created `Sidebar.tsx` with desktop (240px/64px collapsed) and mobile overlay variants
- Created `SidebarItem.tsx` for individual nav items with active state highlighting
- Created `TopBar.tsx` with breadcrumb navigation and mobile menu toggle
- Created `UserMenu.tsx` with user avatar, rank badge, profile link, and logout
- Updated `dashboard/layout.tsx` to use new components and breadcrumb configuration
- Fixed `ModeratorGuard.tsx` rank check from `< 3` to `< 5`

**TypeScript Errors Fixed:**
1. TopBar.tsx JSX parsing error - extracted breadcrumb logic to function
2. CardListSkeleton `showCheckbox` prop - removed non-existent prop
3. StatsCard `trend` prop type - changed string values to "up"|"down"|"neutral"
4. StatsCard `isPulse` prop - removed non-existent prop
5. EmptyState `actionOnClick` prop - changed to `onAction`
6. DashboardHeaderCompact export - removed from index.ts
7. TagList.tsx `actionOnClick` prop - changed to `onAction`
8. TagList.tsx `getColorBadgeStyle` return type - fixed to return CSSProperties
9. sidebar-store.ts `isCollapsed: isCollapsed` typo - changed to `boolean`
10. TagList.tsx EmptyState missing `description` prop - added description

### File List

- `frontend/src/stores/sidebar-store.ts` (CREATED)
- `frontend/src/components/layout/navigation.tsx` (CREATED)
- `frontend/src/components/layout/Sidebar.tsx` (CREATED)
- `frontend/src/components/layout/SidebarItem.tsx` (CREATED)
- `frontend/src/components/layout/TopBar.tsx` (CREATED)
- `frontend/src/components/layout/UserMenu.tsx` (CREATED)
- `frontend/src/app/dashboard/layout.tsx` (UPDATED)
- `frontend/src/components/auth/ModeratorGuard.tsx` (FIXED)
- `frontend/src/app/dashboard/users-manager/page.tsx` (FIXED)
- `frontend/src/components/tag/TagList.tsx` (FIXED)
- `frontend/src/components/dashboard/index.ts` (FIXED)
