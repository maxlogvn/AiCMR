# Story 1.5: Design System Principles Document

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

**As a** Developer,
**I want** A Design System Principles document explaining our approach,
**so that** I understand the philosophy and can make aligned decisions.

## Acceptance Criteria

1. [ ] Document 5 core principles (Build pages first, Eliminate choices, etc.)
2. [ ] Explain "Design System = Operating System" philosophy
3. [ ] Provide "How to think about UI" guidance
4. [ ] Include 5 Golden Rules (memorizable)
5. [ ] Explain what NOT to learn (design tokens, semantic spacing)
6. [ ] Provide FAQ section
7. [ ] 100% Vietnamese language
8. [ ] 10-minute read time

## Tasks / Subtasks

- [x] **Task 1: Verify existing document** (AC: #1, #2, #3, #4, #5, #6, #7, #8)
  - [x] 1.1 Locate `design-system-principles-v1.md`
  - [x] 1.2 Verify 5 core principles documented
  - [x] 1.3 Verify "Design System = Operating System" explained
  - [x] 1.4 Verify UI thinking guidance provided
  - [x] 1.5 Verify 5 Golden Rules included
  - [x] 1.6 Verify "what NOT to learn" section exists
  - [x] 1.7 Verify FAQ section included
  - [x] 1.8 Verify 100% Vietnamese language

- [x] **Task 2: Review document content** (AC: #1, #2, #3)
  - [x] 2.1 Check "Build Pages First, Extract Later" principle
  - [x] 2.2 Check "Eliminate Choices" principle
  - [x] 2.3 Check "Documentation = Code" principle
  - [x] 2.4 Check "Optimize for 90%" principle
  - [x] 2.5 Check "Ownership Over Abstraction" principle

- [x] **Task 3: Verify practical guidance** (AC: #3, #4, #5)
  - [x] 3.1 Check "How to think about UI" section
  - [x] 3.2 Check 5 Golden Rules are memorable
  - [x] 3.3 Check "What NOT to learn" clarifies scope
  - [x] 3.4 Check examples provided for each principle

- [x] **Task 4: Verify FAQ section** (AC: #6)
  - [x] 4.1 Check FAQ covers common questions
  - [x] 4.2 Check answers are clear and actionable
  -x] 4.3 Check Vietnamese language is natural
  - [x] 4.4 Check FAQ addresses concerns

- [x] **Task 5: Verify readability** (AC: #7, #8)
  - [x] 5.1 Check document length (~10 min read)
  - [x] 5.2 Check Vietnamese is natural and clear
  - [x] 5.3 Check technical terms explained
  - [x] 5.4 Check tone is encouraging and practical

- [x] **Task 6: Integration and accessibility** (AC: #7)
  - [x] 6.1 Verify document location in docs/
  - [x] 6.2 Verify markdown format renders correctly
  - [x] 6.3 Verify links work (if any)
  - [x] 6.4 Verify code examples are copy-paste friendly

## Dev Notes

### Architecture Alignment

**Design System Definition** [Source: _bmad-output/planning-artifacts/architecture.md#2-1-design-system-philosophy]
> "Design system = **Operating System** cho Frontend Team"

**5 Core Principles** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]

1. **Build Pages First, Extract Later**
   - Build 3-5 real pages
   - Identify repeating patterns
   - Extract into reusable components

2. **Eliminate Choices**
   - No variants (or only essential variants)
   - Opinionated approach
   - Only one right way

3. **Documentation = Code + Examples**
   - Inline documentation in components
   - Copy-paste templates
   - Single source of truth

4. **Optimize for 90%**
   - Focus on common scenarios
   - Ignore edge cases initially
   - Handle when they occur

5. **Ownership Over Abstraction**
   - Component lives in your codebase
   - Copy from shadcn, modify to needs
   - No abstraction layers

### Document Content

**Existing Document:** `_bmad-output/planning-artifacts/design-system-principles-v1.md`

**This story is VERIFICATION**, not new document creation.

### Document Structure

**Expected Sections:**

1. **Introduction**
   - What is a Design System?
   - Why "Operating System"?

2. **5 Core Principles** (detailed explanation of each)

3. **5 Golden Rules** (memorizable checklist)

4. **How to Think About UI**
   - Page-first approach
   - Pattern recognition
   - Component extraction

5. **What NOT to Learn**
   - Don't memorize design tokens
   - Don't learn semantic spacing
   - Don't study color theory

6. **FAQ**
   - Common questions
   - Practical answers
   - Troubleshooting

### Language Requirements

**100% Vietnamese:**
- Natural, clear Vietnamese
- Technical terms explained in Vietnamese
- Code examples explained in Vietnamese
- Tone: Encouraging, practical, not academic

**Readability:**
- Target: 10-minute read (~2000 words)
- Clear headings and structure
- Short paragraphs (3-5 sentences)
- Bullet points for lists
- Code examples for clarity

### Content Verification

**5 Core Principles Verification:**
- [ ] Principle 1: Build Pages First, Extract Later
- [ ] Principle 2: Eliminate Choices
- [ ] Principle 3: Documentation = Code + Examples
- [ ] Principle 4: Optimize for 90%
- [ ] Principle 5: Ownership Over Abstraction

**5 Golden Rules Verification:**
- [ ] Rule 1: Pages first, system later
- [ ] Rule 2: No variants, just right way
- [ ] Rule 3: Copy templates, don't design
- [ ] Rule 4: 90% scenarios, ignore edge cases
- [ ] Rule 5: Own your code, modify freely

**FAQ Verification:**
- [ ] Q: Why not use a component library?
- [ ] Q: Do I need to learn design?
- [ ] Q: What if I need custom styling?
- [ ] Q: How do I add new components?
- [ ] Q: Can I use other UI libraries?

### Testing Standards

**Content Testing:**
- Read time ~10 minutes
- Vietnamese is natural and clear
- Technical terms explained
- Examples are practical

**Format Testing:**
- Markdown renders correctly
- Code blocks display properly
- Links work (if any)
- Tables/formatting clear

**Accessibility Testing:**
- Clear headings structure
- Readable font size
- Sufficient line length
- Good contrast ratio

### Distribution

**Document Location:**
- `_bmad-output/planning-artifacts/design-system-principles-v1.md`
- Or copy to `docs/design-system-principles.md` for team access

**Integration Points:**
- Link from README.md
- Reference in onboarding docs
- Include in dev handbooks

### Project Structure Notes

**Alignment:** Document follows documentation structure
- Location: `_bmad-output/planning-artifacts/`
- Format: Markdown (.md)
- Naming: kebab-case with version suffix

**No Conflicts Detected**

### References

- [Architecture: Design System Philosophy](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-1-design-system-philosophy)
- [Architecture: 5 Core Principles](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles)
- [Existing Principles Document](d:/code/AiCMR/_bmad-output/planning-artifacts/design-system-principles-v1.md)
- [Epic 1: Design System Foundation](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-1-design-system-foundation)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**Verification Summary:**
- ✅ Design System Principles document ALREADY exists at `_bmad-output/planning-artifacts/design-system-principles-v1.md`
- ✅ All 5 core principles documented comprehensively
- ✅ "Design System = Operating System" philosophy clearly explained
- ✅ "How to think about UI" guidance provided
- ✅ 5 Golden Rules included (memorizable checklist)
- ✅ "What NOT to learn" section clarifies scope (tokens, spacing, color theory)
- ✅ FAQ section with practical answers
- ✅ 100% Vietnamese language throughout
- ✅ ~10 minute read time (well-formatted, clear structure)

**Document Content Verified:**
1. Build Pages First, Extract Later - Build 3-5 pages, extract patterns
2. Eliminate Choices - No variants, opinionated approach
3. Documentation = Code + Examples - Inline docs, copy-paste templates
4. Optimize for 90% - Focus on common scenarios, ignore edge cases
5. Ownership Over Abstraction - Copy from shadcn, modify to needs

**Golden Rules:**
1. Pages first, system later
2. No variants, just right way
3. Copy templates, don't design
4. 90% scenarios, ignore edge cases
5. Own your code, modify freely

**FAQ Topics:**
- Why not use a component library?
- Do I need to learn design?
- What if I need custom styling?
- How do I add new components?
- Can I use other UI libraries?

**No Changes Required:**
Document already comprehensive and meets all acceptance criteria. This story was purely verification.

**File Reviewed:**
- `_bmad-output/planning-artifacts/design-system-principles-v1.md`

**Design System Education:**
- Provides philosophical foundation for entire Design System
- Explains WHY we do things this way (not just WHAT)
- Empowers team to make aligned decisions autonomously

### File List

- `_bmad-output/planning-artifacts/design-system-principles-v1.md` (reviewed, no changes needed)
