#!/bin/bash

# AiCMR Quick Startup Script
# Dùng để khởi động nhanh toàn bộ hệ thống

set -e

# Màu sắc cho terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 AiCMR Quick Startup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Kiểm tra file .env
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Lỗi: File .env không tồn tại!${NC}"
    echo -e "${YELLOW}⚠️  Vui lòng tạo file .env trước khi chạy${NC}"
    echo -e "${YELLOW}📋 Hướng dẫn: docs/01-getting-started.md${NC}"
    exit 1
fi

echo -e "${GREEN}✅ File .env tồn tại${NC}"
echo ""

# Tùy chọn startup
if [ -z "$1" ]; then
    echo -e "${YELLOW}Sử dụng:${NC}"
    echo "  ${GREEN}./start.sh up${NC}              # Khởi động + build"
    echo "  ${GREEN}./start.sh down${NC}            # Dừng tất cả"
    echo "  ${GREEN}./start.sh health${NC}           # Health check nhanh"
    echo "  ${GREEN}./start.sh ps${NC}              # Container status"
    echo "  ${GREEN}./start.sh logs${NC}            # Xem logs (chỉ khi lỗi)"
    echo "  ${GREEN}./start.sh shell backend${NC}    # Vào shell backend"
    echo "  ${GREEN}./start.sh help${NC}            # Xem tất cả lệnh"
    echo ""
    exit 0
fi

