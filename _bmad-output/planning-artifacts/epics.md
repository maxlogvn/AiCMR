---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics-approved', 'step-03-create-stories-complete', 'step-04-final-validation-complete']
workflowType: 'epics'
status: 'complete'
completedAt: '2026-01-25'
inputDocuments:
  - "D:\\code\\AiCMR\\_bmad-output\\planning-artifacts\\prd.md"
  - "D:\\code\\AiCMR\\_bmad-output\\planning-artifacts\\architecture.md"
  - "D:\\code\\AiCMR\\_bmad-output\\planning-artifacts\\ui-component-specifications.md"
  - "D:\\code\\AiCMR\\_bmad-output\\planning-artifacts\\project-context.md"
  - "D:\\code\\AiCMR\\_bmad-output\\analysis\\brainstorming-session-2026-01-24.md"
project_name: "AiCMR"
user_name: "DamodTeam"
date: "2026-01-24"
---

# AiCMR - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for AiCMR, decomposing the requirements from the PRD, UX Design, and Architecture decisions into implementable stories.

**Project Type:** Brownfield UI/UX Redesign
**Scope:** Frontend design system implementation with minimal backend changes

---

## Requirements Inventory

### Functional Requirements (34 Total)

#### Design System (FR1-3)
- **FR1:** System provides consistent visual design tokens (colors, typography, spacing, shadows)
- **FR2:** System provides reusable UI components following design tokens
- **FR3:** System ensures component style consistency regardless of context

#### Navigation (FR4-7)
- **FR4:** Users navigate via persistent sidebar (Home, Blog, Dashboard, Profile)
- **FR5:** System shows/hides navigation items based on user rank
- **FR6:** Users access current page location via breadcrumb
- **FR7:** Users navigate to login/signup from public pages

#### Authentication & Onboarding (FR8-11)
- **FR8:** Guests create account via signup form (name, email, username, password)
- **FR9:** Guests sign in via login form (email/username, password)
- **FR10:** System sends email verification for registration
- **FR11:** New users receive onboarding notification on first login

#### Content Management (FR12-19)
- **FR12:** Editors+ create posts with title, content, category, tags, thumbnail
- **FR13:** Editors+ save posts as draft before publishing
- **FR14:** Editors+ publish posts with confirmation dialog
- **FR15:** Moderators+ view posts in data table (status, author, date)
- **FR16:** Moderators+ filter posts by status, category, author, date
- **FR17:** Moderators+ select multiple posts for bulk actions
- **FR18:** Moderators+ receive confirmation before destructive bulk actions
- **FR19:** System displays success notification after content actions

#### Content Discovery - Public (FR20-23)
- **FR20:** Guests view blog listing with post cards (title, excerpt, thumbnail, meta)
- **FR21:** Guests click card to view full post detail
- **FR22:** Guests view author info, date, tags on post detail
- **FR23:** System renders blog pages with SSR for SEO

#### Dashboard & Analytics (FR24-25)
- **FR24:** Logged-in users view dashboard with statistics cards
- **FR25:** System displays rank-appropriate statistics

#### Data Display & Interaction (FR26-29)
- **FR26:** System displays tabular data with sortable columns
- **FR27:** Users search within data tables
- **FR28:** Users view status indicators with visual badges
- **FR29:** Users view rank badges with visual distinction

#### Feedback & Communication (FR30-32)
- **FR30:** System displays toast notifications for action confirmations
- **FR31:** System displays validation error messages
- **FR32:** System displays loading indicators during async operations

#### File Operations (FR33-34)
- **FR33:** Editors+ upload thumbnail images with progress indication
- **FR34:** System previews uploaded images immediately after selection

---

### Non-Functional Requirements (17 Total)

#### Performance (NFR-PERF-001 to 005)
- **NFR-PERF-001:** Page initial load ≤ 3s on standard broadband (4G mobile)
- **NFR-PERF-002:** User actions provide visual feedback within 100ms
- **NFR-PERF-003:** Lighthouse Performance score ≥ 85 for public pages
- **NFR-PERF-004:** First Contentful Paint ≤ 2s for blog pages
- **NFR-PERF-005:** Time to Interactive ≤ 5s for dashboard

