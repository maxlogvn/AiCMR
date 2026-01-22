'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMyPost, useUpdateMyPost } from '@/hooks/usePosts';
import { useCategories, useTags } from '@/hooks/usePosts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, Eye, ArrowLeft, Upload, X, Trash2 } from 'lucide-react';
import { uploadsApi, getFileUrl } from '@/lib/api';
import type { UpdatePostRequest, Category, Tag } from '@/types/post';
import { useToast } from '@/hooks/useToast';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();

  const postId = Number(params.id);
  const { data: post, isLoading: postLoading } = useMyPost(postId);
  const updatePostMutation = useUpdateMyPost(postId);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: tagsData } = useTags({ pageSize: 100 });
  const tags = tagsData?.items || [];

  const [formData, setFormData] = useState<UpdatePostRequest>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: undefined,
    tags: [],
    thumbnail_image_id: undefined,
    is_featured: false,
    is_pinned: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
  });

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [preview, setPreview] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form with post data
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        category_id: post.category_id || undefined,
        tags: post.tags?.map(t => t.id) || [],
        thumbnail_image_id: post.thumbnail_image_id || undefined,
        is_featured: post.is_featured,
        is_pinned: post.is_pinned,
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        seo_keywords: post.seo_keywords || '',
      });
      setSelectedTags(post.tags?.map(t => t.id) || []);
      if (post.thumbnail_image) {
        setThumbnailPreview(getFileUrl(post.thumbnail_image.id));
      }
    }
  }, [post]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData({ ...formData, slug });
    }
  }, [formData.title]);

  // Handle thumbnail upload
  const handleThumbnailUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadsApi.uploadFile(file, undefined, false);
      setThumbnailPreview(getFileUrl(response.data.id));
      setFormData({ ...formData, thumbnail_image_id: response.data.id });
      toast.showSuccess('Thumbnail uploaded successfully');
    } catch (error) {
      toast.showError('Failed to upload thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      handleThumbnailUpload(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setFormData({ ...formData, thumbnail_image_id: undefined });
  };

  // Handle tag selection
  const toggleTag = (tagId: number) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
    setFormData({ ...formData, tags: newTags });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await updatePostMutation.mutateAsync({
        ...formData,
        tags: selectedTags,
      });
      toast.showSuccess('Post updated successfully');
      router.push('/user/posts');
    } catch (error) {
      toast.showError('Failed to update post');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (postLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="text-center py-12 text-red-600 dark:text-red-400">
          <p>Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button variant="ghost" onClick={handleBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Edit Post
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            <Eye className="w-4 h-4 mr-2" />
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            onClick={handleBack}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updatePostMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {updatePostMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {preview ? (
        /* Preview Mode */
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">{formData.title || 'Untitled Post'}</h1>
          {formData.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">{formData.excerpt}</p>
          )}
          <div
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.content || "" }}
          />
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.filter(t => selectedTags.includes(t.id)).map(tag => (
                <Badge key={tag.id} variant="outline">{tag.name}</Badge>
              ))}
            </div>
          )}
        </Card>
      ) : (
        /* Edit Mode */
        <div className="grid gap-6">
          {/* Main Content */}
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-2 block">Title *</label>
                <Input
                  type="text"
                  placeholder="Enter post title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-sm font-medium mb-2 block">Slug</label>
                <Input
                  type="text"
                  placeholder="post-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="text-sm font-medium mb-2 block">Excerpt</label>
                <Textarea
                  placeholder="Brief summary of the post..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-medium mb-2 block">Content *</label>
                <Textarea
                  placeholder="Write your post content here (Markdown supported)..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={20}
                  required
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thumbnail</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveThumbnail}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isUploading ? 'Uploading...' : 'Click to upload thumbnail'}
                      </span>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category & Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category & Tags</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  {categoriesLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      value={formData.category_id || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 pt-4 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Featured Post</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_pinned}
                      onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Pinned Post</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* SEO Metadata */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">SEO Metadata</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">SEO Title</label>
                  <Input
                    type="text"
                    placeholder="Override page title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">SEO Description</label>
                  <Textarea
                    placeholder="Meta description for search engines"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">SEO Keywords</label>
                  <Input
                    type="text"
                    placeholder="comma, separated, keywords"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Post Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Post Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Status</p>
                    <Badge
                      variant={
                        post.status === 'published'
                          ? 'default'
                          : post.status === 'draft'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Created</p>
                    <p>{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Published</p>
                    <p>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : 'Not published'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Updated</p>
                    <p>{new Date(post.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
