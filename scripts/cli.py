#!/usr/bin/env python3
"""
AiCMR CLI - Cross-Platform Management System

Platform-agnostic Docker management using single docker-compose.yml
Works on Windows, Linux, and macOS without platform-specific overrides.
"""

import subprocess
import sys
import os
from pathlib import Path

# Get project root
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent

# Docker compose command - single file for all platforms
DOCKER_COMPOSE = ["docker-compose", "-f", str(PROJECT_ROOT / "docker-compose.yml")]

# Unified container names (same across all platforms)
CONTAINERS = {
    "mysql": "aicmr-mysql",
    "backend": "aicmr-backend",
    "frontend": "aicmr-frontend",
    "redis": "aicmr-redis",
    "nginx": "aicmr-nginx",
    "phpmyadmin": "aicmr-phpmyadmin",
}

# ANSI Color codes
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
    cmd = DOCKER_COMPOSE + cmd_args

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


def run_docker_raw(cmd):
    """Run raw docker command"""
    try:
        return subprocess.run(cmd, capture_output=True, text=True)
    except Exception as e:
        return None


def docker_up():
    """Start all services"""
    print_info("Starting containers...")
    result = run_docker(["up", "-d"])
    return result is None or result.returncode == 0


def docker_down():
    """Stop all services"""
    print_info("Stopping containers...")
    result = run_docker(["down"])
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
    if result is None or result.returncode == 0:
        print_info("Restarting with new images...")
        result = run_docker(["up", "-d"])
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

    container = CONTAINERS.get(service, service)

    if service == "mysql":
        run_docker_raw(["docker", "exec", "-it", container, "mysql", "-u", os.getenv("DB_USER", "aicmr_user"), "-p" + os.getenv("DB_PASSWORD", "")])
    elif service == "redis":
        run_docker_raw(["docker", "exec", "-it", container, "redis-cli"])
    else:
        shell = "sh" if sys.platform != "win32" else "sh"
        run_docker_raw(["docker", "exec", "-it", container, shell])


# ============================================================================
# HEALTH CHECK FUNCTIONS
# ============================================================================

def check_container(container_name):
    """Check if container is running"""
    try:
        result = run_docker_raw([
            "docker", "inspect", "-f",
            "{{.State.Running}}", container_name
        ])
        if result and "true" in result.stdout:
            return True
        return False
    except Exception:
        return False


def check_service_health(service):
    """Check service health using docker exec"""
    container = CONTAINERS.get(service)

    if service == "mysql":
        result = run_docker_raw([
            "docker", "exec", container,
            "mysqladmin", "ping", "-h", "localhost"
        ])
        return result and result.returncode == 0

    elif service == "redis":
        result = run_docker_raw([
            "docker", "exec", container, "redis-cli", "ping"
        ])
        return result and "PONG" in result.stdout

    else:
        return check_container(container)


def check_all():
    """Check all services"""
    results = {}
    for service, container in CONTAINERS.items():
        results[service] = check_container(container)
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
        "nginx": "Reverse Proxy",
    }

    for service, name in services.items():
        status = results.get(service, False)
        if status:
            print_success(f"{name}: Healthy")
        else:
            print_error(f"{name}: Unhealthy")

    print_separator()

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
        result = subprocess.run(
            ["docker", "version"],
            capture_output=True,
            text=True,
            timeout=5
        )
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
        print_info("Run: ./commander logs to view errors")
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
        print_info("To remove everything: docker-compose down -v")
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
    service = args.service if hasattr(args, 'service') and args.service else None

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
    service = args.service if hasattr(args, 'service') and args.service else "backend"

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

    # Show container status
    print_info("Container Status:")
    docker_ps()

    print_separator()

    # Run health checks
    cmd_health(args)


def cmd_version(args):
    """Show version info"""
    print_header("AiCMR CLI Version")
    print_separator()
    print_info(f"Platform: {sys.platform}")
    print_info(f"Python: {sys.version.split()[0]}")
    print_info(f"Docker: Compose v2 (single file)")
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
  OR
  ./commander <command> [options]

Available Commands:

  [LIFECYCLE]
    up                  Start all services
    down                Stop all services
    restart             Restart all services
    rebuild             Rebuild containers

  [STATUS]
    status              Show container status
    health              Check health of all services
    version             Show version info

  [LOGS]
    logs                Show logs for all services
    logs <service>      Show logs for specific service
                        Services: backend, frontend, mysql, redis, nginx

  [ACCESS]
    shell               Access backend shell (default)
    shell <service>     Access specific service shell
                        Services: backend, mysql, redis, nginx

  [OTHER]
    install             Show installation instructions
    diagnose            Run system diagnosis
    help                Show this help message

Examples:
  ./commander up
  ./commander logs backend
  ./commander shell mysql
  ./commander health

Notes:
  - Uses single docker-compose.yml (platform-agnostic)
  - Container names are consistent across platforms
  - All services include health checks
  - Extra host: host.docker.internal available
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

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Lifecycle commands
    parser_up = subparsers.add_parser('up', help='Start all services')
    parser_up.set_defaults(func=cmd_up)

    parser_down = subparsers.add_parser('down', help='Stop all services')
    parser_down.set_defaults(func=cmd_down)

    parser_restart = subparsers.add_parser('restart', help='Restart all services')
    parser_restart.set_defaults(func=cmd_restart)

    parser_rebuild = subparsers.add_parser('rebuild', help='Rebuild containers')
    parser_rebuild.set_defaults(func=cmd_rebuild)

    # Status commands
    parser_status = subparsers.add_parser('status', help='Show container status')
    parser_status.set_defaults(func=cmd_status)

    parser_health = subparsers.add_parser('health', help='Check health')
    parser_health.set_defaults(func=cmd_health)

    parser_version = subparsers.add_parser('version', help='Show version')
    parser_version.set_defaults(func=cmd_version)

    # Logs commands
    parser_logs = subparsers.add_parser('logs', help='Show logs')
    parser_logs.add_argument('service', nargs='?', help='Service name')
    parser_logs.set_defaults(func=cmd_logs)

    # Shell commands
    parser_shell = subparsers.add_parser('shell', help='Access shell')
    parser_shell.add_argument('service', nargs='?', default='backend', help='Service name')
    parser_shell.set_defaults(func=cmd_shell)

    # Other commands
    parser_install = subparsers.add_parser('install', help='Show installation')
    parser_install.set_defaults(func=cmd_install)

    parser_diagnose = subparsers.add_parser('diagnose', help='Run diagnosis')
    parser_diagnose.set_defaults(func=cmd_diagnose)

    parser_help = subparsers.add_parser('help', help='Show help')
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