#### Accessibility (NFR-A11Y-001 to 006)
- **NFR-A11Y-001:** All interactive elements are keyboard navigable
- **NFR-A11Y-002:** Color contrast meets WCAG AA (4.5:1 normal, 3:1 large)
- **NFR-A11Y-003:** Images include alt text or decorative marking
- **NFR-A11Y-004:** Form inputs include visible labels and error messages
- **NFR-A11Y-005:** Focus indicators visible on all interactive elements
- **NFR-A11Y-006:** Lighthouse Accessibility ≥ 85 (MVP), ≥ 90 (Vision)

#### Browser Compatibility (NFR-BR-001 to 005)
- **NFR-BR-001 to 004:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **NFR-BR-005:** Mobile Safari (iOS) and Chrome (Android)

#### Visual Consistency (NFR-VIS-001 to 003)
- **NFR-VIS-001:** All components use design tokens (zero magic values)
- **NFR-VIS-002:** Same component renders identically across pages
- **NFR-VIS-003:** Design tokens defined as CSS variables

---

### Additional Requirements (from Architecture & UX)

#### Technical Architecture Requirements
- **Brownfield approach:** Gradual migration by page/feature, no rewrite
- **Design token implementation:** Hybrid (TailwindCSS config + CSS variables)
- **Component organization:** Layered (ui/layout/feedback/overlays/data-display)
- **State management:** Zustand for client state, TanStack Query for server state
- **No backend changes:** FastAPI/SQLAlchemy/MySQL remain unchanged

