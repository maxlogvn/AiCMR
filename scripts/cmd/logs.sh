# Logs Command - Controller Layer
# Handle log viewing

cmd_logs() {
    local service=$1

    if [ -n "$service" ]; then
        print_info "Logs cho: ${service}"
        docker_logs "$service"
    else
        print_info "Logs cho tất cả services"
        print_warning "Press Ctrl+C để thoát"
        docker_logs ""
    fi
}
