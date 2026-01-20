#!/bin/bash

# AiCMR CLI - MVC Architecture
# Entry point for all commands with group-based commands

set -e

# Get script directory (resolve symlink if any)
SCRIPT_PATH="${BASH_SOURCE[0]}"
while [ -h "$SCRIPT_PATH" ]; do
    SCRIPT_DIR="$(cd -P "$(dirname "$SCRIPT_PATH")" && pwd)"
    SCRIPT_PATH="$(readlink "$SCRIPT_PATH")"
    [[ $SCRIPT_PATH != /* ]] && SCRIPT_PATH="$SCRIPT_DIR/$SCRIPT_PATH"
done
SCRIPT_DIR="$(cd -P "$(dirname "$SCRIPT_PATH")" && pwd)"

# Change to project root (1 level up from scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../" && pwd)"
cd "$PROJECT_ROOT"

# Load Model layer
source "$SCRIPT_DIR/lib/config.sh"
source "$SCRIPT_DIR/lib/docker.sh"
source "$SCRIPT_DIR/lib/health.sh"
source "$SCRIPT_DIR/lib/preflight.sh"

# Load View layer
source "$SCRIPT_DIR/ui/output.sh"
source "$SCRIPT_DIR/ui/messages.sh"

# Load Controller layer
source "$SCRIPT_DIR/cmd/up.sh"
source "$SCRIPT_DIR/cmd/down.sh"
source "$SCRIPT_DIR/cmd/logs.sh"
source "$SCRIPT_DIR/cmd/health.sh"
source "$SCRIPT_DIR/cmd/shell.sh"
source "$SCRIPT_DIR/cmd/migration.sh"
source "$SCRIPT_DIR/cmd/other.sh"
source "$SCRIPT_DIR/cmd/diagnose.sh"

# Validate .env file
if ! validate_env_file; then
    show_env_error
    exit 1
fi

# Show header
print_header "🚀 $CLI_DESCRIPTION"

# No arguments - show usage
if [ -z "$1" ]; then
    show_usage
    exit 0
fi

# Route commands
case "$1" in
    # Serve commands
    "serve-up"|"serve-start"|"start")
        cmd_up
        ;;
    "serve-down"|"serve-stop"|"stop")
        cmd_down
        ;;
    "serve-restart")
        cmd_restart
        ;;
    "serve-rebuild")
        cmd_rebuild
        ;;

    # Server commands
    "server-status"|"status"|"ps")
        cmd_ps
        ;;
    "server-health"|"health")
        cmd_health "$2"
        ;;

    # Logs commands
    "logs")
        cmd_logs "$2"
        ;;

    # Shell commands
    "shell")
        cmd_shell "$2"
        ;;

    # Database commands
    "db-migrate"|"db-migration"|"migrate"|"migration")
        cmd_migration
        ;;
    "db-create"|"migration-create")
        cmd_migration_create "$2"
        ;;

    # Other commands
    "install")
        cmd_install
        ;;
    "diagnose")
        cmd_diagnose
        ;;

    # Help
    "help"|"--help"|"-h")
        show_help
        ;;

    *)
        print_error "Command không hợp lệ: $1"
        print_warning "Chạy: $CLI_NAME help"
        exit 1
        ;;
esac
