# AiCMR Design System - Team Rollout Plan (v1)

**Dành cho:** Tech Lead + Frontend Team
**Thời gian rollout:** 2-3 tuần
**Mục tiêu:** 100% team adoption, consistent UI across all pages

---

## 📋 Rollout Overview

**Strategy:** Gradual adoption with hands-on workshop
- ❌ KHÔNG phải "big bang" migration
- ✅ YES: New pages use design system, old pages migrate gradually
- ❌ KHÔNG blocking features để refactor
- ✅ YES: Ship features first, refactor later

**Timeline:**
- **Week 1:** Workshop + Setup
- **Week 2:** Pilot project (1-2 features)
- **Week 3:** Full rollout + Feedback

---

## 📅 Week 1: Workshop & Setup

### Day 1: Team Alignment Workshop (2 hours)

**Goal:** Align team on design system philosophy

**Agenda:**
1. **Introduction (15 min)**
   - What is design system? (5 min)
   - Why we need it? (5 min)
   - Success criteria (5 min)

2. **Design System Principles (30 min)**
   - "Build pages first → Extract later"
   - "Eliminate Choices"
   - "Optimize for 90%"
   - Discussion + Q&A

3. **Live Demo (30 min)**
   - Create new page from scratch (15 min)
   - Show copy-template workflow (15 min)

4. **Hands-on Exercise (30 min)**
   - Team tạo 1 page mới theo template
   - Pair programming + guidance

5. **Q&A + Next Steps (15 min)**

