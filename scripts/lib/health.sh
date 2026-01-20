# Health Check Logic - Model Layer
# Pure functions for health checking

# Get health status of MySQL
get_mysql_status() {
    docker inspect --format='{{.State.Health.Status}}' aicmr-mysql-dev 2>/dev/null || echo "unknown"
}

# Get health status of Redis
get_redis_status() {
    docker inspect --format='{{.State.Health.Status}}' aicmr-redis-dev 2>/dev/null || echo "unknown"
}

# Get status of Backend
get_backend_status() {
    docker ps --filter "name=aicmr-backend-dev" --format '{{.Status}}' 2>/dev/null || echo "unknown"
}

# Get status of Frontend
get_frontend_status() {
    docker ps --filter "name=aicmr-frontend-dev" --format '{{.Status}}' 2>/dev/null || echo "unknown"
}

# Check all services health
check_all_services_health() {
    local mysql_status=$(get_mysql_status)
    local redis_status=$(get_redis_status)
    local backend_status=$(get_backend_status)
    local frontend_status=$(get_frontend_status)

    if [ "$mysql_status" == "healthy" ] && [ "$redis_status" == "healthy" ]; then
        echo "true"
        echo "$mysql_status|$redis_status|$backend_status|$frontend_status"
    else
        echo "false"
        echo "$mysql_status|$redis_status|$backend_status|$frontend_status"
    fi
}
