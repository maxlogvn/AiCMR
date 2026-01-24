'use client';

/**
 * ThemeToggle Component
 *
 * Animated toggle button for switching between light and dark themes.
 * Features smooth sun/moon icon transitions like Linear.app.
 *
 * @example
 * <ThemeToggle />
 */

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 group"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative h-5 w-5">
        {/* Sun icon - shown in dark mode */}
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
        {/* Moon icon - shown in light mode */}
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
      </div>
    </Button>
  );
}

// Compact version for use in headers/navbars
export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative h-8 w-8 flex items-center justify-center rounded-md transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
      </div>
    </button>
  );
}
