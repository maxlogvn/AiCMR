# Pattern: Nginx Config Inheritance

**Core Concept**: Use Nginx include directive to share common configuration across platform-specific server blocks. Eliminates duplication of security headers, proxy settings, and shared directives.

**Key Points**:
- Common config in shared file (common.conf)
- Platform-specific files include common config
- Security headers, proxy headers in one place
- Easy to maintain and update
- Clear separation of concerns

**Quick Example**:
```nginx
# nginx/conf.d/common.conf (shared)
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;

# Proxy Headers
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

# HMR support
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

```nginx
# nginx/conf.d/default.conf (Linux-specific)
server {
    include common.conf;  # Include shared config

    location /backend/ {
        resolver 127.0.0.11 valid=30s;
        proxy_pass http://backend_server/;
    }
}
```

```nginx
# nginx/conf.d/default-windows.conf (Windows-specific)
server {
    include common.conf;  # Include shared config

    location /backend/ {
        proxy_pass http://backend_server/;
        # No resolver needed on Windows
    }
}
```

**Benefits**:
- Single source of truth for common config
- Security updates in one place
- Easy to add new platform configs

**Reference**: [DOCKER_COMPOSE_CONSOLIDATION_SUMMARY.md](../../DOCKER_COMPOSE_CONSOLIDATION_SUMMARY.md)

**Related**:
- patterns/docker-compose-override.md - Docker override pattern
- lookup/nginx-config-structure.md - Nginx directory structure
