"use client";

/**
 * Forgot Password Page - AiCMR Design System
 *
 * Story 6.4: Forgot Password Flow
 *
 * Features:
 * - Request password reset via email
 * - Form validation
 * - Success state with instructions
 * - Link back to login
 *
 * Design System Components:
 * - AuthCard: Centered layout
 * - FormLayout + FormField: Form wrapper
 * - Button: Submit action
 * - Toast: Notifications
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthCardWrapper, AuthCardWrapperFooter } from "@/components/ui/auth-card";
import { Button } from "@/components/ui/button";
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";
import { toast } from "@/components/ui/toast";
import { useMutation } from "@tanstack/react-query";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/auth/forgot-password", { email });
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Không thể gửi email");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    forgotPasswordMutation.mutate(email);
  };

  return (
    <AuthCardWrapper
      title="Quên mật khẩu"
      description="Nhập email để nhận hướng dẫn đặt lại mật khẩu"
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit}>
          <FormLayout
            actions={
              <div className="space-y-3 w-full">
                <Button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  className="w-full"
                >
                  {forgotPasswordMutation.isPending
                    ? "Đang gửi..."
                    : "Gửi hướng dẫn"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại đăng nhập
                </Button>
              </div>
            }
          >
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <p className="text-sm text-muted-foreground">
              Chúng tôi sẽ gửi cho bạn một email có chứa hướng dẫn về cách đặt lại
              mật khẩu của mình.
            </p>
          </FormLayout>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            Kiểm tra email của bạn
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{" "}
            <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.
          </p>

          <div className="space-y-3 w-full">
            <Button
              variant="outline"
              onClick={() => setIsSuccess(false)}
              className="w-full"
            >
              Thử lại
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại đăng nhập
            </Button>
          </div>
        </div>
      )}

      <AuthCardWrapperFooter>
        Nhớ lại mật khẩu?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Đăng nhập
        </Link>
      </AuthCardWrapperFooter>
    </AuthCardWrapper>
  );
}
