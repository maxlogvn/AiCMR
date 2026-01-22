#!/usr/bin/env python3
"""
AiCMR CLI - Cross-Platform Management System

Simplified single-file approach to avoid encoding and import issues.
"""

import subprocess
import sys
import os
from pathlib import Path

# Get project root (scripts is inside scripts/)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent

# Detect platform
IS_WINDOWS = sys.platform == "win32"
IS_MAC = sys.platform == "darwin"
IS_LINUX = sys.platform.startswith("linux")

# Docker compose command
if IS_WINDOWS:
    # Windows: use both base and override files
    DOCKER_COMPOSE_BASE = [
        "docker-compose",
        "-f", str(PROJECT_ROOT / "docker-compose.yml"),
        "-f", str(PROJECT_ROOT / "docker-compose.windows.yml")
    ]
else:
    DOCKER_COMPOSE_BASE = ["docker-compose", "-f", str(PROJECT_ROOT / "docker-compose.yml")]

# ANSI Color codes (ASCII only)
RESET = "\033[0m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
CYAN = "\033[96m"
WHITE = "\033[97m"
BOLD = "\033[1m"


# ============================================================================
# OUTPUT FUNCTIONS
# ============================================================================

def print_header(text):
    """Print header with borders"""
    print(f"{CYAN}{BOLD}{'=' * 60}{RESET}")
    print(f"{CYAN}{BOLD}  {text}{RESET}")
    print(f"{CYAN}{BOLD}{'=' * 60}{RESET}")


def print_success(text):
    """Print success message"""
    print(f"{GREEN}[OK] {text}{RESET}")


def print_error(text):
    """Print error message"""
    print(f"{RED}[ERROR] {text}{RESET}")


def print_warning(text):
    """Print warning message"""
    print(f"{YELLOW}[WARNING] {text}{RESET}")


def print_info(text):
    """Print info message"""
    print(f"{BLUE}[INFO] {text}{RESET}")


def print_separator():
    """Print separator line"""
    print(f"{WHITE}{'-' * 60}{RESET}")


def print_url(name, url):
    """Print URL in formatted way"""
    print(f"{CYAN}{BOLD}{name:>13}{RESET}: {CYAN}{url}{RESET}")


# ============================================================================
# DOCKER FUNCTIONS
# ============================================================================

def run_docker(cmd_args, capture=False):
    """Run docker-compose command"""
    cmd = DOCKER_COMPOSE_BASE + cmd_args

    if capture:
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=PROJECT_ROOT
            )
            return result
        except Exception as e:
            print_error(f"Docker command failed: {e}")
            return None
    else:
        try:
            subprocess.run(cmd, cwd=PROJECT_ROOT)
            return None
        except Exception as e:
            print_error(f"Docker command failed: {e}")
            return None


def docker_up():
    """Start all services"""
    print_info("Starting containers...")
    result = run_docker(["up", "-d"])
    return result is None or result.returncode == 0


def docker_down():
    """Stop all services with wait"""
    print_info("Stopping containers (may take 10-20 seconds)...")

    # Run docker-compose down
    result = run_docker(["down"])

    # Wait for containers to stop
    if result is None or result.returncode == 0:
        import time
        print_info("Waiting for containers to stop...")
        time.sleep(15)  # Wait 15 seconds for graceful shutdown

        # Verify containers are stopped
        result2 = run_docker(["ps"], capture=True)
        if result2 and "Up" not in result2.stdout:
            return True
        else:
            print_warning("Some containers may still be running - check with 'python cli.py status'")
            return False

    return result is None or result.returncode == 0


def docker_restart():
    """Restart all services"""
    print_info("Restarting containers...")
    result = run_docker(["restart"])
    return result is None or result.returncode == 0


def docker_rebuild():
    """Rebuild containers"""
    print_info("Rebuilding containers...")
    result = run_docker(["build", "--no-cache"])
    return result is None or result.returncode == 0


def docker_ps():
    """Show container status"""
    result = run_docker(["ps"], capture=True)
    if result:
        print(result.stdout)


