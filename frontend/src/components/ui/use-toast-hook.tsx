/**
 * Toast Hook
 *
 * React hook for managing toast notifications.
 * Provides methods to show different toast types.
 *
 * @see {@link ./Toast.tsx}
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Toast, { type ToastProps } from "./Toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number, title?: string) => void;
  showSuccess: (message: string, duration?: number, title?: string) => void;
  showError: (message: string, duration?: number, title?: string) => void;
  showInfo: (message: string, duration?: number, title?: string) => void;
  showWarning: (message: string, duration?: number, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * ToastProvider - Wraps app to provide toast functionality
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
  } | null>(null);

  const showToast = useCallback(
    (type: ToastType, message: string, duration?: number, title?: string) => {
      setToast({ type, message, duration, title });
    },
    [],
  );

  const showSuccess = useCallback(
    (message: string, duration?: number, title?: string) =>
      showToast("success", message, duration, title),
    [showToast],
  );

  const showError = useCallback(
    (message: string, duration?: number, title?: string) =>
      showToast("error", message, duration ?? 8000, title),
    [showToast],
  );

  const showInfo = useCallback(
    (message: string, duration?: number, title?: string) =>
      showToast("info", message, duration, title),
    [showToast],
  );

  const showWarning = useCallback(
    (message: string, duration?: number, title?: string) =>
      showToast("warning", message, duration, title),
    [showToast],
  );

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showInfo, showWarning }}
    >
      {children}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook
 *
 * @example
 * const { showSuccess, showError } = useToast();
 *
 * showSuccess("Changes saved successfully!");
 * showError("Failed to save. Please try again.");
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
