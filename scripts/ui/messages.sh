# Messages & Notifications - View Layer
# Pre-defined messages

# Show usage help
show_usage() {
    echo -e "${COLOR_YELLOW}Sử dụng:${COLOR_NC}"
    echo -e "  ${COLOR_GREEN}$CLI_NAME serve-up${COLOR_NC}           # Khởi động + build"
    echo -e "  ${COLOR_GREEN}$CLI_NAME serve-down${COLOR_NC}         # Dừng tất cả"
    echo -e "  ${COLOR_GREEN}$CLI_NAME server-health${COLOR_NC}       # Health check nhanh"
    echo -e "  ${COLOR_GREEN}$CLI_NAME diagnose${COLOR_NC}          # Chẩn đoán vấn đề"
    echo -e "  ${COLOR_GREEN}$CLI_NAME server-status${COLOR_NC}       # Container status"
    echo -e "  ${COLOR_GREEN}$CLI_NAME logs${COLOR_NC}             # Xem logs (chỉ khi lỗi)"
    echo -e "  ${COLOR_GREEN}$CLI_NAME shell backend${COLOR_NC}     # Vào shell backend"
    echo -e "  ${COLOR_GREEN}$CLI_NAME help${COLOR_NC}             # Xem tất cả lệnh"
    echo -e ""
}

# Show full help
show_help() {
    echo -e "${COLOR_BLUE}🚀 $PROJECT_NAME CLI Commands:${COLOR_NC}"
    echo -e ""
    echo -e "${COLOR_YELLOW}Serve Commands (Quản lý server):${COLOR_NC}"
    echo -e "  ${COLOR_GREEN}$CLI_NAME serve-up${COLOR_NC}            # Khởi động + build (auto-check + auto-migration)"
    echo -e "  ${COLOR_GREEN}$CLI_NAME serve-down${COLOR_NC}          # Dừng tất cả containers"
    echo -e "  ${COLOR_GREEN}$CLI_NAME serve-restart${COLOR_NC}       # Restart tất cả containers"
    echo -e "  ${COLOR_GREEN}$CLI_NAME serve-rebuild${COLOR_NC}       # Rebuild + restart"
    echo -e ""
    echo -e "${COLOR_YELLOW}Server Commands (Trạng thái & Diagnostics):${COLOR_NC}"
    echo -e "  ${COLOR_GREEN}$CLI_NAME server-health${COLOR_NC}        # Health check nhanh (5s)"
    echo -e "  ${COLOR_GREEN}$CLI_NAME server-health 10${COLOR_NC}    # Health check (10s)"
    echo -e "  ${COLOR_GREEN}$CLI_NAME server-status${COLOR_NC}        # Container status (alias: $CLI_NAME ps)"
    echo -e "  ${COLOR_GREEN}$CLI_NAME diagnose${COLOR_NC}           # Chẩn đoán vấn đề chi tiết"
    echo -e ""
    echo -e "${COLOR_YELLOW}Logs Commands (chỉ khi có lỗi):${COLOR_NC}"
    echo -e "  ${COLOR_GREEN}$CLI_NAME logs${COLOR_NC}               # Logs tất cả services"
    echo -e "  ${COLOR_GREEN}$CLI_NAME logs <service>${COLOR_NC}       # Logs 1 service (backend, frontend, db, redis)"
    echo -e ""
    echo -e "${COLOR_YELLOW}Development Commands:${COLOR_NC}"
    echo -e "  ${COLOR_GREEN}$CLI_NAME shell backend${COLOR_NC}       # Vào shell backend"
    echo -e "  ${COLOR_GREEN}$CLI_NAME shell frontend${COLOR_NC}      # Vào shell frontend"
    echo -e "  ${COLOR_GREEN}$CLI_NAME shell db${COLOR_NC}            # Vào shell MySQL"
    echo -e "  ${COLOR_GREEN}$CLI_NAME shell redis${COLOR_NC}          # Vào shell Redis"
    echo -e ""
    echo -e "${COLOR_YELLOW}Database Commands:${COLOR_NC}"
    echo -e "  ${COLOR_GREEN}$CLI_NAME db-migrate${COLOR_NC}          # Run migrations (alias: $CLI_NAME migrate)"
    echo -e "  ${COLOR_GREEN}$CLI_NAME db-create \"message\"${COLOR_NC}  # Tạo migration mới"
    echo -e ""
    echo -e "${COLOR_YELLOW}Access Commands:${COLOR_NC}"
    echo -e "  ${COLOR_GREEN}$CLI_NAME install${COLOR_NC}            # Mở trang cài đặt"
    echo -e ""
}

# Show env error
show_env_error() {
    print_error "File .env không tồn tại!"
    print_warning "Vui lòng tạo file .env trước khi chạy"
    print_warning "Hướng dẫn: docs/01-getting-started.md"
}

# Show startup success
show_startup_success() {
    print_separator
    print_success "Đã khởi động thành công!"
    print_separator
    print_url "📱 Frontend" "$URL_FRONTEND"
    print_url "🔌 Backend API" "$URL_BACKEND"
    print_url "🗄️ phpMyAdmin" "$URL_PHPMYADMIN"
    print_separator
    print_info "Mẹo: Dùng $CLI_NAME server-status để kiểm tra trạng thái, $CLI_NAME logs nếu gặp lỗi"
}

# Show startup tips
show_tips() {
    echo -e ""
    echo -e "${COLOR_BLUE}💡 Mẹo:${COLOR_NC} Dùng $CLI_NAME server-status để kiểm tra trạng thái, $CLI_NAME logs nếu gặp lỗi"
}

# Show invalid service error
show_invalid_service_error() {
    local service=$1
    print_error "Service không hợp lệ: ${service}"
    print_warning "Services khả dụng: backend, frontend, db, redis"
}
