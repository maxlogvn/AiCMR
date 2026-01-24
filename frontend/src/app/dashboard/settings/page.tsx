"use client";

/**
 * Settings Page - Linear/Vercel Style Redesign
 *
 * Features:
 * - Orange accent header (consistent with other dashboard pages)
 * - Tabbed navigation for sections
 * - Grouped settings by category
 * - Better organization and UX
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Settings as SettingsIcon,
  Save,
  ExternalLink,
  Trash2,
  Globe,
  Search,
  Share2,
  BarChart3,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/ui/FileUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Settings as AppSettings, UpdateSettingsRequest } from "@/types";
import type { Attachment } from "@/types";

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

// Tab definitions
type SettingsTab = "general" | "seo" | "social" | "analytics" | "upload";

const tabs: { id: SettingsTab; label: string; icon: any }[] = [
  { id: "general", label: "Tổng quan", icon: FileText },
  { id: "seo", label: "SEO", icon: Search },
  { id: "social", label: "Mạng xã hội", icon: Share2 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "upload", label: "Upload", icon: Upload },
];

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
    setValue(fieldName, attachment.url);
  };

  const handleRemoveImage = () => {
    setValue(fieldName, "");
  };

  const displayUrl = urlValue ? `/api/v1${urlValue}` : null;

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
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<AppSettingsData | null>(null);

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
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    values: settings,
  });

  // Track form changes for Save button active state
  const formValues = watch();
  const isDirty = Object.keys(dirtyFields).length > 0;

  // Reset hasChanges when settings are loaded
  useEffect(() => {
    if (settings) {
      setHasChanges(false);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data: UpdateSettingsRequest) => {
      const { settingsApi } = await import("@/lib/api");
      return settingsApi.updateSettings(data);
    },
    onSuccess: () => {
      showSuccess("Cập nhật cài đặt thành công!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setSaveSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Cập nhật cài đặt thất bại");
    },
  });

  const handleConfirmSave = () => {
    if (!pendingData) return;
    const cleanedData = Object.fromEntries(
      Object.entries(pendingData).map(([key, value]) => [key, value === null ? undefined : value])
    );
    mutation.mutate(cleanedData as UpdateSettingsRequest);
    setConfirmDialogOpen(false);
    setPendingData(null);
  };

  const onSubmit = (data: AppSettingsData) => {
    setPendingData(data);
    setConfirmDialogOpen(true);
  };

  if (isLoading || settingsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
          <div>
            <div className="h-7 w-48 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-96 rounded-lg border bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header - Orange accent (consistent with other pages) */}
      <PageHeader
        title="Cấu hình hệ thống"
        subtitle="Tùy chỉnh cài đặt cho website của bạn"
        icon={SettingsIcon}
        badge={
          <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 whitespace-nowrap">
            ⚠️ Requires Care
          </span>
        }
      />

      {/* Save success toast indicator - shown via toast when saved */}
      {saveSuccess && (
        <div className="mb-4 flex items-center gap-2 text-sm text-[rgb(var(--semantic-success))]">
          <CheckCircle2 className="h-4 w-4" />
          <span>Đã lưu cài đặt thành công</span>
        </div>
      )}

      {/* Tabbed Navigation */}
      <div className="mb-6">
        <div className="border-b">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-orange-500 text-orange-600 dark:text-orange-400"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Site Identity Card */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                Danh tính website
              </h3>
              <div className="space-y-6">
                <Input
                  label="Tên site"
                  placeholder="AiCMR - Hệ thống quản lý"
                  error={errors.site_name?.message}
                  {...register("site_name")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                Cấu hình SEO
              </h3>
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
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          <div className="space-y-6">
            {/* Open Graph Card */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-500" />
                Open Graph (Facebook/Social)
              </h3>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>

            {/* Twitter Card */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-sky-500" />
                Twitter Card
              </h3>
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
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                Google Analytics
              </h3>
              <div className="space-y-4">
                <Input
                  label="Google Analytics ID"
                  placeholder="G-XXXXXXXXXX"
                  error={errors.google_analytics_id?.message}
                  {...register("google_analytics_id")}
                  helperText="Nhập ID Google Analytics (GA4) để theo dõi truy cập"
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Custom Meta Tags</h3>
              <div className="space-y-4">
                <Input
                  label="Custom Meta (JSON)"
                  placeholder='{"name": "viewport", "content": "width=device-width"}'
                  error={errors.custom_meta?.message}
                  {...register("custom_meta")}
                  helperText="Thêm custom meta tags dưới dạng JSON"
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-muted-foreground" />
                Cấu hình Upload
              </h3>
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
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="sticky bottom-0 flex justify-end gap-4 p-4 border-t bg-background/95 backdrop-blur rounded-b-lg">
          <Button
            type="button"
            onClick={() => reset(settings || undefined)}
            variant="outline"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className={cn(
              "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white",
              isDirty && "shadow-lg shadow-yellow-500/20"
            )}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Đang lưu..." : isDirty ? "Lưu thay đổi" : "Không có thay đổi"}
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Xác nhận lưu cài đặt
            </DialogTitle>
            <DialogDescription>
              Bạn đang thay đổi cài đặt hệ thống. Những thay đổi này có thể ảnh hưởng đến toàn bộ website.
              Hãy chắc chắn rằng bạn đã kiểm tra kỹ các giá trị trước khi lưu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                setPendingData(null);
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Xác nhận lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
