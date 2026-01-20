# Shell Command - Controller Layer
# Handle shell access

cmd_shell() {
    local service=$1

    if [ -z "$service" ]; then
        print_error "Thiếu service name"
        print_warning "Sử dụng: ./start.sh shell <backend|frontend|db>"
        exit 1
    fi

    if ! validate_service "$service"; then
        show_invalid_service_error "$service"
        exit 1
    fi

    case "$service" in
        "backend")
            print_info "Vào shell backend..."
            ;;
        "frontend")
            print_info "Vào shell frontend..."
            ;;
        "db")
            print_info "Vào shell MySQL..."
            ;;
        "redis")
            print_info "Vào shell Redis..."
            ;;
    esac

    docker_shell "$service"
}
