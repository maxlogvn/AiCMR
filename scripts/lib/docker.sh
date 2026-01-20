# Docker Operations - Model Layer
# Pure functions for Docker operations

# Khởi động containers với timeout
docker_up() {
    local timeout=180  # 3 minutes
    local start_time=$(date +%s)

    echo "Building & Starting containers..."

    if ! docker compose up -d --build 2>&1; then
        return 1
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    echo "Startup time: ${duration}s"
    return 0
}

# Dừng containers
docker_down() {
    echo "Stopping containers..."
    docker compose down
}

# Restart containers
docker_restart() {
    echo "Restarting containers..."
    docker compose restart
}

# Rebuild containers
docker_rebuild() {
    echo "Rebuilding containers..."
    docker compose down
    docker compose up -d --build
}

# Lấy status containers
docker_ps() {
    docker ps --filter "name=aicmr" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# View logs
docker_logs() {
    local service=$1
    if [ -n "$service" ]; then
        docker compose logs -f "$service"
    else
        docker compose logs -f
    fi
}

# Vào shell container
docker_shell() {
    local service=$1
    case "$service" in
        "backend")
            docker compose exec backend bash
            ;;
        "frontend")
            docker compose exec frontend sh
            ;;
        "db"|"mysql")
            docker compose exec mysql mysql -u root -p
            ;;
        "redis")
            docker compose exec redis redis-cli
            ;;
    esac
}

# Run migration
docker_migration() {
    if docker compose exec -T backend alembic upgrade head 2>&1; then
        return 0
    fi
    return 1
}

# Check xem có migration mới không
check_pending_migrations() {
    # Check if alembic is configured
    if ! docker compose exec -T backend alembic current >/dev/null 2>&1; then
        return 1  # Alembic not configured
    fi

    # Check if already at head
    if docker compose exec -T backend alembic current 2>&1 | grep -q "head"; then
        return 1  # No pending migrations
    fi
    return 0  # Has pending migrations
}

# Create migration
docker_migration_create() {
    local message=$1
    docker compose exec backend alembic revision --autogenerate -m "$message"
}

# Chạy migration tự động sau khi database healthy
auto_run_migration() {
    print_info "Checking for pending migrations..."

    # Đợi database ready
    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        local mysql_status=$(get_mysql_status)
        if [ "$mysql_status" == "healthy" ]; then
            break
        fi
        attempt=$((attempt + 1))
        sleep 2
    done

    if [ $attempt -eq $max_attempts ]; then
        print_warning "Database không ready, skip migration"
        return 1
    fi

    # Check và chạy migration (silent fail nếu chưa setup)
    if check_pending_migrations 2>/dev/null; then
        print_info "Running migrations..."
        if docker_migration 2>/dev/null; then
            print_success "Migrations completed"
            return 0
        else
            print_warning "Migration failed (có thể chưa setup Alembic)"
            return 1
        fi
    fi

    # Không có migration hoặc chưa setup
    return 0
}
