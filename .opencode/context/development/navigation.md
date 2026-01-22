# Development Context Navigation

**Purpose**: Navigate development-specific knowledge for AiCMR project

**Last Updated**: 2026-01-22

---

## Concepts

Understanding development architecture and approaches

| File | Description | Lines |
|------|-------------|--------|
| [python-cli.md](concepts/python-cli.md) | Cross-platform Python CLI architecture | 71 |
| [rank-system.md](concepts/rank-system.md) | Hierarchical permission system with numeric ranks | 82 |
| [session-state-management.md](concepts/session-state-management.md) | Frontend session state and cleanup | 91 |

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
| [custom-event-pattern.md](examples/custom-event-pattern.md) | Same-tab communication pattern | 67 |
| [rank-testing-examples.md](examples/rank-testing-examples.md) | Automated rank verification commands | 113 |
| [session-cleanup-example.md](examples/session-cleanup-example.md) | Complete logout implementation | 154 |

---

## Guides

Step-by-step development workflows

| File | Description | Lines |
|------|-------------|--------|
| [docker-service-add.md](guides/docker-service-add.md) | Adding services with Docker overrides | 81 |
| [windows-setup.md](guides/windows-setup.md) | Windows environment setup guide | 160 |
| [debugging-auth-flows.md](guides/debugging-auth-flows.md) | Step-by-step debugging procedures | 78 |
| [implementing-logout.md](guides/implementing-logout.md) | Frontend logout with proper cleanup | 134 |

---

## Lookup

Quick reference checklists and tables

| File | Description | Lines |
|------|-------------|--------|
| [windows-docker-overrides.md](lookup/windows-docker-overrides.md) | Windows Docker overrides checklist | 69 |
| [windows-env-vars.md](lookup/windows-env-vars.md) | Windows environment variables checklist | 90 |
| [windows-commands.md](lookup/windows-commands.md) | Windows commands quick reference | 122 |
| [test-accounts-reference.md](lookup/test-accounts-reference.md) | Test credentials and permission matrix | 89 |

---

## Errors

Common errors and solutions

| File | Description | Lines |
|------|-------------|--------|
| [windows-db-connection.md](errors/windows-db-connection.md) | Windows database connection issues | 79 |
| [windows-cors.md](errors/windows-cors.md) | Windows CORS configuration errors | 94 |
| [windows-dev-errors.md](errors/windows-dev-errors.md) | Common Windows development errors | 191 |
| [auth-errors.md](errors/auth-errors.md) | CSRF cache, session contamination fixes | 103 |
| [browser-events-errors.md](errors/browser-events-errors.md) | Storage event limitations and solutions | 76 |

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
- [auth-errors.md](errors/auth-errors.md) - Authentication errors
- [browser-events-errors.md](errors/browser-events-errors.md) - Browser event issues

### Authentication & Authorization
- [rank-system.md](concepts/rank-system.md) - Permission hierarchy
- [session-state-management.md](concepts/session-state-management.md) - Session cleanup
- [implementing-logout.md](guides/implementing-logout.md) - Logout implementation
- [debugging-auth-flows.md](guides/debugging-auth-flows.md) - Auth debugging
- [test-accounts-reference.md](lookup/test-accounts-reference.md) - Test accounts
- [rank-testing-examples.md](examples/rank-testing-examples.md) - Permission testing
- [session-cleanup-example.md](examples/session-cleanup-example.md) - Session cleanup code
- [custom-event-pattern.md](examples/custom-event-pattern.md) - Custom events

---

## Cross-References

Related contexts:
- [aicmr/](../aicmr/) - AiCMR-specific documentation
- [core/](../core/) - Core development standards
