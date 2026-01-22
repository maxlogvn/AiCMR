import api, { resetCsrfToken, resetApiState } from "./api";
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

  async logout(): Promise<{ success: boolean; error?: string }> {
    console.log("[Auth] Logging out");
    
    try {
      const refreshToken = this.getRefreshToken();
      
      if (typeof window !== "undefined") {
        // ✅ STEP 1: Reset API state and CSRF cache BEFORE clearing tokens
        // This ensures the next login session gets fresh CSRF token and clean interceptor state
        resetCsrfToken();
        resetApiState();
        console.log("[Auth] API state reset complete");

        // ✅ STEP 2: Clear tokens immediately from localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // ✅ STEP 3: Try to notify backend (non-blocking, best effort)
        if (refreshToken) {
          try {
            console.log("[Auth] Notifying backend of logout");
            await api.post("/auth/logout", { refresh_token: refreshToken });
            console.log("[Auth] Backend logout notification successful");
          } catch (error) {
            console.warn("[Auth] Backend logout notification failed (non-critical):", error);
            // Don't fail logout if API call fails - tokens are already cleared
          }
        }

        return { success: true };
      }
      
      return { success: false, error: "Window context not available" };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("[Auth] Logout failed:", errorMsg);
      return { success: false, error: errorMsg };
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
