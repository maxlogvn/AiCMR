"use client";

import Link from "next/link";
import { User, Edit2, Lock, Home } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RankBadge } from "@/components/ui/rank-badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function ProfilePage() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardContent className="p-6 text-center text-red-600 dark:text-red-500">
            Không thể tải thông tin người dùng
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumb />

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Hồ sơ của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Avatar Section */}
          <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="mb-2">
              <RankBadge rank={user.rank as any} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {user.email}
            </p>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="text-gray-900 dark:text-white font-medium">
                {user.email}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên đăng nhập
              </label>
              <div className="text-gray-900 dark:text-white font-medium">
                {user.username}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ID người dùng
              </label>
              <div className="text-gray-900 dark:text-white font-mono text-sm">
                {user.id}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trạng thái
              </label>
              <div>
                <Badge
                  variant={user.is_active ? "success" : "destructive"}
                  className="text-xs"
                >
                  {user.is_active ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày tham gia
              </label>
              <div className="text-gray-900 dark:text-white text-sm">
                {new Date(user.created_at).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link href="/user/change-password">
              <Button variant="outline" className="w-full">
                <Edit2 className="h-4 w-4 mr-2" />
                Đổi mật khẩu
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Trang chủ
              </Button>
            </Link>
            {user.rank >= 3 && (
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Lock className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
