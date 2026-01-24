'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Activity,
  Bug,
  Download,
  Trash2,
  RefreshCw,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  ChevronRight,
  Copy,
  RotateCcw,
  X,
  Search,
  MoreVertical,
  AlertOctagon,
  Calendar,
  Folder,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { debugLogger, LogLevel, useDebugLogs, type LogEntry } from '@/lib/debug-logger';

interface HealthCheck {
  name: string;
  status: 'loading' | 'healthy' | 'unhealthy';
  url: string;
  responseTime?: number;
  error?: string;
}

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'text-gray-500 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700',
  [LogLevel.INFO]: 'text-blue-600 bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700',
  [LogLevel.WARN]: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700',
  [LogLevel.ERROR]: 'text-red-600 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700',
};

const LOG_LEVEL_ICONS: Record<LogLevel, React.ReactNode> = {
  [LogLevel.DEBUG]: <Search className="w-3 h-3" />,
  [LogLevel.INFO]: <CheckCircle className="w-3 h-3" />,
  [LogLevel.WARN]: <AlertTriangle className="w-3 h-3" />,
  [LogLevel.ERROR]: <XCircle className="w-3 h-3" />,
};

const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

const LOGS_PER_PAGE = 50;

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
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete confirmation states
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'single' | 'category' | 'level' | 'all' | 'old';
    logId?: string;
    category?: string;
    level?: LogLevel;
    days?: number;
  }>({ open: false, type: 'all' });

  // Get all logs
  const allLogs = useDebugLogs({ limit: 1000 });

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(allLogs.map(l => l.category)))].sort();
  }, [allLogs]);

  // Filter and search logs
  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      // Category filter
      if (selectedCategory !== 'all' && log.category !== selectedCategory) return false;
      // Level filter
      if (selectedLevel !== 'all' && log.level < selectedLevel) return false;
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const messageMatch = log.message.toLowerCase().includes(query);
        const dataMatch = log.data ? JSON.stringify(log.data).toLowerCase().includes(query) : false;
        if (!messageMatch && !dataMatch) return false;
      }
      return true;
    });
  }, [allLogs, selectedCategory, selectedLevel, searchQuery]);

  // Pagination
  const paginatedLogs = useMemo(() => {
    const startIndex = (page - 1) * LOGS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);
  }, [filteredLogs, page]);

  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);

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

  // Run health checks on mount
  useEffect(() => {
    runHealthChecks();
    const interval = setInterval(runHealthChecks, 30000);
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

  const deleteSingleLog = (logId: string) => {
    setDeleteDialog({ open: true, type: 'single', logId });
  };

  const deleteByCategory = (category: string) => {
    setDeleteDialog({ open: true, type: 'category', category });
  };

  const deleteByLevel = (level: LogLevel) => {
    setDeleteDialog({ open: true, type: 'level', level });
  };

  const deleteOldLogs = (days: number) => {
    setDeleteDialog({ open: true, type: 'old', days });
  };

  const confirmDelete = () => {
    switch (deleteDialog.type) {
      case 'single':
        if (deleteDialog.logId) {
          debugLogger.deleteLog(deleteDialog.logId);
          setExpandedLogs(prev => {
            const next = new Set(prev);
            next.delete(deleteDialog.logId!);
            return next;
          });
        }
        break;
      case 'category':
        if (deleteDialog.category) {
          debugLogger.deleteLogsByCategory(deleteDialog.category);
          if (selectedCategory === deleteDialog.category) {
            setSelectedCategory('all');
          }
        }
        break;
      case 'level':
        if (deleteDialog.level !== undefined) {
          debugLogger.deleteLogsByLevel(deleteDialog.level);
        }
        break;
      case 'all':
        debugLogger.clearLogs();
        setExpandedLogs(new Set());
        setPage(1);
        break;
      case 'old':
        if (deleteDialog.days) {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - deleteDialog.days);
          debugLogger.deleteLogsBefore(cutoffDate);
        }
        break;
    }
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  const downloadReport = () => {
    debugLogger.downloadReport();
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('aicmr_debug_logs');
    debugLogger.clearLogs();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={runHealthChecks}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Health Check
          </Button>
          <Button variant="outline" size="sm" onClick={downloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, type: 'all' })}>
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                Clear All Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deleteOldLogs(1)}>
                <Calendar className="w-4 h-4 mr-2" />
                Delete logs older than 1 day
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteOldLogs(7)}>
                <Calendar className="w-4 h-4 mr-2" />
                Delete logs older than 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteOldLogs(30)}>
                <Calendar className="w-4 h-4 mr-2" />
                Delete logs older than 30 days
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deleteByLevel(LogLevel.ERROR)}>
                <AlertOctagon className="w-4 h-4 mr-2 text-red-500" />
                Delete all errors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteByLevel(LogLevel.WARN)}>
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                Delete all warnings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 transition-all hover:shadow-md"
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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="pl-8 pr-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-700 w-48"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-700"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            {selectedCategory !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => deleteByCategory(selectedCategory)}
                title={`Delete all ${selectedCategory} logs`}
              >
                <Ban className="w-3 h-3 text-red-500" />
              </Button>
            )}
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => { setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value) as LogLevel); setPage(1); }}
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
        <div className="max-h-[600px] overflow-y-auto">
          {paginatedLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Bug className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No logs found</p>
              <p className="text-sm mt-1">
                {searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Logs will appear here as events occur'}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {paginatedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="group p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Expand button */}
                      <button
                        className="mt-0.5"
                        onClick={() => toggleExpand(log.id)}
                      >
                        {expandedLogs.has(log.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {/* Level Badge */}
                      <Badge
                        variant="outline"
                        className={`${LOG_LEVEL_COLORS[log.level]} shrink-0 flex items-center gap-1`}
                      >
                        {LOG_LEVEL_ICONS[log.level]}
                        {LOG_LEVEL_NAMES[log.level]}
                      </Badge>

                      {/* Timestamp */}
                      <span className="text-xs text-gray-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>

                      {/* Category Badge */}
                      <Badge variant="outline" className="shrink-0 text-xs">
                        <Folder className="w-3 h-3 mr-1" />
                        {log.category}
                      </Badge>

                      {/* Message */}
                      <span className="flex-1 truncate text-sm">{log.message}</span>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {log.url && (
                          <button
                            onClick={() => copyToClipboard(log.url!)}
                            className="shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Copy URL"
                          >
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteSingleLog(log.id)}
                          className="shrink-0 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          title="Delete this log"
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedLogs.has(log.id) && (
                      <div className="mt-3 ml-7 pl-4 border-l-2 border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
                        {log.stack && (
                          <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded mb-2 overflow-x-auto border border-red-100 dark:border-red-900">
                            {log.stack}
                          </pre>
                        )}
                        {log.data != null && (
                          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto border border-gray-200 dark:border-gray-700">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        )}
                        {log.url && (
                          <p className="text-xs text-gray-500 mt-2">
                            URL: <span className="break-all">{log.url}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.type === 'single' && 'Are you sure you want to delete this log entry?'}
              {deleteDialog.type === 'category' && `Are you sure you want to delete all logs from "${deleteDialog.category}" category?`}
              {deleteDialog.type === 'level' && `Are you sure you want to delete all ${deleteDialog.level !== undefined ? LogLevel[deleteDialog.level] : ''} logs?`}
              {deleteDialog.type === 'all' && 'Are you sure you want to clear all logs? This action cannot be undone.'}
              {deleteDialog.type === 'old' && `Are you sure you want to delete logs older than ${deleteDialog.days} days?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
