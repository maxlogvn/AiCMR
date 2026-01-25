"use client";

import { HeroSection, FeatureCard, RankSystem, TrustBadge } from "@/components/home";
import { Shield, Zap, Users, Lock, Clock, CheckCircle } from "lucide-react";
import { authService } from "@/lib/auth";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserCircle } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Quản lý Người dùng",
    description: "Quản lý người dùng một cách hiệu quả với đầy đủ thông tin và trạng thái tài khoản",
  },
  {
    icon: Lock,
    title: "Phân Quyền Theo Rank",
    description: "Hệ thống rank từ 0-5 giúp phân quyền linh hoạt cho từng nhóm người dùng",
  },
  {
    icon: Shield,
    title: "Bảo Mật Cao",
    description: "JWT token với refresh rotation giúp bảo vệ tài khoản người dùng tối đa",
  },
  {
    icon: Zap,
    title: "Hiệu Suất Tối Ưu",
    description: "Tích hợp dễ dàng, API nhanh chóng, giao diện hiện đại và responsive",
  },
];

export default function HomePage() {
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = authService.getToken();
      if (newToken === null && !hasLoggedOut.current) {
        hasLoggedOut.current = true;
        setToken(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Nếu đã đăng nhập, redirect đến dashboard hoặc profile
  if (token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 px-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="w-24 h-24 mx-auto bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
            <UserCircle className="h-16 w-16 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Chào mừng trở
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Bạn đã đăng nhập. Tiếp tục làm việc với AiCMR 2
            </p>
          </div>
          <Link
            href="/user/profile"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Đi đến trang cá nhân
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <HeroSection />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Tính Năng Nổi Bật
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Được xây dựng với công nghệ hiện đại, tập trung vào hiệu quả và bảo mật
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Rank System Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Hệ Thống Phân Quyền
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Quản lý quyền truy cập linh hoạt theo từng cấp độ người dùng
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <RankSystem />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Tin Tưởng & Bảo Mật
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Được thiết kế với tiêu chuẩn bảo mật cao nhất
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <TrustBadge icon={Shield} title="Bảo mật" value="99.9%" />
            <TrustBadge icon={Clock} title="Thời gian phản hồi" value="< 100ms" />
            <TrustBadge icon={CheckCircle} title="Uptime" value="99.99%" />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Sẵn Sàng Bắt Đầu?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Đăng ký ngay để trải nghiệm hệ thống quản lý người dùng hiện đại
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-zinc-50 text-blue-600 font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-lg border-2 border-white hover:border-white/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 bg-zinc-900 dark:bg-black border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center text-zinc-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AiCMR. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
