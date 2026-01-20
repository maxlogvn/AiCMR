# Diagnose Command - Controller Layer
# Quick diagnostics for common issues

cmd_diagnose() {
    print_header "🔍 AiCMR System Diagnostics"

    # Docker daemon status
    print_separator
    print_info "Checking Docker Daemon..."
    if check_docker_daemon; then
        local docker_version=$(docker --version)
        print_success "Docker: $docker_version"
    else
        print_error "Docker daemon không đang chạy"
        print_warning "Fix: sudo systemctl start docker"
    fi

    # Docker Compose status
    print_info "Checking Docker Compose..."
    if check_docker_compose; then
        local compose_version=$(docker compose version)
        print_success "Docker Compose: $compose_version"
    else
        print_error "Docker Compose không available"
        print_warning "Fix: Cài đặt Docker Compose"
    fi

    # Port conflicts
    print_separator
    print_info "Checking Port Conflicts..."
    local port_conflicts=$(check_ports)
    if [ -z "$port_conflicts" ]; then
        print_success "No port conflicts detected"
    else
        print_error "Ports đang bị sử dụng: $port_conflicts"
        print_warning "Fix: sudo lsof -i:<port> để xem process đang sử dụng"
    fi

    # Disk space
    print_separator
    print_info "Checking Disk Space..."
    local disk_available=$(df -h . | awk 'NR==2 {print $4}')
    print_success "Available space: $disk_available"
    if ! check_disk_space >/dev/null 2>&1; then
        print_warning "Disk space có thể thấp, hãy cleanup Docker: docker system prune"
    fi

    # Container status
    print_separator
    print_info "Checking Containers..."
    docker_ps

    # Service health
    print_separator
    print_info "Checking Service Health..."
    local health_output=$(check_all_services_health)
    local health_status=$(echo "$health_output" | head -1)
    local health_details=$(echo "$health_output" | tail -1)

    if [ "$health_status" == "true" ]; then
        print_success "All services healthy"
    else
        print_warning "Some services unhealthy"
        IFS='|' read -ra STATUS <<< "$health_details"
        print_warning "MySQL: ${STATUS[0]}"
        print_warning "Redis: ${STATUS[1]}"
        print_warning "Backend: ${STATUS[2]}"
        print_warning "Frontend: ${STATUS[3]}"
    fi

    # Environment
    print_separator
    print_info "Checking Environment..."
    if validate_env_file; then
        print_success ".env file exists"
    else
        print_error ".env file not found"
        print_warning "Fix: cp .env.example .env và cấu hình"
    fi

    # Recent errors
    print_separator
    print_info "Recent Errors (last 10 lines):"
    local errors=$(docker compose logs --tail=10 2>&1 | grep -i "error\|fail\|exception" || echo "No errors found")
    if [ "$errors" != "No errors found" ]; then
        print_warning "$errors"
    else
        print_success "$errors"
    fi

    print_separator
    print_info "Diagnostics complete"
    print_separator
    show_tips
}
