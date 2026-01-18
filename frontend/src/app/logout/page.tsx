"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LogoutPage() {
  const { logout } = useAuth();
  const logoutPerformed = useRef(false);

  useEffect(() => {
    if (!logoutPerformed.current) {
      logoutPerformed.current = true;
      logout();
    }
  }, [logout]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Đang đăng xuất...</p>
      </div>
    </div>
  );
}
