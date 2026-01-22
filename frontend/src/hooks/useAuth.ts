"use client";

import { useState, useEffect } from "react";
import { authService } from "@/lib/auth";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      const loggedIn = authService.isLoggedIn();
      setIsAuthenticated(loggedIn);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for logout events
    const handleLogout = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener("auth:logout", handleLogout);
    
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      await authService.login(credentials);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
}