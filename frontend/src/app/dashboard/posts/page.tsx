"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Archive,
  MoreVertical,
  ArrowUpDown,
  Filter,
  FileText,
  LayoutDashboard,
  User,
} from "lucide-react";
import api from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card } from "@/components/ui/card-wrapped";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge-wrapped";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu-wrapped";
import type { Post, PostStatus } from "@/types/post";
import Breadcrumb from "@/components/layout/Breadcrumb";
import QuickNavigation from "@/components/layout/QuickNavigation";
import { PostPagination } from "@/components/post/PostPagination";

const statusColors: Record<PostStatus, string> = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const statusLabels: Record<PostStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

interface Stats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
}

export default function DashboardPostsPage() {
  const { isLoading: userLoading, user } = useUser();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<PostStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const quickLinks = [
    {
      label: "Tổng Quan",
      href: "/dashboard/stats",
      icon: <LayoutDashboard className="h-5 w-5" />,
      description: "Xem thống kê hệ thống",
    },
    {
      label: "Quản Lý Người Dùng",
      href: "/dashboard/users-manager",
      icon: <User className="h-5 w-5" />,
      description: "Quản lý tất cả người dùng",
    },
    ...(user && user.rank === 5
      ? [
          {
            label: "Cài Đặt Hệ Thống",
            href: "/dashboard/settings",
            icon: <Settings className="h-5 w-5" />,
            description: "Cấu hình hệ thống",
          },
        ]
      : []),
  ];

  const { data: postsData, isLoading: postsLoading } = useQuery<{
    items: Post[];
    total: number;
    page: number;
    size: number;
    pages: number;
    stats: {
      total: number;
      published: number;
      draft: number;
      archived: number;
    };
  }>({
    queryKey: ["admin", "posts", filterStatus, searchQuery, page],
    queryFn: async () => {
      const response = await api.get("/backend/api/v1/posts/all", {
        params: {
          status: filterStatus === "all" ? undefined : filterStatus,
          search: searchQuery || undefined,
          page: page,
          size: pageSize,
        },
      });
      return response.data;
    },
  });

  const posts = postsData?.items || [];

  const stats: Stats = {
    total: postsData?.stats.total || 0,
    published: postsData?.stats.published || 0,
    drafts: postsData?.stats.draft || 0,
    archived: postsData?.stats.archived || 0,
  };

  const publishMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      return api.post("/backend/api/v1/posts/bulk/publish", { post_ids: postIds });
    },
    onSuccess: (_, variables) => {
      showSuccess(`Đã đăng ${variables.length} bài viết`);
      setSelectedPosts([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Đăng bài thất bại");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      return api.post("/backend/api/v1/posts/bulk/archive", { post_ids: postIds });
    },
    onSuccess: (_, variables) => {
      showSuccess(`Đã lưu trữ ${variables.length} bài viết`);
      setSelectedPosts([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Lưu trữ thất bại");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      return api.post("/backend/api/v1/posts/bulk/delete", { post_ids: postIds });
    },
    onSuccess: (_, variables) => {
      showSuccess(`Đã xóa ${variables.length} bài viết`);
      setSelectedPosts([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Xóa thất bại");
    },
  });

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((p) => p.id));
    }
  };

  const handlePublish = () => {
    if (selectedPosts.length === 0) {
      showError("Vui lòng chọn ít nhất một bài viết");
      return;
    }
    publishMutation.mutate(selectedPosts);
  };

  const handleArchive = () => {
    if (selectedPosts.length === 0) {
      showError("Vui lòng chọn ít nhất một bài viết");
      return;
    }
    archiveMutation.mutate(selectedPosts);
  };

  const handleDelete = () => {
    if (selectedPosts.length === 0) {
      showError("Vui lòng chọn ít nhất một bài viết");
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedPosts.length} bài viết?`)) {
      deleteMutation.mutate(selectedPosts);
    }
  };

  if (userLoading || postsLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb />

      <QuickNavigation links={quickLinks} title="Thao Tác Nhanh" />

      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-zinc-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Quản Lý Bài Đăng
          </h1>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Quản lý tất cả bài viết trong hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng số</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <Settings className="h-8 w-8 text-zinc-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Đã đăng</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.published}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Draft</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.drafts}
              </p>
            </div>
            <Edit2 className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Lưu trữ</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {stats.archived}
              </p>
            </div>
            <Archive className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      <Card title="Bộ lọc & Tác vụ" className="mb-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as PostStatus | "all");
                setPage(1);
              }}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Draft</option>
              <option value="published">Đã đăng</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>

          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Đã chọn {selectedPosts.length} bài viết
              </span>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={publishMutation.isPending}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Đăng bài
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleArchive}
                disabled={archiveMutation.isPending}
              >
                <Archive className="h-4 w-4 mr-1" />
                Lưu trữ
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedPosts([])}
              >
                Hủy bỏ
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.length && posts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-zinc-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Tiêu đề
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Tác giả
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Lượt xem
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Tác vụ
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPosts([...selectedPosts, post.id]);
                        } else {
                          setSelectedPosts(selectedPosts.filter((id) => id !== post.id));
                        }
                      }}
                      className="rounded border-zinc-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.author?.username || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={statusColors[post.status]}>
                      {statusLabels[post.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.view_count || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(`/user/posts/${post.id}/edit`, "_blank")
                          }
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            archiveMutation.mutate([post.id])
                          }
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Lưu trữ
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => {
                            if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
                              deleteMutation.mutate([post.id]);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-600 dark:text-zinc-400">
                    Không có bài viết nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {postsData && postsData.total > pageSize && (
          <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-700">
            <PostPagination
              total={postsData.total}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
