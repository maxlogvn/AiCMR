/**
 * Debug Logger & Error Reporter for AiCMR
 * Logs errors, warnings, and debug info to localStorage + console
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  category: string;
  data?: unknown;
  stack?: string;
  url?: string;
  userAgent?: string;
}

interface ErrorReport {
  id: string;
  timestamp: string;
  error: {
    message: string;
    stack?: string;
    name?: string;
  };
  context: {
    url: string;
    userAgent: string;
    localStorage?: Record<string, string>;
    sessionStorage?: Record<string, string>;
  };
  logs: LogEntry[];
}

const DEBUG_KEY = 'aicmr_debug_logs';
const MAX_LOGS = 500;

class DebugLogger {
  private logs: LogEntry[] = [];
  private listeners: Set<(logs: LogEntry[]) => void> = new Set();
  private isLogging = false; // Prevent recursive logging
  private originalConsole = {
    log: console.log,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadLogs();
      this.setupGlobalHandlers();
      this.cleanupOldLogs();
    }
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(DEBUG_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      this.originalConsole.error('[DebugLogger] Failed to load logs:', e);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(DEBUG_KEY, JSON.stringify(this.logs));
    } catch (e) {
      this.originalConsole.error('[DebugLogger] Failed to save logs:', e);
    }
  }

  private cleanupOldLogs() {
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(-MAX_LOGS);
      this.saveLogs();
    }
  }

  private setupGlobalHandlers() {
    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      // Prevent infinite loop if error originated from debug logger
      if (event.message?.includes('[DebugLogger]')) return;
      this.error('Unhandled Error', event.message, 'global', {
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Rejection', event.reason, 'promise', {
        stack: event.reason?.stack,
      });
    });

    // NOTE: Console override disabled to prevent infinite loops
    // If you need to capture console logs, use the debug log methods directly
  }

  log(level: LogLevel, message: string, category: string = 'app', data?: unknown) {
    // Prevent infinite loop
    if (this.isLogging) return;
    this.isLogging = true;

    try {
      const entry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        timestamp: new Date().toISOString(),
        level,
        message,
        category,
        data,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      };

      this.logs.push(entry);
      this.cleanupOldLogs();
      this.saveLogs();
      this.notifyListeners();

      // Also log to console with appropriate level (using original console to avoid override)
      const prefix = `[${category}]`;
      switch (level) {
        case LogLevel.DEBUG:
          this.originalConsole.debug?.(prefix, message, data) || console.debug(prefix, message, data);
          break;
        case LogLevel.INFO:
          this.originalConsole.log?.(prefix, message, data) || console.log(prefix, message, data);
          break;
        case LogLevel.WARN:
          this.originalConsole.warn(prefix, message, data);
          break;
        case LogLevel.ERROR:
          this.originalConsole.error(prefix, message, data);
          break;
      }
    } finally {
      this.isLogging = false;
    }
  }

  debug(message: string, category: string = 'app', data?: unknown) {
    this.log(LogLevel.DEBUG, message, category, data);
  }

  info(message: string, category: string = 'app', data?: unknown) {
    this.log(LogLevel.INFO, message, category, data);
  }

  warn(message: string, category: string = 'app', data?: unknown) {
    this.log(LogLevel.WARN, message, category, data);
  }

  error(message: string, category: string = 'app', data?: unknown) {
    this.log(LogLevel.ERROR, message, category, data);
  }

  getLogs(filter?: { level?: LogLevel; category?: string; limit?: number }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.level !== undefined) {
      filtered = filtered.filter(log => log.level >= filter.level!);
    }

    if (filter?.category) {
      filtered = filtered.filter(log => log.category === filter.category);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered.reverse();
  }

  getLogsByCategory(category: string, limit?: number): LogEntry[] {
    return this.getLogs({ category, limit });
  }

  getErrorLogs(limit?: number): LogEntry[] {
    return this.getLogs({ level: LogLevel.ERROR, limit });
  }

  clearLogs() {
    this.logs = [];
    this.saveLogs();
    this.notifyListeners();
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.logs]));
  }

  generateErrorReport(): ErrorReport {
    return {
      id: `report-${Date.now()}`,
      timestamp: new Date().toISOString(),
      error: {
        message: 'Debug Report',
      },
      context: this.getContext(),
      logs: this.getLogs({ limit: 100 }),
    };
  }

  exportLogsAsJSON(): string {
    const report = this.generateErrorReport();
    return JSON.stringify(report, null, 2);
  }

  exportLogsAsText(): string {
    const logs = this.getLogs({ limit: 200 });
    return logs.map(log => {
      const level = LogLevel[log.level].padEnd(5);
      const time = new Date(log.timestamp).toLocaleTimeString();
      return `[${time}] [${level}] [${log.category}] ${log.message}${
        log.data ? '\n  ' + JSON.stringify(log.data, null, 2) : ''
      }`;
    }).join('\n');
  }

  downloadReport() {
    // Don't log during download to avoid infinite loops
    const wasLogging = this.isLogging;
    this.isLogging = true;
    try {
      const report = this.exportLogsAsJSON();
      const blob = new Blob([report], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aicmr-debug-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      this.isLogging = wasLogging;
    }
  }

  private getContext() {
    if (typeof window === 'undefined') {
      return { url: '', userAgent: '' };
    }

    const storage: Record<string, string> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.includes('csrf') && !key.includes('token')) {
          storage[key] = localStorage.getItem(key) || '';
        }
      }
    } catch (e) {
      // Ignore localStorage access errors
    }

    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      localStorage: storage,
    };
  }

  // API request logging
  logApiRequest(method: string, url: string, data?: unknown) {
    this.debug(`${method} ${url}`, 'api', { request: data });
  }

  logApiResponse(method: string, url: string, status: number, duration: number) {
    this.debug(`${method} ${url} - ${status} (${duration}ms)`, 'api');
  }

  logApiError(method: string, url: string, error: unknown) {
    this.error(`${method} ${url} failed`, 'api', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    });
  }
}

// Singleton instance
export const debugLogger = new DebugLogger();

// Hook for React components
export function useDebugLogs(filter?: { level?: LogLevel; category?: string; limit?: number }) {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const filterRef = React.useRef(filter);

  // Only update filterRef if filter actually changed
  React.useEffect(() => {
    const filterStr = JSON.stringify(filter);
    const currentStr = JSON.stringify(filterRef.current);
    if (filterStr !== currentStr) {
      filterRef.current = filter;
    }
  });

  React.useEffect(() => {
    // Initial load
    setLogs(debugLogger.getLogs(filterRef.current));

    // Subscribe to updates
    const unsubscribe = debugLogger.subscribe(() => {
      setLogs(debugLogger.getLogs(filterRef.current));
    });

    return unsubscribe;
  }, []); // Empty deps - only subscribe once on mount

  return logs;
}

import React from 'react';
