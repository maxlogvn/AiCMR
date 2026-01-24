/**
 * SearchInput Component
 *
 * Reusable search input with debounce, loading indicator,
 * and clear button. Used across all dashboard pages.
 *
 * Features:
 * - Real-time search with visual feedback
 * - Loading spinner during search
 * - One-click clear button
 * - Orange accent on focus
 */

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SearchInput Props
 */
export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  /** Current search value */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Called when clear is clicked */
  onClear?: () => void;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Clear button shown when value length >= this */
  clearThreshold?: number;
}

/**
 * SearchInput - Search input with loading and clear
 *
 * @example
 * <SearchInput
 *   value={search}
 *   onChange={setSearch}
 *   isLoading={isSearching}
 *   placeholder="Search posts..."
 * />
 */
export function SearchInput({
  className,
  value,
  onChange,
  onClear,
  isLoading = false,
  clearThreshold = 1,
  placeholder = "Tìm kiếm...",
  type = "search",
  ...props
}: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  const showClear = value.length >= clearThreshold;

  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />

      {/* Input */}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          // Base styles
          "h-9 w-full rounded-md border bg-background pl-10 pr-10",
          // Text styles
          "text-sm outline-none transition-colors",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Focus state with orange accent
          "focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />

      {/* Right side icons container */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Loading Spinner */}
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}

        {/* Clear Button */}
        {showClear && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded p-1 hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Compact search input for smaller spaces
 */
export function SearchInputCompact({
  className,
  value,
  onChange,
  onClear,
  isLoading = false,
  clearThreshold = 1,
  placeholder = "Tìm kiếm...",
  ...props
}: SearchInputProps) {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-8 w-full rounded-md border bg-background pl-8 pr-8",
          "text-sm outline-none transition-colors placeholder:text-muted-foreground",
          "focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20",
          className,
        )}
        {...props}
      />
      {(value?.length >= clearThreshold) && !isLoading && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-muted"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
      {isLoading && (
        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}

export { SearchInput as default };
