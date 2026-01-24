# Story 6.14: Smooth Theme Transitions

Status: review

## Story

As a user,
I want smooth transitions when toggling themes,
So that the change feels polished, not jarring.

## Acceptance Criteria

1. **Given** I click the theme toggle button
   **When** the theme changes
   **Then** transition duration is 200ms

2. **Given** I toggle the theme
   **When** the transition occurs
   **Then** all components transition simultaneously

3. **Given** I am viewing any page
   **When** the theme changes
   **Then** transition uses CSS `transition-property: background-color, color, border-color`

4. **Given** I toggle the theme
   **When** the transition occurs
   **Then** no content shifts during transition

## Tasks / Subtasks

- [x] **Task 1: Set 200ms Transition Duration** (AC: 1)
  - [x] Updated transition-duration from 150ms to 200ms
  - [x] Applied to *, *::before, *::after

- [x] **Task 2: Ensure Simultaneous Component Transitions** (AC: 2)
  - [x] Universal selector (*) applies to all components
  - [x] Includes pseudo-elements (*::before, *::after)

- [x] **Task 3: Use Correct Transition Properties** (AC: 3)
  - [x] transition-property: background-color, border-color, color
  - [x] Removed fill, stroke (not needed for theme)

- [x] **Task 4: Prevent Content Shifts** (AC: 4)
  - [x] box-sizing: border-box on all elements
  - [x] Consistent easing function: cubic-bezier(0.4, 0, 0.2, 1)

## Dev Notes

### Current Implementation Check

**globals.css** (`frontend/src/app/globals.css`):
- ✅ Transition duration: 200ms (was 150ms)
- ✅ Universal selector for simultaneous transitions
- ✅ Correct CSS properties for theme transitions
- ✅ Content shift prevention with box-sizing

### Changes Made

Updated BASE LAYER STYLES section:

**Before:**
```css
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

**After:**
```css
/* Theme transitions - 200ms for smooth theme toggle */
*,
*::before,
*::after {
  transition-property: background-color, border-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Prevent content shift during theme transition */
* {
  box-sizing: border-box;
}
```

### Transition Specifications

**Duration:** 200ms (0.2s)
- Polished feel without being too slow
- Matches Linear/Vercel design standards

**Timing Function:** cubic-bezier(0.4, 0, 0.2, 1)
- Ease-in-out curve for smooth start and end
- Industry standard for UI transitions

**Properties:**
- background-color - for cards, buttons, backgrounds
- border-color - for borders, dividers
- color - for text, icons

### Why These Properties

These are the properties that change between light and dark modes:
- `--background` → background-color
- `--foreground` → color
- `--border` → border-color
- `--card` → background-color
- `--muted` → background-color

Properties NOT included (don't affect theme):
- `fill`, `stroke` - SVG colors, handled separately
- `transform`, `opacity` - animation properties
- Layout properties - don't affect theme appearance

### Integration Points
- Global CSS - affects all theme transitions across the app
- ThemeProvider component handles the theme toggle
- Transitions apply automatically when `.dark` class is added/removed

### References
- [Source: epics.md Story 6.14](../../planning-artifacts/epics.md)
- [Source: brainstorming-session-2026-01-25.md](../../analysis/brainstorming-session-2026-01-25.md)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List

**Implementation Summary:**
- Updated base layer transitions in globals.css
- Changed transition duration from 150ms to 200ms
- Refined transition properties to only theme-related (bg, color, border)
- Added box-sizing to prevent content shifts
- Included pseudo-elements for complete coverage

**Features Implemented:**
1. ✅ 200ms transition duration for theme toggle
2. ✅ All components transition simultaneously (*, *::before, *::after)
3. ✅ CSS properties: background-color, color, border-color
4. ✅ No content shifts (box-sizing: border-box)

**Build Status:** ✅ PASS

### File List

- `frontend/src/app/globals.css` (MODIFIED - updated base layer transitions to 200ms)
