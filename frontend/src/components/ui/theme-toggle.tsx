"use client"

/**
 * Theme Toggle Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Import { ThemeToggle } từ '@/components/ui/theme-toggle'
 * 2. Place trong header navigation (top-right)
 * 3. Component tự động hiển thị icon đúng theme
 *
 * @example
 * ```tsx
 * import { ThemeToggle } from '@/components/ui/theme-toggle'
 *
 * function Header() {
 *   return (
 *     <header>
 *       <Logo />
 *       <nav>...</nav>
 *       <ThemeToggle />
 *     </header>
 *   )
 * }
 * ```
 *
 * Design System Principles:
 * - "Eliminate Choices" - Chỉ 1 toggle button, không có options
 * - Opinionated - Icon tự động đổi (Sun/Moon) dựa trên theme
 * - Consistent - Dùng Button component với variant="secondary"
 */

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/button"

/**
 * Theme Toggle Component
 *
 * Displays a toggle button that switches between light and dark themes.
 * Icon automatically updates based on current resolved theme.
 *
 * Features:
 * - Sun icon (☀️) when in dark mode (clicking switches to light)
 * - Moon icon (🌙) when in light mode (clicking switches to dark)
 * - Smooth icon transition
 * - Full accessibility support
 *
 * Accessibility:
 * - aria-label: "Toggle theme" (screen reader announcement)
 * - Keyboard navigation: Tab, Enter, Space
 * - Focus ring from Button component
 */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  /**
   * Toggle theme handler
   * - Light → Dark
   * - Dark → Light
   * - System mode is toggled based on resolved theme
   */
  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
