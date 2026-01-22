'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/usePosts';
import { useDeleteCategory } from '@/hooks/usePosts';
import type { Category } from '@/types/post';
import { CategoryForm } from './CategoryForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/dialog';

interface CategoryTreeProps {
  onCreateCategory?: () => void;
  onEditCategory?: (category: Category) => void;
}

interface CategoryNodeProps {
  category: Category;
  level?: number;
  onEdit?: (category: Category) => void;
}

function CategoryNode({ category, level = 0, onEdit }: CategoryNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const deleteCategory = useDeleteCategory(category.id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setDeleteDialogOpen(false);
    await deleteCategory.mutateAsync();
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Icon */}
        {category.icon && <span className="text-lg">{category.icon}</span>}

        {/* Name */}
        <span className="flex-1 font-medium">{category.name}</span>

        {/* Stats */}
        <Badge variant="secondary">{category.post_count} posts</Badge>

        {/* Status */}
        {!category.is_active && (
          <Badge variant="outline" className="text-orange-500">Inactive</Badge>
        )}

        {!category.show_in_menu && (
          <Badge variant="outline" className="text-gray-500">Hidden</Badge>
        )}

        {/* Actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(category)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{category.name}"? This will remove the category from all posts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleteCategory.isPending}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree({ onCreateCategory, onEditCategory }: CategoryTreeProps) {
  const { data: categories = [] } = useCategories();

  // Build tree structure
  const buildTree = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map(flatCategories.map((c) => [c.id, { ...c, children: [] }]));
    const roots: Category[] = [];

    flatCategories.forEach((category) => {
      const node = categoryMap.get(category.id)!;
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const tree = buildTree(categories);

  return (
    <div className="border rounded-lg divide-y">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Category Tree</h3>
        <Button size="sm" onClick={onCreateCategory}>
          + New Category
        </Button>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {tree.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found. Create your first category.
          </div>
        ) : (
          tree.map((category) => (
            <CategoryNode
              key={category.id}
              category={category}
              onEdit={onEditCategory}
            />
          ))
        )}
      </div>
    </div>
  );
}
