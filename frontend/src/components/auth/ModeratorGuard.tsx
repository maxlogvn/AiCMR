"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ModeratorGuardProps {
  children: React.ReactNode;
}

export default function ModeratorGuard({ children }: ModeratorGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [mounted] = useState(true);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.rank < 5) {
        // Moderator is rank >= 5
        router.push("/user/profile");
      }
    }
  }, [user, isLoading, router, mounted]);

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

  if (!user || user.rank < 5) {
    return null;
  }

  return <>{children}</>;
}
