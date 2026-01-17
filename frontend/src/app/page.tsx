"use client";

import Link from 'next/link';
import { LogIn, UserPlus, UserCircle } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setToken(authService.getToken());
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Chào mừng đến với AiCMR
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Hệ thống quản lý người dùng với phân quyền theo rank
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          {token ? (
            <Link
              href="/dashboard/profile"
              className="group flex flex-col items-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow sm:col-span-2"
            >
              <UserCircle className="h-12 w-12 text-zinc-600 dark:text-zinc-400 mb-4" />
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                Hồ sơ cá nhân
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Bạn đã đăng nhập. Truy cập trang cá nhân của bạn.
              </p>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="group flex flex-col items-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <LogIn className="h-12 w-12 text-zinc-600 dark:text-zinc-400 mb-4" />
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                  Đăng nhập
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Đăng nhập để tiếp tục sử dụng dịch vụ
                </p>
              </Link>

              <Link
                href="/register"
                className="group flex flex-col items-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <UserPlus className="h-12 w-12 text-zinc-600 dark:text-zinc-400 mb-4" />
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                  Đăng ký
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Tạo tài khoản mới để bắt đầu
                </p>
              </Link>
            </>
          )}
        </div>

        <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Hệ thống Rank
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-900 dark:text-white font-bold mr-3">0</span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Khách</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-900 dark:text-white font-bold mr-3">1-2</span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Thành viên</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center bg-zinc-300 dark:bg-zinc-600 rounded text-zinc-900 dark:text-white font-bold mr-3">3-4</span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Moderator</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 rounded text-white dark:text-zinc-900 font-bold mr-3">5</span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
