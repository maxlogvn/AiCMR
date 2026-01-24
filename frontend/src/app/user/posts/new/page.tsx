'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePost } from '@/hooks/usePosts';
import { useCategories, useTags } from '@/hooks/usePosts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, Eye, ArrowLeft, Upload, X } from 'lucide-react';
import { uploadsApi, getFileUrl } from '@/lib/api';
import type { CreatePostRequest, Category, Tag, Attachment } from '@/types/post';
import { useToast } from '@/hooks/useToast';
import Breadcrumb from '@/components/layout/Breadcrumb';
import QuickNavigation from '@/components/layout/QuickNavigation';
import { useUser } from '@/hooks/useUser';

export default function CreatePostPage() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useUser();

  const [formData, setFormData] = useState<CreatePostRequest>({
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

  const createPostMutation = useCreatePost();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: tagsData } = useTags({ pageSize: 100 });
  const tags = tagsData?.items || [];

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
  const handleSubmit = async (publish: boolean = false) => {
    try {
      await createPostMutation.mutateAsync({
        ...formData,
        tags: selectedTags,
        publish_now: publish,
      });
      toast.showSuccess(publish ? 'Post published successfully' : 'Post saved as draft');
      router.push('/user/posts');
    } catch (error) {
      toast.showError(publish ? 'Failed to publish post' : 'Failed to save post');
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Quick navigation links
  const quickLinks = [
    {
      label: "Bài Đăng Của Tôi",
      href: "/user/posts",
      icon: <FileText className="h-5 w-5" />,
      description: "Quản lý bài đăng của bạn",
    },
    {
      label: "Hồ Sơ Cá Nhân",
      href: "/user/profile",
      icon: <ArrowLeft className="h-5 w-5" />,
      description: "Xem hồ sơ của bạn",
    },
    ...(user && user.rank >= 3
      ? [
          {
            label: "Quản Trị Viên",
            href: "/dashboard",
            icon: <Save className="h-5 w-5" />,
            description: "Bảng điều khiển quản trị",
          },
        ]
      : []),
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <Breadcrumb />

      {/* Quick Navigation */}
      <QuickNavigation links={quickLinks} title="Thao Tác Nhanh" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button variant="ghost" onClick={handleBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Tạo Bài Đăng Mới
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            <Eye className="w-4 h-4 mr-2" />
            {preview ? 'Chỉnh sửa' : 'Xem trước'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={createPostMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu Bản Nháp
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={createPostMutation.isPending}
          >
            <FileText className="w-4 h-4 mr-2" />
            Xuất Bản
          </Button>
        </div>
      </div>

       {preview ? (
         /* Preview Mode */
         <Card className="p-6">
           <h1 className="text-3xl font-bold mb-4">{formData.title || 'Bài đăng chưa có tiêu đề'}</h1>
           {formData.excerpt && (
             <p className="text-gray-500 dark:text-gray-400 mb-4">{formData.excerpt}</p>
           )}
           <div
             className="prose prose-gray dark:prose-invert max-w-none"
             dangerouslySetInnerHTML={{ __html: formData.content }}
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
                 <label className="text-sm font-medium mb-2 block">Tiêu đề *</label>
                 <Input
                   type="text"
                   placeholder="Nhập tiêu đề bài viết..."
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
                   placeholder="bai-viet-slug"
                   value={formData.slug}
                   onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                 />
               </div>

               {/* Excerpt */}
               <div>
                 <label className="text-sm font-medium mb-2 block">Tóm tắt</label>
                 <Textarea
                   placeholder="Tóm tắt ngắn về bài viết..."
                   value={formData.excerpt}
                   onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                   rows={3}
                 />
               </div>

               {/* Content */}
               <div>
                 <label className="text-sm font-medium mb-2 block">Nội dung *</label>
                 <Textarea
                   placeholder="Viết nội dung bài viết tại đây (hỗ trợ Markdown)..."
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
                 <CardTitle className="text-lg">Ảnh đại diện</CardTitle>
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
                       <span className="text-sm text-gray-500 dark:text-gray-400">
                         {isUploading ? 'Đang tải lên...' : 'Bấm để tải ảnh đại diện'}
                       </span>
                     </label>
                   </div>
                 )}
               </CardContent>
             </Card>

             {/* Category & Tags */}
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Danh mục & Thẻ</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                 {/* Category */}
                 <div>
                   <label className="text-sm font-medium mb-2 block">Danh mục</label>
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
                       <option value="">Chọn danh mục</option>
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
                   <label className="text-sm font-medium mb-2 block">Thẻ</label>
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
                     <span className="text-sm">Bài viết nổi bật</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input
                       type="checkbox"
                       checked={formData.is_pinned}
                       onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                       className="rounded"
                     />
                     <span className="text-sm">Bài viết ghim</span>
                   </label>
                 </div>
               </CardContent>
             </Card>

             {/* SEO Metadata */}
             <Card className="lg:col-span-2">
               <CardHeader>
                 <CardTitle className="text-lg">Metadata SEO</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                 <div>
                   <label className="text-sm font-medium mb-2 block">Tiêu đề SEO</label>
                   <Input
                     type="text"
                     placeholder="Ghi đè tiêu đề trang"
                     value={formData.seo_title}
                     onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                   />
                 </div>
                 <div>
                   <label className="text-sm font-medium mb-2 block">Mô tả SEO</label>
                   <Textarea
                     placeholder="Mô tả cho công cụ tìm kiếm"
                     value={formData.seo_description}
                     onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                     rows={3}
                   />
                 </div>
                 <div>
                   <label className="text-sm font-medium mb-2 block">Từ khóa SEO</label>
                   <Input
                     type="text"
                     placeholder="từ, khóa, cách nhau dấu phẩy"
                     value={formData.seo_keywords}
                     onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                   />
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       )}
    </div>
  );
}
