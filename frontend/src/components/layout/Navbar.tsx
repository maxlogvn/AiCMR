"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, User as UserIcon, Home, LayoutDashboard, BookOpen } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/useToast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { showSuccess, showError } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Detect token on mount and listen to storage changes
  useEffect(() => {
    const token = authService.getToken();
    setToken(token);

    const handleStorageChange = () => {
      const newToken = authService.getToken();
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      console.log("[Navbar] Logout initiated");
      setIsLoggingOut(true);
      
      // Call authService.logout which handles both frontend and backend cleanup
      const result = await authService.logout();
      
      setToken(null);
      setMobileMenuOpen(false);
      
      if (result.success) {
        console.log("[Navbar] Logout successful");
        showSuccess("Đăng xuất thành công");
        // Small delay to show success message before redirect
        setTimeout(() => router.push("/login"), 500);
      } else {
        console.warn("[Navbar] Logout had issues:", result.error);
        showError("Đã gặp lỗi khi đăng xuất, nhưng sẽ chuyển hướng");
        // Still redirect after 1 second even if backend fails
        setTimeout(() => router.push("/login"), 1000);
      }
    } catch (error) {
      console.error("[Navbar] Logout error:", error);
      showError("Lỗi đăng xuất, vui lòng thử lại");
      // Force cleanup and redirect anyway
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setToken(null);
      setTimeout(() => router.push("/login"), 1000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Public pages (no auth required)
  const publicPages = ["/", "/login", "/register", "/install", "/(public)/blog"];

  // Check if current page is public
  const isPublicPage = publicPages.some(page => pathname?.startsWith(page));

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white hidden sm:inline">
              AiCMR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Unauthenticated user */}
            {!token ? (
              <>
                <Link
                  href="/"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === "/" 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Trang chủ
                </Link>
                <Link
                  href="/(public)/blog"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname?.startsWith("/(public)/blog") 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Blog
                </Link>
              </>
            ) : (
              /* Authenticated user */
              <>
                <Link
                  href="/user/profile"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === "/user/profile" 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Hồ sơ
                </Link>
                {user && user.rank >= 3 && (
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      pathname?.startsWith("/dashboard") 
                        ? "text-blue-600 dark:text-blue-400" 
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Quản trị
                  </Link>
                )}
                <Link
                  href="/"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === "/" 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Trang chủ
                </Link>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {token ? (
             <button
                 onClick={handleLogout}
                 disabled={isLoggingOut}
                 className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <LogOut className={`h-4 w-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                 {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
               </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <svg
                className={`h-6 w-6 transition-transform ${mobileMenuOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            {!token ? (
              <>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  href="/(public)/blog"
                  className="block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/user/profile"
                  className="block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hồ sơ cá nhân
                </Link>
                {user && user.rank >= 3 && (
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Quản trị
                  </Link>
                )}
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                 <button
                   onClick={handleLogout}
                   disabled={isLoggingOut}
                   className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                 </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

// Import User icon properly
import { User } from "lucide-react";
