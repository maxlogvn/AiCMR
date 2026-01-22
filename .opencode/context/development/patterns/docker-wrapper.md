# Pattern: Docker Operations Wrapper

**Core Concept**: Python wrapper functions for Docker operations with platform-specific adaptation. Abstracts docker-compose commands, detects platform automatically.

**Key Points**:
- Unified interface for Docker operations
- Platform detection (Linux/Mac/Windows)
- Automatic docker-compose command selection
- Container name resolution by platform
- Error handling and user-friendly output

**Core Functions**:
```python
def get_compose_command() -> str:
    """Return platform-specific docker-compose command"""
    if platform.system() == 'Windows':
        return 'docker-compose -f docker-compose.yml -f docker-compose.windows.yml'
    return 'docker-compose'

def docker_up():
    """Start all services"""
    cmd = get_compose_command()
    subprocess.run(f"{cmd} up -d", shell=True)

def docker_down():
    """Stop all services"""
    cmd = get_compose_command()
    subprocess.run(f"{cmd} down", shell=True)

def docker_logs(service: str = None):
    """View logs (all or specific service)"""
    cmd = get_compose_command()
    if service:
        subprocess.run(f"{cmd} logs -f {service}", shell=True)
    else:
        subprocess.run(f"{cmd} logs -f", shell=True)

def docker_shell(service: str):
    """Access container shell"""
    container_name = get_container_name(service)
    subprocess.run(f"docker exec -it {container_name} /bin/bash", shell=True)
```

**Container Name Resolution**:
```python
def get_container_name(service: str) -> str:
    """Return platform-specific container name"""
    if platform.system() == 'Windows':
        return f"aicmr-{service}-windows"
    return f"aicmr-{service}"

# Examples:
# Linux: aicmr-backend
# Windows: aicmr-backend-windows
```

**Supported Operations**:
| Function | Command | Description |
|----------|---------|-------------|
| `docker_up()` | up -d | Start all services |
| `docker_down()` | down | Stop all services |
| `docker_restart()` | restart | Restart services |
| `docker_rebuild()` | up -d --build | Rebuild containers |
| `docker_ps()` | ps | Show container status |
| `docker_logs(service)` | logs -f [service] | View logs |
| `docker_shell(service)` | exec -it [container] | Access shell |

**Usage**:
```python
# In CLI
python3 cli.py up          # docker_up()
python3 cli.py logs backend # docker_logs("backend")
python3 cli.py shell mysql  # docker_shell("mysql")
```

**Reference**: [PYTHON_SCRIPTS_SUMMARY.md](../../PYTHON_SCRIPTS_SUMMARY.md)

**Related**:
- concepts/python-cli.md - Python CLI architecture
- patterns/health-check.md - Health check implementation
