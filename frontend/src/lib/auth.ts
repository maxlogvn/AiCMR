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
      if (typeof window !== "undefined") {
        // ✅ STEP 1: Get tokens BEFORE clearing them
        const refreshToken = this.getRefreshToken();
        const accessToken = this.getToken();
        console.log("[Auth] Tokens to logout:", { 
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken 
        });
        
        // ✅ STEP 2: Try to notify backend FIRST (while we still have valid tokens)
        // This is critical - backend needs to revoke the token
        if (refreshToken) {
          try {
            console.log("[Auth] Notifying backend of logout");
            await api.post("/auth/logout", { refresh_token: refreshToken });
            console.log("[Auth] Backend logout notification successful");
          } catch (error) {
            console.warn("[Auth] Backend logout notification failed (non-critical):", error);
            // Continue with logout even if backend fails
          }
        }

        // ✅ STEP 3: Reset API state and CSRF cache
        // This ensures the next login session gets fresh CSRF token and clean interceptor state
        console.log("[Auth] Resetting CSRF and API state");
        resetCsrfToken();
        resetApiState();
        console.log("[Auth] API state reset complete");

        // ✅ STEP 4: Clear tokens from localStorage
        console.log("[Auth] Clearing tokens from localStorage");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        
        // ✅ STEP 5: Verify tokens are actually removed
        const tokensAfterClear = {
          accessToken: this.getToken(),
          refreshToken: this.getRefreshToken(),
        };
        console.log("[Auth] Tokens after clear:", tokensAfterClear);

        return { success: true };
      }
      
      return { success: false, error: "Window context not available" };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("[Auth] Logout failed:", errorMsg);
      // Still clear tokens even if error occurs
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
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
