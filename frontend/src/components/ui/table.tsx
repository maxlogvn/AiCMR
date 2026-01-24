/**
 * Table Components
 *
 * Base table components with styling.
 * Includes DataTable with sorting, filtering, selection, loading, and empty states.
 *
 * @see {@link https://ui.shadcn.com/docs/components/table}
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";

// ============================================================================
// BASE TABLE COMPONENTS
// ============================================================================

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-gray-50 border-t font-medium [&>tr]:last:border-b-0 dark:bg-gray-800/50",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-gray-50 data-[state=selected]:bg-gray-100 border-b border-gray-200 transition-colors dark:hover:bg-gray-800/50 dark:data-[state=selected]:dark:bg-gray-800 dark:border-gray-700",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-gray-900 h-12 px-4 text-left align-middle font-semibold whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] dark:text-gray-100",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-gray-500 mt-4 text-sm dark:text-gray-400", className)}
      {...props}
    />
  );
}

// ============================================================================
// DATA TABLE COMPONENT
// ============================================================================

export type SortDirection = "asc" | "desc" | null;

export type ColumnDef<T> = {
  id: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

export interface DataTableProps<T> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Loading state */
  loading?: boolean;
  /** Search value */
  searchValue?: string;
  /** On search change */
  onSearchChange?: (value: string) => void;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Sorting state */
  sortColumn?: string;
  /** Sort direction */
  sortDirection?: SortDirection;
  /** On sort change */
  onSort?: (column: string, direction: SortDirection) => void;
  /** Row key extractor */
  rowKey?: (row: T, index: number) => string | number;
  /** Empty state message */
  emptyMessage?: string;
  /** Selection state */
  selectedRows?: Set<string | number>;
  /** On selection change */
  onSelectionChange?: (selectedRows: Set<string | number>) => void;
  /** Minimum rows for loading skeleton */
  skeletonRows?: number;
}

/**
 * DataTable Component
 *
 * @example
 * const columns: ColumnDef<User>[] = [
 *   { id: "name", header: "Name", cell: (row) => row.name },
 *   { id: "email", header: "Email", cell: (row) => row.email },
 * ];
 *
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   loading={isLoading}
 *   searchValue={search}
 *   onSearchChange={setSearch}
 * />
 */
function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  sortColumn,
  sortDirection,
  onSort,
  rowKey = (_, index) => index,
  emptyMessage = "No data found",
  selectedRows = new Set(),
  onSelectionChange,
  skeletonRows = 5,
}: DataTableProps<T>) {
  const handleSort = (columnId: string) => {
    if (!onSort) return;

    if (sortColumn !== columnId) {
      onSort(columnId, "asc");
    } else if (sortDirection === "asc") {
      onSort(columnId, "desc");
    } else {
      onSort(columnId, null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(new Set(data.map(rowKey)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (key: string | number, checked: boolean) => {
    if (!onSelectionChange) return;
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(key);
    } else {
      newSelection.delete(key);
    }
    onSelectionChange(newSelection);
  };

  const isAllSelected =
    data.length > 0 && selectedRows.size === data.length;
  const isSomeSelected =
    selectedRows.size > 0 && selectedRows.size < data.length;

  // Render sort icon
  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) return null;
    if (sortDirection === "asc") return <span className="ml-1">↑</span>;
    if (sortDirection === "desc") return <span className="ml-1">↓</span>;
    return null;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full">
        {searchValue !== undefined && onSearchChange && (
          <div className="mb-4 flex items-center justify-between">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              disabled
              className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              {onSelectionChange && (
                <TableHead className="w-12">
                  <Checkbox disabled />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={i}>
                {onSelectionChange && (
                  <TableCell>
                    <Checkbox disabled />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="w-full">
        {searchValue !== undefined && onSearchChange && (
          <div className="mb-4 flex items-center justify-between">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-64 rounded-lg border border-gray-200 bg-white px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        )}
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search bar */}
      {searchValue !== undefined && onSearchChange && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-64 rounded-lg border border-gray-200 bg-white px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-700 dark:bg-gray-800"
          />
          {selectedRows.size > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedRows.size} selected
            </span>
          )}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {/* Select all checkbox */}
            {onSelectionChange && (
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  aria-checked={isSomeSelected ? "mixed" : isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  indeterminate={isSomeSelected}
                />
              </TableHead>
            )}
            {/* Column headers */}
            {columns.map((column) => (
              <TableHead key={column.id}>
                {column.sortable && onSort ? (
                  <button
                    onClick={() => handleSort(column.id)}
                    className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                  >
                    {column.header}
                    {renderSortIcon(column.id)}
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const key = rowKey(row, index);
            const isSelected = selectedRows.has(key);

            return (
              <TableRow key={key} data-state={isSelected ? "selected" : undefined}>
                {/* Row checkbox */}
                {onSelectionChange && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      aria-checked={isSelected}
                      onChange={(e) => handleSelectRow(key, e.target.checked)}
                    />
                  </TableCell>
                )}
                {/* Row cells */}
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.cell ? column.cell(row) : String(row[column.id] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  DataTable,
};
