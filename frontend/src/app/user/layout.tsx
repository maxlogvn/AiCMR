"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import UserSidebar from "@/components/user/UserSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
        <UserSidebar />
        <main className="flex-1 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
