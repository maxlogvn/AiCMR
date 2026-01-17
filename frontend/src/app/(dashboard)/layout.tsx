"use client";

import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <nav className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
                <span className="ml-2 text-xl font-bold text-zinc-900 dark:text-white">
                  AiCMR
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
