"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { User } from "@/types";

export function useUser() {
  const [isClient] = useState(true);

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
