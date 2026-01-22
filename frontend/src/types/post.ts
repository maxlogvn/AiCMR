// Post Status
export type PostStatus = 'draft' | 'published' | 'archived';

// Base Interfaces
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  icon: string | null;
  color: string | null;
  post_count: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  post_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostMetadata {
  id: number;
  post_id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// Import existing types
export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  rank: number;
  created_at: string;
  updated_at?: string;
}

export interface Attachment {
  id: number;
  filename: string;
  file_path: string;
  content_type: string;
  file_size: number;
  user_id: number;
  created_at: string;
  url: string;
}

// Post Interface
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: PostStatus;
  category_id: number | null;
  author_id: number;
  thumbnail_image_id: number | null;
  is_featured: boolean;
  is_pinned: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author?: User;
  category?: Category;
  tags?: Tag[];
  thumbnail_image?: Attachment;
  metadata?: PostMetadata[];
}

// Request/Response Types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages?: number;
}

// Posts Query Params
export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  status?: PostStatus;
  category_id?: number;
  tags?: number[];
  search?: string;
  author_id?: number;
  date_from?: string;
  date_to?: string;
  is_featured?: boolean;
  is_pinned?: boolean;
  sort_by?: 'created_at' | 'updated_at' | 'published_at' | 'view_count' | 'like_count';
  sort_order?: 'asc' | 'desc';
}

// Tags Query Params
export interface GetTagsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort_by?: 'name' | 'post_count' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Create/Update Request Types
export interface CreatePostRequest {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  category_id?: number;
  tags?: number[];
  thumbnail_image_id?: number;
  is_featured?: boolean;
  is_pinned?: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  metadata?: Record<string, string>;
  publish_now?: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category_id?: number;
  tags?: number[];
  thumbnail_image_id?: number;
  is_featured?: boolean;
  is_pinned?: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  metadata?: Record<string, string>;
}

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  color?: string;
}

export interface CreateTagRequest {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
}

export interface UpdateTagRequest {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
}

// Bulk Operations
export interface BulkPublishRequest {
  post_ids: number[];
}

export interface BulkArchiveRequest {
  post_ids: number[];
}

export interface BulkDeleteRequest {
  post_ids: number[];
}

// Filter State
export interface PostFilters {
  status?: PostStatus;
  category_id?: number;
  tags?: number[];
  search?: string;
  date_from?: string;
  date_to?: string;
}
