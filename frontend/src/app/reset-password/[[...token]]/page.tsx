"use client";

/**
 * Reset Password Page - AiCMR Design System
 *
 * Story 6.4: Forgot Password Flow (part 2)
 *
 * Features:
 * - Reset password with token from email
 * - Form validation (passwords match, min 8 chars)
 * - Success state with redirect
 * - Error handling for invalid tokens
 *
 * Design System Components:
 * - AuthCard: Centered layout
 * - FormLayout + FormField: Form wrapper
 * - Button: Submit action
 * - Toast: Notifications
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Lock, CheckCircle } from "lucide-react";
import { AuthCardWrapper } from "@/components/ui/auth-card";
import { Button } from "@/components/ui/button";
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";
import { toast } from "@/components/ui/toast";
import { useMutation } from "@tanstack/react-query";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  // Get token from URL catch-all route
  const token = params.token?.join("/") || "";

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      toast.error("Token đặt lại mật khẩu không hợp lệ");
    }
  }, [token]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/auth/reset-password", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Đặt lại mật khẩu thành công!");

      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Không thể đặt lại mật khẩu");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isTokenValid) {
      toast.error("Token không hợp lệ");
      return;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    resetPasswordMutation.mutate({ token, password });
  };

  if (!isTokenValid) {
    return (
      <AuthCardWrapper
        title="Liên kết không hợp lệ"
        description="Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ"
      >
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-6">
            Vui lòng yêu cầu đặt lại mật khẩu mới.
          </p>

          <div className="space-y-3 w-full">
            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full"
            >
              Yêu cầu đặt lại mật khẩu
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full"
            >
              Quay lại đăng nhập
            </Button>
          </div>
        </div>
      </AuthCardWrapper>
    );
  }

  return (
    <AuthCardWrapper
      title="Đặt lại mật khẩu"
      description="Nhập mật khẩu mới cho tài khoản của bạn"
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit}>
          <FormLayout
            actions={
              <Button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full"
              >
                {resetPasswordMutation.isPending
                  ? "Đang xử lý..."
                  : "Đặt lại mật khẩu"}
              </Button>
            }
          >
            <FormField
              label="Mật khẩu mới"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <FormField
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Password Requirements */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm font-medium mb-2">Yêu cầu mật khẩu:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ít nhất 8 ký tự</li>
              </ul>
            </div>
          </FormLayout>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            Đặt lại mật khẩu thành công!
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            Mật khẩu của bạn đã được đặt lại thành công. Đang chuyển hướng đến
            trang đăng nhập...
          </p>

          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Đến trang đăng nhập
          </Button>
        </div>
      )}
    </AuthCardWrapper>
  );
}
