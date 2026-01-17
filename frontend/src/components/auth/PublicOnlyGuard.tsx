"use client";

import { ReactNode, useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface PublicOnlyGuardProps {
  children: ReactNode;
}

export default function PublicOnlyGuard({ children }: PublicOnlyGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setToken(authService.getToken());
  }, []);

  useEffect(() => {
    if (mounted && token) {
      router.push('/dashboard/profile');
    }
  }, [mounted, token, router]);

  if (!mounted || token) {
    return null;
  }

  return <>{children}</>;
}
