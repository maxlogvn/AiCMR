/**
 * Toast Component
 *
 * Feedback notification for user actions.
 * Shows success, error, info, and warning states with auto-dismiss.
 *
 * @see {@link https://ui.shadcn.com/docs/components/toast}
 */

"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

export type ToastProps = {
  type: "success" | "error" | "info" | "warning";
  message: string;
  title?: string;
  duration?: number;
  onClose?: () => void;
};

const toastConfig = {
  success: {
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
  },
  info: {
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
};

/**
 * Toast Component
 *
 * @example
 * <Toast
 *   type="success"
 *   title="Success"
 *   message="Your changes have been saved"
 *   duration={5000}
 * />
 */
export default function Toast({
  type = "info",
  message,
  title,
  duration = type === "error" ? 8000 : 5000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const config = toastConfig[type];

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right",
        config.bgColor,
        config.borderColor,
      )}
    >
      {/* Icon */}
      <div className={cn("flex-shrink-0", config.iconColor)}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        {title && (
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </p>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 opacity-70 hover:opacity-100"
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>
  );
}

// Re-export useToast from hook
export { useToast, ToastProvider } from "./use-toast-hook";
