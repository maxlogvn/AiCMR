'use client';

import { useState } from 'react';
import { Search, Edit2, Trash2, ArrowUpDown, Hash, X } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/dashboard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTags, useGetUnusedTags } from '@/hooks/usePosts';
import postsApi from '@/lib/api-posts';
import type { Tag } from '@/types/post';

type ViewMode = 'grid' | 'list';

interface TagListProps {
  viewMode?: ViewMode;
  onCreateTag?: () => void;
  onEditTag?: (tag: Tag) => void;
  onMergeTags?: () => void;
}

export function TagList({
  viewMode = 'grid',
  onCreateTag,
  onEditTag,
  onMergeTags
}: TagListProps) {
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'post_count' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<'all' | 'unused'>('all');

  const { data: tagsData, isLoading } = useTags({ pageSize: 100 });
  const tags = Array.isArray(tagsData) ? tagsData : (tagsData?.items || []);
  const { data: unusedTags = [] } = useGetUnusedTags(filter === 'unused');
  const queryClient = useQueryClient();

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

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tagToDelete) return;
    setDeleteDialogOpen(false);

    try {
      await postsApi.deleteTag(tagToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success(`Đã xóa thẻ "${tagToDelete.name}"`);
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Không thể xóa thẻ';
      toast.error(message);
    }
    setTagToDelete(null);
  };

  // Color badge style - minimal with color only
  const getColorBadgeStyle = (color: string | null): React.CSSProperties => {
    if (!color) return { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' };
    return { backgroundColor: color, color: '#fff' };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  // Grid view - minimal cards with color badge
  if (viewMode === 'grid') {
    return (
      <>
        {/* Search & Filter Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Tất cả ({tags.length})
              </button>
              <button
                onClick={() => setFilter('unused')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unused'
                    ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Chưa dùng ({unusedTags.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Tìm kiếm tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-md border bg-background pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative w-40">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                className="h-9 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSortBy(s as any);
                  setSortOrder(o as any);
                }}
              >
                <option value="name-asc">Tên (A-Z)</option>
                <option value="name-desc">Tên (Z-A)</option>
                <option value="post_count-desc">Dùng nhiều</option>
                <option value="post_count-asc">Dùng ít</option>
                <option value="created_at-desc">Mới nhất</option>
                <option value="created_at-asc">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags Grid */}
        {displayedTags.length === 0 ? (
          <EmptyState
            icon={Hash}
            title={filter === 'unused' ? 'Không có tag nào chưa dùng' : 'Không tìm thấy tag nào'}
            description={search ? 'Thử từ khóa tìm kiếm khác' : 'Tạo tag đầu tiên để bắt đầu'}
            actionLabel="Tạo tag mới"
            onAction={onCreateTag}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTags.map((tag) => (
              <div
                key={tag.id}
                className="group relative overflow-hidden rounded-lg border bg-card p-5 transition-all duration-200 hover:border-[rgb(var(--card-hover-border))] hover:shadow-lg hover:shadow-[rgb(var(--card-hover-shadow))]"
              >
                {/* Header with color badge and actions */}
                <div className="flex items-start justify-between mb-3">
                  {/* Color badge - minimal style */}
                  {tag.color ? (
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={getColorBadgeStyle(tag.color)}
                    >
                      {tag.name}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {tag.name}
                    </span>
                  )}

                  {/* Actions - hover reveal */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onEditTag?.(tag)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(tag)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                {tag.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {tag.description}
                  </p>
                )}

                {/* Footer with post count */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {tag.post_count} bài viết
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa Thẻ</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa thẻ "{tagToDelete?.name}"? Thao tác này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // List view - compact rows
  return (
    <>
      {/* Search & Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Tìm kiếm tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border bg-background pl-10 pr-10 text-sm outline-none focus:border-orange-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tags List */}
      {displayedTags.length === 0 ? (
        <EmptyState
          icon={Hash}
          title="Không tìm thấy tag nào"
          description="Thử từ khóa tìm kiếm khác hoặc tạo tag mới"
          actionLabel="Tạo tag mới"
          onAction={onCreateTag}
        />
      ) : (
        <div className="space-y-3">
          {displayedTags.map((tag) => (
            <div
              key={tag.id}
              className="group flex items-center gap-4 p-4 rounded-lg border bg-card transition-all hover:border-[rgb(var(--card-hover-border))]"
            >
              {/* Color badge */}
              {tag.color ? (
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
                  style={getColorBadgeStyle(tag.color)}
                >
                  {tag.name}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground shrink-0">
                  {tag.name}
                </span>
              )}

              {/* Description */}
              {tag.description && (
                <p className="flex-1 text-sm text-muted-foreground truncate">
                  {tag.description}
                </p>
              )}

              {/* Post count */}
              <Badge variant="secondary" className="shrink-0">
                {tag.post_count}
              </Badge>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => onEditTag?.(tag)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive"
                  onClick={() => handleDeleteClick(tag)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa Thẻ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thẻ "{tagToDelete?.name}"? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
