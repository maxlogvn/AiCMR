"use client";

/**
 * User Profile Page - AiCMR Design System
 *
 * Story 4.3: User Profile Page Redesign
 *
 * Features:
 * - Display user information (email, full name, rank, join date, status)
 * - Edit button to open modal
 * - Edit form in modal using FormLayout + FormField
 * - Update profile via PUT /api/v1/users/me
 * - Success/error toast notifications
 * - Responsive design
 *
 * Design System Components:
 * - LayoutShell: Page header + back button
 * - Card: Profile info display
 * - Badge: Rank badge, Status badge
 * - Modal: Edit profile form
 * - FormLayout + FormField: Edit form
 * - Toast: Success/error notifications
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Edit2, Home, Lock } from "lucide-react";
import { LayoutShell } from "@/components/ui/layout-shell";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";
import { toast } from "@/components/ui/toast";
import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, error } = useUser();

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { full_name: string }) => {
      const api = (await import("@/lib/api")).default;
      return api.put("/users/me", data);
    },
    onSuccess: () => {
      toast.success("Cập nhật hồ sơ thành công");
      setEditModalOpen(false);
      // Refresh user data
      window.location.reload();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Không thể cập nhật hồ sơ");
    },
  });

  // Helper functions
  const getRankLabel = (rank: number) => {
    if (rank === 0) return "Guest";
    if (rank <= 2) return "Member";
    if (rank <= 4) return "Editor";
    if (rank === 5) return "Moderator";
    if (rank === 10) return "Admin";
    return `Rank ${rank}`;
  };

  const getRankVariant = (rank: number): "primary" | "success" | "warning" | "error" | "info" => {
    if (rank === 0) return "info";
    if (rank <= 2) return "primary";
    if (rank <= 4) return "success";
    if (rank === 5) return "warning";
    if (rank === 10) return "error";
    return "primary";
  };

  // Loading state
  if (isLoading) {
    return (
      <LayoutShell title="Hồ sơ" icon={User}>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </LayoutShell>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <LayoutShell title="Lỗi" icon={User}>
        <div className="text-center py-12">
          <p className="text-destructive">Không thể tải thông tin người dùng</p>
        </div>
      </LayoutShell>
    );
  }

  return (
    <>
      <LayoutShell
        title="Hồ sơ của tôi"
        subtitle="Quản lý thông tin cá nhân"
        icon={User}
        actions={
          <Button onClick={() => setEditModalOpen(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        }
      >
        {/* Profile Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card>
            <CardHeader title="Thông tin cơ bản" />
            <CardBody className="space-y-4">
              {/* Avatar + Email */}
              <div className="text-center pb-4 border-b border-border">
                <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="mb-2">
                  <Badge variant={getRankVariant(user.rank as number)}>
                    {getRankLabel(user.rank as number)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tên đầy đủ</label>
                  <p className="font-medium">{user.full_name || "Chưa cập nhật"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tên đăng nhập</label>
                  <p className="font-medium font-mono text-sm">{user.username}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID người dùng</label>
                  <p className="font-mono text-sm text-muted-foreground">{user.id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                  <div className="mt-1">
                    <Badge variant={user.is_active ? "success" : "error"}>
                      {user.is_active ? "Hoạt động" : "Vô hiệu"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader title="Thông tin tài khoản" />
            <CardBody className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ngày tham gia</label>
                <p className="text-sm">
                  {new Date(user.created_at).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Rank</label>
                <div className="mt-1">
                  <Badge variant={getRankVariant(user.rank as number)}>
                    {getRankLabel(user.rank as number)}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Quyền hạn</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.rank === 10 && "Quản trị viên - Full quyền truy cập"}
                  {user.rank === 5 && "Điều hành viên - Quản lý nội dung"}
                  {user.rank >= 3 && user.rank <= 4 && "Biên tập viên - Đăng bài viết"}
                  {user.rank >= 1 && user.rank <= 2 && "Thành viên - Người dùng thường"}
                  {user.rank === 0 && "Khách - Chưa đăng nhập"}
                </p>
              </div>
            </CardBody>
            <CardFooter className="gap-2">
              <Button
                variant="secondary"
                onClick={() => router.push("/user/change-password")}
                className="flex-1"
              >
                <Lock className="h-4 w-4 mr-2" />
                Đổi mật khẩu
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Trang chủ
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Dashboard Access (Editor+) */}
        {user.rank >= 3 && (
          <Card>
            <CardHeader title="Truy cập nhanh" />
            <CardBody>
              <Button
                variant="secondary"
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                Mở Dashboard
              </Button>
            </CardBody>
          </Card>
        )}
      </LayoutShell>

      {/* Edit Profile Modal */}
      <Modal open={editModalOpen} onOpenChange={setEditModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Chỉnh sửa hồ sơ</ModalTitle>
          </ModalHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate({ full_name: (e.target as any).full_name.value });
            }}
          >
            <FormLayout
              actions={
                <ModalFooter>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </ModalFooter>
              }
            >
              <FormField
                label="Tên đầy đủ"
                name="full_name"
                defaultValue={user.full_name || ""}
                placeholder="Nhập tên đầy đủ của bạn"
                required
              />
            </FormLayout>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
