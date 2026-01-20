# Pre-flight Checks - Model Layer
# Validate environment trước khi start

# Kiểm tra Docker daemon đang chạy
check_docker_daemon() {
    if ! docker info >/dev/null 2>&1; then
        return 1
    fi
    return 0
}

# Kiểm tra Docker Compose available
check_docker_compose() {
    if ! docker compose version >/dev/null 2>&1; then
        return 1
    fi
    return 0
}

# Kiểm tra ports không bị conflict
check_ports() {
    local ports=("80" "3306" "6379")
    local conflict_ports=()

    for port in "${ports[@]}"; do
        if lsof -Pi ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
            conflict_ports+=("$port")
        fi
    done

    if [ ${#conflict_ports[@]} -gt 0 ]; then
        echo "${conflict_ports[@]}"
        return 1
    fi
    return 0
}

# Kiểm tra disk space tối thiểu 2GB
check_disk_space() {
    local required_gb=2
    local available_gb=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')

    if [ "$available_gb" -lt "$required_gb" ]; then
        echo "$available_gb"
        return 1
    fi
    return 0
}

# Chạy tất cả pre-flight checks
run_preflight_checks() {
    local errors=()

    # Check Docker daemon
    if ! check_docker_daemon; then
        errors+=("Docker daemon không đang chạy")
    fi

    # Check Docker Compose
    if ! check_docker_compose; then
        errors+=("Docker Compose không available")
    fi

    # Check ports
    local port_conflicts=$(check_ports)
    if [ -n "$port_conflicts" ]; then
        errors+=("Ports đang bị sử dụng: $port_conflicts")
    fi

    # Check disk space
    local disk_available=$(check_disk_space)
    if [ $? -ne 0 ]; then
        errors+=("Disk space không đủ (cần ${required_gb}GB, có ${disk_available}GB)")
    fi

    # Return errors
    if [ ${#errors[@]} -gt 0 ]; then
        for error in "${errors[@]}"; do
            echo "$error"
        done
        return 1
    fi
    return 0
}