**Preparation:**
- ✅ Slides prepared (10 slides max)
- ✅ Templates ready (copy-paste examples)
- ✅ Dev environment running (http://localhost:3000)
- ✅ Documentation open (Getting Started guide)

**Materials:**
- [Getting Started Guide](./getting-started-v1.md)
- [Common Patterns Guide](./common-patterns-v1.md)
- [Design System Principles](./design-system-principles-v1.md)

---

### Day 2-3: Individual Setup (2 days)

**Goal:** Mỗi dev có local environment + hiểu basics

**Tasks:**
1. **Setup (30 min)**
   - Clone latest code
   - Run `npm install`
   - Start dev server
   - Verify theme toggle works

2. **Explore (1 hour)**
   - Read Getting Started guide
   - Explore template pages (`/dashboard/posts`, `/user/profile`)
   - Explore components (`/components/ui/`)

3. **Practice (2 hours)**
   - Create test page using LayoutShell
   - Add FormField components
   - Test DataTable component

4. **Questions (30 min)**
   - Ask uncertainties
   - Clarify patterns
   - Document FAQs

**Expected Output:**
- ✅ Mỗi dev có running dev server
- ✅ Mỗi dev tạo được 1 simple page
- ✅ Mỗi dev hiểu copy-template workflow

---

### Day 4-5: Pilot Feature Selection (2 days)

**Goal:** Choose 1-2 features để build with design system

**Criteria:**
- Complexity: Medium (không quá đơn giản, không quá phức tạp)
- Impact: High visibility (user-facing)
- Dependencies: Low (không block trên other teams)

**Examples:**
- ✅ Tag management page (CRUD)
- ✅ User profile edit (form)
- ✅ Settings page (form)
- ❌ Complex dashboard (quá nhiều edge cases)
- ❌ New feature với unclear requirements

**Decision Process:**
1. Team brainstorms features (30 min)
2. Vote on top 3 (15 min)
3. Tech Lead decides final 1-2 (15 min)

---

## 📅 Week 2: Pilot Implementation

### Goal: Build 1-2 features using design system patterns

### Process:

#### Step 1: Planning (1 day)

**For each feature:**
- Break down into pages (listing, create, edit, detail)
- Identify which patterns to use (Pattern 1, 2, 3, etc.)
- Estimate complexity (points or days)
- Assign to developers (1-2 devs per feature)

**Output:**
- Task list với page breakdown
- Pattern selection cho mỗi page
- Timeline estimate

---

#### Step 2: Implementation (3-4 days)

**Workflow:**
1. **Copy template** from Common Patterns guide (30 min)
2. **Modify content** (API calls, fields, labels) (2-4 hours)
3. **Test manually** (browser, dev server) (1 hour)
4. **Code review** (peer review) (30 min)
5. **Fix issues** (1 hour)
6. **Ship** (merge to main) (30 min)

**Daily Standup Questions:**
- What did you build yesterday?
- What will you build today?
- Any blockers with design system?

**Tech Lead Responsibilities:**
- Review every PR (ensure design system compliance)
- Answer questions within 1 hour
- Document new patterns (if emerge)
- Remove blockers

**Expected Output:**
- ✅ 1-2 features shipped
- ✅ All pages use design system components
- ✅ Consistent UI/UX across features

---

#### Step 3: Retrospective (1 day)

**Goal:** Collect feedback, identify issues, iterate

**Format:**
1. **Demo (30 min)**
   - Show what was built
   - Highlight wins
   - Call out pain points

2. **Discussion (1 hour)**
   - What worked well?
   - What didn't work?
   - What patterns are missing?
   - What components need improvement?

3. **Action Items (30 min)**
   - List improvements (priority, assignee)
   - Update documentation (if needed)
   - Plan next iteration

**Output:**
- List of improvements (ranked by priority)
- Updated documentation (if needed)
- Action items (who, what, when)

---

## 📅 Week 3: Full Rollout

### Goal: 100% team adoption for all new features

### Strategy:

#### New Features (Going Forward)

**Rule:**
> **All new features MUST use design system patterns**

**Exceptions:**
- ❌ NO exceptions unless Tech Lead approval
- ✅ If edge case → Document as new pattern
- ✅ If component missing → Build it, add to system

**Code Review Checklist:**
- [ ] Page uses LayoutShell?
- [ ] Forms use FormLayout + FormField?
- [ ] Tables use DataTable?
- [ ] Buttons use 3 variants only (primary, secondary, destructive)?
- [ ] Colors use design tokens (not hard-coded)?
- [ ] Spacing uses scale (gap-4, gap-8, p-6)?

**PR Template:**
```markdown
## Description
Brief description of feature

## Design System Compliance
- [ ] Used LayoutShell for page layout
- [ ] Used FormLayout + FormField for forms
- [ ] Used DataTable for tables
- [ ] Used Button with 3 variants only
- [ ] Used design tokens (no hard-coded colors)
- [ ] Copied from Common Patterns guide

## Screenshots
Attach screenshots

## Testing
- [ ] Manual testing completed
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile
```

---

#### Existing Features (Gradual Migration)

**Priority:** MEDIUM (don't block new features)

**Strategy:**
1. **Low-hanging fruit first** (simple pages)
   - Settings pages
   - Simple listing pages
   - Form pages

2. **Complex pages later** (after team comfortable)
   - Dashboard with complex stats
   - Pages với custom logic
   - Legacy pages

3. **Opportunistic refactoring**
   - When touching old page for bug fix
   - When touching old page for feature add
   - Don't refactor just for sake of it

**Migration Checklist:**
1. Identify pattern (Listing, Form, Detail, etc.)
2. Copy template from Common Patterns
3. Migrate content (fields, API calls, labels)
4. Test functionality (regression testing)
5. Update UI to match design system
6. Ship (merge to main)

**Estimated Timeline:**
- Month 1: Migrate 20% of pages
- Month 2: Migrate 40% of pages
- Month 3: Migrate remaining 40%

---

## 📊 Success Metrics

**Quantitative:**
- ✅ 100% new features use design system
- ✅ 0% hard-coded colors in new code
- ✅ 100% team uses copy-template workflow
- ✅ Avg. time to build page reduced by 50%

**Qualitative:**
- ✅ Team confident building UI features
- ✅ No "UI fear" in team
- ✅ Consistent UI/UX across app
- ✅ Easy onboarding for new devs

**Track weekly:**
- Number of features built with design system
- Number of pages migrated
- Team satisfaction score (1-5)
- Avg. time to build page (hours)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Component X doesn't exist"

**Solution:**
1. Check if component exists in `/components/ui/`
2. If NO → Build it yourself, add to system
3. If YES → Use it, don't create new one
4. Document pattern (if new)

**Examples:**
- Need Badge component → Check `/components/ui/badge.tsx`
- Need Modal component → Check `/components/ui/dialog.tsx`
- Need Tabs component → Check `/components/ui/tabs.tsx`

---

### Issue 2: "Pattern X doesn't fit my use case"

**Solution:**
1. Check Common Patterns guide → 80% chance pattern exists
2. If NO → Copy closest pattern, modify
3. Document as new pattern
4. Share với team

**Don't:**
- ❌ Build from scratch
- ❌ Create custom solution without documenting
- ❌ Repeat what others already solved

**Do:**
- ✅ Ask team first
- ✅ Copy closest pattern
- ✅ Document new pattern

---

### Issue 3: "Design system is too restrictive"

**Solution:**
1. Understand WHY restriction exists (consistency)
2. If legitimate edge case → Discuss với Tech Lead
3. If approved → Add as new pattern/component
4. Update documentation

**Examples:**
- Need 4th button variant → Discuss, maybe add
- Need different spacing → Use scale (gap-12, gap-16)
- Need custom layout → Document as new pattern

---

### Issue 4: "Refactoring old pages is too slow"

**Solution:**
1. Don't refactor all at once (gradual migration)
2. Focus on new features first
3. Refactor old pages when touching them (opportunistic)
4. Month 1-3 timeline is OK

**Remember:**
- ✅ Ship new features with design system
- ✅ Refactor old pages gradually
- ❌ Don't block features for refactoring

---

## 📚 Resources

**Documentation:**
1. [Getting Started Guide](./getting-started-v1.md) - 5 min read
2. [Common Patterns Guide](./common-patterns-v1.md) - 10 min read
3. [Design System Principles](./design-system-principles-v1.md) - 10 min read

**Template Pages:**
- `/dashboard/posts/page.tsx` - Listing page
- `/user/profile/page.tsx` - Detail page
- `/dashboard/categories/page.tsx` - Tree view page

**Components:**
- `/components/ui/button.tsx` - Button component
- `/components/ui/form-field.tsx` - Form field
- `/components/ui/form-layout.tsx` - Form layout
- `/components/ui/data-table.tsx` - Data table
- `/components/ui/layout-shell.tsx` - Page layout

**Support:**
- Tech Lead: [Name/Slack]
- Design System Channel: #frontend-design-system
- Issue Tracker: [GitHub Issues]

---

## 🎯 Checklist: Rollout Complete

**Week 1:**
- [ ] Workshop completed (all devs attended)
- [ ] All devs have running dev environment
- [ ] All devs created 1 test page
- [ ] Pilot features selected

**Week 2:**
- [ ] 1-2 pilot features shipped
- [ ] Retrospective completed
- [ ] Feedback documented
- [ ] Improvements prioritized

**Week 3:**
- [ ] All new features use design system
- [ ] Code review checklist in place
- [ ] PR template created
- [ ] Migration plan for old pages

**Ongoing:**
- [ ] Track metrics weekly
- [ ] Review new patterns monthly
- [ ] Update documentation quarterly
- [ ] Onboard new hires with Getting Started guide

---

## 🎉 Conclusion

**Rollout success = Team adoption, not perfection**

Remember:
- ✅ Focus on new features first
- ✅ Gradual migration for old pages
- ✅ Document patterns as they emerge
- ✅ Iterate based on feedback

**Design system = Living system** - Evolves với team needs.

---

**Document version:** 1.0
**Last updated:** 2026-01-26
**Maintained by:** Frontend Tech Lead

---

*"Consistency > Perfection. Ship first, refine later."*
