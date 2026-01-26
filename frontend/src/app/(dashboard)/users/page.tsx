"use client";

/**
 * User Listing Page - AiCMR Design System
 *
 * Story 4.1: User Listing Page Redesign
 *
 * Features:
 * - DataTable with sorting (email, name, rank, status)
 * - Search by email/name
 * - Rank badge display
 * - Status badge (active/inactive)
 * - Action buttons (Activate/Deactivate/Delete)
 * - Pagination (20 users per page)
 * - Responsive design
 *
 * Design System Components:
 * - LayoutShell: Page header + actions
 * - DataTable: Sorting, selection, pagination
 * - Badge: Rank badge, Status badge
 * - Modal: Confirmation dialogs
 * - Toast: Success/error notifications
 *
 * @example
 * // Pattern: Listing Page with DataTable + Search + Actions
 * // Copy from: Common Patterns Guide - Pattern 1
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, MoreHorizontal, Shield } from "lucide-react";
import { LayoutShell } from "@/components/ui/layout-shell";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { Users } from "lucide-react";
import { useUser } from "@/hooks/useUser";

// Types
interface User {
  id: number;
  email: string;
  full_name: string;
  rank: number;
  is_active: boolean;
  created_at: string;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();
  const isAdmin = currentUser?.rank === 10;

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const pageSize = 20;

  // Modal states
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRank, setNewRank] = useState<number>(0);

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search, sortField, sortOrder],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;
      return api.get("/users", {
        params: {
          page,
          size: pageSize,
          search,
          sort_field: sortField,
          sort_order: sortOrder,
        },
      });
    },
  });

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;

  // Mutations
  const activateMutation = useMutation({
    mutationFn: async (userId: number) => {
      const api = (await import("@/lib/api")).default;
      return api.patch(`/users/${userId}/activate`);
    },
    onSuccess: () => {
      toast.success("Kích hoạt tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setActivateModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Không thể kích hoạt tài khoản");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (userId: number) => {
      const api = (await import("@/lib/api")).default;
      return api.patch(`/users/${userId}/deactivate`);
    },
    onSuccess: () => {
      toast.success("Vô hiệu hóa tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeactivateModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Không thể vô hiệu hóa tài khoản");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      const api = (await import("@/lib/api")).default;
      return api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      toast.success("Xóa người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Không thể xóa người dùng");
    },
  });

  const rankMutation = useMutation({
    mutationFn: async ({ userId, rank }: { userId: number; rank: number }) => {
      const api = (await import("@/lib/api")).default;
      return api.put(`/users/${userId}`, { rank });
    },
    onSuccess: () => {
      toast.success("Thay đổi rank thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setRankModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Không thể thay đổi rank");
    },
  });

  // Helpers
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Action handlers
  const openActivateModal = (user: User) => {
    setSelectedUser(user);
    setActivateModalOpen(true);
  };

  const openDeactivateModal = (user: User) => {
    setSelectedUser(user);
    setDeactivateModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const openRankModal = (user: User) => {
    setSelectedUser(user);
    setNewRank(user.rank);
    setRankModalOpen(true);
  };

  // DataTable columns
  const columns = [
    {
      key: "full_name",
      label: "Họ và tên",
      sortable: true,
      cell: (row: User) => (
        <div className="font-medium">{row.full_name}</div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      cell: (row: User) => (
        <div className="text-sm text-muted-foreground">{row.email}</div>
      ),
    },
    {
      key: "rank",
      label: "Rank",
      sortable: true,
      cell: (row: User) => (
        <Badge variant={getRankVariant(row.rank)}>
          {getRankLabel(row.rank)}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Trạng thái",
      sortable: true,
      cell: (row: User) => (
        <Badge variant={row.is_active ? "success" : "error"}>
          {row.is_active ? "Hoạt động" : "Vô hiệu"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Ngày tham gia",
      sortable: true,
      cell: (row: User) => {
        const date = new Date(row.created_at);
        return <div className="text-sm text-muted-foreground">{date.toLocaleDateString("vi-VN")}</div>;
      },
    },
    {
      key: "actions",
      label: "",
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          {row.is_active ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openDeactivateModal(row)}
            >
              Vô hiệu
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openActivateModal(row)}
            >
              Kích hoạt
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openRankModal(row)}
            >
              <Shield className="h-3 w-3 mr-1" />
              Rank
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => openDeleteModal(row)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <LayoutShell
        title="Quản lý người dùng"
        subtitle="Quản lý tài khoản, phân quyền và kiểm tra hoạt động"
        icon={Users}
        actions={
          <Button onClick={() => router.push("/dashboard/users/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo người dùng
          </Button>
        }
      >
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Tìm kiếm theo email hoặc tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={users}
          columns={columns}
          pagination
          page={page}
          pageSize={pageSize}
          totalItems={total}
          onPageChange={setPage}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field);
            setSortOrder(order as "asc" | "desc");
          }}
        />
      </LayoutShell>

      {/* Activate Confirmation Modal */}
      <Modal open={activateModalOpen} onOpenChange={setActivateModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Kích hoạt tài khoản</ModalTitle>
          </ModalHeader>

          {selectedUser && (
            <>
              <p className="py-4">
                Bạn có chắc muốn kích hoạt tài khoản <strong>{selectedUser.email}</strong> không?
              </p>
              <ModalFooter>
                <Button variant="secondary" onClick={() => setActivateModalOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={() => selectedUser && activateMutation.mutate(selectedUser.id)}
                  disabled={activateMutation.isPending}
                >
                  {activateMutation.isPending ? "Đang xử lý..." : "Kích hoạt"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Deactivate Confirmation Modal */}
      <Modal open={deactivateModalOpen} onOpenChange={setDeactivateModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Vô hiệu hóa tài khoản</ModalTitle>
          </ModalHeader>

          {selectedUser && (
            <>
              <p className="py-4">
                Bạn có chắc muốn vô hiệu hóa tài khoản <strong>{selectedUser.email}</strong> không?
                Người dùng sẽ không thể đăng nhập sau khi vô hiệu.
              </p>
              <ModalFooter>
                <Button variant="secondary" onClick={() => setDeactivateModalOpen(false)}>
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedUser && deactivateMutation.mutate(selectedUser.id)}
                  disabled={deactivateMutation.isPending}
                >
                  {deactivateMutation.isPending ? "Đang xử lý..." : "Vô hiệu hóa"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Xóa người dùng</ModalTitle>
          </ModalHeader>

          {selectedUser && (
            <>
              <p className="py-4">
                Bạn có chắc muốn xóa người dùng <strong>{selectedUser.email}</strong>?
                Hành động này không thể hoàn tác.
              </p>
              <ModalFooter>
                <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Rank Change Modal */}
      <Modal open={rankModalOpen} onOpenChange={setRankModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Thay đổi Rank</ModalTitle>
          </ModalHeader>

          {selectedUser && (
            <>
              <div className="py-4 space-y-4">
                <p>
                  Thay đổi rank cho <strong>{selectedUser.email}</strong>
                </p>

                <div>
                  <label className="block text-sm font-medium mb-2">Chọn Rank</label>
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value={0}>Guest (0) - Khách</option>
                    <option value={1}>Member (1) - Thành viên</option>
                    <option value={2}>Member (2) - Thành viên</option>
                    <option value={3}>Editor (3) - Biên tập viên</option>
                    <option value={4}>Editor (4) - Biên tập viên</option>
                    <option value={5}>Moderator (5) - Điều phối viên</option>
                    <option value={10}>Admin (10) - Quản trị viên</option>
                  </select>
                </div>

                {selectedUser.rank !== newRank && (
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p className="font-medium">Thay đổi:</p>
                    <p>
                      <Badge variant={getRankVariant(selectedUser.rank)}>
                        {getRankLabel(selectedUser.rank)}
                      </Badge>
                      <span className="mx-2">→</span>
                      <Badge variant={getRankVariant(newRank)}>
                        {getRankLabel(newRank)}
                      </Badge>
                    </p>
                  </div>
                )}
              </div>

              <ModalFooter>
                <Button variant="secondary" onClick={() => setRankModalOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={() => selectedUser && rankMutation.mutate({ userId: selectedUser.id, rank: newRank })}
                  disabled={rankMutation.isPending || selectedUser.rank === newRank}
                >
                  {rankMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
