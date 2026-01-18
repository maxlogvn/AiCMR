import { memo } from "react";
import { Trash2, Edit, Lock } from "lucide-react";
import { Button } from "@/components/ui/button-wrapped";
import type { User } from "@/types";

interface UserRowProps {
  user: User;
  currentUser: User | null;
  onDelete: (id: number) => void;
}

function UserRowComponent({ user, currentUser, onDelete }: UserRowProps) {
  const getRankLabel = (rank: number): string => {
    const labels: Record<number, string> = {
      0: "Guest",
      1: "Member",
      2: "Member",
      3: "Moderator",
      4: "Moderator",
      5: "Admin",
    };
    return labels[rank] || "Unknown";
  };

  const canEdit = currentUser && currentUser.rank === 5;
  const canDelete = currentUser && currentUser.rank === 5;
  const canToggleActive =
    currentUser && currentUser.rank >= 3 && user.id !== currentUser?.id;

  const showEdit = canEdit;
  const showDelete = canDelete;
  const showToggle = !canEdit && canToggleActive;

  const handleToggleActive = () => {
    const newStatus = !user.is_active;
    const confirmMessage = newStatus
      ? `Bạn có chắc chắn muốn kích hoạt người dùng ${user.username}?`
      : `Bạn có chắc chắn muốn vô hiệu hóa người dùng ${user.username}?`;

    if (confirm(confirmMessage)) {
    }
  };

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <td className="p-4 text-zinc-600 dark:text-zinc-400 font-mono text-sm">
        {user.id}
      </td>
      <td className="p-4 text-zinc-900 dark:text-white">{user.email}</td>
      <td className="p-4 text-zinc-900 dark:text-white">{user.username}</td>
      <td className="p-4">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
          {getRankLabel(user.rank)}
        </span>
      </td>
      <td className="p-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {user.is_active ? "Hoạt động" : "Không hoạt động"}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end space-x-2">
          {showEdit && (
            <Button variant="secondary" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {showToggle && (
            <Button variant="secondary" size="sm" onClick={handleToggleActive}>
              <Lock className="h-4 w-4" />
            </Button>
          )}
          {showDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (
                  confirm(
                    `Bạn có chắc chắn muốn xóa người dùng ${user.username}?`,
                  )
                ) {
                  onDelete(user.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export const UserRow = memo(UserRowComponent);
