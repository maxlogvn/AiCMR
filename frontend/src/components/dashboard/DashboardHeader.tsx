'use client';

/**
 * DashboardHeader Component
 *
 * Linear/Vercel style header with breadcrumb, actions, user menu.
 * Features: clean, minimal, responsive.
 */

import { Menu, Search, Bell, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggleCompact } from '@/components/providers';

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  showSearch?: boolean;
  onSearchChange?: (query: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
}

export function DashboardHeader({
  title,
  description,
  actions,
  showSearch = false,
  onSearchChange,
  searchValue = '',
  searchPlaceholder = 'Search...',
}: DashboardHeaderProps) {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { authService } = await import('@/lib/auth');
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile menu button */}
          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb - hidden on mobile */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/dashboard">Dashboard</Link>
              <span>/</span>
              {title && <span className="text-foreground">{title}</span>}
            </div>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="hidden sm:flex max-w-md flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="h-9 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                />
                {searchValue && (
                  <button
                    onClick={() => onSearchChange?.('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Page actions */}
          {actions}

          {/* Divider */}
          {actions && <div className="hidden h-6 w-px bg-border sm:block" />}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <ThemeToggleCompact />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-3 h-9">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-medium text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.username || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.username || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/user/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/posts" className="cursor-pointer">
                  My Posts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/change-password" className="cursor-pointer">
                  Change Password
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
