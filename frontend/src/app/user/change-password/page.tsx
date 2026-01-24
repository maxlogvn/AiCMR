"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/layout/Breadcrumb";

const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    new_password: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirm_password: z.string().min(6, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await api.patch("/users/me/password", {
        old_password: data.old_password,
        new_password: data.new_password,
      });
      showSuccess("Đổi mật khẩu thành công!");
      reset();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Không thể đổi mật khẩu");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Breadcrumb />

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <CardTitle>Đổi mật khẩu</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Old Password */}
            <div>
              <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu cũ
              </label>
              <input
                id="old_password"
                type="password"
                autoComplete="current-password"
                {...register("old_password")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
              {errors.old_password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.old_password.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu mới
              </label>
              <input
                id="new_password"
                type="password"
                autoComplete="new-password"
                {...register("new_password")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.new_password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                {...register("confirm_password")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>

          {/* Back Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link href="/user/profile">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại hồ sơ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
