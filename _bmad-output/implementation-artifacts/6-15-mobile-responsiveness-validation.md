# Story 6.15: Mobile Responsiveness Validation

Status: review

## Story

As a user on mobile device,
I want all dashboard pages to work well on small screens,
So that I can manage content from anywhere.

## Acceptance Criteria

1. **Given** I am on mobile viewport (375px width)
   **When** I view any dashboard page
   **Then** cards stack vertically with full width

2. **Given** I am on mobile device
   **When** I interact with buttons
   **Then** touch targets are minimum 44px (Apple HIG)

3. **Given** I select multiple items
   **When** I view bulk actions
   **Then** bulk actions are in a bottom sheet

4. **Given** I am on mobile device
   **When** I view filters
   **Then** filters are in collapsible dropdown

5. **Given** I am on mobile device
   **When** I view page headers
   **Then** page headers stack (icon above title)

6. **Given** I am on mobile device
   **When** I scroll or navigate
   **Then** no horizontal scrolling occurs

## Tasks / Subtasks

- [x] **Task 1: Verify Card Stacking** (AC: 1)
  - [x] PostsCardGrid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
  - [x] TagList: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
  - [x] Cards full width on mobile (375px)

- [x] **Task 2: Ensure 44px Touch Targets** (AC: 2)
  - [x] Added CSS rules for min-height: 44px on buttons, links, inputs
  - [x] Bulk action buttons have `h-11 min-h-[44px]`
  - [x] Compact opt-out class: `.touch-target-compact`

- [x] **Task 3: Verify Bottom Sheet for Bulk Actions** (AC: 3)
  - [x] Fixed bottom bar: `fixed bottom-0 left-0 right-0`
  - [x] Flex column on mobile, row on desktop
  - [x] Safe-area padding: `pb-safe`

- [x] **Task 4: Verify Collapsible Filters** (AC: 4)
  - [x] PostFilters uses dropdown/select style
  - [x] Filter pills wrap on mobile: `flex-wrap`

- [x] **Task 5: Fix Page Header Stacking** (AC: 5)
  - [x] Icon and title stack vertically: `flex-col` on mobile
  - [x] Icon larger on mobile: `h-12 w-12 sm:h-10 sm:w-10`
  - [x] Actions wrap properly on mobile

- [x] **Task 6: Prevent Horizontal Scrolling** (AC: 6)
  - [x] `body { overflow-x: hidden; max-width: 100vw }`
  - [x] Max-width on img, video, iframe, table, pre, code
  - [x] `-webkit-overflow-scrolling: touch` for iOS

## Dev Notes

### Current Implementation Check

**PageHeader** (`frontend/src/components/dashboard/PageHeader.tsx`):
- ✅ Icon stacks above title on mobile (`flex-col` on icon+title container)
- ✅ Icon larger on mobile (48px vs 40px on desktop)
- ✅ Actions wrap and justify properly

**Posts Page** (`frontend/src/app/dashboard/posts/page.tsx`):
- ✅ Bulk actions bottom sheet with safe-area padding
- ✅ Buttons wrap on mobile with `flex-wrap`
- ✅ Touch targets 44px minimum

**globals.css** (`frontend/src/app/globals.css`):
- ✅ Safe area insets (`pb-safe`, `pt-safe`)
- ✅ Touch target minimums (44px)
- ✅ Horizontal scroll prevention
- ✅ Overflow prevention on common elements

### Changes Made

**1. PageHeader component updates:**
```tsx
// Icon and title - stack vertically on mobile
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
  <div className="flex h-12 w-12 sm:h-10 sm:w-10 ...">  {/* Larger on mobile */}
    <Icon className="h-6 w-6 sm:h-5 sm:w-5" />
  </div>
  <div className="flex flex-col">  {/* Title section */}
    <h1>{title}</h1>
    <p>{subtitle}</p>
  </div>
</div>
```

**2. Bulk actions bottom sheet updates:**
```tsx
<div className="fixed bottom-0 ... pb-safe ...">
  <div className="flex flex-col sm:flex-row ... gap-3">
    <span>...</span>
    <div className="flex ... flex-wrap justify-center sm:justify-end">
      <Button className="h-11 min-h-[44px]">...</Button>  {/* 44px min */}
    </div>
  </div>
</div>
```

**3. Mobile responsiveness CSS added:**
```css
/* Safe area insets */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}

/* Touch targets */
button, a, input[type="checkbox"], input[type="radio"] {
  min-height: 44px;
  min-width: 44px;
}

/* Prevent horizontal scroll */
body {
  overflow-x: hidden;
  max-width: 100vw;
}

/* Overflow prevention */
img, video, iframe, table, pre, code {
  max-width: 100%;
}
```

### Responsive Breakpoints

| Breakpoint | Width | Columns |
|------------|-------|---------|
| Mobile (default) | 0px+ | 1 column |
| Tablet (sm) | 640px+ | 2 columns |
| Desktop (lg) | 1024px+ | 3 columns |

### Touch Target Sizes

| Element | Size | Standard |
|---------|------|----------|
| Buttons | 44px | Apple HIG |
| Links | 44px | Apple HIG |
| Checkbox/Radio | 44px | Apple HIG |
| Bulk Action Buttons | 44px (h-11) | Apple HIG |

### Safe Areas

iOS devices have safe areas:
- **Top**: Notch (44px on iPhone X+)
- **Bottom**: Home indicator (34px on iPhone X+)

`pb-safe` uses `env(safe-area-inset-bottom, 16px)` to add padding when needed.

### Integration Points
- All dashboard pages use PageHeader
- Posts page has bulk actions bottom sheet
- Global CSS affects all pages

### References
- [Source: epics.md Story 6.15](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)
- [Apple Human Interface Guidelines - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/components/menus-and-actions/buttons)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Updated PageHeader to stack icon above title on mobile
- Enhanced bulk actions bottom sheet with safe-area padding and 44px touch targets
- Added mobile responsiveness CSS utilities (safe areas, touch targets, overflow prevention)
- Verified all dashboard pages work on 375px viewport

**Features Implemented:**
1. ✅ Cards stack vertically with full width on mobile (responsive grid)
2. ✅ Touch targets minimum 44px (Apple HIG compliant)
3. ✅ Bulk actions in bottom sheet with safe-area padding
4. ✅ Filters use dropdown/collapsible style (already implemented)
5. ✅ Page headers stack (icon above title) on mobile
6. ✅ No horizontal scrolling (overflow-x: hidden, max-width constraints)

**Build Status:** ✅ PASS

### File List

- `frontend/src/components/dashboard/PageHeader.tsx` (MODIFIED - mobile stacking, larger icon)
- `frontend/src/app/dashboard/posts/page.tsx` (MODIFIED - bulk actions safe area, 44px buttons)
- `frontend/src/app/globals.css` (MODIFIED - mobile responsiveness utilities)
