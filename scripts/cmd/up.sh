# Up Command - Controller Layer
# Handle container startup

cmd_up() {
    # Pre-flight checks
    print_header "Pre-flight Checks"

    local preflight_errors=$(run_preflight_checks)
    if [ $? -ne 0 ]; then
        print_error "Pre-flight checks failed:"
        for error in $preflight_errors; do
            print_error "  - $error"
        done
        print_separator
        print_warning "Sử dụng './start.sh diagnose' để kiểm tra chi tiết"
        exit 1
    fi

    print_success "Pre-flight checks passed"
    print_separator

    # Start containers
    print_header "Building & Starting containers"

    if ! docker_up; then
        print_error "Khởi động containers thất bại"
        print_warning "Sử dụng './start.sh logs' để xem lỗi chi tiết"
        exit 1
    fi

    print_separator
    print_success "Đã khởi động thành công!"
    print_separator
    print_url "📱 Frontend" "$URL_FRONTEND"
    print_url "🔌 Backend API" "$URL_BACKEND"
    print_url "📚 API Docs" "$URL_DOCS"
    print_url "🗄️ phpMyAdmin" "$URL_PHPMYADMIN"
    print_separator

    # Auto-run migration
    auto_run_migration

    print_separator
    show_tips
}