#### Design System Specifications
- **Primary colors:** Indigo (#4F46E5), Indigo-50 (#EEF2FF)
- **Accent colors:** Teal (#14B8A6), Teal-50 (#F0FDFA)
- **Typography:** Inter (sans-serif), JetBrains Mono (monospace)
- **Spacing:** 8px base system (0, 4, 8, 12, 16, 24, 32, 48, 64, 96px)
- **Component categories:** 5 layers (ui, layout, feedback, overlays, data-display)

#### Authorization Requirements
- **Rank-based system:** Guest(0) < Member(1-2) < Editor(3-4) < Moderator(5) < Admin(10)
- **Guard components:** Use existing AuthGuard, ModeratorGuard, AdminGuard
- **Navigation visibility:** Based on user rank

#### Rendering Requirements
- **SSR pages:** `/`, `/blog`, `/blog/[slug]` (for SEO)
- **SPA pages:** `/dashboard/*`, `/user/*` (for UX performance)

---

### FR Coverage Map

FR1: Epic 1 - Design tokens definition
FR2: Epic 1 - Reusable UI components
FR3: Epic 1 - Component consistency

FR4: Epic 2 - Persistent sidebar navigation
FR5: Epic 2 - Rank-based navigation visibility
FR6: Epic 2 - Breadcrumb navigation
FR7: Epic 2 - Public navigation to login/signup

FR8: Epic 3 - Guest signup form
FR9: Epic 3 - Guest login form
FR10: Epic 3 - Email verification
FR11: Epic 3 - Onboarding notification

FR12: Epic 4 - Post creation with metadata
FR13: Epic 4 - Save as draft
FR14: Epic 4 - Publish with confirmation

FR15: Epic 5 - View posts in data table
FR16: Epic 5 - Filter posts
FR17: Epic 5 - Bulk selection
FR18: Epic 5 - Bulk action confirmation
FR19: Epic 5 - Success notifications

FR20: Epic 2 - Blog listing with cards
FR21: Epic 2 - Click to view detail
FR22: Epic 2 - Post detail with metadata
FR23: Epic 2 - SSR rendering for SEO

FR24: Epic 5 - Dashboard statistics cards
FR25: Epic 5 - Rank-appropriate stats

FR26: Epic 1 - Tabular data display
FR27: Epic 1 - Table search
FR28: Epic 1 - Status badges
FR29: Epic 1 - Rank badges

FR30: Epic 1 - Toast notifications (base pattern)
FR31: Epic 1 - Validation error messages
FR32: Epic 1 - Loading indicators

FR33: Epic 4 - Image upload with progress
FR34: Epic 4 - Image preview after selection

---

## Epic List

### Epic 1: Design System Foundation
**Goal:** Establish consistent visual experience across all pages through design tokens, base UI components, and feedback patterns.
**FRs covered:** FR1-3, FR26-29, FR30-32
**User Value:** Foundation enabler - provides design tokens and base components used by all other epics

### Epic 2: Public Content Discovery
**Goal:** Enable guests to discover and read blog content with optimized SEO and navigation.
**FRs covered:** FR4-7, FR20-23, FR30-32
**User Value:** Complete public content browsing experience for guests without requiring authentication

### Epic 3: User Authentication & Profile
**Goal:** Enable users to register, login, verify email, and manage their profiles.
**FRs covered:** FR8-11, FR30-32
**User Value:** Complete authentication journey from guest to registered member

### Epic 4: Content Creation
**Goal:** Enable writers to create, edit, save drafts, upload images, and publish content.
**FRs covered:** FR12-14, FR26-29, FR30-32, FR33-34
**User Value:** Complete content creation workflow for writers and editors

### Epic 5: Content Moderation
**Goal:** Enable moderators to review, filter, manage bulk actions, and view statistics.
**FRs covered:** FR15-19, FR24-25, FR26-29, FR30-32
**User Value:** Complete content management and analytics experience for moderators

### Epic 6: Dashboard Visual Redesign
**Goal:** Apply consistent "Stats Page" design patterns across all dashboard pages for visual coherence and improved UX.
**FRs covered:** NFR-VIS-001 to 003 (Visual Consistency)
**User Value:** Modern, cohesive dashboard experience with reduced cognitive load and improved user confidence

---

## Epic 1: Design System Foundation

**Goal:** Establish consistent visual experience across all pages through design tokens, base UI components, and feedback patterns.

**FRs covered:** FR1-3, FR26-29, FR30-32

**Description:** This epic creates the foundational design system that all other epics depend on. It establishes design tokens (colors, typography, spacing), base UI components (buttons, inputs, cards), data display components (tables, badges), and feedback patterns (toasts, loading states, error messages).

### Story 1.1: Design Token Configuration
As a developer,
I want centralized design tokens for colors, typography, and spacing,
So that all components use consistent visual values.

**Acceptance Criteria:**
**Given** the project uses TailwindCSS 4
**When** design tokens are configured
**Then** colors use Indigo (primary #4F46E5) and Teal (accent #14B8A6)
**And** typography uses Inter font with defined type scale
**And** spacing follows 8px base system (0, 4, 8, 12, 16, 24, 32, 48px)
**And** all tokens are defined as CSS variables for runtime access

### Story 1.2: Base Button Component
As a developer,
I want a reusable Button component with variants,
So that all buttons in the app have consistent styling.

**Acceptance Criteria:**
**Given** the design system uses Radix UI primitives
**When** a Button component is created
**Then** it supports variants: primary, secondary, ghost, destructive, outline, link
**And** it supports sizes: sm, md, lg, icon
**And** it uses class-variance-authority for variant management
**And** it accepts asChild prop for composition with Radix Slot

### Story 1.3: Form Input Components
As a user,
I want form inputs with consistent styling and validation states,
So that all forms feel cohesive and provide clear feedback.

**Acceptance Criteria:**
**Given** a user needs to input data
**When** form input components are used
**Then** Input, Textarea, Select, and Checkbox components exist
**And** each component has default, focus, error, and disabled states
**And** error states show red border and error message
**And** focus states show ring indicator
**And** Label component is provided for accessibility

### Story 1.4: Status and Rank Badges
As a user,
I want visual indicators for content status and user rank,
So that I can quickly understand system state.

**Acceptance Criteria:**
**Given** content has status (published, draft, scheduled, archived)
**When** a StatusBadge component displays the status
**Then** each status has distinct color (green, yellow, blue, gray)
**And** badge displays status name and optional icon
**Given** users have rank (Guest, Member, Editor, Moderator, Admin)
**When** a RankBadge component displays the rank
**Then** each rank has distinct visual styling
**And** badge shows rank name and numeric value

### Story 1.5: Data Table Component
As a moderator,
I want a sortable, searchable data table,
So that I can efficiently find and manage records.

**Acceptance Criteria:**
**Given** a list of data needs to be displayed
**When** a DataTable component is used
**Then** it supports sortable columns
**And** it supports row selection with checkboxes
**And** it supports search/filter input
**And** it shows loading state during data fetch
**And** it shows empty state when no data

### Story 1.6: Toast Notification System
As a user,
I want feedback notifications for my actions,
So that I know if my action succeeded or failed.

**Acceptance Criteria:**
**Given** a user performs an action (create, update, delete)
**When** the action completes
**Then** a toast notification appears in corner of screen
**And** success toasts show green styling
**And** error toasts show red styling with error message
**And** toasts auto-dismiss after configurable duration
**And** user can manually dismiss toast

### Story 1.7: Loading Indicators
As a user,
I want visual feedback during async operations,
So that I know the system is working.

**Acceptance Criteria:**
**Given** an async operation is in progress
**When** a loading state is shown
**Then** a Spinner component exists for inline loading
**And** skeleton screens exist for content loading
**And** buttons show loading state when clicked
**And** loading indicators respect the design token colors

### Story 1.8: Card Component
As a user,
I want consistent content containers,
So that related information is visually grouped.

**Acceptance Criteria:**
**Given** content needs to be grouped
**When** a Card component is used
**Then** it supports header, content, and footer sections
**And** it has consistent border radius and shadow
**And** it supports hover elevation effect
**And** it uses design tokens for all styling values

---

## Epic 2: Public Content Discovery

**Goal:** Enable guests to discover and read blog content with optimized SEO and navigation.

**FRs covered:** FR4-7, FR20-23, FR30-32

**Description:** This epic delivers the complete public-facing content experience. Guests can browse the blog listing, read post details, navigate the site, and access login/signup—all without authentication. Pages are server-rendered for optimal SEO.

### Story 2.1: Blog Listing Page
As a guest,
I want to browse all published blog posts,
So that I can discover content that interests me.

**Acceptance Criteria:**
**Given** I am a guest user (not authenticated)
**When** I navigate to `/blog`
**Then** I see a grid of post cards
**And** each card shows thumbnail, title, excerpt, author, date
**And** cards are arranged in responsive grid (2 columns on tablet+)
**And** page is server-rendered for SEO
**And** I can click a card to view full post

### Story 2.2: Blog Post Detail Page
As a guest,
I want to read the full content of a blog post,
So that I can consume the complete article.

**Acceptance Criteria:**
**Given** I click on a blog post card
**When** the post detail page loads
**Then** I see the full post content rendered from markdown
**And** I see cover image at top (if exists)
**And** I see author info with avatar
**And** I see publish date and tags
**And** page is server-rendered for SEO with meta tags
**And** URL follows pattern `/blog/{slug}`

### Story 2.3: Public Navigation Header
As a guest,
I want a consistent navigation header,
So that I can easily move between pages.

**Acceptance Criteria:**
**Given** I am on any public page
**When** I view the navigation header
**Then** I see links to Home and Blog
**And** I see Login and Signup buttons
**And** header remains fixed at top when scrolling
**And** on mobile, menu collapses into hamburger

### Story 2.4: Breadcrumb Navigation
As a user,
I want breadcrumb navigation,
So that I know where I am in the site hierarchy.

**Acceptance Criteria:**
**Given** I am on a nested page
**When** I view the breadcrumb
**Then** I see the path from Home to current page
**And** each segment is clickable
**And** current page is not clickable
**And** separator uses chevron icon
**And** breadcrumb appears below header

### Story 2.5: Public Footer
As a guest,
I want a consistent footer with site information,
So that I can find additional resources.

**Acceptance Criteria:**
**Given** I scroll to bottom of any public page
**When** I view the footer
**Then** I see copyright information
**And** I see links to key pages
**And** footer uses design token colors
**And** footer is responsive on mobile

### Story 2.6: SEO Optimization for Public Pages
As a site owner,
I want public pages optimized for search engines,
So that my content ranks well in search results.

**Acceptance Criteria:**
**Given** a public page is rendered
**When** the HTML is generated
**Then** each page has unique title and meta description
**And** blog post detail includes Open Graph tags
**And** images include alt text
**And** page structure uses semantic HTML (article, section, h1-h6)
**And** Lighthouse SEO score is ≥ 90

---

## Epic 3: User Authentication & Profile

**Goal:** Enable users to register, login, verify email, and manage their profiles.

**FRs covered:** FR8-11, FR30-32

**Description:** This epic delivers the complete authentication journey. Guests can register, verify their email, log in, receive onboarding, and manage their profile settings.

### Story 3.1: User Registration
As a guest,
I want to create an account,
So that I can access member-only features.

**Acceptance Criteria:**
**Given** I am a guest user
**When** I navigate to `/register`
**Then** I see a registration form with name, email, username, password fields
**And** all fields have validation (email format, password strength)
**And** I submit valid data
**Then** account is created
**And** verification email is sent
**And** I see confirmation message
**And** I am redirected to login page

### Story 3.2: User Login
As a registered user,
I want to log in to my account,
So that I can access my personalized dashboard.

**Acceptance Criteria:**
**Given** I have a verified account
**When** I navigate to `/login`
**Then** I see login form with email/username and password fields
**And** I can choose "Remember me" option
**When** I submit valid credentials
**Then** I am authenticated
**And** JWT access token is stored in memory
**And** I am redirected to dashboard
**And** I see success toast notification

### Story 3.3: Email Verification
As a newly registered user,
I want to verify my email address,
So that I can activate my account.

**Acceptance Criteria:**
**Given** I have just registered
**When** the system sends a verification email
**Then** email contains a verification link
**And** link contains unique verification token
**When** I click the verification link
**Then** my account is marked as verified
**And** I can now log in
**And** I see confirmation message

### Story 3.4: Onboarding Notification
As a new user on first login,
I want to be welcomed to the platform,
So that I understand what features are available.

**Acceptance Criteria:**
**Given** I have just logged in for the first time
**When** my dashboard loads
**Then** I see a welcome toast notification
**And** toast contains greeting and brief feature overview
**And** toast points me to key actions (create post, view profile)
**And** I can dismiss the notification

### Story 3.5: User Profile Management
As a logged-in user,
I want to update my profile information,
So that my account details are current.

**Acceptance Criteria:**
**Given** I am logged in
**When** I navigate to `/user/profile`
**Then** I see my current profile information (name, email, username)
**And** I can edit name and username
**And** I can upload a new avatar image
**And** I see my current rank (read-only)
**When** I save changes
**Then** profile is updated
**And** I see success toast notification

---

## Epic 4: Content Creation

**Goal:** Enable writers to create, edit, save drafts, upload images, and publish content.

**FRs covered:** FR12-14, FR26-29, FR30-32, FR33-34

**Description:** This epic delivers the complete content creation workflow for writers and editors. Users can create posts with rich content, upload images, save drafts, and publish when ready.

### Story 4.1: Post Editor Layout
As a writer,
I want a clean editor layout,
So that I can focus on writing content.

**Acceptance Criteria:**
**Given** I am an Editor+ (rank ≥ 3)
**When** I navigate to `/user/posts/new`
**Then** I see the post editor layout
**And** title field is at top
**And** main editor area is in center
**And** metadata panel is on left (category, tags, status)
**And** preview panel is on right (desktop only)
**And** layout collapses to single column on mobile

### Story 4.2: Post Metadata Management
As a writer,
I want to set post metadata,
So that my content is properly categorized.

**Acceptance Criteria:**
**Given** I am creating or editing a post
**When** I view the metadata panel
**Then** I can select a category from dropdown
**And** I can add multiple tags (with autocomplete)
**And** I can set post status (Draft, Published, Scheduled)
**And** I can upload a thumbnail image
**And** I can set SEO title and description

### Story 4.3: Rich Text Editor
As a writer,
I want a markdown editor for content,
So that I can write formatted text.

**Acceptance Criteria:**
**Given** I am in the post editor
**When** I type in the content area
**Then** the editor supports markdown syntax
**And** I see a live preview of formatted content
**And** I can insert code blocks, quotes, lists
**And** editor supports keyboard shortcuts
**And** content is auto-saved to draft every 30 seconds

### Story 4.4: Image Upload with Progress
As a writer,
I want to upload images for my post,
So that I can include visual content.

**Acceptance Criteria:**
**Given** I am editing a post
**When** I click the upload button for thumbnail
**Then** file picker opens
**And** I can select image files (jpg, png, webp)
**When** upload is in progress
**Then** I see a progress bar
**And** I see percentage complete
**When** upload completes
**Then** I see a preview of the uploaded image
**And** image URL is saved to post metadata

### Story 4.5: Save as Draft
As a writer,
I want to save my post as a draft,
So that I can continue working on it later.

**Acceptance Criteria:**
**Given** I am writing a post
**When** I click "Save as Draft"
**Then** the post is saved with status "draft"
**And** I see a success toast notification
**And** I can close the editor and return later
**When** I return to drafts
**Then** my draft is in the list with last modified date

### Story 4.6: Publish Post
As a writer,
I want to publish my post,
So that it becomes visible to the public.

**Acceptance Criteria:**
**Given** I have finished writing a post
**When** I click "Publish"
**Then** a confirmation dialog appears
**And** dialog shows post title and asks "Are you sure you want to publish?"
**When** I confirm
**Then** post status changes to "published"
**And** post is visible on `/blog` immediately
**And** I see success toast notification

### Story 4.7: My Posts List
As a writer,
I want to see all my posts,
So that I can manage my content.

**Acceptance Criteria:**
**Given** I am logged in as Editor+
**When** I navigate to `/user/posts`
**Then** I see a list of all posts I created
**And** each post shows title, status, date, views
**And** I can filter by status (All, Draft, Published)
**And** I can click "Edit" to modify a post
**And** I can click "Delete" with confirmation

---

## Epic 5: Content Moderation

**Goal:** Enable moderators to review, filter, manage bulk actions, and view statistics.

**FRs covered:** FR15-19, FR24-25, FR26-29, FR30-32

**Description:** This epic delivers the complete content management and analytics experience for moderators. Users can view all posts, filter and search, perform bulk actions, and view dashboard statistics.

### Story 5.1: Moderator Dashboard Layout
As a moderator,
I want a dashboard with sidebar navigation,
So that I can access all moderation tools.

**Acceptance Criteria:**
**Given** I am a Moderator+ (rank ≥ 5)
**When** I navigate to `/dashboard`
**Then** I see a sidebar on the left (240px width)
**And** sidebar shows navigation items based on my rank
**And** sidebar sections: My Profile, My Posts, All Posts, Categories, Tags, Users, Settings
**And** I see a top bar with breadcrumb and user menu
**And** main content area displays on right

### Story 5.2: All Posts Data Table
As a moderator,
I want to view all posts in the system,
So that I can review and moderate content.

**Acceptance Criteria:**
**Given** I am a Moderator+
**When** I navigate to `/dashboard/posts`
**Then** I see a data table of all posts
**And** table columns: checkbox, title, status, author, date, actions
**And** each row has a checkbox for selection
**And** I can sort by any column
**And** I can search by title or author
**And** table shows pagination (20 posts per page)

### Story 5.3: Post Filtering
As a moderator,
I want to filter posts by status and category,
So that I can focus on specific content.

**Acceptance Criteria:**
**Given** I am viewing the posts table
**When** I click the filter button
**Then** I see filter options for status (All, Draft, Published, Scheduled, Archived)
**And** I see filter options for category (all categories in system)
**And** I see date range picker
**When** I apply filters
**Then** table updates to show matching posts only
**And** I see clear indication of active filters
**And** I can clear all filters with one click

### Story 5.4: Bulk Post Selection
As a moderator,
I want to select multiple posts at once,
So that I can perform actions on many items.

**Acceptance Criteria:**
**Given** I am viewing the posts table
**When** I click the checkbox in table header
**Then** all visible posts are selected
**When** I select individual posts
**Then** I see count of selected posts
**And** bulk action buttons appear (Publish, Archive, Delete)
**And** I can deselect all posts with one click

### Story 5.5: Bulk Publish Action
As a moderator,
I want to publish multiple posts at once,
So that I can efficiently make content live.

**Acceptance Criteria:**
**Given** I have selected multiple draft posts
**When** I click "Publish" bulk action
**Then** a confirmation dialog appears
**And** dialog shows count of posts to be published
**And** dialog asks "Are you sure you want to publish {n} posts?"
**When** I confirm
**Then** all selected posts are published
**And** I see success toast notification with count
**And** table refreshes to show updated status

### Story 5.6: Dashboard Statistics Cards
As a moderator,
I want to see key statistics on my dashboard,
So that I can understand system activity.

**Acceptance Criteria:**
**Given** I am a Moderator+
**When** I navigate to `/dashboard`
**Then** I see statistics cards at top of page
**And** cards show: Total Posts, Published Posts, Draft Posts, Total Users
**And** each card shows trend indicator (↑ or ↓ with percentage)
**And** cards are clickable to view detailed stats
**And** stats are filtered based on my rank

### Story 5.7: Statistics Detail Page
As a moderator,
I want to see detailed analytics,
So that I can make informed decisions.

**Acceptance Criteria:**
**Given** I am a Moderator+
**When** I navigate to `/dashboard/stats`
**Then** I see time range selector (7 days, 30 days, 90 days, All time)
**And** I see line chart of posts created over time
**And** I see breakdown of posts by status
**And** I see top categories by post count
**And** I see top authors by post count
**And** I can export stats as CSV

### Story 5.8: Bulk Delete with Confirmation
As a moderator,
I want to delete multiple posts at once,
So that I can efficiently remove inappropriate content.

**Acceptance Criteria:**
**Given** I have selected multiple posts
**When** I click "Delete" bulk action
**Then** a warning dialog appears with red styling
**And** dialog shows count of posts to be permanently deleted
**And** dialog requires typing "DELETE" to confirm
**When** I confirm
**Then** all selected posts are deleted
**And** I see success toast notification
**And** deleted posts no longer appear in table

---

## Epic 6: Dashboard Visual Redesign

**Goal:** Apply consistent "Stats Page" design patterns across all dashboard pages for visual coherence and improved UX.

**FRs covered:** NFR-VIS-001 to 003 (Visual Consistency)

**Description:** This epic redesigns all dashboard pages (`/posts`, `/categories`, `/tags`, `/users-manager`, `/settings`) to match the modern design patterns established in the `/stats` page. The redesign follows a "Calm but Clear" philosophy with orange accent color, consistent card layouts, empty states, loading skeletons, and responsive mobile-first design.

**Source:** Derived from brainstorming session `brainstorming-session-2026-01-25.md`

---

### Story 6.1: CSS Token Architecture Update

As a developer,
I want semantic CSS tokens for accent colors and dark mode,
So that all dashboard pages use consistent styling.

**Acceptance Criteria:**
**Given** the project uses TailwindCSS 4 with CSS variables
**When** accent tokens are defined
**Then** `--accent` = orange-500 (249 115 22)
**And** `--accent-soft` = orange-400 (251 146 60)
**And** `--accent-gradient` = linear-gradient(to-br, rgb(249 115 22), rgb(234 88 12))
**And** semantic colors exist: `--success`, `--warning`, `--danger`, `--info`
**And** dark mode border variables are defined
**And** all tokens respect WCAG AA contrast requirements

---

### Story 6.2: Unified Page Header Component

As a user,
I want consistent page headers across all dashboard pages,
So that I always know where I am in the system.

**Acceptance Criteria:**
**Given** I am on any dashboard page
**When** I view the page header
**Then** I see a gradient icon container (orange for content, yellow for settings)
**And** I see page title as `text-2xl font-bold tracking-tight`
**And** I see subtitle as `text-sm text-muted-foreground`
**And** settings pages show warning badge "⚠️ Requires Care"
**And** header is responsive (stacks on mobile)

---

### Story 6.3: Enhanced Card Component System

As a developer,
I want reusable card components with hover effects,
So that all content containers feel cohesive.

**Acceptance Criteria:**
**Given** a card component is used
**When** I hover over the card
**Then** border changes to orange-500/30
**And** shadow appears with orange tint
**And** transition is smooth (200ms)
**Given** a card is in "selected" state
**When** I view the card
**Then** border is orange-500/50
**And** background has orange-500/5 tint
**Given** mobile viewport
**When** I view cards
**Then** cards use compact padding (p-4 instead of p-5)

---

### Story 6.4: Empty State Component

As a user,
I want helpful empty states with clear next actions,
So that I know what to do when there's no data.

**Acceptance Criteria:**
**Given** a page has no data to display
**When** I view the empty state
**Then** I see a centered icon container (rounded-full, muted/50 background)
**Then** I see a headline explaining why it's empty
**Then** I see a description with more details
**Then** I see a CTA button to take action
**And** icons are context-specific (📝 for posts, 📂 for categories, 🏷️ for tags, 👥 for users)

---

### Story 6.5: Loading Skeleton Components

As a user,
I want loading states that preview the content structure,
So that I know what's coming and perceive faster load.

**Acceptance Criteria:**
**Given** a page is loading data
**When** I view the skeleton state
**Then** stats cards show skeleton with icon placeholder and value placeholder
**And** card lists show skeleton with rounded image and text lines
**And** skeletons use animate-pulse for smooth animation
**And** skeleton color is muted/50 (not distracting)

---

### Story 6.6: Posts Page Card Layout

As a moderator,
I want posts displayed as cards instead of a dense table,
So that I can scan content more easily on all devices.

**Acceptance Criteria:**
**Given** I am on `/dashboard/posts`
**When** I view the posts list
**Then** each post is displayed as a card (not table row)
**And** card shows: checkbox, thumbnail, title, excerpt, author, views, date, status badge
**And** actions (View, Edit, More) are revealed on hover (desktop)
**And** bulk actions bar appears below stats when posts are selected
**And** selected cards have orange border highlight
**Given** mobile viewport
**When** I view posts
**Then** cards are full-width with stacked content
**And** actions appear in bottom sheet on swipe

---

### Story 6.7: Real-time Search with Debounce

As a moderator,
I want search results to update as I type,
So that I can find posts without pressing Enter.

**Acceptance Criteria:**
**Given** I am viewing the posts page
**When** I type in the search input
**Then** results update after 300ms of no typing
**And** I see a loading indicator during search
**And** search matches title, author, or excerpt
**And** search is case-insensitive
**And** I can clear search with one click

---

### Story 6.8: Adaptive Filter Pills

As a moderator,
I want filter pills on desktop and dropdown on mobile,
So that filtering works well on all devices.

**Acceptance Criteria:**
**Given** I am on desktop viewport
**When** I view the filters
**Then** I see horizontal scrollable pills (status, category, date range)
**And** active pills are orange with close button
**Given** I am on mobile viewport
**When** I view the filters
**Then** I see a "Filters" button that opens a dropdown
**And** I can select multiple filters
**And** I see count of active filters

---

### Story 6.9: Categories Tree View

As a moderator,
I want categories displayed as a tree with dotted connectors,
So that I can see the hierarchy at a glance.

**Acceptance Criteria:**
**Given** I am on `/dashboard/categories`
**When** I view the categories list
**Then** I see a tree structure with dotted line connectors
**And** each node shows folder icon, name, and post count
**And** I can expand/collapse branches
**And** I see drag handles for reordering
**And** selected nodes have orange border

---

### Story 6.10: Tags Grid Layout

As a moderator,
I want tags displayed as minimal grid cards with color badges,
So that I can quickly scan all tags.

**Acceptance Criteria:**
**Given** I am on `/dashboard/tags`
**When** I view the tags list
**Then** I see a responsive grid of cards (3 columns on desktop, 2 on tablet, 1 on mobile)
**And** each card shows tag name, post count, and colored badge
**And** badge uses the tag's assigned color
**And** cards show post actions on hover
**And** empty state prompts me to create first tag

---

### Story 6.11: Users Page with Living Stats

As a moderator,
I want "living" stats cards that update in real-time,
So that I can monitor user activity at a glance.

**Acceptance Criteria:**
**Given** I am on `/dashboard/users-manager`
**When** I view the page header
**Then** I see 3 stats cards: Total Users, New This Week, Online Now
**And** numbers update via real-time subscription
**And** trend indicators show weekly change
**And** cards are clickable to filter user list
**Below the stats**, I see user cards (same layout as posts)
**And** each card shows: avatar, name, username, email, rank badge, status, actions

---

### Story 6.12: Settings Page with Tabbed Navigation

As an admin,
I want settings organized in tabs with clear sections,
So that I can find configuration options quickly.

**Acceptance Criteria:**
**Given** I am on `/dashboard/settings`
**When** I view the page header
**Then** header uses yellow accent (not orange) to indicate "care required"
**And** I see a warning badge "⚠️ Requires Care"
**When** I view the settings navigation
**Then** I see tabs: General, SEO & Social, Upload & Media
**And** active tab has orange border-bottom
**And** clicking tab switches content without page reload
**When** I modify a setting
**Then** I see "Save changes" button become active
**And** I see confirmation dialog before saving

---

### Story 6.13: Dark Mode Refinement

As a user,
I want polished dark mode with proper contrast,
So that I can use the dashboard comfortably at night.

**Acceptance Criteria:**
**Given** I have dark mode enabled
**When** I view any dashboard page
**Then** shadows are replaced by borders (because invisible in dark)
**And** gradient saturation is reduced (less intense)
**And** all text meets WCAG AA contrast (4.5:1 minimum)
**And** orange accents are slightly lighter for visibility
**And** card hover uses overlay instead of shadow

---

### Story 6.14: Smooth Theme Transitions

As a user,
I want smooth transitions when toggling themes,
So that the change feels polished, not jarring.

**Acceptance Criteria:**
**Given** I click the theme toggle button
**When** the theme changes
**Then** transition duration is 200ms
**And** all components transition simultaneously
**And** transition uses CSS `transition-property: background-color, color, border-color`
**And** no content shifts during transition

---

### Story 6.15: Mobile Responsiveness Validation

As a user on mobile device,
I want all dashboard pages to work well on small screens,
So that I can manage content from anywhere.

**Acceptance Criteria:**
**Given** I am on mobile viewport (375px width)
**When** I view any dashboard page
**Then** cards stack vertically with full width
**And** touch targets are minimum 44px (Apple HIG)
**Then** bulk actions are in a bottom sheet
**And** filters are in collapsible dropdown
**And** page headers stack (icon above title)
**And** no horizontal scrolling occurs

---

**Total Stories:** 49 stories across 6 epics (34 previous + 15 new in Epic 6)
