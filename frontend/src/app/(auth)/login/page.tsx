"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { LoginRequest } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      showSuccess('Đăng nhập thành công!');
      setTimeout(() => router.push('/profile'), 1000);
    } catch (error) {
      showError((error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Đăng nhập thất bại');
    }
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <LogIn className="mx-auto h-12 w-12 text-zinc-600 dark:text-zinc-400" />
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
          Đăng nhập
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Mật khẩu"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          fullWidth
        >
          Đăng nhập
        </Button>

        <div className="flex flex-col items-center space-y-2 text-sm">
          <div className="text-zinc-600 dark:text-zinc-400">
            Chưa có tài khoản?{' '}
            <a href="/register" className="font-medium text-zinc-900 dark:text-white hover:underline">
              Đăng ký ngay
            </a>
          </div>
          <a href="/forgot-password" className="text-zinc-600 dark:text-zinc-400 hover:underline">
            Quên mật khẩu?
          </a>
        </div>
      </form>
    </Card>
  );
}
