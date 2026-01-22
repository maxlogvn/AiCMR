# Pattern: Docker Compose Override

**Core Concept**: Use Docker Compose override pattern to manage platform-specific configurations without duplicating base configuration. Base file contains common config, override file contains platform-specific changes.

**Key Points**:
- Base compose file (docker-compose.yml) - shared configuration across platforms
- Override file (docker-compose.windows.yml) - Windows-specific overrides
- Merge on runtime: `docker-compose -f base.yml -f override.yml up`
- Override extends base by adding/replacing configuration
- Reduces code duplication by ~20%

**Quick Example**:
```yaml
# docker-compose.yml (base)
services:
  backend:
    image: myapp:latest
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development

# docker-compose.windows.yml (override)
services:
  backend:
    container_name: app-backend-windows
    ports:
      - "8000:8000"  # Exposed directly
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

**Usage**:
```bash
# Linux/Mac
docker-compose up -d

# Windows (base + override)
docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d
```

**Reference**: [DOCKER_COMPOSE_CONSOLIDATION_SUMMARY.md](../../DOCKER_COMPOSE_CONSOLIDATION_SUMMARY.md)

**Related**:
- patterns/nginx-include.md - Config inheritance pattern
- guides/docker-service-add.md - Adding services with overrides
- lookup/windows-docker-overrides.md - Windows override checklist