def docker_logs(service=None):
    """Show logs for service"""
    if service:
        print_info(f"Showing logs for {service}... (Ctrl+C to exit)")
        run_docker(["logs", "-f", service])
    else:
        print_info("Showing logs for all services... (Ctrl+C to exit)")
        run_docker(["logs", "-f"])


def docker_shell(service):
    """Access container shell"""
    print_info(f"Opening shell for {service}... (Ctrl+D to exit)")

    if IS_WINDOWS:
        # Windows: use docker exec with cmd.exe or specific tools
        if service == "mysql":
            run_docker(["exec", service, "mysql", "-u", "aicmr_user", "-paicmr"])
        elif service == "redis":
            run_docker(["exec", service, "redis-cli"])
        else:
            run_docker(["exec", service, "sh"])
    else:
        # Linux/Mac: use docker exec with /bin/sh
        run_docker(["exec", service, "/bin/sh"])


def docker_exec(service, command):
    """Execute command in container"""
    print_info(f"Executing command in {service}...")
    run_docker(["exec", service, *command.split()])


# ============================================================================
# HEALTH CHECK FUNCTIONS (Docker-based, no HTTP requests)
# ============================================================================

def check_mysql():
    """Check MySQL using docker exec"""
    try:
        cmd = ["docker", "exec", "-i"]
        if IS_WINDOWS:
            cmd += ["aicmr-mysql-windows", "mysqladmin", "ping"]
        else:
            cmd += ["aicmr-mysql-dev", "mysqladmin", "ping"]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        return "mysqld is alive" in result.stdout or result.returncode == 0
    except Exception:
        return False


def check_redis():
    """Check Redis using docker exec"""
    try:
        cmd = ["docker", "exec", "-i"]
        if IS_WINDOWS:
            cmd += ["aicmr-redis-windows", "redis-cli", "ping"]
        else:
            cmd += ["aicmr-redis-dev", "redis-cli", "ping"]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        return "PONG" in result.stdout
    except Exception:
        return False


def check_backend():
    """Check backend using docker ps (no HTTP requests)"""
    try:
        # Check if backend container is running
        result = run_docker(["ps", "backend"], capture=True)
        if result and "backend" in result.stdout and "Up" in result.stdout:
            return True
        return False
    except Exception:
        return False


def check_frontend():
    """Check frontend using docker ps (no HTTP requests)"""
    try:
        # Check if frontend container is running
        result = run_docker(["ps", "frontend"], capture=True)
        if result and "frontend" in result.stdout and "Up" in result.stdout:
            return True
        return False
    except Exception:
        return False


def check_nginx():
    """Check nginx using docker ps (no HTTP requests)"""
    try:
        # Check if nginx container is running
        result = run_docker(["ps", "nginx"], capture=True)
        if result and "nginx" in result.stdout and "Up" in result.stdout:
            return True
        return False
    except Exception:
        return False


def check_all():
    """Check all services"""
    results = {
        "mysql": check_mysql(),
        "redis": check_redis(),
        "backend": check_backend(),
        "frontend": check_frontend(),
        "nginx": check_nginx()
    }
    return results


def print_health_report():
    """Print full health report"""
    print_header("Health Check Report")
    print_separator()

    results = check_all()

    services = {
        "mysql": "MySQL Database",
        "redis": "Redis Cache",
        "backend": "Backend API",
        "frontend": "Frontend",
        "nginx": "Rewrite Proxy",
    }

    for service, name in services.items():
        status = results.get(service)
        if status:
            print_success(f"{name}: Healthy")
        else:
            print_error(f"{name}: Unhealthy")

    print_separator()

    # Overall status
    healthy_count = sum(1 for v in results.values() if v)
    total_count = len(results)

    if healthy_count == total_count:
        print_success(f"All services healthy ({healthy_count}/{total_count})")
    else:
        print_warning(f"Services unhealthy: {total_count - healthy_count}/{total_count}")

    print_separator()


# ============================================================================
# VALIDATION
# ============================================================================

