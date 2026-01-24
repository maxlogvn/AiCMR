'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/usePosts';
import { useDeleteCategory } from '@/hooks/usePosts';
import type { Category } from '@/types/post';
import { CategoryForm } from './CategoryForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CategoryTreeProps {
  onCreateCategory?: () => void;
  onEditCategory?: (category: Category) => void;
}

interface CategoryNodeProps {
  category: Category;
  level?: number;
  onEdit?: (category: Category) => void;
  isSelected?: boolean;
  hasSiblingAfter?: boolean;
  isLast?: boolean;
}

function CategoryNode({
  category,
  level = 0,
  onEdit,
  isSelected = false,
  hasSiblingAfter = false,
  isLast = false,
}: CategoryNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const deleteCategory = useDeleteCategory(category.id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      await deleteCategory.mutateAsync();
      toast.success(`Đã xóa chuyên mục "${category.name}"`);
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Không thể xóa chuyên mục';
      toast.error(message);
    }
  };

  return (
    <div className="relative">
      {/* Dotted line connectors for nested levels */}
      {level > 0 && (
        <>
          {/* Horizontal connector line */}
          <div
            className="absolute top-4 left-0 w-4 border-t border-dashed border-gray-300 dark:border-gray-600"
            style={{ left: `${level * 24 - 12}px` }}
          />
        </>
      )}

      {/* Vertical line for parent with children */}
      {hasChildren && expanded && (
        <div
          className="absolute top-10 bottom-0 w-px border-l border-dashed border-gray-300 dark:border-gray-600"
          style={{ left: `${level * 24 + 11}px` }}
        />
      )}

      {/* Node */}
      <div
        className={cn(
          "flex items-center gap-2 py-2.5 px-3 my-1 rounded-lg transition-all",
          "hover:bg-gray-50 dark:hover:bg-gray-800/50",
          "group",
          // Selected state with orange border
          isSelected && "border border-orange-500/50 bg-orange-500/5"
        )}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Folder Icon */}
        <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
          <Folder className="w-4 h-4" />
        </div>

        {/* Name */}
        <span className="flex-1 font-medium text-foreground">{category.name}</span>

        {/* Post Count Badge */}
        <Badge
          variant="secondary"
          className="text-xs"
        >
          {category.post_count} bài
        </Badge>

        {/* Status Badges */}
        {!category.is_active && (
          <Badge variant="outline" className="text-orange-500 border-orange-500/50 text-xs">
            Inactive
          </Badge>
        )}

        {!category.show_in_menu && (
          <Badge variant="outline" className="text-gray-500 border-gray-500/50 text-xs">
            Ẩn
          </Badge>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit?.(category)}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xóa danh mục</DialogTitle>
                <DialogDescription>
                  Bạn có chắc muốn xóa "{category.name}"? Hành động này sẽ gỡ danh mục khỏi tất cả bài viết.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteCategory.isPending}
                >
                  Xóa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="relative">
          {category.children!.map((child, index) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              hasSiblingAfter={index < category.children!.length - 1}
              isLast={index === category.children!.length - 1}
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
    type CategoryNode = Category & { children: Category[] };
    const categoryMap = new Map<number, CategoryNode>(
      flatCategories.map((c) => [c.id, { ...c, children: [] }]),
    );
    const roots: CategoryNode[] = [];

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
    <div className="border rounded-lg bg-card divide-y">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-muted/20">
        <div>
          <h3 className="font-semibold text-foreground">Danh mục phân cấp</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {categories.length} danh mục
          </p>
        </div>
        <Button
          size="sm"
          onClick={onCreateCategory}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          + Tạo mới
        </Button>
      </div>

      {/* Tree Content */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {tree.length === 0 ? (
          <div className="py-12 text-center">
            <Folder className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              Chưa có danh mục nào
            </p>
            <Button
              variant="outline"
              onClick={onCreateCategory}
              className="gap-2"
            >
              <Folder className="h-4 w-4" />
              Tạo danh mục đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-0">
            {tree.map((category) => (
              <CategoryNode
                key={category.id}
                category={category}
                onEdit={onEditCategory}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryTree;
