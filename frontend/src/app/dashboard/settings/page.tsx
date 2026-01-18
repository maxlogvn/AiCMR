"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Input } from "@/components/ui/input-wrapped";
import { Button } from "@/components/ui/button-wrapped";
import type { Settings as AppSettings, UpdateSettingsRequest } from "@/types";

const Card = dynamic(() =>
  import("@/components/ui/card-wrapped").then((mod) => ({ default: mod.Card })),
);

const settingsSchema = z.object({
  site_name: z.string().min(1, "Tên site là bắt buộc"),
  logo_url: z.string().url().optional().or(z.literal("")),
  favicon_url: z.string().url().optional().or(z.literal("")),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().url().optional().or(z.literal("")),
  og_type: z.string().default("website"),
  og_url: z.string().url().optional().or(z.literal("")),
  twitter_card: z.string().default("summary_large_image"),
  twitter_title: z.string().optional(),
  twitter_description: z.string().optional(),
  twitter_image: z.string().url().optional().or(z.literal("")),
  robots: z.string().default("index, follow"),
  canonical_url: z.string().url().optional().or(z.literal("")),
  google_analytics_id: z.string().optional(),
  custom_meta: z.string().optional(),
});

type AppSettingsData = z.infer<typeof settingsSchema>;

export default function DashboardSettingsPage() {
  const { isLoading } = useUser();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading: settingsLoading } = useQuery<AppSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const { settingsApi } = await import("@/lib/api");
      const response = await settingsApi.getSettings();
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    values: settings,
  });

  const mutation = useMutation({
    mutationFn: async (data: UpdateSettingsRequest) => {
      const { settingsApi } = await import("@/lib/api");
      return settingsApi.updateSettings(data);
    },
    onSuccess: () => {
      showSuccess("Cập nhật cài đặt thành công!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Cập nhật cài đặt thất bại");
    },
  });

  const onSubmit = (data: AppSettingsData) => {
    mutation.mutate(data);
  };

  if (isLoading || settingsLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6 text-zinc-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Cấu hình hệ thống
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Thông tin chung">
          <div className="space-y-4">
            <Input
              label="Tên site"
              placeholder="AiCMR - Hệ thống quản lý"
              error={errors.site_name?.message}
              {...register("site_name")}
            />

            <Input
              label="Logo URL"
              placeholder="https://example.com/logo.png"
              error={errors.logo_url?.message}
              {...register("logo_url")}
            />

            <Input
              label="Favicon URL"
              placeholder="https://example.com/favicon.ico"
              error={errors.favicon_url?.message}
              {...register("favicon_url")}
            />
          </div>
        </Card>

        <Card title="SEO Metadata">
          <div className="space-y-4">
            <Input
              label="SEO Title"
              placeholder="AiCMR - Hệ thống quản lý người dùng"
              error={errors.seo_title?.message}
              {...register("seo_title")}
            />

            <Input
              label="SEO Description"
              placeholder="Mô tả ngắn gọn về website"
              error={errors.seo_description?.message}
              {...register("seo_description")}
            />

            <Input
              label="SEO Keywords"
              placeholder="keyword1, keyword2, keyword3"
              error={errors.seo_keywords?.message}
              {...register("seo_keywords")}
            />

            <Input
              label="Canonical URL"
              placeholder="https://yourdomain.com"
              error={errors.canonical_url?.message}
              {...register("canonical_url")}
            />

            <Input
              label="Robots.txt"
              placeholder="index, follow"
              error={errors.robots?.message}
              {...register("robots")}
            />
          </div>
        </Card>

        <Card title="Open Graph (Facebook/Social)">
          <div className="space-y-4">
            <Input
              label="OG Title"
              placeholder="Tiêu đề hiển thị khi chia sẻ"
              error={errors.og_title?.message}
              {...register("og_title")}
            />

            <Input
              label="OG Description"
              placeholder="Mô tả hiển thị khi chia sẻ"
              error={errors.og_description?.message}
              {...register("og_description")}
            />

            <Input
              label="OG Image URL"
              placeholder="https://example.com/og-image.png"
              error={errors.og_image?.message}
              {...register("og_image")}
            />

            <Input
              label="OG Type"
              error={errors.og_type?.message}
              {...register("og_type")}
            />

            <Input
              label="OG URL"
              placeholder="https://yourdomain.com"
              error={errors.og_url?.message}
              {...register("og_url")}
            />
          </div>
        </Card>

        <Card title="Twitter Card">
          <div className="space-y-4">
            <Input
              label="Card Type"
              error={errors.twitter_card?.message}
              {...register("twitter_card")}
            />

            <Input
              label="Twitter Title"
              placeholder="Tiêu đề hiển thị trên Twitter"
              error={errors.twitter_title?.message}
              {...register("twitter_title")}
            />

            <Input
              label="Twitter Description"
              placeholder="Mô tả hiển thị trên Twitter"
              error={errors.twitter_description?.message}
              {...register("twitter_description")}
            />

            <Input
              label="Twitter Image URL"
              placeholder="https://example.com/twitter-image.png"
              error={errors.twitter_image?.message}
              {...register("twitter_image")}
            />
          </div>
        </Card>

        <Card title="Google Analytics">
          <div className="space-y-4">
            <Input
              label="Google Analytics ID"
              placeholder="G-XXXXXXXXXX"
              error={errors.google_analytics_id?.message}
              {...register("google_analytics_id")}
            />
          </div>
        </Card>

        <Card title="Custom Meta Tags">
          <div className="space-y-4">
            <Input
              label="Custom Meta (JSON)"
              placeholder='{"name": "viewport", "content": "width=device-width"}'
              error={errors.custom_meta?.message}
              {...register("custom_meta")}
            />
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => reset(settings || undefined)}
            variant="secondary"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Lưu thay đổi</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
