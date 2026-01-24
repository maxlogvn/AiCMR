# Story 1.7: Loading Indicators

**Epic:** Epic 1 - Design System Foundation
**Story ID:** 1.7
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **user**,
I want **visual feedback during async operations**,
so that **I know the system is working**.

---

## Acceptance Criteria

1. **Given** an async operation is in progress
   **When** a loading state is shown
   **Then** a Spinner component exists for inline loading

2. **Given** content is being loaded
   **When** content loading is shown
   **Then** skeleton screens exist for content loading

3. **Given** user clicks an action button
   **When** action is processing
   **Then** buttons show loading state when clicked

4. **Given** design system is established
   **When** loading indicators are displayed
   **Then** loading indicators respect the design token colors

---

## Tasks / Subtasks

### Task 1: Create Spinner component (AC: #1, #4)
- [x] 1.1 Create `Spinner` component for inline loading
- [x] 1.2 Support sizes: sm, md, lg
- [x] 1.3 Use primary color from design tokens
- [x] 1.4 Add proper accessibility (aria-label)

### Task 2: Create Skeleton component (AC: #2, #4)
- [x] 2.1 Create `Skeleton` component for content loading
- [x] 2.2 Support variants: text, circular, rectangular
- [x] 2.3 Create `CardSkeleton` for card placeholders
- [x] 2.4 Create `TableSkeleton` for table placeholders

### Task 3: Create LoadingButton component (AC: #3)
- [x] 3.1 Create `LoadingButton` component
- [x] 3.2 Add loading prop to Button
- [x] 3.3 Show spinner inline when loading
- [x] 3.4 Disable button while loading

### Task 4: Update LoadingSpinner (AC: #4)
- [x] 4.1 Update existing `LoadingSpinner` with design tokens
- [x] 4.2 Use primary color for spinner

### Task 5: Verify components work (AC: #1, #2, #3, #4)
- [x] 5.1 Build passes with all loading components
- [x] 5.2 All components render correctly

---

## Dev Notes

### Spinner Usage

```tsx
import { Spinner } from "@/components/ui/LoadingSpinner";

<Spinner />        // Default size
<Spinner size="sm" />  // Small (16px)
<Spinner size="lg" />  // Large (32px)
```

### Skeleton Usage

```tsx
import { Skeleton, CardSkeleton, TableSkeleton } from "@/components/ui/LoadingSpinner";

// Text skeleton
<Skeleton className="h-4 w-32" />

// Circular skeleton (avatar)
<Skeleton variant="circular" className="size-10" />

// Rectangular skeleton (image)
<Skeleton variant="rectangular" className="h-32 w-full" />

// Card skeleton
<CardSkeleton />

// Table skeleton
<TableSkeleton rows={5} columns={4} />
```

### LoadingButton Usage

```tsx
import { LoadingButton } from "@/components/ui/LoadingSpinner";

function SubmitForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await submitForm();
    setIsLoading(false);
  };

  return (
    <LoadingButton loading={isLoading} onClick={handleSubmit}>
      Submit
    </LoadingButton>
  );
}
```

### LoadingSpinner (Full Page) Usage

```tsx
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoadingPage() {
  return <LoadingSpinner />;
}
```

### Component Sizes

| Component | Sizes Available |
|-----------|-----------------|
| Spinner | sm (16px), md (24px), lg (32px) |
| Skeleton | Custom width/height |

### Design Token Usage

- `border-primary-600` / `border-t-primary-600` → Spinner uses primary Indigo color
- `bg-gray-200` / `dark:bg-gray-700` → Skeleton pulse color
- `animate-spin` → Spinner rotation animation
- `animate-pulse` → Skeleton pulse animation

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/components/ui/LoadingSpinner.tsx` | Added Spinner, Skeleton, LoadingButton, CardSkeleton, TableSkeleton |

### Components Created

| Component | Purpose |
|-----------|---------|
| `Spinner` | Inline loading indicator |
| `LoadingSpinner` | Full page loading (existing, updated) |
| `Skeleton` | Content placeholder |
| `LoadingButton` | Button with loading state |
| `CardSkeleton` | Card placeholder |
| `TableSkeleton` | Table placeholder |

### Build Verification
✅ Build successful with all loading components

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR32: Loading indicators)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Component Organization)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (Loading Pattern)
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md` (Design System Rules)
