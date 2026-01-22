"use client";

import { User, Lock, Home, LogOut, LayoutDashboard, FileText, PenSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const menuItems = [
    {
      label: "Hồ sơ cá nhân",
      icon: <User className="h-5 w-5" />,
      href: "/user/profile",
    },
    {
      label: "Bài đăng của tôi",
      icon: <FileText className="h-5 w-5" />,
      href: "/user/posts",
    },
    {
      label: "Đổi mật khẩu",
      icon: <Lock className="h-5 w-5" />,
      href: "/user/change-password",
    },
  ];

  if (user && user.rank >= 3) {
    menuItems.push({
      label: "Trang quản trị",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    });
  }

  menuItems.push({
    label: "Về trang chủ",
    icon: <Home className="h-5 w-5" />,
    href: "/",
  });

  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col min-h-screen">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-zinc-900 dark:bg-zinc-100 rounded flex items-center justify-center">
            <User className="h-5 w-5 text-white dark:text-zinc-900" />
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            Tài khoản
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
