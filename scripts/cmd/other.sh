# Status Command - Controller Layer
# Handle container status display

cmd_status() {
    print_info "Trạng thái containers:"
    docker_ps
}

cmd_ps() {
    print_info "Container Status:"
    docker_ps
}

cmd_install() {
    print_info "Mở trang cài đặt..."
    if command -v xdg-open &> /dev/null; then
        xdg-open "$URL_INSTALL" 2>/dev/null
    elif command -v open &> /dev/null; then
        open "$URL_INSTALL" 2>/dev/null
    else
        print_warning "Mở trình duyệt và truy cập: ${URL_INSTALL}"
    fi
}

cmd_rebuild() {
    print_warning "Rebuilding containers..."
    docker_rebuild
    print_separator
    print_success "Đã rebuild thành công!"
    show_tips
}

cmd_restart() {
    print_warning "Đang restart containers..."
    docker_restart
    print_success "Đã restart thành công!"
}
