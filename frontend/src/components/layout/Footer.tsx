"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 dark:bg-black border-t border-zinc-800 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-600 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-bold text-white">AiCMR</span>
            </div>
            <p className="text-zinc-400 text-sm">
              Hệ thống quản lý hồ sơ y tế tích hợp AI
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Đăng Nhập
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Đăng Ký
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Tài Nguyên</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Tài Liệu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  API
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Hỗ Trợ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-zinc-400 text-sm">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@aicmr.com" className="hover:text-white transition-colors">
                  support@aicmr.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-zinc-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+84 (0) 123 456 789</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Copyright */}
          <div className="text-zinc-400 text-sm">
            <p>&copy; {currentYear} AiCMR. Tất cả quyền được bảo lưu.</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800/50 rounded-lg"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800/50 rounded-lg"
              title="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800/50 rounded-lg"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              Điều Khoản
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              Chính Sách
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              Quyền Riêng Tư
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
