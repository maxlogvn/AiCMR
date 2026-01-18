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
}
