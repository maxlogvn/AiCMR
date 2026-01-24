# Story 1.2: Base Button Component

**Epic:** Epic 1 - Design System Foundation
**Story ID:** 1.2
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **developer**,
I want **a reusable Button component with variants**,
so that **all buttons in the app have consistent styling**.

---

## Acceptance Criteria

1. **Given** the design system uses Radix UI primitives
   **When** a Button component is created
   **Then** it supports variants: primary, secondary, ghost, destructive, outline, link

2. **Given** the design system specifications
   **When** size variants are defined
   **Then** it supports sizes: sm, md, lg, icon

3. **Given** the requirement for variant management
   **When** variants are implemented
   **Then** it uses class-variance-authority for variant management

4. **Given** Radix UI integration requirements
   **When** composition is needed
   **Then** it accepts asChild prop for composition with Radix Slot

---

## Tasks / Subtasks

### Task 1: Create Button component with CVA (AC: #1, #2, #3)
- [x] 1.1 Update existing `components/ui/button.tsx` with CVA variants
- [x] 1.2 Define variant styles: primary, secondary, ghost, destructive, outline, link
- [x] 1.3 Define size styles: sm, md, lg, icon
- [x] 1.4 Add asChild prop for Radix Slot composition
- [x] 1.5 Use design tokens (bg-primary-600, rounded-lg, etc.)

### Task 2: Verify Button component works (AC: #1, #2, #3, #4)
- [x] 2.1 Build passes with updated button component
- [x] 2.2 All variants render correctly
- [x] 2.3 asChild prop works with Radix Slot
- [x] 2.4 Design tokens are properly used

---

## Dev Notes

### Button Component Specifications

**Variants:**
| Variant | Description | Styles |
|---------|-------------|--------|
| primary | Default action | bg-primary-600, white text |
| secondary | Secondary action | bg-secondary, gray text |
| ghost | Minimal styling | transparent, hover effect |
| destructive | Dangerous action | bg-red-600 |
| outline | Border only | border, no background |
| link | Link-style button | text with underline |

**Sizes:**
| Size | Height | Padding |
|------|--------|---------|
| sm | 32px (h-8) | px-3 |
| md | 40px (h-10) | px-4 |
| lg | 48px (h-12) | px-6 |
| icon | 36px | N/A (square) |

**Usage Examples:**
```tsx
// Primary button
<Button>Click me</Button>

// With variant
<Button variant="secondary">Cancel</Button>
<Button variant="destructive">Delete</Button>

// With size
<Button size="lg">Large Button</Button>
<Button size="sm">Small</Button>

// Icon button
<Button size="icon">
  <Icon name="search" />
</Button>

// As link (Radix Slot composition)
<Button asChild>
  <a href="/page">Link Button</a>
</Button>
```

### Dependencies Already Installed
- `@radix-ui/react-slot`: ^1.2.4
- `class-variance-authority`: ^0.7.1

### Design Token Usage
- `bg-primary-600` → Indigo #4F46E5
- `hover:bg-primary-700` → Indigo #4338CA
- `rounded-lg` → 12px border radius
- `focus-visible:ring-primary-600` → Focus ring color

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/components/ui/button.tsx` | Updated with CVA, primary variant, design tokens |

### Key Changes
1. Renamed default variant → primary
2. Updated border-radius to rounded-lg (12px)
3. Added proper focus ring with primary color
4. Ensured all variants use design tokens
5. Added TypeScript interface export

### Build Verification
✅ Build successful with updated button component

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR2: Reusable UI components)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Component Organization)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (Button Component)
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md` (Design System Rules)
