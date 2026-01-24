/**
 * SIMPLE AUTH SERVICE - No complexity, just JWT + localStorage
 */

// Simple types
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

const API_BASE = "/backend/api/v1";

export const authService = {
  // Get token from localStorage
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  // Login function
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data: LoginResponse = await response.json();
    
    // Store token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", data.access_token);
    }

    return data;
  },

  // Register function
  async register(userData: RegisterRequest): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }
  },

  // Logout function
  async logout(): Promise<void> {
    // Call backend logout (optional)
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.getToken()}`,
        },
      });
    } catch (error) {
      console.warn("Backend logout failed:", error);
      // Continue anyway
    }

    // Clear tokens from storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Reset API state (csrf tokens, interceptors)
      const { resetCsrfToken, resetApiState } = await import("./api");
      resetCsrfToken();
      resetApiState();

      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
  },

  // Get current user info (if needed)
  async getCurrentUser(): Promise<any> {
    const token = this.getToken();
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_BASE}/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user info");
    }

    return response.json();
  },
};