# Lookup: Windows Docker Overrides Checklist

**Core Concept**: Reference checklist for Windows-specific Docker Compose overrides. Use this guide when adding or updating services for Windows development.

**Key Points**:
- Container names require -windows suffix
- Ports must be exposed (not internal)
- Use host.docker.internal for host access
- Enable file watching with CHOKIDAR_USEPOLLING
- Extra hosts needed for host networking

**Override Checklist**:

| Configuration | Linux (Base) | Windows (Override) | Required |
|--------------|--------------|-------------------|----------|
| Container Name | `backend` | `backend-windows` | ✅ |
| Port Mapping | `8000:8000` | `8000:8000` | ⚠️ Expose directly |
| Database Host | `mysql` | `host.docker.internal:3306` | ✅ |
| Redis Host | `redis` | `host.docker.internal:6379` | ✅ |
| File Watching | Default | `CHOKIDAR_USEPOLLING=true` | ✅ |
| Extra Hosts | Not needed | `host.docker.internal:host-gateway` | ✅ |
| Volume Logs | Optional | `./storage/logs:/app/logs` | ⚠️ Recommended |

**Environment Variables**:
```yaml
environment:
  - DATABASE_URL=mysql+aiomysql://user:pass@host.docker.internal:3306/db
  - CHOKIDAR_USEPOLLING=true
  - LOG_LEVEL=DEBUG
```

**Extra Hosts Configuration**:
```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

**Volumes for Windows**:
```yaml
volumes:
  - ./storage/logs:/app/logs  # Logs visible on host
```

**Quick Template**:
```yaml
service_name-windows:
  extends: service_name
  environment:
    - CHOKIDAR_USEPOLLING=true
    - DATABASE_URL=mysql+aiomysql://user:pass@host.docker.internal:3306/db
  extra_hosts:
    - "host.docker.internal:host-gateway"
  volumes:
    - ./storage/logs:/app/logs
```

**Reference**: [DOCKER_COMPOSE_CONSOLIDATION_SUMMARY.md](../../DOCKER_COMPOSE_CONSOLIDATION_SUMMARY.md)

**Related**:
- patterns/docker-compose-override.md - Override pattern
- errors/windows-db-connection.md - Database connection issues
