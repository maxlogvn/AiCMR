'use client';

import { useState } from 'react';
import { Search, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTags, useGetUnusedTags } from '@/hooks/usePosts';
import { useDeleteTag, useMergeTags } from '@/hooks/usePosts';
import type { Tag } from '@/types/post';
import { TagForm } from './TagForm';

interface TagListProps {
  onCreateTag?: () => void;
  onEditTag?: (tag: Tag) => void;
  onMergeTags?: () => void;
}

export function TagList({ onCreateTag, onEditTag, onMergeTags }: TagListProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'post_count' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<'all' | 'unused'>('all');

  const { data: tagsData } = useTags({ pageSize: 100 });
  const tags = tagsData?.items || [];
  const { data: unusedTags = [] } = useGetUnusedTags(filter === 'unused');

  // Filter and sort
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'post_count') {
      comparison = a.post_count - b.post_count;
    } else if (sortBy === 'created_at') {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const displayedTags = filter === 'unused' ? unusedTags : sortedTags;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tags ({displayedTags.length})</h3>
        <div className="flex gap-2">
          <select
            className="dark:bg-input/30 border-input h-9 w-32 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Tags</option>
            <option value="unused">Unused ({unusedTags.length})</option>
          </select>

          {onMergeTags && (
            <Button variant="outline" size="sm" onClick={onMergeTags}>
              Merge
            </Button>
          )}
          
          <Button size="sm" onClick={onCreateTag}>
            + New Tag
          </Button>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative w-40">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            className="dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent pl-10 pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              setSortBy(s as any);
              setSortOrder(o as any);
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="post_count-desc">Most Used</option>
            <option value="post_count-asc">Least Used</option>
            <option value="created_at-desc">Newest</option>
            <option value="created_at-asc">Oldest</option>
          </select>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedTags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {/* Color Chip */}
            {tag.color && (
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
            )}

            {/* Name & Description */}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{tag.name}</div>
              {tag.description && (
                <div className="text-sm text-gray-500 truncate">{tag.description}</div>
              )}
            </div>

            {/* Post Count */}
            <Badge variant="secondary">{tag.post_count}</Badge>

            {/* Actions */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditTag?.(tag)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {displayedTags.length === 0 && (
        <div className="p-8 text-center text-gray-500 border rounded-lg">
          {filter === 'unused' ? 'No unused tags found.' : 'No tags found.'}
        </div>
      )}
    </div>
  );
}
