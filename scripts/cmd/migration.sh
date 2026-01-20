# Migration Command - Controller Layer
# Handle database migrations

cmd_migration() {
    print_info "Running database migrations..."
    docker_migration
    print_success "Migration hoàn tất!"
}

cmd_migration_create() {
    local message=$1

    if [ -z "$message" ]; then
        print_error "Thiếu migration message"
        print_warning "Sử dụng: ./start.sh migration-create \"message\""
        exit 1
    fi

    print_info "Tạo migration: ${message}"
    docker_migration_create "$message"
    print_success "Migration file đã tạo!"
    print_warning "Để apply, chạy: ./start.sh migration"
}
