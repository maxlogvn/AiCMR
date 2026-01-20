# Down Command - Controller Layer
# Handle container shutdown

cmd_down() {
    print_warning "Đang dừng containers..."
    docker_down
    print_success "Đã dừng thành công!"
}
