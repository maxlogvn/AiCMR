# Health Command - Controller Layer
# Handle health check

cmd_health() {
    local timeout=${1:-5}
    local elapsed=0

    print_info "Health Check (${timeout}s)"
    print_separator

    while [ $elapsed -lt $timeout ]; do
        local result=$(check_all_services_health)
        local is_healthy=$(echo "$result" | head -1)
        local statuses=$(echo "$result" | tail -1)

        IFS='|' read -ra STATUS <<< "$statuses"
        local mysql_status="${STATUS[0]}"
        local redis_status="${STATUS[1]}"
        local backend_status="${STATUS[2]}"
        local frontend_status="${STATUS[3]}"

        if [ "$is_healthy" == "true" ]; then
            print_services_status "$mysql_status" "$redis_status" "$backend_status" "$frontend_status"
            print_separator
            print_success "🎉 Tất cả services đã sẵn sàng!"
            return 0
        fi

        elapsed=$((elapsed + 1))
        sleep 1
    done

    print_warning "Đang khởi động..."
    print_services_status "$mysql_status" "$redis_status" "$backend_status" "$frontend_status"
    print_separator
    print_info "Chạy: $CLI_NAME server-status để kiểm tra chi tiết"
}
