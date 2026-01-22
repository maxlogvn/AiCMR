import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import postsApi from '@/lib/api-posts';
import type {
  Post,
  Category,
  Tag,
  PaginatedResponse,
  GetPostsParams,
  GetTagsParams,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateTagRequest,
  UpdateTagRequest,
  PostStatus,
  ReorderRequest,
  MergeRequest,
} from '@/types/post';

// ==================== Public Posts Hooks ====================
export function usePosts(params: GetPostsParams) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.getPosts(params).then(r => r.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePostBySlug(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getPostBySlug(slug).then(r => r.data),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePostRaw(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['post', slug, 'raw'],
    queryFn: () => postsApi.getPostRaw(slug).then(r => r.data),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ==================== Categories Hooks ====================
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => postsApi.getCategories().then(r => r.data),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCategoryBySlug(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => postsApi.getCategoryBySlug(slug).then(r => r.data),
    enabled: enabled && !!slug,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: () => postsApi.getCategoryTree().then(r => r.data),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// ==================== Tags Hooks ====================
export function useTags(params?: GetTagsParams) {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => postsApi.getTags(params).then(r => r.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useTagBySlug(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['tag', slug],
    queryFn: () => postsApi.getTagBySlug(slug).then(r => r.data),
    enabled: enabled && !!slug,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useTrendingTags(limit: number = 10) {
  return useQuery({
    queryKey: ['tags', 'trending', limit],
    queryFn: () => postsApi.getTrendingTags(limit).then(r => r.data),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// ==================== Authenticated User Posts Hooks ====================
export function useMyPosts(params: GetPostsParams, enabled: boolean = true) {
  return useQuery({
    queryKey: ['my-posts', params],
    queryFn: () => postsApi.getMyPosts(params).then(r => r.data),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useMyPost(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['my-post', id],
    queryFn: () => postsApi.getMyPost(id).then(r => r.data),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
  });
}

export function useUpdateMyPost(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePostRequest) => postsApi.updateMyPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['my-post', id] });
    },
  });
}

export function useDeleteMyPost(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postsApi.deleteMyPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
  });
}

export function useUpdateMyPostStatus(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: PostStatus) => postsApi.updateMyPostStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-post', id] });
    },
  });
}

// ==================== Admin/Moderator Posts Hooks ====================
export function useAllPosts(params: GetPostsParams, enabled: boolean = true) {
  return useQuery({
    queryKey: ['all-posts', params],
    queryFn: () => postsApi.getAllPosts(params).then(r => r.data),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUpdatePost(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePostRequest) => postsApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['my-post', id] });
    },
  });
}

export function useDeletePost(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
    },
  });
}

export function useBulkPublishPosts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => postsApi.bulkPublishPosts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
  });
}

export function useBulkArchivePosts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => postsApi.bulkArchivePosts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
  });
}

export function useBulkDeletePosts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => postsApi.bulkDeletePosts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
  });
}

// ==================== Admin/Moderator Categories Hooks ====================
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'tree'] });
    },
  });
}

export function useUpdateCategory(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => postsApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'tree'] });
      queryClient.invalidateQueries({ queryKey: ['category'] });
    },
  });
}

export function useDeleteCategory(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postsApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'tree'] });
    },
  });
}

// ==================== Admin/Moderator Tags Hooks ====================
export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTagRequest) => postsApi.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tag'] });
    },
  });
}

export function useDeleteTag(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postsApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

// ==================== Admin Category Hooks ====================
export function useReorderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.reorderCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'tree'] });
    },
  });
}

// ==================== Admin Tag Hooks ====================
export function useGetUnusedTags(enabled: boolean = true) {
  return useQuery({
    queryKey: ['tags', 'unused'],
    queryFn: () => postsApi.getUnusedTags().then(r => r.data),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMergeTags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceId, targetId }: MergeRequest) => 
      postsApi.mergeTags(sourceId, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tags', 'trending'] });
      queryClient.invalidateQueries({ queryKey: ['tags', 'unused'] });
    },
  });
}
