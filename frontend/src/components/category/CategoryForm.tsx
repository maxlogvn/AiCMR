'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCategories } from '@/hooks/usePosts';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/post';
import { useCreateCategory, useUpdateCategory } from '@/hooks/usePosts';
import { Loader2, Palette, Folder, RefreshCw, Eye, Sparkles, X, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().max(100, 'Slug must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  parent_id: z.number().optional(),
  icon: z.string().max(50, 'Icon must be less than 50 characters').optional(),
  color: z.string().optional(),
  display_order: z.number().int().min(0).optional(),
  show_in_menu: z.boolean().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
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

// Enhanced icon presets with categories
const iconPresets = [
  { name: 'Folder', value: '📁', category: 'General' },
  { name: 'Book', value: '📚', category: 'Education' },
  { name: 'News', value: '📰', category: 'Media' },
  { name: 'Tech', value: '💻', category: 'Tech' },
  { name: 'Health', value: '🏥', category: 'Health' },
  { name: 'Sports', value: '⚽', category: 'Sports' },
  { name: 'Music', value: '🎵', category: 'Arts' },
  { name: 'Art', value: '🎨', category: 'Arts' },
  { name: 'Science', value: '🔬', category: 'Science' },
  { name: 'Business', value: '💼', category: 'Business' },
  { name: 'Travel', value: '✈️', category: 'Travel' },
  { name: 'Food', value: '🍔', category: 'Lifestyle' },
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

export function CategoryForm({ open, onClose, category }: CategoryFormProps) {
  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(category?.id || 0);
  const [previewSlug, setPreviewSlug] = useState('');

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
    mode: 'onBlur',
  });

  const nameValue = form.watch('name');
  const slugValue = form.watch('slug');
  const colorValue = form.watch('color');
  const iconValue = form.watch('icon');

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

  const onSubmit = async (data: CategoryFormData) => {
    const slug = data.slug || slugify(data.name);
    const description = data.description || undefined;
    const icon = data.icon || undefined;
    const color = data.color || undefined;
    const parent_id = data.parent_id && !isNaN(data.parent_id) ? data.parent_id : undefined;

    try {
      if (category) {
        const payload: UpdateCategoryRequest = {
          name: data.name,
          slug,
          description,
          parent_id: parent_id ?? category.parent_id ?? undefined,
          icon,
          color,
          display_order: data.display_order,
          show_in_menu: data.show_in_menu,
        };
        await updateCategory.mutateAsync(payload);
        toast.success(`Đã cập nhật chuyên mục "${data.name}"`);
      } else {
        const payload: CreateCategoryRequest = {
          name: data.name,
          slug,
          description,
          parent_id,
          icon,
          color,
          display_order: data.display_order,
          show_in_menu: data.show_in_menu,
        };
        await createCategory.mutateAsync(payload);
        toast.success(`Đã tạo chuyên mục "${data.name}"`);
      }
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Có lỗi xảy ra';
      toast.error(message);
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;
  const nameError = form.formState.errors.name;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  // Build category tree for better parent selection
  const buildTree = (flatCategories: Category[]): Category[] => {
    const validCategories = flatCategories.filter((c) => c && c.id !== undefined && c.id !== null);
    const categoryMap = new Map<number, Category & { children: Category[] }>(
      validCategories.map((c) => [c.id, { ...c, children: [] }])
    );
    const roots: Category[] = [];

    validCategories.forEach((cat) => {
      const node = categoryMap.get(cat.id);
      if (!node) return;
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent && parent.id !== cat?.id) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const renderCategoryOptions = (categories: Category[], level = 0) => {
    const options: React.ReactNode[] = [];
    categories.forEach((cat) => {
      if (!cat || cat.id === undefined || cat.id === null) return;
      const indent = '　'.repeat(level);
      options.push(
        <option key={cat.id} value={cat.id}>
          {indent}{cat.name || 'Unnamed'}
        </option>
      );
      if ('children' in cat && cat.children && cat.children.length > 0) {
        options.push(...renderCategoryOptions(cat.children as Category[], level + 1));
      }
    });
    return options;
  };

  const categoryTree = buildTree(categories);

  // Get gradient for preview
  const selectedColor = colorPresets.find(c => c.value === colorValue);
  const gradientClass = selectedColor?.gradient || 'from-gray-400 to-gray-500';

  return (
    <Dialog open={open} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-gray-200/50 dark:border-gray-700/50">
        {/* Header with gradient accent */}
        <div className="relative">
          <div className={`h-1.5 bg-gradient-to-r ${gradientClass}`} />
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientClass} text-white shadow-lg`}>
                <Folder className="w-5 h-5" />
              </div>
              <span className="font-semibold">{category ? 'Edit Category' : 'Create Category'}</span>
            </DialogTitle>
            <DialogDescription className="ml-14 text-gray-500 dark:text-gray-400">
              {category ? 'Update category information and settings.' : 'Add a new category to organize your content.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6 space-y-5">
          {/* Name Field with enhanced styling */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              Name <span className="text-red-500">*</span>
              <span className="ml-auto text-xs font-normal text-gray-400">
                {nameValue?.length || 0}/100
              </span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  {...form.register('name')}
                  placeholder="e.g., Technology"
                  className={`h-11 pl-4 pr-12 rounded-xl border-2 transition-all duration-200 ${
                    nameError
                      ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-400 focus:ring-blue-500/20'
                  }`}
                />
                {iconValue && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">
                    {iconValue}
                  </span>
                )}
              </div>
            </div>
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
                  <span className="text-gray-400 text-xs">/categories/</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">
                    {previewSlug || <span className="text-gray-400">category-url-slug</span>}
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
              placeholder="Brief description of this category..."
              rows={2}
              className="resize-none rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-400 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>

          {/* Parent Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Folder className="w-4 h-4 text-gray-400" />
              Parent Category
            </label>
            <Controller
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : NaN)}
                  className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-400 focus:ring-blue-500/20 outline-none transition-all duration-200"
                >
                  <option value="">None (Root Level)</option>
                  {renderCategoryOptions(categoryTree)}
                </select>
              )}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              {category?.parent_id ? 'Change parent to move this category' : 'Select a parent to create a sub-category'}
            </p>
          </div>

          {/* Icon Selection with enhanced grid */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Icon <span className="font-normal text-gray-400">(Optional)</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {iconPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => form.setValue('icon', iconValue === preset.value ? '' : preset.value)}
                  className={`group relative p-3 rounded-xl border-2 transition-all duration-200 ${
                    iconValue === preset.value
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/20 scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-102 bg-white dark:bg-gray-800/50'
                  }`}
                  title={`${preset.name} - ${preset.category}`}
                >
                  <span className="text-2xl block transition-transform duration-200 group-hover:scale-110">
                    {preset.value}
                  </span>
                  {iconValue === preset.value && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <Input
              {...form.register('icon')}
              placeholder="Or type a custom emoji..."
              className="h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-400 text-center"
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
              <div className="relative">
                <Input
                  type="color"
                  {...form.register('color')}
                  className="w-12 h-10 p-0.5 rounded-xl cursor-pointer border-2 border-gray-200 dark:border-gray-700"
                />
              </div>
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

          {/* Display Order & Menu Toggle - Enhanced */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Display Order
              </label>
              <div className="relative">
                <Input
                  type="number"
                  {...form.register('display_order', { valueAsNumber: true })}
                  min={0}
                  className="h-11 pl-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-400"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Lower numbers appear first
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Visibility
              </label>
              <button
                type="button"
                onClick={() => form.setValue('show_in_menu', !form.getValues('show_in_menu'))}
                className={`w-full h-11 px-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-200 ${
                  form.watch('show_in_menu')
                    ? 'border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  form.watch('show_in_menu')
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {form.watch('show_in_menu') && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-medium">Show in menu</span>
              </button>
            </div>
          </div>

          {/* Live Preview Section - Enhanced */}
          {(nameValue || iconValue || colorValue) && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
              <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-5`} />
              <div className="relative p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Eye className="w-3.5 h-3.5" />
                  Live Preview
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-lg transition-all duration-300 ${
                      colorValue
                        ? 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                    style={{
                      border: colorValue ? `2px solid ${colorValue}20` : '2px solid #e5e7eb',
                    }}
                  >
                    {iconValue && <span className="text-lg">{iconValue}</span>}
                    <span style={{ color: colorValue || undefined }}>{nameValue || 'Category Name'}</span>
                  </div>
                  {colorValue && (
                    <div
                      className="w-8 h-8 rounded-xl shadow-lg"
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
                  {category ? 'Update' : 'Create'} Category
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
