# Story 2.3: DataTable Component

Status: ready-for-dev

## Story

**As a** Developer,
**I want** A DataTable component with sorting, selection, and pagination,
**so that** I can build listing pages quickly without reinventing tables.

## Acceptance Criteria

1. [ ] Create `DataTable` component with table + controls
2. [ ] Support sortable columns (click header to sort)
3. [ ] Support row selection (checkboxes)
4. [ ] Support pagination (Prev/Next buttons, page numbers)
5. [ ] Display empty state when no data
6. [ ] Display loading skeleton during fetch
7. [ ] Use design tokens throughout
8. [ ] Add inline documentation with usage examples
9. [ ] Accessible (keyboard navigation, ARIA)

## Tasks / Subtasks

- [ ] **Task 1: Create DataTable structure** (AC: #1, #7)
  - [ ] 1.1 Create `frontend/src/components/ui/data-table.tsx`
  - [ ] 1.2 Define DataTable component wrapper
  - [ ] 1.3 Use shadcn Table as base component
  - [ ] 1.4 Add TypeScript props interfaces
  - [ ] 1.5 Use design tokens for styling

- [ ] **Task 2: Implement columns definition** (AC: #2)
  - [ ] 2.1 Add columns prop (array of column definitions)
  - [ ] 2.2 Support column id, header, accessor, cell renderer
  - [ ] 2.3 Add sortable flag to columns
  - [ ] 2.4 Implement sort state (sortColumn, sortDirection)
  - [ ] 2.5 Display sort indicator icon (↑↓) in header

- [ ] **Task 3: Implement row selection** (AC: #3)
  - [ ] 3.1 Add checkbox column (first column)
  - [ ] 3.2 Support select all checkbox in header
  - [ ] 3.3 Support individual row checkboxes
  - [ ] 3.4 Maintain selected rows state
  - [ ] 3.5 Expose selectedRows to parent

- [ ] **Task 4: Implement pagination** (AC: #4)
  - [ ] 4.1 Add currentPage prop
  - 4.2 Add pageSize prop (rows per page)
  - 4.3 Add totalPages prop
  - [ ] 4.4 Add onPageChange callback
  - [ ] 4.5 Add Prev/Next buttons
  - [ ] 4.6 Add page number display
  - [ ] 4.7 Disable Prev on first page
  - 4.8 Disable Next on last page

- [ ] **Task 5: Implement empty state** (AC: #5)
  - [ ] 5.1 Check if data array is empty
  - [ ] 5.2 Display empty state message
  - [ ] 5.3 Add empty state icon (optional)
  - [ ] 5.4 Style empty state center-aligned

- [ ] **Task 6: Implement loading state** (AC: #6)
  - [ ] 6.1 Add isLoading prop
  - [ ] 6.2 Display loading skeleton when isLoading=true
  - [ ] 6.3 Match table structure (rows × columns)
  - [ ] 6.4 Add shimmer animation

- [ ] **Task 7: Add accessibility** (AC: #9)
  - [ ] 7.1 Use semantic HTML (table, thead, tbody, tr, th, td)
  - [ ] 7.2 Add aria-label to table
  - [ ] 7.3 Add aria-sort to sortable headers
  - [ ] 7.4 Add aria-rowindex to rows
  - [ ] 7.5 Test keyboard navigation

- [ ] **Task 8: Add documentation** (AC: #8)
  - [ ] 8.1 Add file header comment with usage instructions
  - [ ] 8.2 Add basic table example
  - [ ] 8.3 Add sortable table example
  - [ ] 8.4 Add selectable table example
  - [.5 Add paginated table example
  - [ ] 8.6 Add empty/loading state examples
  - [ ] 8.7 Verify Design System principles documented
  - 8.8 Verify Vietnamese language in comments

- [ ] **Task 9: Testing and validation** (AC: #2, #3, #4, #5, #6)
  - [ ] 9.1 Test sorting works (click header)
  - [ ] 9.2 Test row selection works (checkboxes)
  - 9.3 Test pagination works (Prev/Next)
  - 9.4 Test empty state displays
  - [ ] 9.5 Test loading skeleton displays

## Dev Notes

### Architecture Alignment

**Design System Principle: Eliminate Choices** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- No table variants (no compact, bordered, etc.)
- No size variants (only 1 default size)
- Opinionated pagination style

**Design System Principle: Optimize for 90%** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Covers 90% of table use cases (listing, sorting, selection, pagination)
- Ignore edge cases (tree tables, inline editing, etc.)

### Technical Context

**File to Create:** `frontend/src/components/ui/data-table.tsx`

**Dependencies:**
- React (useState, useMemo)
- tanstack/react-query (optional, for data fetching examples)
- shadcn/ui Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Table components
- lucide-react icons (ChevronUp, ChevronsUpDown, ChevronDown)
- Design tokens (spacing, colors, borders)
- Utility function cn for className merging

**Implementation Pattern:**
```tsx
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  sortable?: boolean
  selectable?: boolean
  currentPage?: number
  pageSize?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
  onSelectionChange?: (selectedRows: TData[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sortable = true,
  selectable = false,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
  })

  // Handle selection change
  React.useEffect(() => {
    if (selectable && onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, selectable, onSelectionChange, table])

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {selectable && (
                  <TableHead key="select" className="w-[50px]">
                    <Checkbox
                      checked={table.getIsAllPageRowsSelected()}
                      onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      { context: header.getContext() }
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {selectable && (
                    <TableCell key="select" className="w-[50px]">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        { context: cell.getContext() }
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Component Structure

**DataTable Parts:**
1. **Table** - Main table wrapper with border
2. **TableHeader** - Header row with column names
3. **TableBody** - Body with data rows
4. **TableRow** - Individual rows
5. **TableHead** - Header cells (with sort indicators)
6. **TableCell** - Data cells
7. **Pagination** - Prev/Next controls (bottom)

**Props:**
- `columns` (required) - Array of column definitions
- `data` (required) - Array of data objects
- `sortable` (optional, default: true) - Enable/disable sorting
- `selectable` (optional, default: false) - Enable row selection
- `currentPage` (optional, default: 1) - Current page number
- `pageSize` (optional, default: 10) - Rows per page
- `totalPages` (optional, default: 1) - Total pages
- `onPageChange` (optional) - Callback when page changes
- `isLoading` (optional, default: false) - Show loading skeleton
- `onSelectionChange` (optional) - Callback when selection changes

**Column Definition:**
```typescript
interface ColumnDef<TData, TValue> {
  id: string
  header: string
  accessor: keyof TData | ((row: TData) => TValue)
  cell?: (props: { row: TData; getValue: () => TValue }) => React.ReactNode
}
```

### Usage Examples

**Basic Table:**
```tsx
import { DataTable } from '@/components/ui/data-table'

interface User {
  id: number
  name: string
  email: string
  role: string
}

const columns: ColumnDef<User, string>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
  { id: 'role', header: 'Role', accessor: 'role' },
]

function UsersPage() {
  const [users] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ])

  return (
    <DataTable
      columns={columns}
      data={users}
      selectable={true}
      currentPage={1}
      pageSize={10}
      totalPages={1}
    />
  )
}
```

**Sortable Table:**
```tsx
const [sorting, setSorting] = useState<SortingState>([])

<DataTable
  columns={columns}
  data={users}
  sortable={true}
/>
```

**With Custom Cell Renderer:**
```tsx
const columns: ColumnDef<User, string>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar user={row} />
        <span>{row.name}</span>
      </div>
    ),
  },
  { id: 'email', header: 'Email', accessor: 'email' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editUser(row.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteUser(row.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
```

**With Pagination:**
```tsx
function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [users] = useState<User[]>([])
  const [totalPages, setTotalPages] = useState(5)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Fetch users for page
  }

  return (
    <DataTable
      columns={columns}
      data={users}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}
```

**With Data Fetching (TanStack Query):**
```tsx
import { useQuery } from '@tanstack/react-query'

function UsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: () => fetch(`/api/users?page=${currentPage}`).then(r => r.json()),
  })

  if (isLoading) {
    return <DataTableSkeleton />
  }

  return (
    <DataTable
      columns={columns}
      data={users || []}
      isLoading={isLoading}
    />
  )
}
```

**With Selection:**
```tsx
function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const handleDeleteSelected = () => {
    // Delete selected users
    selectedUsers.forEach(user => deleteUser(user.id))
    setSelectedUsers([])
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        selectable={true}
        onSelectionChange={setSelectedUsers}
      />

      {selectedUsers.length > 0 && (
        <Button
          variant="destructive"
          onClick={handleDeleteSelected}
          className="mb-4"
        >
          Delete {selectedUsers.length} Selected
        </Button>
      )}
    </>
  )
}
```

### Loading Skeleton

**Skeleton Component:**
```tsx
import { Skeleton } from '@/components/ui/skeleton'

function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Skeleton className="h-4 w-4" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-32" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

### Empty State

**Empty State Component:**
```tsx
import { FileQuestion, Inbox } from 'lucide-react'

function DataTableEmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">{message || 'No data found'}</p>
      <p className="text-sm text-muted-foreground">
        Try adjusting your filters or add new data.
      </p>
    </div>
  )
}
```

### Sorting Logic

**Sort Indicators:**
- No sort: No icon
- Ascending: ↑ icon (ChevronUp)
- Descending: ↓ icon (ChevronDown)
- Click header to toggle: none → ascending → descending → none

**Sort Implementation:**
```tsx
const [sorting, setSorting] = useState<SortingState>([])

// Sort data
const sortedData = React.useMemo(() => {
  if (!sorting || sorting.length === 0) return data

  const sorted = [...data]
  const sortColumn = sorting[0]

  sorted.sort((a, b) => {
    const aValue = a[sortColumn.id]
    const bValue = b[sortColumn.id]

    if (aValue < bValue) return sortColumn.desc ? 1 : -1
    if (aValue > bValue) return sortColumn.desc ? -1 : 1
    return 0
  })

  return sorted
}, [data, sorting])
```

### Pagination Logic

**Pagination Controls:**
- Previous button: Disabled on first page
- Next button: Disabled on last page
- Page display: "Page X of Y"

**Implementation:**
```tsx
const handlePrevious = () => {
  if (currentPage > 1) {
    onPageChange(currentPage - 1)
  }
}

const handleNext = () => {
  if (currentPage < totalPages) {
    onPageChange(currentPage + 1)
  }
}
```

### Accessibility Considerations

**Semantic HTML:**
- `<table>` for table wrapper
- `<thead>`, `<tbody>` for sections
- `<tr>` for rows
- `<th>` for headers
- `<td>` for data cells

**ARIA Attributes:**
- `aria-label` on table (description of table content)
- `aria-sort` on sortable headers (ascending/descending/none)
- `aria-rowindex` on rows (row number)
- `aria-selected` on selected rows

**Keyboard Navigation:**
- Tab: Focus through interactive elements
- Enter/Space: Activate buttons
- Arrow keys: Navigate within table (if enhanced)

**Screen Reader:**
- Table caption announced
- Column headers announced
- Sort state announced
- Row selection state announced

### Testing Standards

**Visual Testing:**
- Table displays with correct borders
- Headers display with correct styling
- Rows display with correct spacing
- Sort indicators display correctly

**Functional Testing:**
- Sorting works (click header)
- Selection works (checkboxes)
- Pagination works (Prev/Next buttons)
- Empty state displays when no data
- Loading skeleton displays during fetch

**Accessibility Testing:**
- Screen reader announces table structure
- Keyboard navigation works
- ARIA attributes present
- Focus visible on interactive elements

**Cross-Browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)

### Project Structure Notes

**Alignment:** DataTable follows component structure
- Location: `frontend/src/components/ui/data-table.tsx`
- Naming: kebab-case
- Exports: Named export (DataTable)

**Integration Points:**
- Used in all listing pages (users, posts, categories, tags)
- Works with TanStack Query for data fetching
- Works with Button component for actions
- May need Checkbox component (if not already exists)

**Dependencies:**
- @tanstack/react-table (recommended for table logic)
- @tanstack/react-query (optional, for data fetching)

**Installation Required:**
```bash
npm install @tanstack/react-table
```

### References

- [Architecture: Component Structure](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-3-component-structure)
- [Epic 2: Design System Components](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-2-design-system-components)
- [Story 2.3 in Epics](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#story-23-datatable-component)
- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [shadcn/ui Table](https://ui.shadcn.com/docs/components/table)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**File Created:** None yet - Status: ready-for-dev

**Next Steps:**
1. Install @tanstack/react-table dependency
2. Create data-table.tsx component file
3. Implement sortable columns with sort indicators
4. Implement row selection with checkboxes
5. Implement pagination with Prev/Next buttons
6. Add empty state and loading skeleton
7. Add ARIA attributes and keyboard navigation
8. Add inline Vietnamese documentation

**Dependencies to Install:**
```bash
npm install @tanstack/react-table
```

**Optional Dependencies:**
```bash
npm install @tanstack/react-query  # For data fetching examples
```

### File List

- `frontend/src/components/ui/data-table.tsx` (to be created)
- `frontend/src/components/ui/skeleton.tsx` (may need to create for loading state)
- `frontend/src/components/ui/checkbox.tsx` (may need to create for row selection)

**Integration Notes:**
- DataTable is complex component - consider implementing in multiple iterations
- Start with basic table, then add sorting, selection, pagination incrementally
- Consider creating separate stories for each feature if needed
