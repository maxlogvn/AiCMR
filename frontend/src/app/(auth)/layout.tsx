"use client";

import PublicOnlyGuard from "@/components/auth/PublicOnlyGuard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicOnlyGuard>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-black px-4 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <Footer />
      </div>
    </PublicOnlyGuard>
  );
}
