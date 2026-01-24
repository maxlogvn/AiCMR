import ModeratorGuard from "@/components/auth/ModeratorGuard";
import { DashboardContent } from "@/components/dashboard";

/**
 * Dashboard Layout
 *
 * Uses the new unified dashboard layout with:
 * - Fixed sidebar with user dropdown, collapse button, navigation
 * - Mobile sidebar overlay
 * - Mobile header with menu button
 * - Rank-based navigation filtering
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModeratorGuard>
      <DashboardContent>
        {children}
      </DashboardContent>
    </ModeratorGuard>
  );
}
