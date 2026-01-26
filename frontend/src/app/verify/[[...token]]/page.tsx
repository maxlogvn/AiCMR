"use client";

/**
 * Email Verification Page - AiCMR Design System
 *
 * Story 6.3: Email Verification
 *
 * Features:
 * - Verify email from token in URL
 * - Display success/error state
 * - Auto-redirect to login after success
 * - Resend verification email option
 *
 * Design System Components:
 * - AuthCard: Centered layout
 * - Badge: Status indicator
 * - Button: Actions
 * - Toast: Notifications
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle, XCircle, Mail, RefreshCw } from "lucide-react";
import { AuthCardWrapper } from "@/components/ui/auth-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

type VerificationStatus = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");

  // Get token from URL catch-all route
  const token = params.token?.join("/") || "";

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token xác thực không hợp lệ");
        return;
      }

      try {
        const api = (await import("@/lib/api")).default;
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Xác thực email thành công!");
        toast.success("Email đã được xác thực");

        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.detail || "Xác thực email thất bại");
        toast.error("Không thể xác thực email");
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResend = async () => {
    try {
      const api = (await import("@/lib/api")).default;
      await api.post("/auth/resend-verification");
      toast.success("Đã gửi lại email xác thực");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Không thể gửi lại email");
    }
  };

  return (
    <AuthCardWrapper
      title="Xác thực Email"
      description="Xác thực địa chỉ email của bạn"
    >
      <div className="flex flex-col items-center py-8">
        {/* Icon */}
        {status === "loading" && (
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}

        {status === "success" && (
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        )}

        {status === "error" && (
          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        )}

        {/* Status Badge */}
        {status !== "loading" && (
          <div className="mb-4">
            <Badge variant={status === "success" ? "success" : "error"}>
              {status === "success" ? "Thành công" : "Thất bại"}
            </Badge>
          </div>
        )}

        {/* Message */}
        <p className="text-center text-muted-foreground mb-6">
          {status === "loading"
            ? "Đang xác thực email của bạn..."
            : message}
        </p>

        {/* Actions */}
        {status === "success" && (
          <div className="text-sm text-muted-foreground">
            Đang chuyển hướng đến trang đăng nhập...
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3 w-full">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Về trang đăng nhập
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={handleResend}
            >
              <Mail className="h-4 w-4 mr-2" />
              Gửi lại email xác thực
            </Button>
          </div>
        )}
      </div>
    </AuthCardWrapper>
  );
}
