"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import UserSidebar from "@/components/user/UserSidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 bg-zinc-50 dark:bg-black">
          <UserSidebar />
          <main className="flex-1 py-8 px-4 sm:px-8">{children}</main>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}
