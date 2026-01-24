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
import { Loader2, Palette, RefreshCw, Eye, Sparkles, Hash, X, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  slug: z.string().max(50, 'Slug must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.string().optional(),
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagFormProps {
  open: boolean;
  onClose: () => void;
  tag?: Tag | null;
}

// Enhanced color presets with gradients
const colorPresets = [
  { name: 'Coral', value: '#FF6B6B', gradient: 'from-red-400 to-pink-500' },
  { name: 'Orange', value: '#FF8E53', gradient: 'from-orange-400 to-amber-500' },
  { name: 'Amber', value: '#F59E0B', gradient: 'from-amber-400 to-yellow-500' },
  { name: 'Emerald', value: '#10B981', gradient: 'from-emerald-400 to-green-500' },
  { name: 'Teal', value: '#14B8A6', gradient: 'from-teal-400 to-cyan-500' },
  { name: 'Sky', value: '#0EA5E9', gradient: 'from-sky-400 to-blue-500' },
  { name: 'Indigo', value: '#6366F1', gradient: 'from-indigo-400 to-violet-500' },
  { name: 'Violet', value: '#8B5CF6', gradient: 'from-violet-400 to-purple-500' },
  { name: 'Fuchsia', value: '#D946EF', gradient: 'from-fuchsia-400 to-pink-500' },
  { name: 'Rose', value: '#FB7185', gradient: 'from-rose-400 to-red-500' },
  { name: 'Slate', value: '#64748B', gradient: 'from-slate-400 to-gray-500' },
  { name: 'Cyan', value: '#06B6D4', gradient: 'from-cyan-400 to-teal-500' },
];

// Slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function TagForm({ open, onClose, tag }: TagFormProps) {
  const createTag = useCreateTag();
  const updateTag = useUpdateTag(tag?.id || 0);
  const [previewSlug, setPreviewSlug] = useState('');

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
    mode: 'onBlur',
  });

  const nameValue = form.watch('name');
  const slugValue = form.watch('slug');
  const colorValue = form.watch('color');

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue && !slugValue) {
      const generated = slugify(nameValue);
      setPreviewSlug(generated);
    } else if (slugValue) {
      setPreviewSlug(slugValue);
    } else {
      setPreviewSlug('');
    }
  }, [nameValue, slugValue]);

  const generateSlug = () => {
    if (nameValue) {
      form.setValue('slug', slugify(nameValue));
      setPreviewSlug(slugify(nameValue));
    }
  };

  const onSubmit = async (data: TagFormData) => {
    const slug = data.slug || slugify(data.name);
    const description = data.description || undefined;
    const color = data.color || undefined;

    try {
      if (tag) {
        const payload: UpdateTagRequest = {
          name: data.name,
          slug,
          description,
          color,
        };
        await updateTag.mutateAsync(payload);
        toast.success(`Đã cập nhật thẻ "${data.name}"`);
      } else {
        const payload: CreateTagRequest = {
          name: data.name,
          slug,
          description,
          color,
        };
        await createTag.mutateAsync(payload);
        toast.success(`Đã tạo thẻ "${data.name}"`);
      }
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Có lỗi xảy ra';
      toast.error(message);
    }
  };

  const isPending = createTag.isPending || updateTag.isPending;
  const nameError = form.formState.errors.name;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  // Get gradient for preview
  const selectedColor = colorPresets.find(c => c.value === colorValue);
  const gradientClass = selectedColor?.gradient || 'from-gray-400 to-gray-500';

  return (
    <Dialog open={open} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-gray-200/50 dark:border-gray-700/50">
        {/* Header with gradient accent */}
        <div className="relative">
          <div className={`h-1.5 bg-gradient-to-r ${gradientClass}`} />
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientClass} text-white shadow-lg`}>
                <Hash className="w-5 h-5" />
              </div>
              <span className="font-semibold">{tag ? 'Edit Tag' : 'Create Tag'}</span>
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6 space-y-5">
          {/* Name Field with enhanced styling */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" />
              Tag Name <span className="text-red-500">*</span>
              <span className="ml-auto text-xs font-normal text-gray-400">
                {nameValue?.length || 0}/50
              </span>
            </label>
            <Input
              {...form.register('name')}
              placeholder="e.g., javascript, react, tutorial"
              className={`h-11 pl-4 pr-4 rounded-xl border-2 transition-all duration-200 ${
                nameError
                  ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-400 focus:ring-blue-500/20'
              }`}
            />
            {nameError && (
              <p className="text-sm text-red-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {nameError.message}
              </p>
            )}
          </div>

          {/* Slug Field with enhanced styling */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                URL Slug
              </span>
              {nameValue && (
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Auto-generate
                </button>
              )}
            </label>
            <div className="relative">
              <div className="h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 flex items-center">
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 text-xs">/tags/</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">
                    {previewSlug || <span className="text-gray-400">tag-url-slug</span>}
                  </span>
                </span>
              </div>
            </div>
            <Input
              {...form.register('slug')}
              placeholder="Leave empty to auto-generate"
              className="sr-only"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
            <Textarea
              {...form.register('description')}
              placeholder="What is this tag about?"
              rows={2}
              className="resize-none rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-400 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>

          {/* Color Selection with enhanced styling */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-400" />
              Color <span className="font-normal text-gray-400">(Optional)</span>
            </label>

            {/* Color grid with gradient indicators */}
            <div className="grid grid-cols-6 gap-2.5">
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => form.setValue('color', colorValue === preset.value ? '' : preset.value)}
                  className={`group relative w-full aspect-square rounded-xl border-2 transition-all duration-200 ${
                    colorValue === preset.value
                      ? 'border-gray-900 dark:border-white shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                >
                  {colorValue === preset.value && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                      <Check className="w-5 h-5 text-white" />
                    </span>
                  )}
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${preset.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-200`} />
                </button>
              ))}
            </div>

            {/* Custom color input */}
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                {...form.register('color')}
                className="w-12 h-10 p-0.5 rounded-xl cursor-pointer border-2 border-gray-200 dark:border-gray-700"
              />
              <Input
                {...form.register('color')}
                placeholder="#FF6B6B"
                className="flex-1 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 font-mono text-sm uppercase"
              />
              {colorValue && (
                <button
                  type="button"
                  onClick={() => form.setValue('color', '')}
                  className="px-3 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Live Preview Section - Enhanced */}
          {(nameValue || colorValue) && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
              <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-5`} />
              <div className="relative p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Eye className="w-3.5 h-3.5" />
                  Live Preview
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 ${
                      colorValue
                        ? 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                    style={{
                      border: colorValue ? `2px solid ${colorValue}30` : '2px solid #e5e7eb',
                      color: colorValue || undefined,
                    }}
                  >
                    <span className="text-lg opacity-70">#</span>
                    <span>{nameValue || 'Tag Name'}</span>
                  </div>
                  {colorValue && (
                    <div
                      className="w-7 h-7 rounded-xl shadow-lg"
                      style={{ backgroundColor: colorValue }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Summary - Enhanced */}
          {hasErrors && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800/50">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Please fix the errors above
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                  Some fields need attention before continuing
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions - Enhanced */}
          <DialogFooter className="gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 h-11 rounded-xl border-2 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !!nameError}
              className={`flex-1 h-11 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 bg-gradient-to-r ${gradientClass}`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {tag ? 'Update' : 'Create'} Tag
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
