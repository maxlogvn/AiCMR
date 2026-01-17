"use client";

import { ReactNode, useEffect } from 'react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const token = authService.getToken();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
