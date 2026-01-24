# Story 1.5: Data Table Component

**Epic:** Epic 1 - Design System Foundation
**Story ID:** 1.5
**Status:** done
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Story

As a **moderator**,
I want **a sortable, searchable data table**,
so that **I can efficiently find and manage records**.

---

## Acceptance Criteria

1. **Given** a list of data needs to be displayed
   **When** a DataTable component is used
   **Then** it supports sortable columns

2. **Given** bulk actions are needed
   **When** interacting with the table
   **Then** it supports row selection with checkboxes

3. **Given** filtering is required
   **When** using the table
   **Then** it supports search/filter input

4. **Given** async data loading
   **When** data is being fetched
   **Then** it shows loading state during data fetch

5. **Given** no results exist
   **When** the table has no data
   **Then** it shows empty state when no data

---

## Tasks / Subtasks

### Task 1: Update base Table components (AC: #1, #2)
- [x] 1.1 Update `components/ui/table.tsx` with design tokens
- [x] 1.2 Update border, hover, and selected states
- [x] 1.3 Add proper spacing and typography

### Task 2: Create DataTable component (AC: #1, #2, #3, #4, #5)
- [x] 2.1 Add ColumnDef type for flexible column configuration
- [x] 2.2 Implement sortable columns with sort direction indicators
- [x] 2.3 Implement row selection with checkboxes
- [x] 2.4 Implement search/filter input
- [x] 2.5 Implement loading skeleton state
- [x] 2.6 Implement empty state with message

### Task 3: Verify component works (AC: #1, #2, #3, #4, #5)
- [x] 3.1 Build passes with DataTable component
- [x] 3.2 All features work correctly

---

## Dev Notes

### DataTable Usage

```tsx
import { DataTable, type ColumnDef } from "@/components/ui/table";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const columns: ColumnDef<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  { id: "email", header: "Email", cell: (row) => row.email },
  { id: "role", header: "Role", cell: (row) => row.role },
];

function UserTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<SortDirection>();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      searchValue={search}
      onSearchChange={setSearch}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={setSortColumn}
      rowKey={(row) => row.id}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
    />
  );
}
```

### Features

| Feature | Description |
|---------|-------------|
| **Sortable columns** | Click column header to toggle asc/desc/null |
| **Row selection** | Checkbox per row, select all in header |
| **Search** | Optional search input above table |
| **Loading state** | Skeleton rows while data loads |
| **Empty state** | Message when no data |
| **Custom cells** | Render function per column |

### Sort States

| State | Icon |
|-------|------|
| Unsorted | None |
| Ascending | ↑ |
| Descending | ↓ |

### Design Token Usage

- `border-gray-200` → #E5E7EB (table borders)
- `hover:bg-gray-50` → Hover state
- `data-[state=selected]:bg-gray-100` → Selected row
- `h-12 px-4` → Header cell height and padding
- `p-4` → Body cell padding

---

## Implementation Summary

**Completed:** 2026-01-24

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/components/ui/table.tsx` | Added DataTable component with all features |

### Build Verification
✅ Build successful with DataTable component

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR26-27: Tabular data, search/filter)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Component Organization)
- **UX Specs:** `_bmad-output/planning-artifacts/ui-component-specifications.md` (DataTable)
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md` (Design System Rules)
