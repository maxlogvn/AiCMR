# AiCMR Context Navigation

## Overview
Context files for AiCMR project extracted from documentation, organized by function for AI agent reference.

## Concepts (10 files)
Core architectural and functional concepts:

- [docker-architecture.md](concepts/docker-architecture.md) - Containerized deployment architecture
- [database-schema.md](concepts/database-schema.md) - MySQL data models and relationships  
- [storage-architecture.md](concepts/storage-architecture.md) - Hybrid file storage system
- [rank-system.md](concepts/rank-system.md) - User permission hierarchy (0-5)
- [jwt-authentication.md](concepts/jwt-authentication.md) - Token-based authentication
- [csrf-protection.md](concepts/csrf-protection.md) - Cross-site request forgery prevention
- [rate-limiting.md](concepts/rate-limiting.md) - API abuse prevention with Redis
- [password-complexity.md](concepts/password-complexity.md) - Password security requirements
- [upload-module.md](concepts/upload-module.md) - File upload system with validation
- [monitoring.md](concepts/monitoring.md) - Prometheus metrics and logging

## Guides (5 files)  
Step-by-step development workflows:

- [getting-started.md](guides/getting-started.md) - Initial setup and installation
- [backend-development.md](guides/backend-development.md) - FastAPI development standards
- [frontend-development.md](guides/frontend-development.md) - Next.js development patterns
- [opencode-cli.md](guides/opencode-cli.md) - AI-assisted development commands
- [api-usage.md](guides/api-usage.md) - REST API integration guide

## Lookup (2 files)
Reference data and commands:

- [api-reference.md](lookup/api-reference.md) - Complete API endpoint reference
- [commands.md](lookup/commands.md) - Development and deployment commands

## Errors (1 file)
Common error patterns and solutions:

- [upload-errors.md](errors/upload-errors.md) - File upload failure scenarios

## Dependencies Map
```
concepts/docker-architecture.md
├── concepts/storage-architecture.md
└── concepts/monitoring.md

concepts/database-schema.md
├── concepts/jwt-authentication.md
└── concepts/upload-module.md

concepts/jwt-authentication.md
├── concepts/csrf-protection.md
├── concepts/rate-limiting.md
└── concepts/rank-system.md

guides/getting-started.md
├── guides/backend-development.md
└── guides/frontend-development.md

guides/api-usage.md
├── concepts/jwt-authentication.md
└── concepts/rank-system.md
```

## Usage Guidelines
- Concepts files: 1-3 sentences core idea, 3-5 key points, minimal example
- All files <200 lines for quick scanning
- Cross-references link related concepts
- Reference links point to full documentation

## Last Updated
2026-01-20