'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Bug,
  Download,
  Trash2,
  RefreshCw,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  ChevronRight,
  Copy,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { debugLogger, LogLevel, useDebugLogs, type LogEntry } from '@/lib/debug-logger';
import api from '@/lib/api';

interface HealthCheck {
  name: string;
  status: 'loading' | 'healthy' | 'unhealthy';
  url: string;
  responseTime?: number;
  error?: string;
}

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
  [LogLevel.INFO]: 'text-blue-600 bg-blue-100 dark:bg-blue-900',
  [LogLevel.WARN]: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900',
  [LogLevel.ERROR]: 'text-red-600 bg-red-100 dark:bg-red-900',
};

const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

export default function DebugDashboard() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    { name: 'Backend API', status: 'loading', url: '/backend/health' },
    { name: 'Categories API', status: 'loading', url: '/backend/api/v1/categories/' },
    { name: 'Tags API', status: 'loading', url: '/backend/api/v1/tags/' },
    { name: 'Posts API', status: 'loading', url: '/backend/api/v1/posts/' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  // Get all unique categories
  const allLogs = useDebugLogs({ limit: 200 });
  const categories = ['all', ...Array.from(new Set(allLogs.map(l => l.category)))];

  // Filter logs
  const filteredLogs = allLogs.filter(log => {
    if (selectedCategory !== 'all' && log.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && log.level < (selectedLevel === 'all' ? 0 : selectedLevel)) return false;
    return true;
  });

  const errorCount = allLogs.filter(l => l.level === LogLevel.ERROR).length;
  const warnCount = allLogs.filter(l => l.level === LogLevel.WARN).length;

  // Health check function
  const runHealthChecks = useCallback(async () => {
    const checks = [...healthChecks];

    for (let i = 0; i < checks.length; i++) {
      const check = checks[i];
      const startTime = performance.now();

      try {
        const response = await fetch(check.url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const responseTime = Math.round(performance.now() - startTime);
        checks[i] = {
          ...check,
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime,
          error: response.ok ? undefined : `HTTP ${response.status}`,
        };
      } catch (e) {
        checks[i] = {
          ...check,
          status: 'unhealthy',
          responseTime: Math.round(performance.now() - startTime),
          error: e instanceof Error ? e.message : String(e),
        };
      }

      setHealthChecks([...checks]);
    }

    debugLogger.info('Health checks completed', 'health', {
      results: checks.map(c => ({ name: c.name, status: c.status, responseTime: c.responseTime })),
    });
  }, []);

  useEffect(() => {
    runHealthChecks();
    const interval = setInterval(runHealthChecks, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearLogs = () => {
    debugLogger.clearLogs();
    setExpandedLogs(new Set());
  };

  const downloadReport = () => {
    debugLogger.downloadReport();
  };

  const clearLocalStorage = () => {
    // Clear debug logs from localStorage
    localStorage.removeItem('aicmr_debug_logs');
    clearLogs();
    // Reload page to reset state
    window.location.reload();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    debugLogger.info('Copied to clipboard', 'debug');
  };

  // Get browser info
  const browserInfo = typeof window !== 'undefined' ? {
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  } : null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Debug Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitor application health and debug issues
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={runHealthChecks}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={downloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearLogs}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button variant="destructive" size="sm" onClick={clearLocalStorage}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Storage
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthChecks.map(check => (
          <div
            key={check.name}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{check.name}</span>
              {check.status === 'loading' && (
                <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
              )}
              {check.status === 'healthy' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {check.status === 'unhealthy' && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            {check.responseTime !== undefined && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{check.responseTime}ms</span>
                {check.error && (
                  <span className="text-red-500 truncate ml-2" title={check.error}>
                    {check.error}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allLogs.length}</p>
              <p className="text-xs text-gray-500">Total Logs</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{errorCount}</p>
              <p className="text-xs text-gray-500">Errors</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{warnCount}</p>
              <p className="text-xs text-gray-500">Warnings</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {filteredLogs.length > 0
                  ? new Date(filteredLogs[0].timestamp).toLocaleTimeString()
                  : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Last Activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Info */}
      {browserInfo && (
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Browser & Environment Info
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">URL:</span>
              <p className="truncate" title={browserInfo.url}>{browserInfo.url}</p>
            </div>
            <div>
              <span className="text-gray-500">Viewport:</span>
              <p>{browserInfo.viewport}</p>
            </div>
            <div>
              <span className="text-gray-500">Screen:</span>
              <p>{browserInfo.screen}</p>
            </div>
            <div>
              <span className="text-gray-500">Language:</span>
              <p>{browserInfo.language}</p>
            </div>
            <div>
              <span className="text-gray-500">Online:</span>
              <p>{browserInfo.onLine ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="text-gray-500">Cookies:</span>
              <p>{browserInfo.cookieEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">User Agent:</span>
              <p className="truncate text-xs" title={browserInfo.userAgent}>
                {browserInfo.userAgent}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logs Section */}
      <div className="border rounded-lg bg-white dark:bg-gray-800">
        {/* Filter Bar */}
        <div className="p-4 border-b flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-700"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value) as LogLevel)}
            className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-700"
          >
            <option value="all">All Levels</option>
            <option value={String(LogLevel.ERROR)}>Error Only</option>
            <option value={String(LogLevel.WARN)}>Warning & Above</option>
            <option value={String(LogLevel.INFO)}>Info & Above</option>
            <option value={String(LogLevel.DEBUG)}>All</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredLogs.length} of {allLogs.length} logs
          </span>
        </div>

        {/* Logs List */}
        <div className="max-h-[500px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bug className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No logs found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => toggleExpand(log.id)}
                  >
                    <button className="mt-0.5">
                      {expandedLogs.has(log.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <Badge
                      variant="outline"
                      className={`${LOG_LEVEL_COLORS[log.level]} shrink-0`}
                    >
                      {LOG_LEVEL_NAMES[log.level]}
                    </Badge>
                    <span className="text-xs text-gray-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {log.category}
                    </Badge>
                    <span className="flex-1 truncate">{log.message}</span>
                    {log.url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(log.url!);
                        }}
                        className="shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    )}
                  </div>

                  {expandedLogs.has(log.id) && (
                    <div className="mt-3 ml-7 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {log.stack && (
                        <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded mb-2 overflow-x-auto">
                          {log.stack}
                        </pre>
                      )}
                      {log.data && (
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                      {log.url && (
                        <p className="text-xs text-gray-500 mt-1">
                          URL: <span className="break-all">{log.url}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
