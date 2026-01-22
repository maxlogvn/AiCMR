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
import type { Tag, CreateTagRequest, UpdateTagRequest } from '@/types/post';
import { useCreateTag, useUpdateTag } from '@/hooks/usePosts';
import { Loader2, Palette } from 'lucide-react';

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be less than 50 characters').optional().or(z.literal('')),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format (e.g., #FF0000)').optional().or(z.literal('')),
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagFormProps {
  open: boolean;
  onClose: () => void;
  tag?: Tag | null;
}

const colorPresets = [
  '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4',
  '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#6B7280',
];

export function TagForm({ open, onClose, tag }: TagFormProps) {
  const createTag = useCreateTag();
  const updateTag = useUpdateTag(tag?.id || 0);

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag ? {
      name: tag.name,
      slug: tag.slug,
      description: tag.description || '',
      color: tag.color || '',
    } : {
      name: '',
      slug: '',
      description: '',
      color: '',
    },
  });

  const onSubmit = async (data: TagFormData) => {
    const payload: CreateTagRequest | UpdateTagRequest = {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description || undefined,
      color: data.color || undefined,
    };

    if (tag) {
      await updateTag.mutateAsync(payload);
    } else {
      await createTag.mutateAsync(payload);
    }
    onClose();
  };

  const isPending = createTag.isPending || updateTag.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <Input {...form.register('name')} placeholder="Tag name" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Slug</label>
            <Input {...form.register('slug')} placeholder="tag-slug" />
            {form.formState.errors.slug && (
              <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea {...form.register('description')} placeholder="Tag description" rows={2} />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color
            </label>
            <div className="space-y-2">
              {/* Color Presets */}
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => form.setValue('color', color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      form.watch('color') === color
                        ? 'border-gray-900 dark:border-white scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Custom Color */}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {tag ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
