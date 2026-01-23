'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCategories } from '@/hooks/usePosts';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/post';
import { useCreateCategory, useUpdateCategory } from '@/hooks/usePosts';
import { Loader2 } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters').optional().or(z.literal('')),
  description: z.string().optional(),
  parent_id: z.number().optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format (e.g., #FF0000)').optional().or(z.literal('')),
  display_order: z.number().optional(),
  show_in_menu: z.boolean().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryForm({ open, onClose, category }: CategoryFormProps) {
  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(category?.id || 0);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || undefined,
      icon: category.icon || '',
      color: category.color || '',
      display_order: category.display_order,
      show_in_menu: category.show_in_menu,
    } : {
      name: '',
      slug: '',
      description: '',
      parent_id: undefined,
      icon: '',
      color: '',
      display_order: 0,
      show_in_menu: true,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    const description = data.description || undefined;
    const icon = data.icon || undefined;
    const color = data.color || undefined;
    // Convert NaN (from empty select value) to undefined for root category
    const parent_id = data.parent_id && !isNaN(data.parent_id) ? data.parent_id : undefined;

    if (category) {
      const payload: UpdateCategoryRequest = {
        name: data.name,
        slug,
        description,
        parent_id: parent_id,
        icon,
        color,
        display_order: data.display_order,
        show_in_menu: data.show_in_menu,
      };
      await updateCategory.mutateAsync(payload);
    } else {
      const payload: CreateCategoryRequest = {
        name: data.name,
        slug,
        description,
        parent_id: parent_id,
        icon,
        color,
        display_order: data.display_order,
        show_in_menu: data.show_in_menu,
      };
      await createCategory.mutateAsync(payload);
    }
    onClose();
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Create Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <Input {...form.register('name')} placeholder="Category name" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Slug</label>
            <Input {...form.register('slug')} placeholder="category-slug" />
            {form.formState.errors.slug && (
              <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea {...form.register('description')} placeholder="Category description" rows={3} />
          </div>

          <div>
            <label className="text-sm font-medium">Parent Category</label>
            <select
              {...form.register('parent_id', { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">None (Root)</option>
              {categories
                .filter((c) => c.id !== category?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Icon</label>
              <Input {...form.register('icon')} placeholder="folder, book, etc." />
            </div>

            <div>
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  {...form.register('color')}
                  className="w-16 h-10 p-1"
                />
                <Input {...form.register('color')} placeholder="#FF0000" />
              </div>
              {form.formState.errors.color && (
                <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Display Order</label>
              <Input
                type="number"
                {...form.register('display_order', { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                {...form.register('show_in_menu')}
                id="show_in_menu"
                className="w-4 h-4"
              />
              <label htmlFor="show_in_menu" className="text-sm">
                Show in menu
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
