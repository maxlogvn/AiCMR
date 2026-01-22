# MVI Content Extraction Principles

## Overview

Step-by-step guide for applying Minimal Viable Information (MVI) principle when extracting content from verbose sources into context files.

## When to Use

- Converting documentation summaries to context
- Harvesting AI-generated session files
- Extracting key concepts from long guides
- Creating reference files from implementation notes

## Prerequisites

- Source content identified and categorized
- Target file structure determined
- MVI size limits understood (<200 lines per file)

## Extraction Process

### Step 1: Identify Core Concept
**Action:** Extract the essential definition in 1-3 sentences
**Example:**
```
Source: 400-line authentication guide
Extract: "JWT-based stateless authentication using signed tokens. 
Server validates signature to trust payload without database lookup."
```

### Step 2: Extract Key Points
**Action:** Identify 3-5 most important characteristics
**Focus on:** What makes this concept unique, critical properties, common patterns
```
- Token has 3 parts: header.payload.signature
- Server verifies signature to trust payload  
- No session storage needed (stateless)
- Tokens expire (include exp claim)
- Store in httpOnly cookie or Authorization header
```

### Step 3: Create Minimal Example  
**Action:** Provide working code <10 lines
**Requirements:** Runnable, demonstrates core concept, no verbose comments
```typescript
// Sign token
const token = jwt.sign({ userId: 123 }, SECRET_KEY, { expiresIn: '1h' });

// Verify token  
const decoded = jwt.verify(token, SECRET_KEY);
console.log(decoded.userId); // 123
```

### Step 4: Add Reference Links
**Action:** Link to original source and related context files
**Purpose:** Enable deep dive without duplicating content
```
Reference: https://jwt.io/introduction
Related: examples/jwt-auth-example.md, errors/auth-errors.md
```

### Step 5: Validate Output
**Action:** Check file meets MVI criteria
**Criteria:** 
- [ ] Core concept 1-3 sentences
- [ ] Key points 3-5 bullets  
- [ ] Example <10 lines
- [ ] Total file <200 lines
- [ ] Scannable in <30 seconds

## Content Categories

### Extract These:
- **Core definitions** - What it is, why it exists
- **Key properties** - Essential characteristics  
- **Common patterns** - Typical usage scenarios
- **Critical gotchas** - Must-know issues
- **Working examples** - Minimal functional code

### Skip These:
- **Implementation details** - Reference docs instead
- **Complete tutorials** - Link to full guides
- **Historical context** - Unless critical to understanding
- **Verbose explanations** - Summarize key points only

## Quality Validation

```markdown
✓ Can concept be understood in 30 seconds?
✓ Are examples immediately usable?
✓ Do references provide path to deeper info?
✓ Is file focused on single concept?
✓ Would busy developer find this useful?
```

## Common Patterns

**Concept Files (50-100 lines):**
- Definition + Key points + Example + References

**Guide Files (80-150 lines):**  
- Overview + Steps + Validation + Troubleshooting

**Error Files (60-120 lines):**
- Symptom + Cause + Solution + Prevention

**Example Files (40-80 lines):**
- Use case + Code + Explanation + Variations

## Reference

- Source: .opencode/context/core/HARVEST_SUMMARY.md
- Related: core/concepts/context-harvesting.md
- Related: core/standards/mvi.md