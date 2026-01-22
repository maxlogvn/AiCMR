'use client';

import { useState } from 'react';
import { Search, X, Calendar, Tag as TagIcon, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCategories, useTags } from '@/hooks/usePosts';
import type { PostFilters } from '@/types/post';

interface FilterSidebarProps {
  filters: PostFilters;
  onFiltersChange: (filters: PostFilters) => void;
  onReset?: () => void;
  showStatusFilter?: boolean;
  statusOptions?: Array<{ value: string; label: string }>;
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  onReset,
  showStatusFilter = false,
  statusOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ],
}: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const { data: categories = [] } = useCategories();
  const { data: tagsData } = useTags({ pageSize: 100 });
  const tags = tagsData?.items || [];

  // Filter update handlers
  const updateFilter = (key: keyof PostFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Search with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilter('search', value || undefined);
  };

  // Category toggle
  const toggleCategory = (categoryId: number) => {
    const newCategories = filters.category_id === categoryId ? undefined : categoryId;
    updateFilter('category_id', newCategories);
  };

  // Tag toggle
  const toggleTag = (tagId: number) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    updateFilter('tags', newTags.length > 0 ? newTags : undefined);
  };

  // Date handlers
  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    updateFilter('date_from', value || undefined);
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    updateFilter('date_to', value || undefined);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    onReset?.();
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.category_id ||
    (filters.tags && filters.tags.length > 0) ||
    filters.date_from ||
    filters.date_to ||
    filters.status;

  return (
    <Card className="p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-sm"
          >
            <X className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Status Filter */}
      {showStatusFilter && (
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Status</label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.status === option.value ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() =>
                  updateFilter(
                    'status',
                    filters.status === option.value ? undefined : (option.value as any)
                  )
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          Category
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filters.category_id === category.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => toggleCategory(category.id)}
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
              <Badge variant="secondary" className="ml-auto text-xs">
                {category.post_count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 flex items-center gap-2">
          <TagIcon className="w-4 h-4" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={filters.tags?.includes(tag.id) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleTag(tag.id)}
              style={tag.color ? { borderColor: tag.color } : undefined}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Date Range
        </label>
        <div className="space-y-2">
          <div>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
