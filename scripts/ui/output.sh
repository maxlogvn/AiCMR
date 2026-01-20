# UI Output Functions - View Layer
# Pure functions for rendering output

# Print success message
print_success() {
    local message=$1
    echo -e "${COLOR_GREEN}✅ ${message}${COLOR_NC}"
}

# Print error message
print_error() {
    local message=$1
    echo -e "${COLOR_RED}❌ ${message}${COLOR_NC}"
}

# Print warning message
print_warning() {
    local message=$1
    echo -e "${COLOR_YELLOW}⚠️  ${message}${COLOR_NC}"
}

# Print info message
print_info() {
    local message=$1
    echo -e "${COLOR_BLUE}ℹ️  ${message}${COLOR_NC}"
}

# Print header
print_header() {
    local title=$1
    echo -e "${COLOR_BLUE}========================================${COLOR_NC}"
    echo -e "${COLOR_BLUE}${title}${COLOR_NC}"
    echo -e "${COLOR_BLUE}========================================${COLOR_NC}"
    echo ""
}

# Print separator
print_separator() {
    echo ""
}

# Print URL
print_url() {
    local label=$1
    local url=$2
    echo -e "${COLOR_YELLOW}${label}:${COLOR_NC}    ${url}"
}

# Print services status
print_services_status() {
    local mysql_status=$1
    local redis_status=$2
    local backend_status=$3
    local frontend_status=$4

    if [ "$mysql_status" == "healthy" ] && [ "$redis_status" == "healthy" ]; then
        print_success "MySQL: ${mysql_status}"
        print_success "Redis: ${redis_status}"
        print_success "Backend: ${backend_status}"
        print_success "Frontend: ${frontend_status}"
    else
        print_warning "MySQL: ${mysql_status}"
        print_warning "Redis: ${redis_status}"
        print_warning "Backend: ${backend_status}"
        print_warning "Frontend: ${frontend_status}"
    fi
}
