"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import Toast from "@/components/ui/Toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    duration?: number;
  } | null>(null);

  const showToast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      console.log(`[useToast] Showing ${type}:`, message);
      setToast({ type, message, duration });
    },
    [],
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => showToast("success", message, duration),
    [showToast],
  );
  const showError = useCallback(
    (message: string, duration?: number) => showToast("error", message, duration || 8000),
    [showToast],
  );
  const showInfo = useCallback(
    (message: string, duration?: number) => showToast("info", message, duration),
    [showToast],
  );
  const showWarning = useCallback(
    (message: string, duration?: number) => showToast("warning", message, duration),
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
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
