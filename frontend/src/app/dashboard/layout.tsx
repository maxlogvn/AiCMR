"use client";

import ModeratorGuard from "@/components/auth/ModeratorGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModeratorGuard>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 bg-zinc-50 dark:bg-black">
          <AdminSidebar />
          <main className="flex-1 p-4 sm:p-8">{children}</main>
        </div>
        <Footer />
      </div>
    </ModeratorGuard>
  );
}
