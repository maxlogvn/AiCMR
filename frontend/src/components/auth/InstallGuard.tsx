"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface InstallGuardProps {
  children: React.ReactNode;
}

export default function InstallGuard({ children }: InstallGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (mounted) {
      const checkInstallStatus = async () => {
        try {
          setChecking(true);
          const response = await api.get<{ installed: boolean }>(
            "install/status",
          );
          const { installed } = response.data;

          setChecking(false);

          if (!installed) {
            // Nếu chưa cài đặt, chỉ cho phép ở trang /install
            if (pathname !== "/install") {
              router.replace("/install");
            }
          } else {
            // Nếu đã cài đặt, chặn truy cập trang /install
            if (pathname === "/install") {
              router.replace("/login");
            }
          }
        } catch (error) {
          console.error("Lỗi kiểm tra trạng thái cài đặt:", error);
          // Nếu lỗi (vd backend chưa sẵn sàng), mặc định cho cài đặt
          setChecking(false);
          if (pathname !== "/install") {
            router.replace("/install");
          }
        }
      };

      checkInstallStatus();
    }
  }, [mounted, pathname, router]);

  // Ngăn hydration mismatch
  if (!mounted || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
