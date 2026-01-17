"use client";

import PublicOnlyGuard from "@/components/auth/PublicOnlyGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicOnlyGuard>
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </PublicOnlyGuard>
  );
}
