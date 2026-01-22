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
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
    const checkInstallStatus = async () => {
      try {
        console.log("InstallGuard: Checking install status...", { pathname });
        const response = await api.get<{ installed: boolean }>("install/status");
        const { installed } = response.data;
        console.log("InstallGuard: Install status received", { installed, pathname });

        if (!installed && pathname !== "/install") {
          console.log("InstallGuard: Redirecting to install page");
          router.replace("/install");
        } else if (installed && pathname === "/install") {
          console.log("InstallGuard: Already installed, redirecting to login");
          router.replace("/login");
        }

        setChecking(false);
      } catch (error) {
        console.error("InstallGuard: Error checking install status", error);
        setChecking(false);
        // Nếu đang ở trang install, cho phép hiển thị
        if (pathname === "/install") {
          console.log("InstallGuard: Error but on install page, allowing access");
          return;
        }
        // Nếu không thể kiểm tra và không ở trang install, redirect đến install
        console.log("InstallGuard: Error and not on install page, redirecting to install");
        router.replace("/install");
      }
    };

    checkInstallStatus();
  }, [pathname, router]);

  if (!mounted || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
