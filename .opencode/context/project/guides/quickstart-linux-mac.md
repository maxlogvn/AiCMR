# Guide: Quick Start (Linux/Mac)

**Core Concept**: Setup AiCMR development environment on Linux or Mac using Docker Compose. Follow DRY principles with environment templates and unified commands.

**Key Points**:
1. Clone repository from Git
2. Copy and configure .env file
3. Start containers with docker-compose
4. Verify all services are running
5. Access via localhost URLs

**Step-by-Step**:

### 1. Clone Repository
```bash
git clone <repository-url>
cd AiCMR
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables**:
```bash
# Database
DB_NAME=aicmr
DB_USER=aicmr_user
DB_PASSWORD=your_secure_password

# Backend
SECRET_KEY=your_secret_key_32_chars

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Services
```bash
# Option 1: Using Make (recommended)
make up

# Option 2: Using Docker Compose
docker-compose up -d
```

**What happens**:
- Pulls Docker images from registry
- Builds containers from Dockerfiles
- Creates volumes for data persistence
- Starts all services in background

### 4. Verify Services
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs -f

# Verify all containers are "Up"
```

**Expected Output**:
```
NAME           STATUS     PORTS
aicmr-backend  Up 2 mins  0.0.0.0:8000->8000/tcp
aicmr-frontend Up 2 mins  0.0.0.0:3000->3000/tcp
aicmr-mysql    Up 2 mins  0.0.0.0:3306->3306/tcp
aicmr-redis    Up 2 mins  0.0.0.0:6379->6379/tcp
aicmr-nginx    Up 2 mins  0.0.0.0:80->80/tcp
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Nginx: http://localhost

**Common Commands**:
```bash
make up          # Start services
make down        # Stop services
make restart     # Restart services
make logs        # View logs
make clean       # Clean up (remove volumes)
make build       # Rebuild containers
```

**Troubleshooting**:
- **Port conflicts**: Check with `lsof -i :3000` (Mac) or `netstat -tulpn` (Linux)
- **Permission errors**: Run with `sudo` if Docker requires elevated privileges
- **Container not starting**: Check logs with `docker-compose logs <service>`

**Prerequisites**:
- Docker Desktop 4.0+ or Docker Engine
- Docker Compose 2.0+
- 4GB+ RAM available
- 10GB+ disk space

**Reference**: [README.md](../../README.md)

**Related**:
- concepts/architecture.md - System architecture
- lookup/commands-reference.md - All available commands
- lookup/access-urls.md - Development & production URLs
