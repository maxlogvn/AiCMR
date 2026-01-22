'use client';

import { useState } from 'react';
import { List, Trees } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryTree, CategoryForm } from '@/components/category';
import type { Category } from '@/types/post';

type ViewMode = 'tree' | 'list';

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your blog categories
          </p>
        </div>

        <Button onClick={handleCreate}>
          + New Category
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'tree' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('tree')}
        >
          <Trees className="w-4 h-4 mr-2" />
          Tree View
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
      {viewMode === 'tree' ? (
        <CategoryTree
          onCreateCategory={handleCreate}
          onEditCategory={handleEdit}
        />
      ) : (
        <div className="p-8 text-center text-gray-500 border rounded-lg">
          List view coming soon
        </div>
      )}

      {/* Form Dialog */}
      <CategoryForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
