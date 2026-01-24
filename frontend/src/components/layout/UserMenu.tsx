'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { RankBadge } from '@/components/ui/rank-badge';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  className?: string;
}

export default function UserMenu({ className }: UserMenuProps) {
  const { user } = useUser();
  const { logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {user.username}
        </span>
        <RankBadge rank={user.rank as 0 | 1 | 2 | 3 | 4 | 5 | 10} />
        <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/user/profile');
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                Hồ sơ cá nhân
              </button>
              <hr className="my-1 border-gray-200" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
