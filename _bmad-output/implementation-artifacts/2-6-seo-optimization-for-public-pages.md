# Story 2.6: SEO Optimization for Public Pages

**Epic:** Epic 2 - Public Content Discovery
**Story ID:** 2.6
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **content creator**,
I want **proper SEO metadata on public pages**,
so that **content is discoverable via search engines**.

---

## Acceptance Criteria

1. **Given** public pages exist
   **When** a page is rendered
   **Then** proper meta tags are included for SEO

2. **Given** blog pages are public
   **When** a blog page is shared
   **Then** Open Graph tags enable proper preview on social media

3. **Given** search engine indexing
   **When** crawlers access the site
   **Then** robots meta allows indexing

---

## Tasks / Subtasks

### Task 1: Add metadata to public layout (AC: #1, #2, #3)
- [x] 1.1 Add title metadata to public layout
- [x] 1.2 Add description metadata to public layout
- [x] 1.3 Add keywords metadata to public layout
- [x] 1.4 Add Open Graph metadata to public layout

### Task 2: Verify root layout metadata (AC: #1, #2, #3)
- [x] 2.1 Root layout has default title and description
- [x] 2.2 Root layout has robots meta tag
- [x] 2.3 Root layout has Open Graph tags
- [x] 2.4 Root layout has Twitter card meta tags

### Task 3: Build verification (AC: #1, #2, #3)
- [x] 3.1 Build passes without errors
- [x] 3.2 Metadata renders correctly

---

## Dev Notes

### Metadata Structure

| Meta Tag | Purpose | Value |
|----------|---------|-------|
| title | Page title | Blog - AiCMR |
| description | Page description | Khám phá các bài viết về y tế... |
| keywords | Search keywords | blog, y tế, sức khỏe, AI... |
| og:title | Open Graph title | Blog - AiCMR |
| og:description | Open Graph description | Khám phá các bài viết... |
| og:type | Open Graph type | website |

### Root Layout Metadata

The root layout (`/app/layout.tsx`) includes:
- Default title: "AiCMR - Hệ thống quản lý hồ sơ y tế tích hợp AI"
- Default description: "AiCMR - Giải pháp quản lý y tế thông minh..."
- Robots: "index, follow"
- Open Graph tags for social sharing
- Twitter card tags

### Public Layout Metadata

The public layout (`/app/(public)/layout.tsx`) includes:
- Blog-specific title and description
- Keywords for blog content
- Open Graph tags for blog pages

### Note on SSR and Dynamic Metadata

Current implementation uses client-side rendering for blog pages. Full SEO optimization with dynamic metadata based on post content requires:
1. Converting blog pages to server components
2. Implementing `generateMetadata` function for dynamic routes
3. Fetching post data server-side for metadata generation

This is deferred to a future refactor as it requires significant architectural changes.

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/app/(public)/layout.tsx` | Add metadata export for public pages |

### Build Verification
✅ Build successful with SEO metadata

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR25: SEO optimization)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Next.js App Router)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (SEO Requirements)
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md` (Design System Rules)

---
