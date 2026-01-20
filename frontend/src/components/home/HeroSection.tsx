import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center space-y-6">
      <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          Hệ thống quản lý người dùng thế hệ mới
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
        Chào mừng đến với{" "}
        <span className="text-blue-600 dark:text-blue-400">AiCMR</span>
      </h1>

      <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        Nền tảng quản lý người dùng hiện đại với phân quyền linh hoạt theo rank.
        An toàn, bảo mật, dễ dàng tích hợp vào mọi dự án.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <Link
          href="/login"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          Đăng nhập
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>

        <Link
          href="/register"
          className="inline-flex items-center px-8 py-4 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-semibold rounded-lg border-2 border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
