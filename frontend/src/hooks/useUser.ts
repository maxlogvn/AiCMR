"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { authService } from "@/lib/auth";
import type { User } from "@/types";

export function useUser() {
  const [isClient] = useState(true);
  const queryClient = useQueryClient();

  // ✅ NEW: Monitor token changes and invalidate cache
  useEffect(() => {
    const handleStorageChange = () => {
      const token = authService.getToken();
      
      if (!token) {
        // ✅ User logged out - invalidate and clear user cache
        console.log("[useUser] Token removed, clearing user cache");
        queryClient.setQueryData(["user", "me"], null);
        queryClient.removeQueries({ queryKey: ["user", "me"] });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [queryClient]);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await api.get<User>("/users/me");
      return response.data;
    },
    enabled: isClient,
    retry: false,
  });

  return {
    user,
    isLoading,
    error,
    refetch,
  };
}
