"use client";

import dynamic from "next/dynamic";
import { useForm, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings as SettingsIcon, Save, ExternalLink, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { uploadsApi } from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Input } from "@/components/ui/input-wrapped";
import { Button } from "@/components/ui/button-wrapped";
import FileUpload from "@/components/ui/FileUpload";
import type { Settings as AppSettings, UpdateSettingsRequest } from "@/types";
import type { Attachment } from "@/types";

const Card = dynamic(() =>
  import("@/components/ui/card-wrapped").then((mod) => ({ default: mod.Card })),
);

const settingsSchema = z.object({
  site_name: z.string().min(1, "Tên site là bắt buộc"),
  logo_url: z.string().optional().or(z.literal("")).nullable(),
  favicon_url: z.string().optional().or(z.literal("")).nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  seo_keywords: z.string().optional().nullable(),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
  og_image: z.string().optional().or(z.literal("")).nullable(),
  og_type: z.string().default("website").nullable(),
  og_url: z.string().optional().or(z.literal("")).nullable(),
  twitter_card: z.string().default("summary_large_image").nullable(),
  twitter_title: z.string().optional().nullable(),
  twitter_description: z.string().optional().nullable(),
  twitter_image: z.string().optional().or(z.literal("")).nullable(),
  robots: z.string().default("index, follow").nullable(),
  canonical_url: z.string().optional().or(z.literal("")).nullable(),
  google_analytics_id: z.string().optional().nullable(),
  custom_meta: z.string().optional().nullable(),
  upload_allowed_extensions: z.string().optional().nullable(),
  upload_max_size_mb: z.string().optional().nullable(),
});

type AppSettingsData = z.infer<typeof settingsSchema>;

interface ImageFieldProps {
  label: string;
  fieldName: "logo_url" | "favicon_url" | "og_image" | "twitter_image";
  urlValue: string | null | undefined;
  register: any;
  error?: string;
  setValue: any;
  allowedExtensions?: string[];
  maxSizeMB?: number;
}

function ImageField({
  label,
  fieldName,
  urlValue,
  register,
  error,
  setValue,
  allowedExtensions = ["jpg", "jpeg", "png", "ico", "svg"],
  maxSizeMB = 5,
}: ImageFieldProps) {
  const handleUploadSuccess = (attachment: Attachment) => {
    // Lưu URL proxy từ backend (đã được backend tự động chọn URL SEO nếu is_public=true)
    setValue(fieldName, attachment.url);
  };

  const handleRemoveImage = () => {
    setValue(fieldName, "");
  };

  // Kiểm tra xem URL có phải là file public không dựa vào pattern backend trả về
  const isPublicFile = urlValue?.startsWith("/media/");
  const displayUrl = urlValue ? uploadsApi.getFileUrl(urlValue) : null;
  
  // Debug logging
  console.log("ImageField Debug:", {
    label,
    fieldName,
    urlValue,
    isPublicFile,
    displayUrl
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {urlValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveImage}
            className="h-7 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Xóa
          </Button>
        )}
      </div>

      {urlValue ? (
        <div className="relative group">
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden border-2 border-border relative">
            <Image
              src={displayUrl || urlValue}
              alt={label}
              fill
              referrerPolicy="no-referrer"
              className="object-contain"
              unoptimized
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <a
              href={displayUrl || urlValue}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Xem ảnh
            </a>
          </div>
        </div>
      ) : (
        <FileUpload
          onSuccess={handleUploadSuccess}
          allowedExtensions={allowedExtensions}
          maxSizeMB={maxSizeMB}
          isPublic={true}
          className="max-w-full"
        />
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">hoặc nhập URL:</span>
      </div>

      <Input
        placeholder="https://example.com/image.png"
        error={error}
        {...register(fieldName)}
      />
    </div>
  );
}

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
    setValue,
    watch,
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
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value === null ? undefined : value])
    );
    mutation.mutate(cleanedData as UpdateSettingsRequest);
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
          <div className="space-y-6">
            <Input
              label="Tên site"
              placeholder="AiCMR - Hệ thống quản lý"
              error={errors.site_name?.message}
              {...register("site_name")}
            />

            <ImageField
              label="Logo URL"
              fieldName="logo_url"
              urlValue={watch("logo_url")}
              register={register}
              error={errors.logo_url?.message}
              setValue={setValue}
              allowedExtensions={["jpg", "jpeg", "png", "svg", "webp"]}
              maxSizeMB={5}
            />

            <ImageField
              label="Favicon URL"
              fieldName="favicon_url"
              urlValue={watch("favicon_url")}
              register={register}
              error={errors.favicon_url?.message}
              setValue={setValue}
              allowedExtensions={["ico", "png", "jpg", "jpeg", "svg"]}
              maxSizeMB={1}
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
          <div className="space-y-6">
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

            <ImageField
              label="OG Image URL"
              fieldName="og_image"
              urlValue={watch("og_image")}
              register={register}
              error={errors.og_image?.message}
              setValue={setValue}
              allowedExtensions={["jpg", "jpeg", "png", "webp"]}
              maxSizeMB={5}
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
          <div className="space-y-6">
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

            <ImageField
              label="Twitter Image URL"
              fieldName="twitter_image"
              urlValue={watch("twitter_image")}
              register={register}
              error={errors.twitter_image?.message}
              setValue={setValue}
              allowedExtensions={["jpg", "jpeg", "png", "webp"]}
              maxSizeMB={5}
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

        <Card title="Cấu hình Upload">
          <div className="space-y-4">
            <Input
              label="Định dạng cho phép"
              placeholder="jpg, png, pdf, docx"
              error={errors.upload_allowed_extensions?.message}
              {...register("upload_allowed_extensions")}
              helperText="Danh sách định dạng file phân cách bằng dấu phẩy"
            />
            <Input
              label="Dung lượng tối đa (MB)"
              type="number"
              placeholder="10"
              error={errors.upload_max_size_mb?.message}
              {...register("upload_max_size_mb")}
              helperText="Giới hạn kích thước file upload (tính bằng Megabytes)"
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
