export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  rank: number;
  created_at: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  rank?: number;
  is_active?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages?: number;
}

export interface UserWithRank extends User {
  rank_label: string;
}

export interface Settings {
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  og_url: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  robots: string | null;
  canonical_url: string | null;
  google_analytics_id: string | null;
  custom_meta: string | null;
  upload_allowed_extensions: string | null;
  upload_max_size_mb: string | null;
}

export interface StatsOverview {
  total_users: number;
  active_users: number;
  inactive_users: number;
  by_rank: Record<number, number>;
  recent_users: User[];
}

export interface UpdateSettingsRequest {
  site_name?: string;
  logo_url?: string;
  favicon_url?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  og_url?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots?: string;
  canonical_url?: string;
  google_analytics_id?: string;
  custom_meta?: string;
  upload_allowed_extensions?: string;
  upload_max_size_mb?: string;
}

export interface PublicSettingsResponse {
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  og_url: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  robots: string | null;
  canonical_url: string | null;
  google_analytics_id: string | null;
  custom_meta: string | null;
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
