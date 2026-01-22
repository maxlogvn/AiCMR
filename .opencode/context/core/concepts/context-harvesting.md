# Context Harvesting Workflow

## Core Concept

Automated process to extract valuable knowledge from AI-generated summary files into permanent context storage, then clean workspace to prevent clutter.

## Key Points

- **6-stage workflow** - Scan, analyze, approve, extract, cleanup, report
- **Auto-detection patterns** - Finds summary files by naming conventions
- **MVI extraction** - Applies minimal viable information principle
- **Approval gate** - User confirmation required before any changes
- **Safe cleanup** - Archive originals, don't permanently delete

## Workflow Stages

### Stage 1: Scan
**Purpose:** Find all summary files in workspace
**Patterns:** `*SUMMARY.md`, `*OVERVIEW.md`, `SESSION-*.md`, files >2KB in root

### Stage 2: Analyze  
**Purpose:** Categorize content by function
**Mapping:** Design decisions → concepts/, Solutions → examples/, Steps → guides/, Errors → errors/

### Stage 3: Approve (CRITICAL)
**Purpose:** Present user with letter-based selection UI
**Requirement:** MUST wait for explicit user confirmation before proceeding

### Stage 4: Extract
**Purpose:** Apply MVI minimization to approved content
**Output:** Create/update context files <200 lines each

### Stage 5: Cleanup
**Purpose:** Archive source files safely
**Strategy:** Move to `.tmp/archive/harvested/{date}/` (preserves originals)

### Stage 6: Report
**Purpose:** Show comprehensive operation results
**Content:** Files created, cleanup status, disk space freed

## Minimal Example

```bash
# Execute harvest operation
/context harvest

# System scans workspace → finds 3 summaries
# Shows approval UI with letter options [A] [B] [C]
# User types: "A C" 
# Extracts approved items → permanent context
# Archives source files → .tmp/archive/
# Reports: "2 items harvested, 5.2KB freed"
```

## Content Classification

**Extract (Valuable):**
- Design decisions and rationale
- Working patterns and solutions  
- Error encounters with fixes
- API changes and migration notes

**Skip (Temporary):**
- Planning discussions
- Conversational notes
- TODO lists
- Session metadata

## Safety Features

- **Approval gate** - Never auto-delete without confirmation
- **Archive by default** - Preserve originals for rollback
- **Validation checks** - File size and structure verification
- **Rollback capability** - Can restore from archive

## Reference

- Source: .opencode/context/core/HARVEST_SUMMARY.md
- Related: core/guides/mvi-extraction.md
- Related: core/standards/mvi.md