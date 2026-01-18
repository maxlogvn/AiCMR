"use client";

import { ReactNode, useEffect, useState } from "react";
import { authService } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setToken(authService.getToken());
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/login");
    }
  }, [mounted, token, router]);

  if (!mounted || !token) {
    return null;
  }

  return <>{children}</>;
}
