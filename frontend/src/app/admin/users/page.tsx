"use client";

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { User, PaginatedResponse } from '@/types';

const UserRow = dynamic(() => import('./UserRow').then(mod => ({ default: mod.UserRow })));

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const size = 10;
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<PaginatedResponse<User>>({
    queryKey: ['admin', 'users', page],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<User>>(`/users/?page=${page}&size=${size}`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      showSuccess('Xóa người dùng thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || 'Không thể xóa người dùng');
    },
  });

  const handleDelete = useCallback((userId: number) => {
    deleteMutation.mutate(userId);
  }, [deleteMutation]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8 text-center">Đã xảy ra lỗi khi tải danh sách người dùng.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-zinc-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Quản lý người dùng
          </h1>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">ID</th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Email</th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Username</th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Rank</th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Trạng thái</th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((user) => (
                <UserRow key={user.id} user={user} onDelete={handleDelete} />
              ))}
              {data?.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">
            Tổng cộng: {data?.total || 0} người dùng
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-zinc-900 dark:text-white px-2">
              Trang {page}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={!data || data.items.length < size}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
