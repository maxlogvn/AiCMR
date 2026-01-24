'use client';

/**
 * DashboardLayout Component
 *
 * Main layout wrapper for all dashboard pages.
 * Combines Sidebar, Header, and content area with responsive design.
 *
 * @example
 * <DashboardLayout>
 *   <PageContent />
 * </DashboardLayout>
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar, MobileSidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  headerActions?: React.ReactNode;
  showSearch?: boolean;
  onSearchChange?: (query: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
}

export function DashboardLayout({
  children,
  title,
  description,
  headerActions,
  showSearch,
  onSearchChange,
  searchValue,
  searchPlaceholder,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Hide sidebar on public pages
  const isDashboardPage = pathname?.startsWith('/dashboard');
  if (!isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          title={title || ''}
          description={description}
          actions={headerActions}
          showSearch={showSearch}
          onSearchChange={onSearchChange}
          searchValue={searchValue}
          searchPlaceholder={searchPlaceholder}
        />

        {/* Page Title Section (for pages without title in header) */}
        {(title || description) && !headerActions && (
          <div className="border-b bg-background/50 px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                {/* Mobile menu button below header for this layout */}
                <button
                  className="lg:hidden mb-4 flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-semibold lg:text-2xl">{title}</h1>
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              {headerActions && <div className="flex lg:hidden">{headerActions}</div>}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            // Padding depends on whether we have a separate title section
            (title || description) && !headerActions ? 'px-6 py-6' : 'p-6'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// Simplified layout for dashboard pages with their own headers
// Uses FIXED sidebar - sidebar stays in place while content scrolls
export function DashboardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Calculate margin based on sidebar state (w-16 = 4rem, w-64 = 16rem)
  const sidebarMargin = sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64';

  return (
    <>
      {/* Fixed Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          isFixed
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content - with left margin for fixed sidebar */}
      <div className={cn('min-h-screen bg-background transition-all duration-300', sidebarMargin)}>
        {/* Mobile header with menu button */}
        <div className="lg:hidden flex h-14 items-center justify-between border-b px-4 bg-background">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-medium text-white">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <main className={cn('p-4 lg:p-6', className)}>
          {children}
        </main>
      </div>
    </>
  );
}
