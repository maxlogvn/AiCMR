"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Save } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/api";
import { Input } from "@/components/ui/input-wrapped";
import { Button } from "@/components/ui/button-wrapped";

const Card = dynamic(
  () =>
    import("@/components/ui/card-wrapped").then((mod) => ({
      default: mod.Card,
    })),
  {
    loading: () => (
      <div className="animate-pulse h-64 bg-zinc-200 rounded-lg dark:bg-zinc-800" />
    ),
  },
);

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
      <Card title="Đổi mật khẩu">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Đổi mật khẩu
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Mật khẩu cũ"
              type="password"
              autoComplete="current-password"
              error={errors.old_password?.message}
              {...register("old_password")}
            />

            <Input
              label="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              error={errors.new_password?.message}
              {...register("new_password")}
            />

            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              autoComplete="new-password"
              error={errors.confirm_password?.message}
              {...register("confirm_password")}
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <a
            href="/user/profile"
            className="w-full flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Quay lại hồ sơ
          </a>
        </div>
      </Card>
    </div>
  );
}
