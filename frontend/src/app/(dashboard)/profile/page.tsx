"use client";

import { User, Edit2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <div className="p-6 text-center text-red-600 dark:text-red-400">
            Không thể tải thông tin người dùng
          </div>
        </Card>
      </div>
    );
  }

  const getRankLabel = (rank: number): string => {
    if (rank === 5) return 'Admin';
    if (rank >= 3) return 'Moderator';
    if (rank >= 1) return 'Member';
    return 'Guest';
  };

  const getRankBadgeColor = (rank: number): string => {
    if (rank === 5) return 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900';
    if (rank >= 3) return 'bg-zinc-700 text-white dark:bg-zinc-600 dark:text-zinc-300';
    if (rank >= 1) return 'bg-zinc-400 text-white dark:bg-zinc-600 dark:text-zinc-300';
    return 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-300';
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Card title="Hồ sơ của bạn">
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRankBadgeColor(user.rank)}`}>
              {getRankLabel(user.rank)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email
            </label>
            <div className="text-zinc-900 dark:text-white font-medium">{user.email}</div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Tên đăng nhập
            </label>
            <div className="text-zinc-900 dark:text-white font-medium">{user.username}</div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              ID người dùng
            </label>
            <div className="text-zinc-900 dark:text-white font-mono">{user.id}</div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Trạng thái
            </label>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Ngày tham gia
            </label>
            <div className="text-zinc-900 dark:text-white">
              {new Date(user.created_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button className="w-full flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <Edit2 className="h-4 w-4 mr-2" />
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </Card>
    </div>
  );
}