# Xử lý commands
case "$1" in
    "up"|"start")
        echo -e "${BLUE}🔧 Building & Starting containers...${NC}"
        docker compose up -d --build
        echo ""
        echo -e "${GREEN}✅ Đã khởi động thành công!${NC}"
        echo ""
        echo -e "${YELLOW}📱 Frontend:${NC}    http://localhost/"
        echo -e "${YELLOW}🔌 Backend API:${NC}  http://localhost/backend/"
        echo -e "${YELLOW}🗄️ phpMyAdmin:${NC}    http://localhost/phpmyadmin/"
        echo ""
        echo -e "${BLUE}💡 Mẹo:${NC} Dùng ./start.sh ps để kiểm tra trạng thái, ./start.sh logs nếu gặp lỗi"
        ;;
        
    "down"|"stop")
        echo -e "${YELLOW}🛑 Đang dừng containers...${NC}"
        docker compose down
        echo -e "${GREEN}✅ Đã dừng thành công!${NC}"
        ;;
        
    "restart")
        echo -e "${YELLOW}🔄 Đang restart containers...${NC}"
        docker compose restart
        echo -e "${GREEN}✅ Đã restart thành công!${NC}"
        ;;
        
    "logs")
        if [ -n "$2" ]; then
            echo -e "${BLUE}📋 Logs cho: $2${NC}"
            docker compose logs -f "$2"
        else
            echo -e "${BLUE}📋 Logs cho tất cả services${NC}"
            echo -e "${YELLOW}Press Ctrl+C để thoát${NC}"
            docker compose logs -f
        fi
        ;;
        
    "status")
        echo -e "${BLUE}📊 Trạng thái containers:${NC}"
        docker compose ps
        ;;
        
    "install")
        echo -e "${BLUE}🔗 Mở trang cài đặt...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost/install 2>/dev/null
        elif command -v open &> /dev/null; then
            open http://localhost/install 2>/dev/null
        else
            echo -e "${YELLOW}📱 Mở trình duyệt và truy cập:${NC} http://localhost/install"
        fi
        ;;
        
    "rebuild")
        echo -e "${YELLOW}🔨 Rebuilding containers...${NC}"
        docker compose down
        docker compose up -d --build
        echo ""
        echo -e "${GREEN}✅ Đã rebuild thành công!${NC}"
        echo -e "${YELLOW}💡 Mẹo:${NC} Dùng ./start.sh ps để kiểm tra trạng thái"
        ;;
        
    "shell")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Lỗi: Thiếu service name${NC}"
            echo -e "${YELLOW}Sử dụng:${NC} ./start.sh shell <backend|frontend|db>"
            exit 1
        fi
        
        case "$2" in
            "backend")
                echo -e "${BLUE}🐍 Vào shell backend...${NC}"
                docker compose exec backend bash
                ;;
            "frontend")
                echo -e "${BLUE}⚛️  Vào shell frontend...${NC}"
                docker compose exec frontend sh
                ;;
            "db"|"mysql")
                echo -e "${BLUE}🐘 Vào shell MySQL...${NC}"
                docker compose exec mysql mysql -u root -p
                ;;
            "redis")
                echo -e "${BLUE}🔴 Vào shell Redis...${NC}"
                docker compose exec redis redis-cli
                ;;
            *)
                echo -e "${RED}❌ Lỗi: Service không hợp lệ: $2${NC}"
                echo -e "${YELLOW}Services khả dụng:${NC} backend, frontend, db, redis"
                exit 1
                ;;
        esac
        ;;
        
    "migration"|"migrate")
        echo -e "${BLUE}🔄 Running database migrations...${NC}"
        docker compose exec backend alembic upgrade head
        echo -e "${GREEN}✅ Migration hoàn tất!${NC}"
        ;;
        
    "migration-create")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Lỗi: Thiếu migration message${NC}"
            echo -e "${YELLOW}Sử dụng:${NC} ./start.sh migration-create \"message\""
            exit 1
        fi
        echo -e "${BLUE}📝 Tạo migration: $2${NC}"
        docker compose exec backend alembic revision --autogenerate -m "$2"
        echo -e "${GREEN}✅ Migration file đã tạo!${NC}"
        echo -e "${YELLOW}Để apply, chạy: ./start.sh migration${NC}"
        ;;
        
    "ps")
        echo -e "${BLUE}📊 Container Status:${NC}"
        docker ps --filter "name=aicmr" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        ;;

    "health")
        echo -e "${BLUE}💚 Health Check (${NC}${2:-5}s${BLUE})${NC}"
        echo ""

        local timeout=${2:-5}
        local elapsed=0

        while [ $elapsed -lt $timeout ]; do
            local mysql_status=$(docker inspect --format='{{.State.Health.Status}}' aicmr-mysql-dev 2>/dev/null || echo "unknown")
            local redis_status=$(docker inspect --format='{{.State.Health.Status}}' aicmr-redis-dev 2>/dev/null || echo "unknown")
            local backend_status=$(docker ps --filter "name=aicmr-backend-dev" --format '{{.Status}}' 2>/dev/null || echo "")
            local frontend_status=$(docker ps --filter "name=aicmr-frontend-dev" --format '{{.Status}}' 2>/dev/null || echo "")

            if [ "$mysql_status" == "healthy" ] && [ "$redis_status" == "healthy" ]; then
                echo -e "${GREEN}✅ MySQL: ${mysql_status}${NC}"
                echo -e "${GREEN}✅ Redis: ${redis_status}${NC}"
                echo -e "${GREEN}✅ Backend: ${backend_status}${NC}"
                echo -e "${GREEN}✅ Frontend: ${frontend_status}${NC}"
                echo ""
                echo -e "${GREEN}🎉 Tất cả services đã sẵn sàng!${NC}"
                exit 0
            fi

            elapsed=$((elapsed + 1))
            sleep 1
        done

        echo -e "${YELLOW}⏳ Đang khởi động...${NC}"
        echo -e "${YELLOW}MySQL: ${mysql_status}${NC}"
        echo -e "${YELLOW}Redis: ${redis_status}${NC}"
        echo -e "${YELLOW}Backend: ${backend_status}${NC}"
        echo -e "${YELLOW}Frontend: ${frontend_status}${NC}"
        echo ""
        echo -e "${BLUE}💡 Chạy ./start.sh ps để kiểm tra chi tiết${NC}"
        ;;
        
    "help"|"--help"|"-h")
        echo -e "${BLUE}🚀 AiCMR Quick Startup Commands:${NC}"
        echo ""
        echo -e "${YELLOW}Khởi động/Dừng:${NC}"
        echo "  ${GREEN}./start.sh${NC}              # Hiển thị hướng dẫn"
        echo "  ${GREEN}./start.sh up${NC}            # Khởi động + build"
        echo "  ${GREEN}./start.sh down${NC}          # Dừng tất cả"
        echo "  ${GREEN}./start.sh restart${NC}       # Restart tất cả"
        echo "  ${GREEN}./start.sh rebuild${NC}       # Rebuild + restart"
        echo ""
        echo -e "${YELLOW}Health & Status:${NC}"
        echo "  ${GREEN}./start.sh health${NC}         # Health check nhanh (5s)"
        echo "  ${GREEN}./start.sh health 10${NC}     # Health check (10s)"
        echo "  ${GREEN}./start.sh ps${NC}            # Container status"
        echo ""
        echo -e "${YELLOW}Logs (chỉ khi có lỗi):${NC}"
        echo "  ${GREEN}./start.sh logs${NC}          # Logs tất cả"
        echo "  ${GREEN}./start.sh logs <service>${NC}  # Logs 1 service"
        echo ""
        echo -e "${YELLOW}Development:${NC}"
        echo "  ${GREEN}./start.sh shell backend${NC}    # Vào shell backend"
        echo "  ${GREEN}./start.sh shell frontend${NC}   # Vào shell frontend"
        echo "  ${GREEN}./start.sh shell db${NC}         # Vào shell MySQL"
        echo "  ${GREEN}./start.sh shell redis${NC}       # Vào shell Redis"
        echo ""
        echo -e "${YELLOW}Database:${NC}"
        echo "  ${GREEN}./start.sh migration${NC}         # Run migrations"
        echo "  ${GREEN}./start.sh migration-create \"msg\"${NC}  # Tạo migration"
        echo ""
        echo -e "${YELLOW}Access:${NC}"
        echo "  ${GREEN}./start.sh install${NC}         # Mở trang cài đặt"
        echo ""
        ;;
        
    *)
        echo -e "${RED}❌ Lỗi: Command không hợp lệ: $1${NC}"
        echo -e "${YELLOW}Chạy: ./start.sh help${NC}"
        exit 1
        ;;
esac
