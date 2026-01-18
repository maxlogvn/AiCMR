export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private metricsHistory: Map<string, number[]> = new Map();

  startTiming(key: string): number {
    const startTime = performance.now();
    this.metrics.set(key, startTime);
    return startTime;
  }

  endTiming(key: string): number {
    const startTime = this.metrics.get(key) || 0;
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.metricsHistory.set(key, [
      ...(this.metricsHistory.get(key) || []),
      duration,
    ]);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${key}: ${duration.toFixed(2)}ms`);
    }

    this.metrics.delete(key);
    return duration;
  }

  getAverage(key: string): number {
    const history = this.metricsHistory.get(key) || [];
    if (history.length === 0) return 0;
    const sum = history.reduce((a, b) => a + b, 0);
    return sum / history.length;
  }

  getMetricsHistory(): Record<string, number[]> {
    const result: Record<string, number[]> = {};
    this.metricsHistory.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  clearHistory(): void {
    this.metricsHistory.clear();
  }
}

export const monitor = new PerformanceMonitor();
