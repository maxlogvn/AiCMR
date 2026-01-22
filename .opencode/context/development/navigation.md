# Development Context Navigation

**Purpose**: Navigate development-specific knowledge for AiCMR project

**Last Updated**: 2026-01-22

---

## Concepts

Understanding development architecture and approaches

| File | Description | Lines |
|------|-------------|--------|
| [python-cli.md](concepts/python-cli.md) | Cross-platform Python CLI architecture | 71 |

---

## Patterns

Reusable development patterns and solutions

| File | Description | Lines |
|------|-------------|--------|
| [docker-compose-override.md](patterns/docker-compose-override.md) | Docker Compose override pattern for platforms | 56 |
| [nginx-include.md](patterns/nginx-include.md) | Nginx config inheritance with includes | 68 |
| [health-check.md](patterns/health-check.md) | Health check implementation pattern | 79 |
| [docker-wrapper.md](patterns/docker-wrapper.md) | Docker operations wrapper with platform detection | 90 |

---

## Examples

Working examples and code snippets

| File | Description | Lines |
|------|-------------|--------|
| [windows-docker-config.md](examples/windows-docker-config.md) | Windows-specific Docker configuration | 152 |
| [windows-dev-tips.md](examples/windows-dev-tips.md) | Windows development best practices | 95 |

---

## Guides

Step-by-step development workflows

| File | Description | Lines |
|------|-------------|--------|
| [docker-service-add.md](guides/docker-service-add.md) | Adding services with Docker overrides | 81 |
| [windows-setup.md](guides/windows-setup.md) | Windows environment setup guide | 160 |

---

## Lookup

Quick reference checklists and tables

| File | Description | Lines |
|------|-------------|--------|
| [windows-docker-overrides.md](lookup/windows-docker-overrides.md) | Windows Docker overrides checklist | 69 |
| [windows-env-vars.md](lookup/windows-env-vars.md) | Windows environment variables checklist | 90 |
| [windows-commands.md](lookup/windows-commands.md) | Windows commands quick reference | 122 |

---

## Errors

Common errors and solutions

| File | Description | Lines |
|------|-------------|--------|
| [windows-db-connection.md](errors/windows-db-connection.md) | Windows database connection issues | 79 |
| [windows-cors.md](errors/windows-cors.md) | Windows CORS configuration errors | 94 |
| [windows-dev-errors.md](errors/windows-dev-errors.md) | Common Windows development errors | 191 |

---

## Quick Access

### Docker/Container Development
- [docker-compose-override.md](patterns/docker-compose-override.md) - Override pattern
- [docker-wrapper.md](patterns/docker-wrapper.md) - Docker operations
- [docker-service-add.md](guides/docker-service-add.md) - Adding services

### Windows Development
- [windows-setup.md](guides/windows-setup.md) - Environment setup
- [windows-docker-config.md](examples/windows-docker-config.md) - Docker configuration
- [windows-dev-tips.md](examples/windows-dev-tips.md) - Best practices
- [windows-commands.md](lookup/windows-commands.md) - Commands reference
- [windows-env-vars.md](lookup/windows-env-vars.md) - Variable checklist
- [windows-docker-overrides.md](lookup/windows-docker-overrides.md) - Override checklist

### Common Issues
- [windows-dev-errors.md](errors/windows-dev-errors.md) - Common errors
- [windows-db-connection.md](errors/windows-db-connection.md) - Database errors
- [windows-cors.md](errors/windows-cors.md) - CORS errors
- [health-check.md](patterns/health-check.md) - Health check pattern

---

## Cross-References

Related contexts:
- [aicmr/](../aicmr/) - AiCMR-specific documentation
- [core/](../core/) - Core development standards
