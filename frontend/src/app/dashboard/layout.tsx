"use client";

import ModeratorGuard from "@/components/auth/ModeratorGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModeratorGuard>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </ModeratorGuard>
  );
}
