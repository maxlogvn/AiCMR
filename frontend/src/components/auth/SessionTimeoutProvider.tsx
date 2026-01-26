"use client";

/**
 * Session Timeout Provider - AiCMR Design System
 *
 * Story 6.5: Session Timeout Handling
 *
 * Features:
 * - Detect session timeout (30min access token)
 * - Show warning modal 5 minutes before expiry
 * - Allow user to extend session
 * - Auto-logout when session expires
 * - Refresh token automatically
 *
 * Design System Components:
 * - Modal: Warning modal
 * - Button: Extend session, Logout
 * - Toast: Notifications
 */

import { useEffect, useState, useCallback } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AlertTriangle } from "lucide-react";

// Access token expiry: 30 minutes (1800 seconds)
// Warning time: 5 minutes before expiry (300 seconds)
const ACCESS_TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes in ms
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes in ms

interface SessionTimeoutProviderProps {
  children: React.ReactNode;
}

export function SessionTimeoutProvider({ children }: SessionTimeoutProviderProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  // Refresh token function
  const refreshSession = useCallback(async () => {
    try {
      const api = (await import("@/lib/api")).default;
      await api.post("/auth/refresh");
      toast.success("Đã gia hạn phiên làm việc");

      // Reset warning state
      setShowWarning(false);
      setTimeRemaining(0);

      // Clear logout timer
      if (logoutTimer) {
        clearTimeout(logoutTimer);
        setLogoutTimer(null);
      }

      return true;
    } catch (error) {
      toast.error("Không thể gia hạn phiên làm việc");
      handleLogout();
      return false;
    }
  }, [logoutTimer]);

  // Logout function
  const handleLogout = useCallback(() => {
    const authService = (await import("@/lib/auth")).authService;
    authService.logout();
    window.location.href = "/login";
  }, []);

  // Setup session timeout monitoring
  useEffect(() => {
    let warningTimer: NodeJS.Timeout;
    let expiryTimer: NodeJS.Timeout;

    const setupTimers = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (!loginTime) return;

      const loginTimestamp = parseInt(loginTime, 10);
      const now = Date.now();
      const elapsed = now - loginTimestamp;
      const timeUntilExpiry = ACCESS_TOKEN_EXPIRY - elapsed;
      const timeUntilWarning = timeUntilExpiry - WARNING_TIME;

      // Clear existing timers
      if (warningTimer) clearTimeout(warningTimer);
      if (expiryTimer) clearTimeout(expiryTimer);

      // Set warning timer (if not already expired)
      if (timeUntilWarning > 0) {
        warningTimer = setTimeout(() => {
          setShowWarning(true);
          setTimeRemaining(Math.floor(WARNING_TIME / 1000)); // 5 minutes in seconds
        }, timeUntilWarning);
      } else if (timeUntilExpiry > 0) {
        // Already in warning period
        setShowWarning(true);
        setTimeRemaining(Math.floor(timeUntilExpiry / 1000));
      }

      // Set expiry timer
      if (timeUntilExpiry > 0) {
        expiryTimer = setTimeout(() => {
          setShowWarning(false);
          toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          handleLogout();
        }, timeUntilExpiry);
      } else {
        // Already expired
        handleLogout();
      }
    };

    setupTimers();

    // Update countdown timer every second when warning is shown
    const countdownTimer = setInterval(() => {
      if (showWarning && timeRemaining > 0) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    // Listen for activity to reset timers
    const handleActivity = () => {
      // Only reset if warning is not shown
      if (!showWarning) {
        setupTimers();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      clearInterval(countdownTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      if (warningTimer) clearTimeout(warningTimer);
      if (expiryTimer) clearTimeout(expiryTimer);
    };
  }, [showWarning, timeRemaining, handleLogout]);

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {children}

      {/* Session Expiry Warning Modal */}
      <Modal open={showWarning} onOpenChange={setShowWarning}>
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <ModalTitle>Phiên làm việc sắp hết hạn</ModalTitle>
            </div>
          </ModalHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Phiên làm việc của bạn sẽ hết hạn sau{" "}
              <strong className="text-foreground">{formatTime(timeRemaining)}</strong>.
              Bạn có muốn gia hạn không?
            </p>

            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                ⚠️ Nếu bạn không gia hạn, bạn sẽ bị đăng xuất tự động và các thay
                đổi chưa lưu sẽ bị mất.
              </p>
            </div>
          </div>

          <ModalFooter>
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="flex-1"
            >
              Đăng xuất
            </Button>
            <Button
              onClick={refreshSession}
              className="flex-1"
            >
              Gia hạn phiên
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
