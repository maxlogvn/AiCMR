"use client";

import { create } from "zustand";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  User,
  FileText,
  FolderTree,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

interface AdminSidebarStore {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const useAdminSidebar = create<AdminSidebarStore>((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
}));

export default function AdminSidebar() {
  const { collapsed, setCollapsed } = useAdminSidebar();
  const { user } = useUser();

  const menuItems = [
    {
      label: "Tổng quan",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard/stats",
      minRank: 3,
    },
    {
      label: "Quản lý người dùng",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/users-manager",
      minRank: 3,
    },
    {
      label: "Quản lý bài đăng",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/posts",
      minRank: 1, // Changed from 3 to 1 - available for all users
    },
    {
      label: "Chuyên mục",
      icon: <FolderTree className="h-5 w-5" />,
      href: "/dashboard/categories",
      minRank: 3,
    },
    {
      label: "Thẻ",
      icon: <Tag className="h-5 w-5" />,
      href: "/dashboard/tags",
      minRank: 3,
    },
    {
      label: "Cấu hình hệ thống",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
      minRank: 5,
    },
  ];

  return (
    <div
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col min-h-screen`}
    >
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-zinc-900 dark:text-white" />
            {!collapsed && (
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Dashboard
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
          >
            <svg
              className={`h-5 w-5 text-zinc-600 dark:text-zinc-400 transition-transform ${collapsed ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Show message if user has no permission for any items */}
      {user && menuItems.every(item => user.rank < item.minRank) && (
        <div className="p-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {!collapsed && "Bạn không có quyền truy cập các tính năng này."}
        </div>
      )}

      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          if (user && user.rank < item.minRank) {
            return null;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                collapsed ? "justify-center" : "justify-start"
              } hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/user/profile"
          className="flex items-center space-x-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
        >
          <User className="h-5 w-5" />
          {!collapsed && <span> Tài khoản của tôi</span>}
        </Link>
      </div>
    </div>
  );
}
