"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { inputClasses } from "@/components/ui/input";

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postCount: number;
  onConfirm: () => void;
  isPending?: boolean;
}

const REQUIRED_TEXT = "DELETE";

export function BulkDeleteDialog({
  open,
  onOpenChange,
  postCount,
  onConfirm,
  isPending = false,
}: BulkDeleteDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Reset input when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmationText("");
      setIsValid(false);
    }
  }, [open]);

  // Validate input
  useEffect(() => {
    setIsValid(confirmationText === REQUIRED_TEXT);
  }, [confirmationText]);

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg text-red-600">Xóa bài viết</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Bạn có chắc chắn muốn xóa <span className="font-semibold text-red-600">{postCount}</span> bài viết?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-red-600 dark:text-red-400 mb-1">Cảnh báo:</p>
              <p>Hành động này <span className="font-semibold text-foreground">không thể hoàn tác</span>. Các bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
            </div>
          </div>

          {/* Confirmation input */}
          <div className="space-y-2">
            <label htmlFor="delete-confirmation" className="text-sm font-medium text-foreground">
              Để xác nhận, nhập <span className="font-mono font-bold text-red-600">DELETE</span> vào ô bên dưới:
            </label>
            <input
              id="delete-confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Nhập "${REQUIRED_TEXT}" để xác nhận`}
              className={inputClasses}
              disabled={isPending}
              autoComplete="off"
            />
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
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isValid || isPending}
          >
            {isPending ? "Đang xử lý..." : "Xóa bài viết"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BulkDeleteDialog;
