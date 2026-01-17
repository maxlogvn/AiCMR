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
  token_type: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
}

export interface UserWithRank extends User {
  rank_label: string;
}
