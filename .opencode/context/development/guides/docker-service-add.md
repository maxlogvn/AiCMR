# Guide: Adding Services with Docker Overrides

**Core Concept**: Add services to base compose file first, then add platform-specific overrides only if needed. Follows DRY principle with clear separation of concerns.

**Key Points**:
1. Add service to docker-compose.yml (base config)
2. Add platform-specific overrides only if needed
3. Test on both platforms
4. Update documentation

**Step-by-Step**:

### 1. Add to Base Compose File
```yaml
# docker-compose.yml
new_service:
  image: myimage:latest
  ports:
    - "9000:9000"
  environment:
    - NODE_ENV=development
  volumes:
    - ./storage/data:/app/data
```

### 2. Add Windows Overrides (if needed)
```yaml
# docker-compose.windows.yml
new_service:
  container_name: new-service-windows
  environment:
    - WINDOWS_SPECIFIC_VAR=value
  volumes:
    - ./storage/logs:/app/logs
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

### 3. Start Services
```bash
# Linux/Mac
docker-compose up -d

# Windows
docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d
```

**When to Override**:
- Different container names (suffix -windows)
- Different port mappings (exposed vs internal)
- Platform-specific environment variables
- Volume mount differences
- Extra hosts needed (host.docker.internal)

**When NOT to Override**:
- Same image version
- Same port configuration
- Same environment variables
- Same volume mounts

**Validation**:
```bash
# Validate compose config
docker-compose -f docker-compose.yml -f docker-compose.windows.yml config

# Check container status
docker-compose ps
```

**Reference**: [DOCKER_COMPOSE_CONSOLIDATION_SUMMARY.md](../../DOCKER_COMPOSE_CONSOLIDATION_SUMMARY.md)

**Related**:
- patterns/docker-compose-override.md - Override pattern
- lookup/windows-docker-overrides.md - Override checklist
