"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input-wrapped";
import { Button } from "@/components/ui/button-wrapped";
import { Card } from "@/components/ui/card-wrapped";
import type { LoginRequest } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const getErrorMessage = (error: unknown): string => {
    const fallback = "Đăng nhập thất bại";
    if (!error) return fallback;
    if (typeof error === "string") return error;
    if (typeof error === "object") {
      const anyError = error as {
        message?: unknown;
        response?: { data?: { detail?: unknown } };
      };
      const detail = anyError.response?.data?.detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail)) {
        const msgs = detail
          .map((d) => (d && typeof d === "object" ? (d as { msg?: unknown }).msg : null))
          .filter((m): m is string => typeof m === "string");
        if (msgs.length > 0) return msgs.join("\n");
      }
      if (detail != null) {
        try {
          return JSON.stringify(detail);
        } catch {
          return String(detail);
        }
      }
      if (typeof anyError.message === "string") return anyError.message;
    }
    return fallback;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      setFormError(null);
      console.log("[LoginPage] Submitting login form for:", data.email);
      await login(data);
      console.log("[LoginPage] Login succeeded, showing success toast");
      showSuccess("Đăng nhập thành công!");

      // Fetch user info với retry logic
      let retries = 0;
      const maxRetries = 3;
      let user = null;

      while (retries < maxRetries && !user) {
        try {
          const response = await fetch("/backend/api/v1/users/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });

          if (response.ok) {
            user = await response.json();
            break;
          } else if (response.status === 401) {
            console.warn("[LoginPage] User fetch 401, retrying...");
            retries++;
            await new Promise(resolve => setTimeout(resolve, 500));
          } else {
            console.error("[LoginPage] User fetch failed with status:", response.status);
            break;
          }
        } catch (fetchError) {
          console.error("[LoginPage] User fetch error:", fetchError);
          retries++;
          if (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }

      if (user && user.rank >= 3) {
        console.log("[LoginPage] User has admin rank, redirecting to dashboard");
        router.push("/dashboard/stats");
      } else {
        console.log("[LoginPage] User is regular user, redirecting to home");
        router.push("/");
      }
    } catch (error) {
      console.error("[LoginPage] Login error:", error);
      const message = getErrorMessage(error);
      setFormError(message);
      console.log("[LoginPage] Showing error toast with message:", message);
      showError(message, 8000); // Lỗi hiển thị 8 giây
    }
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <LogIn className="mx-auto h-12 w-12 text-zinc-600 dark:text-zinc-400" />
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
          Đăng nhập
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Mật khẩu"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          Đăng nhập
        </Button>
        {formError && (
          <div className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">
            {formError}
          </div>
        )}

        <div className="flex flex-col items-center space-y-2 text-sm">
          <div className="text-zinc-600 dark:text-zinc-400">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="font-medium text-zinc-900 dark:text-white hover:underline"
            >
              Đăng ký ngay
            </a>
          </div>
          <a
            href="/forgot-password"
            className="text-zinc-600 dark:text-zinc-400 hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
      </form>
    </Card>
  );
}
