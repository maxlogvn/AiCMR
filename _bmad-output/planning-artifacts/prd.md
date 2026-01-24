---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments:
  - "D:\\code\\AiCMR\\_bmad-output\\analysis\\brainstorming-session-2026-01-24.md"
  - "D:\\code\\AiCMR\\_bmad-output\\planning-artifacts\\ui-component-specifications.md"
  - "D:\\code\\AiCMR\\docs\\index.md"
  - "D:\\code\\AiCMR\\docs\\technology-stack.md"
  - "D:\\code\\AiCMR\\docs\\api-contracts-frontend.md"
  - "D:\\code\\AiCMR\\docs\\component-inventory-frontend.md"
  - "D:\\code\\AiCMR\\docs\\routing-structure-frontend.md"
  - "D:\\code\\AiCMR\\docs\\api-contracts-backend.md"
  - "D:\\code\\AiCMR\\docs\\data-models-backend.md"
  - "D:\\code\\AiCMR\\docs\\integration-architecture.md"
  - "D:\\code\\AiCMR\\docs\\project-overview.md"
  - "D:\\code\\AiCMR\\docs\\source-tree-analysis.md"
  - "D:\\code\\AiCMR\\docs\\development-guide.md"
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 1
  projectDocsCount: 11
workflowType: 'prd'
classification:
  projectType: web_app
  domain: general
  complexity: low-medium
  projectContext: brownfield
dateCompleted: "2026-01-24"
---

# Product Requirements Document - AiCMR

**Author:** DamodTeam
**Date:** 2026-01-24
**Status:** Complete

## Executive Summary

AiCMR là AI-powered Content Management System với UI/UX redesign hoàn toàn. PRD này định nghĩa requirements cho brownfield project: redesign existing CMS UI với design system thống nhất (Indigo/Teal colors, Inter typography, 8px spacing).

**Product Vision:** CMS với UI liền mạch, không mỗi component một phong cách khác nhau. Design system đảm bảo consistency across 13 pages và 20+ components.

**Target Users:** Guest → Member → Editor → Moderator → Admin (rank-based system)

## Project Classification

- **Project Type:** Web Application (Next.js SPA với App Router)
- **Domain:** General (CMS platform)
- **Complexity:** Low-Medium
- **Project Context:** Brownfield (UI/UX redesign)

## PRD Scope

**INCLUDE:**
- UI/UX redesign hoàn toàn theo brainstorming session
- Design system implementation (Indigo/Teal, Inter typography, 8px spacing)
- 13 pages mockups
- 20+ components với unified style

**EXCLUDE (tách PRD riêng):**
- AI Writing Assistant features
- Backend API changes (trừ khi cần cho UI)

## Success Criteria

### User Success

| Metric | Target |
|--------|--------|
| **Navigation efficiency** | Users find common features trong ≤ 3 clicks |
| **Visual consistency** | Zero style inconsistencies |
| **Mobile usability** | Core flows usable on 375px+ viewport |
| **Task completion** | 90% users complete core tasks without documentation |

### Business Success

| Metric | Target |
|--------|--------|
| **Task completion time** | ↓ 20% so với UI cũ |
| **User complaints** | ↓ 50% tickets "UI confusion" sau 1 tháng |
| **Adoption rate** | 80% active users switch trong 2 tuần |
| **Support reduction** | ↓ 30% "how to" requests sau launch |

### Technical Success

| Metric | Target |
|--------|--------|
| **Design token coverage** | 100% components use tokens |
| **Component consistency** | Zero cross-component style drift |
| **Performance** | Lighthouse ≥ 85 |
| **Browser support** | Chrome, Firefox, Safari, Edge (last 2) |

## User Journeys

### Journey 1: Guest → Member Conversion

**Persona:** Minh - Freelance Writer

**Opening Scene:** Minh tìm AiCMR qua Google search, impressed với content quality, muốn sign up.

**Rising Action:** Scroll xuống footer, tìm link Login → Signup form.

**Climax:** Click "Create Account" → Toast notification "Welcome to AiCMR!" + email verification.

**Resolution:** Verify email → Dashboard appears với rank-appropriate sidebar.

**Requirements:** Visible CTA, simple signup, email verification, onboarding toast.

### Journey 2: Editor - Content Creation

**Persona:** Lan - Content Editor

**Opening Scene:** Opens dashboard, 3 articles to publish, old UI confusing.

**Rising Action:** Click "New Post" → Clean editor layout (Left: metadata, Center: editor, Right: preview).

**Climax:** Write article → Select category → Add tags → Click "Save as Draft" → Green toast confirmation.

**Resolution:** Published status badge appears. "15 minutes instead of 30!"

**Requirements:** Organized editor layout, save draft, publish confirmation, status badges, autocomplete.

### Journey 3: Moderator - Content Management

**Persona:** Tuấn - Community Moderator

**Opening Scene:** 12 posts pending review, no bulk actions in old UI.

**Rising Action:** Navigate to "All Posts" → Data table with checkboxes, filters, search.

**Climax:** Filter "Draft" → Select all 8 → Click "Publish" → Confirmation dialog → Confirm.

**Resolution:** All 8 published, toast confirmation appears. "Efficient!"

**Requirements:** Data table, filters, search, bulk actions, confirmation dialogs, toast notifications.

### Journey 4: Admin - System Configuration

**Persona:** Hùng - System Admin

**Opening Scene:** Needs update site name/logo after rebrand.

**Rising Action:** Click "Settings" (Admin only) → Tabbed interface (General, SEO, Upload).

**Climax:** Upload logo → Progress bar → Preview appears → Enter site name → Click "Save" → Green toast.

**Resolution:** Refresh page → New logo/name visible everywhere. "In control."

