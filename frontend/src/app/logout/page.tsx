"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const logoutPerformed = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!logoutPerformed.current) {
      logoutPerformed.current = true;

      const performLogout = async () => {
        try {
          console.log("[LogoutPage] Starting logout process");
          const result = await logout();

          if (result.success) {
            console.log("[LogoutPage] Logout successful, redirecting to login");
            // Add a small delay to ensure storage is cleared
            await new Promise((resolve) => setTimeout(resolve, 100));
            router.push("/login");
          } else {
            console.warn("[LogoutPage] Logout failed:", result.error);
            setError(result.error || "Logout failed");
            // Redirect anyway after 3 seconds
            setTimeout(() => router.push("/login"), 3000);
          }
        } catch (err) {
          console.error("[LogoutPage] Logout error:", err);
          setError("An error occurred during logout");
          // Redirect anyway after 3 seconds
          setTimeout(() => router.push("/login"), 3000);
        }
      };

      performLogout();

      // Safety timeout: redirect after 5 seconds if nothing happens
      const timeoutId = setTimeout(() => {
        console.warn("[LogoutPage] Logout timeout reached, force redirecting");
        router.push("/login");
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [logout, router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="mb-4 inline-flex rounded-lg bg-red-100 p-3 dark:bg-red-900/20">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h.5a2 2 0 012 2v2m0 0V7a2 2 0 012-2h.5a2 2 0 012 2v2m0 0V7a2 2 0 012-2h.5a2 2 0 012 2v2m0 0V7"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
            Lỗi đăng xuất
          </h2>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">{error}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Đang chuyển hướng về trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Đang đăng xuất...</p>
      </div>
    </div>
  );
}
