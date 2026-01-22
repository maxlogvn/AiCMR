'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMyPosts } from '@/hooks/usePosts';
import { useDeleteMyPost, useUpdateMyPostStatus } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { PostList, PostPagination } from '@/components/post';
import { FilterSidebar } from '@/components/post';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card-wrapped';
import { FileText, Plus, AlertTriangle, PenSquare, LayoutDashboard } from 'lucide-react';
import type { GetPostsParams, PostFilters, Post } from '@/types/post';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import Breadcrumb from '@/components/layout/Breadcrumb';
import QuickNavigation from '@/components/layout/QuickNavigation';

export default function MyPostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();

  const [filters, setFilters] = useState<PostFilters>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Get query params from URL
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;

  // Debounce filters
  const debouncedFilters = useDebounce(filters, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedFilters.status) params.set('status', debouncedFilters.status);
    if (debouncedFilters.category_id) params.set('category_id', debouncedFilters.category_id.toString());
    if (debouncedFilters.tags && debouncedFilters.tags.length > 0) {
      debouncedFilters.tags.forEach(tag => params.append('tags', tag.toString()));
    }
    if (debouncedFilters.search) params.set('search', debouncedFilters.search);
    if (debouncedFilters.date_from) params.set('date_from', debouncedFilters.date_from);
    if (debouncedFilters.date_to) params.set('date_to', debouncedFilters.date_to);
    if (page > 1) params.set('page', page.toString());
    if (pageSize !== 10) params.set('pageSize', pageSize.toString());

    const newUrl = `?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [debouncedFilters, page, pageSize]);

  // Build query params
  const queryParams: GetPostsParams = {
    page,
    pageSize,
    status: filters.status as any,
    category_id: debouncedFilters.category_id,
    tags: debouncedFilters.tags,
    search: debouncedFilters.search,
    date_from: debouncedFilters.date_from,
    date_to: debouncedFilters.date_to,
  };

  // Fetch my posts
  const { data, isLoading, error } = useMyPosts(queryParams);

  // Mutations
  const deletePostMutation = useDeleteMyPost(0);
  const updateStatusMutation = useUpdateMyPostStatus(0);

  // Handle delete
  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      await deletePostMutation.mutateAsync(postToDelete.id);
      toast.showSuccess('Post deleted successfully');
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      toast.showError('Failed to delete post');
    }
  };

  // Handle publish
  const handlePublish = async (post: Post) => {
    try {
      await updateStatusMutation.mutateAsync(post.id, 'published');
      toast.showSuccess('Post published successfully');
    } catch (error) {
      toast.showError('Failed to publish post');
    }
  };

  // Handle archive
  const handleArchive = async (post: Post) => {
    try {
      await updateStatusMutation.mutateAsync(post.id, 'archived');
      toast.showSuccess('Post archived successfully');
    } catch (error) {
      toast.showError('Failed to archive post');
    }
  };

  // Handle edit
  const handleEdit = (post: Post) => {
    router.push(`/user/posts/${post.id}/edit`);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    window.history.pushState({}, '', `?${params.toString()}`);
    window.location.reload();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({});
  };

  // Quick navigation links
  const quickLinks = [
    {
      label: "Tạo Bài Mới",
      href: "/user/posts/new",
      icon: <PenSquare className="h-5 w-5" />,
      description: "Viết bài đăng mới",
    },
    {
      label: "Hồ Sơ Cá Nhân",
      href: "/user/profile",
      icon: <FileText className="h-5 w-5" />,
      description: "Xem hồ sơ của bạn",
    },
    ...(user && user.rank >= 3
      ? [
          {
            label: "Quản Trị Viên",
            href: "/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            description: "Bảng điều khiển quản trị",
          },
        ]
      : []),
  ];

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="text-center py-12 text-red-600 dark:text-red-400">
          <p>Không thể tải bài đăng. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Breadcrumb />

      {/* Quick Navigation */}
      <QuickNavigation links={quickLinks} title="Thao Tác Nhanh" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bài Đăng Của Tôi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý tất cả bài đăng của bạn
          </p>
        </div>
        <Button onClick={() => router.push('/user/posts/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo Bài Mới
        </Button>
      </div>

       {/* Stats */}
       {data && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
             <div className="flex items-center gap-3">
               <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
               <div>
                 <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng bài đăng</p>
                 <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{data.total}</p>
               </div>
             </div>
           </Card>
           <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-full bg-green-600 dark:bg-green-400" />
               <div>
                 <p className="text-sm text-zinc-600 dark:text-zinc-400">Đã xuất bản</p>
                 <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                   {data.items.filter(p => p.status === 'published').length}
                 </p>
               </div>
             </div>
           </Card>
           <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-full bg-yellow-600 dark:bg-yellow-400" />
               <div>
                 <p className="text-sm text-zinc-600 dark:text-zinc-400">Bản nháp</p>
                 <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                   {data.items.filter(p => p.status === 'draft').length}
                 </p>
               </div>
             </div>
           </Card>
         </div>
       )}

      {/* Main Content */}
      <div className="flex gap-6 flex-col lg:flex-row">
         {/* Main Content Area */}
         <div className="flex-1">
           <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
             {data?.total || 0} bài đăng tìm thấy
           </p>

           {isLoading ? (
             <div className="flex justify-center items-center py-12">
               <LoadingSpinner />
             </div>
           ) : data && data.items.length > 0 ? (
             <>
               <PostList
                 posts={data.items}
                 isLoading={isLoading}
                 showActions={true}
                 onEdit={handleEdit}
                 onDelete={handleDeleteClick}
                 onPublish={handlePublish}
                 onArchive={handleArchive}
               />

               {/* Pagination */}
               {data.pages && data.pages > 1 && (
                 <div className="mt-8">
                   <PostPagination
                     total={data.total}
                     page={data.page}
                     pageSize={data.size}
                     onPageChange={handlePageChange}
                   />
                 </div>
               )}
             </>
           ) : (
             <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">
               <p>Không tìm thấy bài đăng nào</p>
               <Button
                 className="mt-4"
                 onClick={() => router.push('/user/posts/new')}
               >
                 <Plus className="w-4 h-4 mr-2" />
                 Tạo bài đăng đầu tiên của bạn
               </Button>
             </div>
           )}
         </div>

        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
            showStatusFilter={true}
          />
        </div>
      </div>

       {/* Delete Confirmation Dialog */}
       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-destructive" />
               Xóa Bài Đăng
             </DialogTitle>
             <DialogDescription>
               Bạn có chắc chắn muốn xóa "{postToDelete?.title}"? Hành động này không thể hoàn tác.
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <Button
               variant="outline"
               onClick={() => {
                 setDeleteDialogOpen(false);
                 setPostToDelete(null);
               }}
             >
               Hủy
             </Button>
             <Button
               variant="destructive"
               onClick={handleDeleteConfirm}
               disabled={deletePostMutation.isPending}
             >
               {deletePostMutation.isPending ? 'Đang xóa...' : 'Xóa'}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
    </div>
  );
}
