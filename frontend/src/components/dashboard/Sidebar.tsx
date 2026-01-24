'use client';

/**
 * Sidebar Component - Redesigned
 *
 * Compact design with user section at top, collapse toggle separate.
 * No nested buttons - fixed hydration error.
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  FolderTree,
  Tag,
  Users,
  Settings,
  Home,
  LogOut,
  User as UserIcon,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/useUser';
import { ThemeToggleCompact } from '@/components/providers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  requiredRank?: number;
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard/stats', icon: LayoutDashboard },
  { label: 'Posts', href: '/dashboard/posts', icon: FileText },
  { label: 'Categories', href: '/dashboard/categories', icon: FolderTree },
  { label: 'Tags', href: '/dashboard/tags', icon: Tag },
  { label: 'Users', href: '/dashboard/users-manager', icon: Users, requiredRank: 5 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, requiredRank: 5 },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  isFixed?: boolean;
}

const getRankLabel = (rank: number): string => {
  const labels: Record<number, string> = {
    0: 'Guest',
    1: 'Member',
    3: 'Editor',
    5: 'Moderator',
    10: 'Admin',
  };
  return labels[rank] || 'Unknown';
};

const getRankColor = (rank: number): string => {
  const colors: Record<number, string> = {
    0: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    1: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
    3: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    5: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    10: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  };
  return colors[rank] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
};

export function Sidebar({ collapsed = false, onCollapsedChange, isFixed = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

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
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300 ease-out',
        collapsed ? 'w-16' : 'w-64',
        isFixed && 'h-screen'
      )}
    >
      {/* Top Section - User + Collapse */}
      <div className="flex items-center gap-2 px-3 py-3 border-b">
        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'relative shrink-0 transition-all duration-200',
                'hover:scale-105 active:scale-95'
              )}
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-orange-500/20 ring-2 ring-background hover:ring-orange-500/20">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-background flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-2">
            <div className="px-2 py-2 border-b mb-2">
              <p className="text-sm font-semibold">{user?.username || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>

            <DropdownMenuItem asChild>
              <Link href="/user/profile" className="cursor-pointer">
                <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user/posts" className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                My Posts
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user/change-password" className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                Change Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 dark:text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* App Info - Only show when not collapsed */}
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">AiCMR</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground truncate">
                {user?.username || 'User'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                getRankColor(user?.rank || 0)
              )}>
                {getRankLabel(user?.rank || 0)}
              </span>
            </div>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => onCollapsedChange?.(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 ml-auto"
          aria-label={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </p>
        )}
        <ul className={cn('space-y-0.5', collapsed && 'space-y-2')}>
          {navItems.map((item) => {
            if (item.requiredRank && user && user.rank < item.requiredRank) {
              return null;
            }

            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    'group',
                    isActive
                      ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    collapsed && 'justify-center px-2 py-2.5'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-orange-500" />
                  )}

                  {/* Icon */}
                  <item.icon className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive && 'text-orange-600 dark:text-orange-400'
                  )} />

                  {/* Label */}
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ThemeToggleCompact />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            <ThemeToggleCompact />
          </div>
        )}
      </div>
    </aside>
  );
}

// Mobile Sidebar
export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      const { authService } = await import('@/lib/auth');
      await authService.logout();
      onClose();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out',
          'flex flex-col border-r bg-card shadow-2xl',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header with User + Close */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Link
            href="/user/profile"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="relative shrink-0">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-orange-500/25">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-background flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">AiCMR</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm font-medium text-muted-foreground truncate">
                  {user?.username || 'User'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                  getRankColor(user?.rank || 0)
                )}>
                  {getRankLabel(user?.rank || 0)}
                </span>
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="px-2 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              if (item.requiredRank && user && user.rank < item.requiredRank) {
                return null;
              }

              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                      'group',
                      isActive
                        ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-orange-500" />
                    )}

                    <item.icon className={cn(
                      'h-5 w-5 shrink-0 transition-colors',
                      isActive && 'text-orange-600 dark:text-orange-400'
                    )} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggleCompact />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-muted text-red-600 dark:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
