# Story 1.4: Status and Rank Badges

**Epic:** Epic 1 - Design System Foundation
**Story ID:** 1.4
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **user**,
I want **visual indicators for content status and user rank**,
so that **I can quickly understand system state**.

---

## Acceptance Criteria

1. **Given** content has status (published, draft, scheduled, archived)
   **When** a StatusBadge component displays the status
   **Then** each status has distinct color (green, yellow, blue, gray)
   **And** badge displays status name and optional icon

2. **Given** users have rank (Guest, Member, Editor, Moderator, Admin)
   **When** a RankBadge component displays the rank
   **Then** each rank has distinct visual styling
   **And** badge shows rank name and numeric value

---

## Tasks / Subtasks

### Task 1: Update base Badge component (AC: #1, #2)
- [x] 1.1 Update `components/ui/badge.tsx` with new variants (success, warning, info)
- [x] 1.2 Add icon prop support
- [x] 1.3 Add ref forwarding for composition

### Task 2: Create StatusBadge component (AC: #1)
- [x] 2.1 Create `components/ui/status-badge.tsx`
- [x] 2.2 Define status types: published, draft, scheduled, archived
- [x] 2.3 Configure colors: published (green), draft (yellow), scheduled (blue), archived (gray)
- [x] 2.4 Add icons for each status

### Task 3: Create RankBadge component (AC: #2)
- [x] 3.1 Create `components/ui/rank-badge.tsx`
- [x] 3.2 Define rank types: 0 (Guest), 1-2 (Member), 3-4 (Editor), 5 (Moderator), 10 (Admin)
- [x] 3.3 Configure variants for each rank level
- [x] 3.4 Add showValue prop for numeric display

### Task 4: Verify components work (AC: #1, #2)
- [x] 4.1 Build passes with all badge components
- [x] 4.2 All variants render correctly

---

## Dev Notes

### StatusBadge Usage

```tsx
import { StatusBadge } from "@/components/ui/status-badge";

<StatusBadge status="published" />  // ✅ Published (green)
<StatusBadge status="draft" />      // ⏳ Draft (yellow)
<StatusBadge status="scheduled" />  // 📅 Scheduled (blue)
<StatusBadge status="archived" />   // 🗑️ Archived (gray)

// Hide icon
<StatusBadge status="published" hideIcon />
```

### RankBadge Usage

```tsx
import { RankBadge } from "@/components/ui/rank-badge";

<RankBadge rank={0} />  // 👤 Guest
<RankBadge rank={1} />  // 👥 Member
<RankBadge rank={5} />  // 🔧 Moderator
<RankBadge rank={10} /> // 👑 Admin

// With numeric value
<RankBadge rank={5} showValue />  // 🔧 Moderator (5)

// Hide icon
<RankBadge rank={10} hideIcon />  // Admin
```

### Status Badge Colors

| Status | Icon | Color | Variant |
|--------|------|-------|---------|
| Published | ✅ | Green | success |
| Draft | ⏳ | Yellow | warning |
| Scheduled | 📅 | Blue | info |
| Archived | 🗑️ | Gray | default |

### Rank Badge Colors

| Rank | Label | Icon | Variant |
|------|-------|------|---------|
| 0 | Guest | 👤 | default (gray) |
| 1-2 | Member | 👥 | default (gray) |
| 3-4 | Editor | ✍️ | info (blue) |
| 5 | Moderator | 🔧 | warning (amber) |
| 10 | Admin | 👑 | destructive (red) |

### Design Token Usage

- `rounded-full` → pill shape
- `bg-emerald-100` / `text-emerald-700` → success (published)
- `bg-amber-100` / `text-amber-700` → warning (draft, moderator)
- `bg-blue-100` / `text-blue-700` → info (scheduled, editor)
- `bg-gray-100` / `text-gray-700` → default (archived, guest, member)
- `bg-red-100` / `text-red-700` → destructive (admin)

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Created

| File | Description |
|------|-------------|
| `frontend/src/components/ui/status-badge.tsx` | Content status badge with 4 states |
| `frontend/src/components/ui/rank-badge.tsx` | User rank badge with 7 levels |

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/components/ui/badge.tsx` | Added success, warning, info variants, icon prop, ref forwarding |

### Build Verification
✅ Build successful with all badge components

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR28-29: Status and Rank badges)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Component Organization)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (StatusBadge, RankBadge)
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md` (Rank System)
