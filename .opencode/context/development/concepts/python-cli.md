# Concept: Cross-Platform Python CLI

**Core Concept**: Python-based CLI system replacing shell scripts for unified cross-platform development. Single codebase supports Linux, Mac, and Windows with consistent behavior.

**Key Points**:
- MVC architecture (Model-View-Controller)
- Unified entry point via cli.py
- Automatic platform detection
- Same commands across all platforms
- Better error handling vs shell scripts

**Architecture**:
```
scripts/
  cli.py              # Main CLI entry point
  lib/
    ui/output.py      # Terminal formatting & colors
    config.py         # Configuration management
    docker.py         # Docker operations
    health.py         # Health checks
```

**Platform Detection**:
```python
# Auto-detects platform
import platform
system = platform.system()  # 'Linux', 'Darwin', 'Windows'

if system == 'Windows':
    compose_cmd = 'docker-compose -f docker-compose.yml -f docker-compose.windows.yml'
else:
    compose_cmd = 'docker-compose'
```

**Usage**:
```bash
# All platforms
python3 cli.py up              # Start services
python3 cli.py down            # Stop services
python3 cli.py logs backend    # View logs
python3 cli.py health          # Health check
python3 cli.py shell mysql     # Access shell
```

**Commands Supported**:
- Serve: up, down, restart, rebuild
- Server: status, health
- Logs: all or specific service
- Shell: access container shell
- Database: db-migrate
- Other: install, diagnose, help

**Benefits vs Shell Scripts**:
| Aspect | Shell | Python |
|--------|-------|--------|
| Cross-platform | 2x code (sh + bat) | 1 codebase |
| Error handling | Limited | Exception handling |
| Testing | Platform-specific | Same test across platforms |
| Features | Basic | Advanced (health checks) |

**Reference**: [PYTHON_SCRIPTS_SUMMARY.md](../../PYTHON_SCRIPTS_SUMMARY.md)

**Related**:
- patterns/docker-wrapper.md - Docker operations wrapper
- patterns/health-check.md - Health check implementation
