"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, User as UserIcon, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Don't show navbar on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
              AiCMR
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              /* Not logged in */
              <>
                <Link
                  href="/"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === "/" 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Trang chủ
                </Link>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              /* Logged in */
              <>
                <Link
                  href="/"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === "/" 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Trang chủ
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname?.startsWith("/dashboard") 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isLoading 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoading ? "Đang xuất..." : "Đăng xuất"}
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Đăng ký
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
                  >
                    {isLoading ? "Đang xuất..." : "Đăng xuất"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}