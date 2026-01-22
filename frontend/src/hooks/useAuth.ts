"use client";

import { useState } from "react";
import { authService } from "@/lib/auth";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => ({
    isAuthenticated: !!authService.getToken(),
    user: null,
  }));

  const login = async (credentials: LoginRequest): Promise<TokenResponse> => {
    const response = await authService.login(credentials);
    setState((prev) => ({ ...prev, isAuthenticated: true }));
    return response;
  };

  const register = async (data: RegisterRequest): Promise<User> => {
    const response = await authService.register(data);
    return response;
  };

  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.logout();
    setState({
      isAuthenticated: false,
      user: null,
    });
    return result;
  };

  const checkAuth = () => {
    const token = authService.getToken();
    setState({
      isAuthenticated: !!token,
      user: null,
    });
  };

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: false,
    login,
    register,
    logout,
    checkAuth,
  };
}
