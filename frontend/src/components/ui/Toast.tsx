"use client";

import { useState, useEffect } from "react";

interface ToastProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function Toast({
  type = "info",
  message,
  duration = 3000,
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

  const icons = {
    success: <span className="text-white">✓</span>,
    error: <span className="text-white">✕</span>,
    info: <span className="text-white">ℹ</span>,
    warning: <span className="text-white">⚠</span>,
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`fixed top-4 right-4 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-opacity duration-300`}
    >
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white bg-opacity-20 font-bold text-xs">
        {icons[type]}
      </div>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="ml-2 hover:opacity-75 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
}
