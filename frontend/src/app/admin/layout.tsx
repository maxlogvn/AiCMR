"use client";

import AdminGuard from '@/components/auth/AdminGuard';
import Navbar from '@/components/layout/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <Navbar />
        <main className="py-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
