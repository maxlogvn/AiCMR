"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AuthCardWrapper, AuthCardWrapperFooter } from "@/components/ui/auth-card";
import { Input } from "@/components/ui/input-wrapped";
import { Mail, User, Lock, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await register({ email, username, password });
      setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
    }
  };

  return (
    <AuthCardWrapper
      title="Đăng ký tài khoản"
      description="Tạo tài khoản mới cho AiCMR"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Email */}
        <Input
          label="Email"
          type="email"
          name="email"
          icon={Mail}
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Username */}
        <Input
          label="Tên người dùng"
          type="text"
          name="username"
          icon={User}
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password */}
        <Input
          label="Mật khẩu"
          type="password"
          name="password"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Confirm Password */}
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          name="confirmPassword"
          icon={Lock}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>

      {/* Login Link */}
      <AuthCardWrapperFooter>
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Đăng nhập ngay
        </Link>
      </AuthCardWrapperFooter>
    </AuthCardWrapper>
  );
}
