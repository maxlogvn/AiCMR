'use client';

import { useState } from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagList, TagForm, MergeDialog } from '@/components/tag';
import type { Tag } from '@/types/post';

type ViewMode = 'grid' | 'list';

export default function TagsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMergeOpen, setIsMergeOpen] = useState(false);

  const handleCreate = () => {
    setSelectedTag(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your blog tags
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsMergeOpen(true)}>
            Merge Tags
          </Button>
          <Button onClick={handleCreate}>
            + New Tag
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
        >
          <Grid className="w-4 h-4 mr-2" />
          Grid View
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4 mr-2" />
          List View
        </Button>
      </div>

      {/* Content */}
      <TagList
        onCreateTag={handleCreate}
        onEditTag={handleEdit}
        onMergeTags={() => setIsMergeOpen(true)}
      />

      {/* Form Dialog */}
      <TagForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        tag={selectedTag}
      />

      {/* Merge Dialog */}
      <MergeDialog
        open={isMergeOpen}
        onClose={() => setIsMergeOpen(false)}
      />
    </div>
  );
}