def check_docker():
    """Check if Docker is available"""
    try:
        result = subprocess.run(["docker", "version"], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print_success("Docker is installed and accessible")
            return True
        else:
            print_error("Docker is not accessible")
            return False
    except Exception as e:
        print_error(f"Docker check failed: {e}")
        return False


def validate_env():
    """Validate .env file exists"""
    env_file = PROJECT_ROOT / ".env"
    if not env_file.exists():
        print_error(".env file not found!")
        print_info("Usage: cp .env.example .env")
        return False

    # Check required variables (basic check)
    try:
        with open(env_file, 'r') as f:
            content = f.read()
            required_vars = ['DB_NAME=', 'DB_USER=', 'DB_PASSWORD=', 'SECRET_KEY=']
            for var in required_vars:
                if var not in content:
                    print_error(f"Missing {var.strip('=')} in .env")
                    return False
    except Exception as e:
        print_error(f"Error reading .env: {e}")
        return False

    return True


# ============================================================================
# COMMAND HANDLERS
# ============================================================================

def cmd_up(args):
    """Start all services"""
    print_header("Starting AiCMR")
    print_separator()

    if not validate_env():
        return 1

    if not check_docker():
        return 1

    if docker_up():
        print_separator()
        print_success("Started successfully!")
        print_separator()
        print_url("Frontend", "http://localhost:3000")
        print_url("Backend API", "http://localhost:8000")
        print_url("API Docs", "http://localhost:8000/docs")
        print_url("phpMyAdmin", "http://localhost:8080")
        print_separator()
        return 0
    else:
        print_separator()
        print_error("Start failed!")
        print_info("Usage: python cli.py logs to view errors")
        return 1


def cmd_down(args):
    """Stop all services"""
    print_header("Stopping AiCMR")
    print_separator()

    if docker_down():
        print_separator()
        print_success("Stopped successfully!")
        print_separator()
        print_info("Note: Data volumes are preserved")
        print_info("To remove volumes, run: python cli.py rebuild")
        print_separator()
        return 0
    else:
        print_separator()
        print_error("Stop failed!")
        return 1


def cmd_restart(args):
    """Restart all services"""
    print_header("Restarting AiCMR")
    print_separator()

    if docker_restart():
        print_separator()
        print_success("Restarted successfully!")
        print_separator()
        print_url("Frontend", "http://localhost:3000")
        print_url("Backend API", "http://localhost:8000")
        print_url("API Docs", "http://localhost:8000/docs")
        print_url("phpMyAdmin", "http://localhost:8080")
        print_separator()
        return 0
    else:
        print_separator()
        print_error("Restart failed!")
        return 1


def cmd_rebuild(args):
    """Rebuild containers"""
    print_header("Rebuilding AiCMR")
    print_separator()

    if docker_rebuild():
        print_separator()
        print_success("Rebuild complete!")
        print_separator()
        return 0
    else:
        print_separator()
        print_error("Rebuild failed!")
        return 1


def cmd_status(args):
    """Show container status"""
    print_header("Container Status")
    print_separator()
    docker_ps()
    print_separator()


def cmd_health(args):
    """Check health of all services"""
    print_header("Health Check")
    print_separator()

    print_health_report()

    print_separator()
    print_info("Health Check Complete")
    print_separator()


def cmd_logs(args):
    """Show logs for service"""
    service = args.service if hasattr(args, 'service') else None

    if service:
        print_header(f"Logs for {service}")
        print_separator()
        docker_logs(service)
    else:
        print_header("Logs for All Services")
        print_separator()
        docker_logs(None)


def cmd_shell(args):
    """Access shell of service"""
    service = args.service if hasattr(args, 'service') else "backend"

    print_header(f"Shell into {service}")
    print_separator()
    docker_shell(service)


def cmd_install(args):
    """Show installation instructions"""
    print_header("AiCMR Installation")
    print_separator()
    print_info("Open browser and navigate to:")
    print_url("Installation", "http://localhost:3000/install")
    print_separator()
    print_info("Follow on-screen instructions")
    print_separator()


def cmd_diagnose(args):
    """Diagnose system issues"""
    print_header("System Diagnosis")
    print_separator()

    # Check Docker
    check_docker()

    # Check .env file
    print_info("Checking .env file...")
    if validate_env():
        print_success(".env file is valid")
    else:
        print_error(".env file is missing or invalid")

    print_separator()

    # Run health checks
    cmd_health(args)


def cmd_version(args):
    """Show version info"""
    print_header("AiCMR CLI Version")
    print_separator()
    print_info(f"Platform: {sys.platform}")
    print_info(f"Python: {sys.version}")
    print_info(f"Docker: compose v2")
    print_info(f"Project: {PROJECT_ROOT}")
    print_separator()


# ============================================================================
# USAGE
# ============================================================================

def print_usage():
    """Print usage information"""
    print(f"""
{RESET}{'=' * 60}
{CYAN}{BOLD}AiCMR CLI - System Management Tool{RESET}
{RESET}{'=' * 60}

Usage:
  python cli.py <command> [options]

Available Commands:

  [SERVE COMMANDS]
    up                  Start all services
    down                Stop all services
    restart             Restart all services
    rebuild             Rebuild containers

  [SERVER COMMANDS]
    status              Show container status
    health              Check health of all services
    version             Show version info

  [LOGS COMMANDS]
    logs                Show logs for all services
    logs <service>      Show logs for specific service
                        Services: backend, frontend, mysql, redis, nginx

  [SHELL COMMANDS]
    shell               Access backend shell (default)
    shell <service>      Access specific service shell
                        Services: backend, mysql, redis, nginx

  [OTHER COMMANDS]
    install             Show installation instructions
    diagnose            Run system diagnosis
    help                Show this help message

Examples:
  python cli.py up
  python cli.py logs backend
  python cli.py shell mysql
  python cli.py health

Notes:
  - Windows: Uses docker-compose.windows.yml for platform-specific configs
  - Linux/Mac: Uses docker-compose.yml
  - All commands require Docker Desktop to be running
  - Health checks use Docker commands (no HTTP requests required)
""")


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(
        description="AiCMR CLI - System Management Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    # Create subparsers for commands
    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Serve commands
    parser_up = subparsers.add_parser('up', help='Start all services')
    parser_up.set_defaults(func=cmd_up)

    parser_down = subparsers.add_parser('down', help='Stop all services')
    parser_down.set_defaults(func=cmd_down)

    parser_restart = subparsers.add_parser('restart', help='Restart all services')
    parser_restart.set_defaults(func=cmd_restart)

    parser_rebuild = subparsers.add_parser('rebuild', help='Rebuild containers')
    parser_rebuild.set_defaults(func=cmd_rebuild)

    # Server commands
    parser_status = subparsers.add_parser('status', help='Show container status')
    parser_status.set_defaults(func=cmd_status)

    parser_health = subparsers.add_parser('health', help='Check health of all services')
    parser_health.set_defaults(func=cmd_health)

    parser_version = subparsers.add_parser('version', help='Show version info')
    parser_version.set_defaults(func=cmd_version)

    # Logs commands
    parser_logs = subparsers.add_parser('logs', help='Show logs')
    parser_logs.add_argument('service', nargs='?', help='Service name (backend, frontend, mysql, redis, nginx)')
    parser_logs.set_defaults(func=cmd_logs)

    # Shell commands
    parser_shell = subparsers.add_parser('shell', help='Access shell')
    parser_shell.add_argument('service', nargs='?', default='backend', help='Service name (default: backend)')
    parser_shell.set_defaults(func=cmd_shell)

    # Other commands
    parser_install = subparsers.add_parser('install', help='Show installation instructions')
    parser_install.set_defaults(func=cmd_install)

    parser_diagnose = subparsers.add_parser('diagnose', help='Run system diagnosis')
    parser_diagnose.set_defaults(func=cmd_diagnose)

    parser_help = subparsers.add_parser('help', help='Show this help message')
    parser_help.set_defaults(func=lambda args: print_usage())

    # Parse arguments
    args = parser.parse_args()

    # If no command provided, show usage
    if not args.command:
        print_usage()
        sys.exit(1)

    # Execute command
    result = args.func(args)
    sys.exit(result if result is not None else 0)


if __name__ == "__main__":
    main()
