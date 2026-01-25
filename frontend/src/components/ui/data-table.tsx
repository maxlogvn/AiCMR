/**
 * Data Table Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Truyền data và columns
 * 2. Sorting tự động (nếu sortable: true)
 * 3. Row selection (optional)
 * 4. Pagination (optional)
 *
 * Design System Principles:
 * - "Opinionated" - Table style tự động, không cần config
 * - "Optimize for 90%" - Data table cho 90% CMS listing pages
 * - "Eliminate Choices" - Chỉ 1 cách đúng để display table data
 *
 * @example
 * // Basic table
 * <DataTable
 *   data={users}
 *   columns={[
 *     { key: "name", label: "Tên", sortable: true },
 *     { key: "email", label: "Email", sortable: true },
 *     { key: "role", label: "Vai trò" },
 *   ]}
 * />
 *
 * @example
 * // With row selection
 * <DataTable
 *   data={posts}
 *   columns={[
 *     { key: "title", label: "Tiêu đề", sortable: true },
 *     { key: "status", label: "Trạng thái" },
 *   ]}
 *   selectable
 *   selectedIds={selectedIds}
 *   onSelectionChange={setSelectedIds}
 * />
 *
 * @example
 * // With pagination
 * <DataTable
 *   data={categories}
 *   columns={[
 *     { key: "name", label: "Tên", sortable: true },
 *     { key: "slug", label: "Slug" },
 *   ]}
 *   pagination
 *   page={page}
 *   pageSize={pageSize}
 *   totalItems={total}
 *   onPageChange={setPage}
 * />
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface DataTableColumn<T = any> {
  /** Key to access data */
  key: string;
  /** Column header label */
  label: string;
  /** Enable sorting (click header to sort) */
  sortable?: boolean;
  /** Custom cell renderer */
  cell?: (row: T, rowIndex: number) => React.ReactNode;
  /** Column width */
  width?: string;
}

export interface DataTableProps<T = any> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row IDs */
  selectedIds?: (string | number)[];
  /** Selection change callback */
  onSelectionChange?: (ids: (string | number)[]) => void;
  /** Unique key for each row (default: "id") */
  rowKey?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Additional className */
  className?: string;

  // Pagination
  /** Enable pagination */
  pagination?: boolean;
  /** Current page (1-indexed) */
  page?: number;
  /** Page size */
  pageSize?: number;
  /** Total items (for pagination) */
  totalItems?: number;
  /** Page change callback */
  onPageChange?: (page: number) => void;

  // Sorting
  /** Current sort field */
  sortField?: string;
  /** Current sort order */
  sortOrder?: "asc" | "desc" | null;
  /** Sort change callback */
  onSortChange?: (field: string, order: "asc" | "desc" | null) => void;
}

/**
 * Data Table Component
 *
 * Pattern xuất hiện trong: Posts Listing Page, Users Page, Categories Page
 *
 * Reusable data table với:
 * - Sorting (click column header)
 * - Row selection (checkboxes)
 * - Pagination (prev/next buttons)
 * - Empty state (no data)
 * - Loading state (skeleton)
 * - Design tokens (border-border, text-foreground, bg-background)
 *
 * Spacing Scale (Design System):
 * - px-4 = 16px horizontal padding
 * - py-3 = 12px vertical padding
 * - gap-2 = 8px between items
 */
export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  rowKey = "id",
  emptyMessage = "Không có dữ liệu",
  isLoading = false,
  className,
  pagination = false,
  page = 1,
  pageSize = 20,
  totalItems,
  onPageChange,
  sortField,
  sortOrder,
  onSortChange,
}: DataTableProps<T>) => {
  // Handle row selection
  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    const allSelected = data.length > 0 && selectedIds.length === data.length;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((row) => row[rowKey]));
    }
  };

  const handleSelectRow = (rowId: string | number) => {
    if (!onSelectionChange) return;

    const isSelected = selectedIds.includes(rowId);
    if (isSelected) {
      onSelectionChange(selectedIds.filter((id) => id !== rowId));
    } else {
      onSelectionChange([...selectedIds, rowId]);
    }
  };

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!onSortChange) return;

    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    // If clicking the same column, cycle: null -> asc -> desc -> null
    if (sortField === columnKey) {
      if (sortOrder === "asc") {
        onSortChange(columnKey, "desc");
      } else if (sortOrder === "desc") {
        onSortChange(columnKey, null);
      } else {
        onSortChange(columnKey, "asc");
      }
    } else {
      // Clicking new column, start with asc
      onSortChange(columnKey, "asc");
    }
  };

  // Check if all rows are selected
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  // Calculate pagination
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 1;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Loading skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-muted rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-muted">
            <tr>
              {/* Select All Checkbox */}
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-border"
                  />
                </th>
              )}

              {/* Column Headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-foreground",
                    column.sortable && onSortChange && "cursor-pointer hover:bg-muted/80",
                    column.width && `w-[${column.width}]`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortField === column.key && (
                      <span className="text-primary">
                        {sortOrder === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : sortOrder === "desc" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-background divide-y divide-border">
            {data.map((row, rowIndex) => {
              const rowId = row[rowKey];
              const isSelected = selectedIds.includes(rowId);

              return (
                <tr
                  key={rowId}
                  className={cn(
                    "hover:bg-muted/50",
                    isSelected && "bg-muted"
                  )}
                >
                  {/* Row Checkbox */}
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                  )}

                  {/* Cells */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-foreground"
                    >
                      {column.cell
                        ? column.cell(row, rowIndex)
                        : String(row[column.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          {/* Info */}
          {totalItems && (
            <span className="text-sm text-muted-foreground">
              Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} trong số {totalItems} mục
            </span>
          )}

          {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trước
            </Button>
            <span className="text-sm text-foreground px-2">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.displayName = "DataTable";
