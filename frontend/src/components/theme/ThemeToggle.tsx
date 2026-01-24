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
      className="relative h-9 w-9 rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative h-5 w-5">
        {/* Sun icon - shown in dark mode */}
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-transform duration-300 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
        {/* Moon icon - shown in light mode */}
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-transform duration-300 ${
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
      </div>
      {/* Subtle glow effect */}
      <span
        className={`absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 ${
          theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-400/10'
        } group-hover:opacity-100`}
      />
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
