"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AuthCardWrapper, AuthCardWrapperFooter } from "@/components/ui/auth-card";
import { Input } from "@/components/ui/input-wrapped";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      router.push("/dashboard/stats");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    }
  };

  return (
    <AuthCardWrapper
      title="Đăng nhập"
      description="AiCMR - Hệ thống quản lý y tế"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
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

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      {/* Register Link */}
      <AuthCardWrapperFooter>
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Đăng ký ngay
        </Link>
      </AuthCardWrapperFooter>
    </AuthCardWrapper>
  );
}
