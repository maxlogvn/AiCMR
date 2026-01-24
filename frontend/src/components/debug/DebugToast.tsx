'use client';

import { useEffect, useState } from 'react';
import { XCircle, AlertTriangle, X } from 'lucide-react';
import { debugLogger, LogLevel, useDebugLogs } from '@/lib/debug-logger';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';

interface DebugToastProps {
  maxVisible?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function DebugToast({ maxVisible = 3, position = 'bottom-right' }: DebugToastProps) {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Get only error and warning logs
  const errorLogs = useDebugLogs({
    level: LogLevel.WARN,
    limit: maxVisible * 2,
  });

  // Filter out dismissed logs
  const activeLogs = errorLogs.filter(log => !dismissed.has(log.id));

  // Auto-dismiss old logs when new ones come in
  useEffect(() => {
    if (activeLogs.length > maxVisible) {
      const toDismiss = activeLogs.slice(maxVisible);
      setDismissed(prev => {
        const next = new Set(prev);
        toDismiss.forEach(log => next.add(log.id));
        return next;
      });
    }
  }, [activeLogs.length, maxVisible]);

  const dismiss = (id: string) => {
    setDismissed(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setDismissed(prev => {
      const next = new Set(prev);
      activeLogs.forEach(log => next.add(log.id));
      return next;
    });
  };

  if (!visible || activeLogs.length === 0) {
    return null;
  }

  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed z-[9999] ${positionClasses[position]} space-y-2 max-w-md w-full`}>
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-xs font-medium text-gray-500">
          {activeLogs.length} issue{activeLogs.length > 1 ? 's' : ''}
        </span>
        <button
          onClick={clearAll}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>
      {activeLogs.slice(0, maxVisible).map((log) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`
            border rounded-lg shadow-lg p-3 bg-white dark:bg-gray-800
            ${log.level === LogLevel.ERROR
              ? 'border-red-200 dark:border-red-800'
              : 'border-yellow-200 dark:border-yellow-800'}
          `}
        >
          <div className="flex items-start gap-3">
            <div className={`
              p-1 rounded-full shrink-0
              ${log.level === LogLevel.ERROR
                ? 'bg-red-100 dark:bg-red-900'
                : 'bg-yellow-100 dark:bg-yellow-900'}
            `}>
              {log.level === LogLevel.ERROR ? (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {log.category}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {log.message}
              </p>
              {log.data != null && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    Details
                  </summary>
                  <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
            <button
              onClick={() => dismiss(log.id)}
              className="shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * DevTools Panel - Shows in development mode
 * Press Ctrl+Shift+D (or Cmd+Shift+D) to toggle
 */
export function DevToolsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useMotionValue({ x: 0, y: 0 });

  // Keyboard shortcut to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        drag
        dragConstraints={{ left: 0, right: window.innerWidth - 50, top: 0, bottom: window.innerHeight - 50 }}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`
          fixed z-[9998] p-2 rounded-full shadow-lg
          ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
          text-white
          transition-colors
        `}
        style={{ left: position.x, top: position.y }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bug className="w-5 h-5" />}
      </motion.button>

      {/* Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-4 z-[9997] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border overflow-hidden flex"
        >
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 dark:bg-gray-800 p-4">
            <h2 className="font-bold text-lg mb-4">DevTools</h2>
            <nav className="space-y-2">
              <a
                href="/dashboard/debug"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Activity className="w-4 h-4" />
                Debug Dashboard
              </a>
              <a
                href="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Settings className="w-4 h-4" />
                Settings
              </a>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <iframe src="/dashboard/debug" className="w-full h-full border-0" />
          </div>
        </motion.div>
      )}
    </>
  );
}

import { Activity, Settings, Bug } from 'lucide-react';
