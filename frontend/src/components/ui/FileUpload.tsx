"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, File as FileIcon, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadsApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { Attachment } from "@/types";

interface FileUploadProps {
  onSuccess?: (attachment: Attachment) => void;
  maxSizeMB?: number;
  allowedExtensions?: string[];
  className?: string;
}

export default function FileUpload({
  onSuccess,
  maxSizeMB = 10,
  allowedExtensions = ["jpg", "jpeg", "png", "pdf", "doc", "docx", "xls", "xlsx"],
  className,
}: FileUploadProps) {
  const { showSuccess, showError } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        return `Kích thước file vượt quá ${maxSizeMB}MB`;
      }

      // Check extension
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension && !allowedExtensions.includes(extension)) {
        return `Định dạng file .${extension} không được hỗ trợ`;
      }

      return null;
    },
    [maxSizeMB, allowedExtensions]
  );

  const handleUpload = useCallback(
    async (selectedFile: File) => {
      const error = validateFile(selectedFile);
      if (error) {
        showError(error);
        return;
      }

      setFile(selectedFile);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const response = await uploadsApi.uploadFile(selectedFile, (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        });

        showSuccess("Tải lên tập tin thành công!");
        onSuccess?.(response.data);
        // Giữ trạng thái thành công trong 2 giây rồi reset
        setTimeout(resetState, 2000);
      } catch (err: unknown) {
        console.error("Upload error:", err);
        const errorMsg =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
          "Đã có lỗi xảy ra khi tải file";
        showError(errorMsg);
        resetState();
      }
    },
    [validateFile, showError, showSuccess, onSuccess]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleUpload(droppedFile);
      }
    },
    [handleUpload]
  );

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
          isUploading && "pointer-events-none opacity-80"
        )}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          className="hidden"
          accept={allowedExtensions.map((ext) => `.${ext}`).join(",")}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-semibold mb-1">Nhấn để tải lên hoặc kéo thả</p>
              <p className="text-sm text-muted-foreground">
                Hỗ trợ: {allowedExtensions.join(", ").toUpperCase()} (Tối đa {maxSizeMB}MB)
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg mb-4">
                <div className="bg-primary/20 p-2 rounded">
                  <FileIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {uploadProgress === 100 && !isUploading ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetState();
                    }}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>{uploadProgress === 100 ? "Đã xong" : "Đang tải lên..."}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  />
                </div>
              </div>

              {isUploading && (
                <div className="flex items-center justify-center mt-4 gap-2 text-sm text-primary animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
