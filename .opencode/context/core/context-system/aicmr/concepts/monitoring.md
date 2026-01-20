# Concept: Monitoring

**Core Idea**: AiCMR integrates Prometheus metrics endpoint for system monitoring, tracking request counts, latency, active users, and cache performance with structured JSON logging.

**Key Points**:
- /metrics endpoint exposes Prometheus-compatible metrics
- Tracks request count, response time, and error rates
- Monitors active user sessions and cache hit/miss ratios
- Loguru provides structured JSON logging with rotation and compression
- Metrics help identify performance bottlenecks and system health

**Quick Example**:
```bash
# Access metrics
curl http://aicmr.local/backend/metrics

# Sample output
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
# http_requests_total{method="GET",endpoint="/api/v1/users"} 42
```

**Reference**: docs/02-architecture.md

**Related**: concepts/docker-architecture.md