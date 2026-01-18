"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Mail, User } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/card-wrapped';
import { Button } from '@/components/ui/button-wrapped';
import { Input } from '@/components/ui/input-wrapped';

const installSchema = z.object({
  install_secret: z.string().min(1, 'Vui lòng nhập mã cài đặt'),
  email: z.string().email('Email không hợp lệ'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  site_name: z.string().min(1, 'Vui lòng nhập tên ứng dụng'),
  logo_url: z.string().url('Logo URL không hợp lệ').optional().or(z.literal('')),
});

type InstallFormData = z.infer<typeof installSchema>;

export default function InstallPage() {
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstallFormData>({
    resolver: zodResolver(installSchema),
    defaultValues: {
      install_secret: '',
      email: '',
      username: '',
      password: '',
      site_name: '',
      logo_url: '',
    },
  });

  const onSubmit = async (data: InstallFormData) => {
    try {
      await api.post('/install/setup', {
        ...data,
        logo_url: data.logo_url || undefined,
      });
      showSuccess('Cài đặt thành công! Đang chuyển hướng...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || 'Không thể cài đặt. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Cài đặt hệ thống
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Hoàn tất thiết lập ban đầu để sử dụng AiCMR
          </p>
        </div>

        <Card title="Thông tin cài đặt">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Install Secret */}
            <div>
              <Input
                label="Mã cài đặt bảo mật (INSTALL_SECRET)"
                type="password"
                error={errors.install_secret?.message}
                {...register('install_secret')}
                helperText="Tìm mã này trong file .env hoặc cấu hình server của bạn"
              />
            </div>

            {/* Admin Account */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Tài khoản Admin
              </h2>
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Tên đăng nhập"
                error={errors.username?.message}
                {...register('username')}
              />
              <Input
                label="Mật khẩu"
                type="password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {/* Site Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Cấu hình hệ thống
              </h2>
              <Input
                label="Tên ứng dụng"
                error={errors.site_name?.message}
                {...register('site_name')}
              />
              <Input
                label="URL Logo (Tùy chọn)"
                type="url"
                error={errors.logo_url?.message}
                {...register('logo_url')}
                helperText="Để trống nếu không có logo"
              />
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Đang cài đặt...' : 'Hoàn tất cài đặt'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
