# Story 2.5: Public Footer

**Epic:** Epic 2 - Public Content Discovery
**Story ID:** 2.5
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **visitor**,
I want **a consistent footer**,
so that **I can find important links and contact information**.

---

## Acceptance Criteria

1. **Given** the footer exists
   **When** a visitor views any public page
   **Then** the footer displays brand info, quick links, resources, and contact

2. **Given** design system is established
   **When** footer is rendered
   **Then** all colors use design tokens

3. **Given** blog feature is available
   **When** footer is displayed
   **Then** Blog link points to correct route (/blog)

---

## Tasks / Subtasks

### Task 1: Update Footer with design tokens (AC: #1, #2)
- [x] 1.1 Replace `blue-600`, `indigo-600` with `primary-600`
- [x] 1.2 Update logo gradient to use primary-600

### Task 2: Fix Blog link (AC: #3)
- [x] 2.1 Change from `/(public)/blog` to `/blog`

### Task 3: Verify footer content (AC: #1)
- [x] 3.1 Brand section displays correctly
- [x] 3.2 Quick links section displays correctly
- [x] 3.3 Resources section displays correctly
- [x] 3.4 Contact section displays correctly
- [x] 3.5 Social links display correctly
- [x] 3.6 Legal links display correctly

### Task 4: Build verification (AC: #1, #2, #3)
- [x] 4.1 Build passes without errors
- [x] 4.2 Footer renders correctly on all pages

---

## Dev Notes

### Footer Structure

| Section | Content |
|---------|---------|
| Brand | Logo, tagline |
| Quick Links | Trang chủ, Blog, Đăng nhập, Đăng ký |
| Resources | Tài liệu, API, Hỗ trợ, FAQ |
| Contact | Email, phone, location |
| Social | GitHub, Twitter, LinkedIn |
| Legal | Điều khoản, Chính sách, Quyền riêng tư |

### Design Token Usage

- `from-primary-600 to-indigo-600` → Logo gradient
- `text-zinc-400` → Secondary text color
- `hover:text-white` → Link hover state
- `bg-zinc-900` → Footer background

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/components/layout/Footer.tsx` | Use primary-600 tokens, fix Blog link |

### Build Verification
✅ Build successful with updated Footer

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR8: Public site navigation)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Component Organization)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (Footer Component)
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md` (Design System Rules)
- **Epic 1:** `_bmad-output/implementation-artifacts/1-8-card-component.md` (Design System Foundation)

---
