import api from './api';
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
  BulkPublishRequest,
  BulkArchiveRequest,
  BulkDeleteRequest,
  PostStatus,
} from '@/types/post';

// ==================== Public Posts ====================
export const postsApi = {
  // Public
  getPosts: (params: GetPostsParams) =>
    api.get<PaginatedResponse<Post>>('/posts', { params }),

  getPostBySlug: (slug: string) =>
    api.get<Post>(`/posts/${slug}`),

  getPostRaw: (slug: string) =>
    api.get<string>(`/posts/${slug}/raw`),

  // ==================== Categories ====================
  getCategories: () =>
    api.get<Category[]>('/categories'),

  getCategoryBySlug: (slug: string) =>
    api.get<Category>(`/categories/${slug}`),

  getCategoryTree: () =>
    api.get<Category[]>('/categories/tree'),

  // ==================== Tags ====================
  getTags: (params?: GetTagsParams) =>
    api.get<PaginatedResponse<Tag>>('/tags', { params }),

  getTagBySlug: (slug: string) =>
    api.get<Tag>(`/tags/${slug}`),

  getTrendingTags: (limit: number = 10) =>
    api.get<Tag[]>('/tags/trending', { params: { limit } }),

  // ==================== Authenticated User Posts ====================
  createPost: (data: CreatePostRequest) =>
    api.post<Post>('/posts/me', data),

  getMyPosts: (params: GetPostsParams) =>
    api.get<PaginatedResponse<Post>>('/posts/me', { params }),

  getMyPost: (id: number) =>
    api.get<Post>(`/posts/me/${id}`),

  updateMyPost: (id: number, data: UpdatePostRequest) =>
    api.patch<Post>(`/posts/me/${id}`, data),

  deleteMyPost: (id: number) =>
    api.delete(`/posts/me/${id}`),

  updateMyPostStatus: (id: number, status: PostStatus) =>
    api.patch(`/posts/me/${id}/status`, { status }),

  // ==================== Admin/Moderator Posts ====================
  getAllPosts: (params: GetPostsParams) =>
    api.get<PaginatedResponse<Post>>('/posts/all', { params }),

  updatePost: (id: number, data: UpdatePostRequest) =>
    api.patch<Post>(`/posts/${id}`, data),

  deletePost: (id: number) =>
    api.delete(`/posts/${id}`),

  bulkPublishPosts: (ids: number[]) =>
    api.post('/posts/bulk/publish', { post_ids: ids } as BulkPublishRequest),

  bulkArchivePosts: (ids: number[]) =>
    api.post('/posts/bulk/archive', { post_ids: ids } as BulkArchiveRequest),

  bulkDeletePosts: (ids: number[]) =>
    api.post('/posts/bulk/delete', { post_ids: ids } as BulkDeleteRequest),

  // ==================== Admin/Moderator Categories ====================
  createCategory: (data: CreateCategoryRequest) =>
    api.post<Category>('/categories/', data),

  updateCategory: (id: number, data: UpdateCategoryRequest) =>
    api.patch<Category>(`/categories/${id}`, data),

  deleteCategory: (id: number) =>
    api.delete(`/categories/${id}`),

  // ==================== Admin/Moderator Tags ====================
  createTag: (data: CreateTagRequest) =>
    api.post<Tag>('/tags/', data),

  updateTag: (id: number, data: UpdateTagRequest) =>
    api.patch<Tag>(`/tags/${id}`, data),

  deleteTag: (id: number) =>
    api.delete(`/tags/${id}`),
};

export default postsApi;
