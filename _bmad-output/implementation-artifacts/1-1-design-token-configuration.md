# Story 1.1: Design Token Configuration

**Epic:** Epic 1 - Design System Foundation
**Story ID:** 1.1
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **developer**,
I want **centralized design tokens for colors, typography, and spacing**,
so that **all components use consistent visual values**.

---

## Acceptance Criteria

1. **Given** the project uses TailwindCSS 4
   **When** design tokens are configured
   **Then** colors use Indigo (primary #4F46E5) and Teal (accent #14B8A6)

2. **Given** the design system specification
   **When** typography tokens are configured
   **Then** typography uses Inter font with defined type scale (Display → Caption)

3. **Given** the spacing requirements
   **When** spacing tokens are configured
   **Then** spacing follows 8px base system (0, 4, 8, 12, 16, 24, 32, 48px)

4. **Given** the hybrid token approach
   **When** tokens are defined
   **Then** all tokens are defined as CSS variables for runtime access

5. **Given** TailwindCSS 4 configuration
   **When** theme is extended
   **Then** primary and accent colors are available as Tailwind utilities (primary-50 to primary-900, accent-50 to accent-900)

---

## Tasks / Subtasks

### Task 1: Create tokens directory structure (AC: #4)
- [x] 1.1 Create `/src/tokens/` directory
- [x] 1.2 Create `colors.ts` with primary (Indigo) and accent (Teal) color palettes
- [x] 1.3 Create `typography.ts` with Inter font and type scale definitions
- [x] 1.4 Create `spacing.ts` with 8px base spacing scale
- [x] 1.5 Create `radius.ts` with border radius definitions
- [x] 1.6 Create `shadows.ts` with elevation shadow definitions
- [x] 1.7 Create `index.ts` that exports all tokens

### Task 2: Configure TailwindCSS 4 theme extension (AC: #1, #2)
- [x] 2.1 Create `/tailwind.config.ts` (root level if not exists)
- [x] 2.2 Extend theme with primary colors (Indigo palette)
- [x] 2.3 Extend theme with accent colors (Teal palette)
- [x] 2.4 Add fontFamily configuration for Inter and JetBrains Mono
- [x] 2.5 Add custom spacing scale following 8px base system
- [x] 2.6 Add custom borderRadius scale
- [x] 2.7 Add custom shadows

### Task 3: Define CSS variables for runtime access (AC: #4)
- [x] 3.1 Update `globals.css` with CSS variable definitions
- [x] 3.2 Define `--color-primary-*` variables for all primary shades
- [x] 3.3 Define `--color-accent-*` variables for all accent shades
- [x] 3.4 Define `--color-gray-*` variables for neutral palette
- [x] 3.5 Define semantic color variables (--color-success, --color-warning, --color-error, --color-info)
- [x] 3.6 Define `--spacing-*` variables for spacing scale
- [x] 3.7 Define `--radius-*` variables for border radius

### Task 4: Add Inter font configuration (AC: #2)
- [x] 4.1 Check if Inter font is already available (Geist Sans used currently)
- [x] 4.2 Update `layout.tsx` or `globals.css` with Inter font import
- [x] 4.3 Configure font family fallback for Inter

### Task 5: Create utility functions (Dev)
- [x] 5.1 Verify `cn()` utility exists in `/src/lib/utils.ts`
- [x] 5.2 If not exists, create with tailwind-merge implementation

### Task 6: Verify token system works (AC: #1, #2, #3, #4)
- [x] 6.1 Build TailwindCSS configuration succeeds
- [x] 6.2 CSS variables are accessible via `getComputedStyle()`
- [x] 6.3 Tailwind utility classes use new colors (e.g., `bg-primary-600`, `text-accent-500`)
- [x] 6.4 Spacing utilities work correctly (e.g., `p-4` = 16px)

---

## Dev Notes

### Current State Analysis

**Existing globals.css:**
- Uses OKLCH color space (not RGB hex)
- Has current CSS variable structure but different naming convention
- Uses `@theme inline` for TailwindCSS 4

**Required Changes:**
- Migrate from OKLCH to RGB hex colors (Indigo/Teal)
- Update CSS variable naming to match design system specification
- Extend TailwindCSS theme with new color palettes

### Design Token Specifications

**Primary Colors (Indigo):**
```typescript
primary: {
  50: '#EEF2FF',
  100: '#E0E7FF',
  200: '#C7D2FE',
  300: '#A5B4FC',
  400: '#818CF8',
  500: '#6366F1',
  600: '#4F46E5', // Primary actions
  700: '#4338CA',
  800: '#3730A3',
  900: '#312E81',
}
```

**Accent Colors (Teal):**
```typescript
accent: {
  50: '#F0FDFA',
  100: '#CCFBF1',
  200: '#99F6E4',
  300: '#5EEAD4',
  400: '#2DD4BF',
  500: '#14B8A6', // CTA, highlights
  600: '#0D9488',
  700: '#0F766E',
  800: '#115E59',
  900: '#134E4A',
}
```

**Neutral Grays:**
```typescript
gray: {
  50: '#F9FAFB',  // Background
  100: '#F3F4F6',
  200: '#E5E7EB', // Border
  300: '#D1D5DB',
  400: '#9CA3AF', // Disabled
  500: '#6B7280',
  600: '#4B5563', // Text secondary
  700: '#374151',
  800: '#1F2937',
  900: '#111827', // Text primary
}
```

**Semantic Colors:**
```typescript
semantic: {
  success: '#10B981', // Published, active
  warning: '#F59E0B', // Draft, pending
  error: '#EF4444',   // Error, deleted
  info: '#3B82F6',     // Info, scheduled
}
```

**Typography Scale:**
```typescript
fontSize: {
  display: ['48px', { lineHeight: '56px', letterSpacing: '-0.02' }],
  h1: ['36px', { lineHeight: '40px', letterSpacing: '-0.02' }],
  h2: ['30px', { lineHeight: '36px', letterSpacing: '-0.01' }],
  h3: ['24px', { lineHeight: '32px' }],
  h4: ['20px', { lineHeight: '28px' }],
  'body-lg': ['18px', { lineHeight: '28px' }],
  body: ['16px', { lineHeight: '24px' }],
  'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.01' }],
  caption: ['12px', { lineHeight: '16px', letterSpacing: '0.04' }],
}
```

**Spacing Scale (8px base):**
```typescript
spacing: {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}
```

**Border Radius:**
```typescript
borderRadius: {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
}
```

### Critical Anti-Patterns to Avoid

```typescript
// ❌ FORBIDDEN - Magic values
<div className="p-[16px] text-[#4F46E5] bg-[#4F46E5]">

// ❌ FORBIDDEN - Inline styles
<div style={{ backgroundColor: '#4F46E5' }}>

// ✅ REQUIRED - Use design tokens
<div className="p-4 text-gray-900 bg-primary-600 rounded-lg">
```

### Project Structure Notes

**New Files to Create:**
```
frontend/src/
├── tokens/
│   ├── colors.ts       # Primary, accent, gray, semantic colors
│   ├── typography.ts   # Font family and type scale
│   ├── spacing.ts      # 8px base spacing scale
│   ├── radius.ts       # Border radius definitions
│   ├── shadows.ts      # Elevation shadows
│   └── index.ts        # Re-exports all tokens
├── lib/
│   └── utils.ts        # cn() utility (verify exists)
└── app/
    └── globals.css      # CSS variables update
```

**Configuration Files to Update:**
```
frontend/
├── tailwind.config.ts  # Create/extend with theme configuration
└── app/
    └── globals.css      # Update CSS variables
```

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - Story creation phase.

### Completion Notes List

Initial story creation - ready for development.

### File List

**Files to Create:**
- `/src/tokens/colors.ts`
- `/src/tokens/typography.ts`
- `/src/tokens/spacing.ts`
- `/src/tokens/radius.ts`
- `/src/tokens/shadows.ts`
- `/src/tokens/index.ts`
- `/tailwind.config.ts` (if not exists)

**Files to Modify:**
- `/src/app/globals.css`
- `/src/lib/utils.ts` (verify cn utility exists)

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR1-3: Design System Requirements)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Design Token Implementation section)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (Design Tokens section)
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md` (Design System Rules, Anti-Patterns)
- **Brainstorming:** `_bmad-output/analysis/brainstorming-session-2026-01-24.md` (Color Palette, Typography, Spacing)

---

**Next Steps:**
1. Run `dev-story` workflow to implement this story
2. Run `code-review` after implementation is complete
3. Mark story as `done` and proceed to Story 1.2 (Base Button Component)

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Created

| File | Description |
|------|-------------|
| `frontend/src/tokens/colors.ts` | Primary (Indigo), Accent (Teal), Gray, Semantic colors |
| `frontend/src/tokens/typography.ts` | Inter font, complete type scale (Display → Caption) |
| `frontend/src/tokens/spacing.ts` | 8px base spacing system (0-24 scale) |
| `frontend/src/tokens/radius.ts` | Border radius (4px base unit) |
| `frontend/src/tokens/shadows.ts` | Material Design 3 elevation shadows |
| `frontend/src/tokens/index.ts` | Central exports, complete tokens object |
| `frontend/tailwind.config.ts` | TailwindCSS 4 theme configuration with token imports |

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/app/globals.css` | Migrated OKLCH → RGB hex, added Indigo/Teal colors, CSS variables |
| `frontend/src/app/layout.tsx` | Replaced Geist fonts with Inter and JetBrains Mono |

### Build Verification

✅ Build successful: `npm run build` passes with 20 static routes generated
✅ All design tokens available as Tailwind utilities
✅ CSS variables defined for runtime access

### Design Token Usage Examples

```tsx
// Colors
<div className="bg-primary-600 text-white">       // Indigo primary
<div className="bg-accent-500 text-white">        // Teal accent
<div className="text-semantic-success">           // Green status

// Typography
<h1 className="text-display font-sans">           // 48px Inter
<p className="text-body font-sans">               // 16px Inter

// Spacing
<div className="p-4">                             // 16px
<div className="gap-6">                           // 24px

// Border radius
<div className="rounded-lg">                      // 12px
<button className="rounded-full">                 // 9999px

// Shadows
<div className="shadow-md">                       // Medium elevation
<div className="shadow-lg">                       // Large elevation
```
