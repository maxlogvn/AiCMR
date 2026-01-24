"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BulkPublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postCount: number;
  onConfirm: () => void;
  isPending?: boolean;
}

export function BulkPublishDialog({
  open,
  onOpenChange,
  postCount,
  onConfirm,
  isPending = false,
}: BulkPublishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <DialogTitle className="text-lg">Đăng bài viết</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Bạn có chắc chắn muốn đăng <span className="font-semibold text-foreground">{postCount}</span> bài viết?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Lưu ý:</p>
              <p>Các bài viết này sẽ được công khai ngay lập tức và hiển thị cho tất cả người dùng.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Đăng bài"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BulkPublishDialog;
