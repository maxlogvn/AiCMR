"use client";

/**
 * Change Password Page - AiCMR Design System
 *
 * Story 4.4: Change Password Page
 *
 * Features:
 * - Form with 3 fields: Current password, New password, Confirm password
 * - Client-side validation (passwords match, min 8 characters)
 * - POST /api/v1/users/me/change-password
 * - Success/error toast notifications
 * - Redirect to profile after success
 * - Responsive design
 *
 * Design System Components:
 * - LayoutShell: Page header + back button
 * - FormLayout + FormField: Form wrapper
 * - Button: Submit button
 * - Toast: Success/error notifications
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { LayoutShell } from "@/components/ui/layout-shell";
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

// Validation schema
const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    new_password: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số"),
    confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/users/me/change-password", {
        old_password: data.old_password,
        new_password: data.new_password,
      });
    },
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      setTimeout(() => {
        router.push("/user/profile");
      }, 1000);
    },
    onError: (error: any) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Không thể đổi mật khẩu");
    },
  });

  return (
    <LayoutShell
      title="Đổi mật khẩu"
      subtitle="Cập nhật mật khẩu để bảo vệ tài khoản"
      icon={Lock}
      backUrl="/user/profile"
    >
      <form onSubmit={handleSubmit((data) => changePasswordMutation.mutate(data))}>
        <FormLayout
          actions={
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </div>
          }
        >
          {/* Old Password */}
          <FormField
            label="Mật khẩu cũ"
            name="old_password"
            type="password"
            placeholder="••••••••••"
            error={errors.old_password?.message}
            required
            {...register("old_password")}
            autoComplete="current-password"
          />

          {/* New Password */}
          <FormField
            label="Mật khẩu mới"
            name="new_password"
            type="password"
            placeholder="••••••••••"
            error={errors.new_password?.message}
            required
            {...register("new_password")}
            autoComplete="new-password"
          />

          {/* Confirm Password */}
          <FormField
            label="Xác nhận mật khẩu mới"
            name="confirm_password"
            type="password"
            placeholder="••••••••••"
            error={errors.confirm_password?.message}
            required
            {...register("confirm_password")}
            autoComplete="new-password"
          />
        </FormLayout>
      </form>

      {/* Password Requirements */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm font-medium mb-2">Yêu cầu mật khẩu:</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Ít nhất 8 ký tự</li>
          <li>• Ít nhất 1 chữ hoa (A-Z)</li>
          <li>• Ít nhất 1 chữ thường (a-z)</li>
          <li>• Ít nhất 1 số (0-9)</li>
        </ul>
      </div>
    </LayoutShell>
  );
}
