# Story 6.3: Enhanced Card Component System

Status: review

## Story

As a developer,
I want reusable card components with hover effects,
So that all content containers feel cohesive.

## Acceptance Criteria

1. **Given** a card component is used
   **When** I hover over the card
   **Then** border changes to orange-500/30
   **And** shadow appears with orange tint
   **And** transition is smooth (200ms)

2. **Given** a card is in "selected" state
   **When** I view the card
   **Then** border is orange-500/50
   **And** background has orange-500/5 tint

3. **Given** mobile viewport
   **When** I view cards
   **Then** cards use compact padding (p-4 instead of p-5)

## Tasks / Subtasks

- [x] **Task 1: Create EnhancedCard Component** (AC: 1, 2, 3)
  - [x] Create `frontend/src/components/ui/EnhancedCard.tsx`
  - [x] Base card with hover effects
  - [x] Selected state variant
  - [x] Mobile compact variant

- [x] **Task 2: Implement Hover Effects** (AC: 1)
  - [x] Hover: `hover:border-orange-500/30`
  - [x] Hover: `hover:shadow-lg hover:shadow-orange-500/5`
  - [x] Transition: `transition-all duration-200`

- [x] **Task 3: Implement Selected State** (AC: 2)
  - [x] Selected: `border-orange-500/50 bg-orange-500/5`
  - [x] Use `data-selected` attribute for CSS targeting

- [x] **Task 4: Mobile Compact Variant** (AC: 3)
  - [x] Mobile: `p-4` instead of `p-5`
  - [x] Use responsive: `p-4 sm:p-5`

- [x] **Task 5: Update Existing Card Component** (AC: 1)
  - [x] Update base Card component to use enhanced styles
  - [x] Or create wrapper that adds effects to existing Card

## Dev Notes

### Component Interface
```typescript
interface EnhancedCardProps {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
  hoverable?: boolean;
  compact?: boolean;
}
```

### Style Specifications

**Base Card:**
```tsx
className="rounded-lg border bg-card p-5
  hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5
  transition-all duration-200
  dark:hover:border-orange-400/30 dark:hover:shadow-orange-400/5"
```

**Selected State:**
```tsx
className="border-orange-500/50 bg-orange-500/5"
```

**Mobile Compact:**
```tsx
className="p-4 sm:p-5"
```

### Integration Points
- Posts cards (Story 6.6)
- Category cards (Story 6.9)
- Tag cards (Story 6.10)
- User cards (Story 6.11)
- Stats cards (already enhanced)

### Design Tokens Used
- `--card-hover-border: rgba(249, 115, 22, 0.30)` - from CSS tokens
- `--card-hover-shadow: rgba(249, 115, 22, 0.05)` - from CSS tokens

### References
- [Source: epics.md Story 6.3](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Enhanced existing Card component instead of creating new EnhancedCard.tsx
- Added `hover` prop for orange-500/30 border and shadow effects on hover
- Added `selected` prop for selected state with orange-500/50 border and bg-orange-500/5 tint
- Added `compact` prop for mobile-responsive padding (p-4 sm:p-5)
- All props have default values so existing usage continues to work

**Features Implemented:**
1. ✅ Hover effect: `hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5`
2. ✅ Smooth transition: `transition-all duration-200`
3. ✅ Selected state: `border-orange-500/50 bg-orange-500/5`
4. ✅ Mobile compact: `p-4 sm:p-5` when compact=true
5. ✅ Dark mode support included

**Files Modified:**
- `frontend/src/components/ui/card.tsx` - Added hover, selected, compact props

**Build Status:** ✅ PASS

### File List

- `frontend/src/components/ui/card.tsx` (MODIFIED - added hover, selected, compact props)