**Requirements:** Rank-based navigation, tabbed interface, file upload, form validation, save confirmation.

## Web App Specific Requirements

### Rendering Strategy

- **SSR** cho `/`, `/blog`, `/blog/[slug]` (SEO)
- **SPA** cho `/dashboard/*`, `/user/*` (UX performance)

### Browser Matrix

| Browser | Support |
|---------|----------|
| Chrome, Firefox, Safari, Edge | Last 2 versions ✅ |
| IE11 | Not supported ❌ |

### Responsive Breakpoints

| Mobile | Tablet | Desktop | Wide |
|--------|--------|---------|------|
| 375px+ | 768px+ | 1024px+ | 1440px+ |

### Performance Targets

| Metric | Target |
|--------|--------|
| Initial load | < 3s |
| Time to Interactive | < 5s |
| First Contentful Paint | < 2s |
| Lighthouse Performance | ≥ 85 |
| Lighthouse Accessibility | ≥ 85 (MVP), ≥ 90 (Vision) |

## Project Scoping & Phased Development

### MVP Strategy

**Approach:** Problem-Solving + Experience
**Resources:** 1-2 frontend developers, 2-3 sprints (4-6 weeks)

### MVP - Phase 1 (Core UI)

**Journeys Supported:** Guest→Member, Editor, Moderator
**Capabilities:**
- Design system (tokens, components)
- Sidebar navigation (rank-based)
- Dashboard layout
- Posts list với data table
- Post editor với metadata panel
- Blog listing/detail (SSR)
- Login/Signup pages

### Growth - Phase 2 (Content Management)

- Categories tree view
- Tags grid
- User profile
- Settings page

### Vision - Phase 3 (Polish)

- Mobile responsive
- Loading states/animations
- Error handling/validation
- Full WCAG 2.1 AA

### Risk Mitigation

- **Technical:** Gradual migration, component fallbacks
- **Market:** Beta testing, feedback collection
- **Resource:** MVP focused on high-impact pages

## Functional Requirements

### Design System

- FR1: **System** provides consistent visual design tokens (colors, typography, spacing, shadows)
- FR2: **System** provides reusable UI components following design tokens
- FR3: **System** ensures component style consistency regardless of context

### Navigation

- FR4: **Users** navigate via persistent sidebar (Home, Blog, Dashboard, Profile)
- FR5: **System** shows/hides navigation items based on user rank
- FR6: **Users** access current page location via breadcrumb
- FR7: **Users** navigate to login/signup from public pages

### Authentication & Onboarding

- FR8: **Guests** create account via signup form (name, email, username, password)
- FR9: **Guests** sign in via login form (email/username, password)
- FR10: **System** sends email verification for registration
- FR11: **New users** receive onboarding notification on first login

### Content Management

- FR12: **Editors+** create posts with title, content, category, tags, thumbnail
- FR13: **Editors+** save posts as draft before publishing
- FR14: **Editors+** publish posts with confirmation dialog
- FR15: **Moderators+** view posts in data table (status, author, date)
- FR16: **Moderators+** filter posts by status, category, author, date
- FR17: **Moderators+** select multiple posts for bulk actions
- FR18: **Moderators+** receive confirmation before destructive bulk actions
- FR19: **System** displays success notification after content actions

### Content Discovery (Public)

- FR20: **Guests** view blog listing with post cards (title, excerpt, thumbnail, meta)
- FR21: **Guests** click card to view full post detail
- FR22: **Guests** view author info, date, tags on post detail
- FR23: **System** renders blog pages with SSR for SEO

### Dashboard & Analytics

- FR24: **Logged-in users** view dashboard with statistics cards
- FR25: **System** displays rank-appropriate statistics

### Data Display & Interaction

- FR26: **System** displays tabular data with sortable columns
- FR27: **Users** search within data tables
- FR28: **Users** view status indicators with visual badges
- FR29: **Users** view rank badges with visual distinction

### Feedback & Communication

- FR30: **System** displays toast notifications for action confirmations
- FR31: **System** displays validation error messages
- FR32: **System** displays loading indicators during async operations

### File Operations

- FR33: **Editors+** upload thumbnail images with progress indication
- FR34: **System** previews uploaded images immediately after selection

## Non-Functional Requirements

### Performance

- NFR-PERF-001: Page initial load ≤ 3s on standard broadband (4G mobile)
- NFR-PERF-002: User actions provide visual feedback within 100ms
- NFR-PERF-003: Lighthouse Performance score ≥ 85 for public pages
- NFR-PERF-004: First Contentful Paint ≤ 2s for blog pages
- NFR-PERF-005: Time to Interactive ≤ 5s for dashboard

### Accessibility

- NFR-A11Y-001: All interactive elements are keyboard navigable
- NFR-A11Y-002: Color contrast meets WCAG AA (4.5:1 normal, 3:1 large)
- NFR-A11Y-003: Images include alt text or decorative marking
- NFR-A11Y-004: Form inputs include visible labels and error messages
- NFR-A11Y-005: Focus indicators visible on all interactive elements
- NFR-A11Y-006: Lighthouse Accessibility ≥ 85 (MVP), ≥ 90 (Vision)

### Browser Compatibility

- NFR-BR-001 through 004: Chrome, Firefox, Safari, Edge (last 2 versions)
- NFR-BR-005: Mobile Safari (iOS) and Chrome (Android)

### Visual Consistency

- NFR-VIS-001: All components use design tokens (zero magic values)
- NFR-VIS-002: Same component renders identically across pages
- NFR-VIS-003: Design tokens defined as CSS variables

---

**PRD Completion Date:** 2026-01-24

**Total Functional Requirements:** 34 across 9 capability areas
**Total Non-Functional Requirements:** 17 across 4 categories
