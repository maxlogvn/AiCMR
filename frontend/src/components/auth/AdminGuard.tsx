"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [mounted] = useState(true);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.rank < 5) {
        router.push("/user/profile"); // Redirect non-admin users
      }
    }
  }, [user, isLoading, router, mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Only render children if user is logged in AND is admin
  if (!user || user.rank < 5) {
    return null;
  }

  return <>{children}</>;
}
