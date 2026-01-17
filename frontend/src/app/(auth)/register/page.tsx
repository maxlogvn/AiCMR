"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { RegisterRequest } from '@/types';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự').max(50),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword } = data;
      await registerUser(data as Omit<RegisterFormData, 'confirmPassword'> as RegisterRequest);
      showSuccess('Đăng ký thành công!');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      showError((error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Đăng ký thất bại');
    }
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <UserPlus className="mx-auto h-12 w-12 text-zinc-600 dark:text-zinc-400" />
        <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
          Đăng ký
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
          autoComplete="email"
        />

        <Input
          label="Tên đăng nhập"
          type="text"
          error={errors.username?.message}
          {...register('username')}
          autoComplete="username"
        />

        <Input
          label="Mật khẩu"
          type="password"
          error={errors.password?.message}
          {...register('password')}
          autoComplete="new-password"
        />

        <Input
          label="Xác nhận mật khẩu"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          autoComplete="new-password"
        />

        <div className="pt-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
          >
            Đăng ký
          </Button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-medium text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}
