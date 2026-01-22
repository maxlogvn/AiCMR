import api from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "../types";

export const authService = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    try {
      console.log("[Auth] Attempting login for:", data.email);
      const response = await api.post<TokenResponse>("/auth/login", data);
      console.log("[Auth] Login successful, storing tokens");
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
      return response.data;
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<User> {
    try {
      console.log("[Auth] Attempting register for:", data.email);
      const response = await api.post<User>("/auth/register", data);
      console.log("[Auth] Register successful");
      return response.data;
    } catch (error) {
      console.error("[Auth] Register failed:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    console.log("[Auth] Logging out");
    const refreshToken = this.getRefreshToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      try {
        if (refreshToken) {
          await api.post("/auth/logout", { refresh_token: refreshToken });
        }
      } catch (error) {
        console.warn("[Auth] Logout API call failed (non-critical):", error);
      }

      window.location.href = "/login";
    }
  },

  async refreshToken(): Promise<TokenResponse> {
    try {
      console.log("[Auth] Refreshing token");
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      const response = await api.post<TokenResponse>("/auth/refresh", {
        refresh_token: refreshToken,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
      console.log("[Auth] Token refreshed successfully");
      return response.data;
    } catch (error) {
      console.error("[Auth] Token refresh failed:", error);
      throw error;
    }
  },

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  },
};
