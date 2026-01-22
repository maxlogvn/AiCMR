# Concept: Project Structure

**Core Concept**: Standardized directory structure for AiCMR project with clear separation of concerns. Frontend, backend, infrastructure, and configuration organized in logical folders.

**Directory Structure**:
```
AiCMR/
├── frontend/                 # Next.js frontend application
│   ├── src/                 # Source code
│   ├── Dockerfile           # Container build config
│   └── package.json         # Dependencies
├── backend/                  # FastAPI backend application
│   ├── app/                 # Application code
│   ├── Dockerfile           # Container build config
│   └── requirements.txt     # Python dependencies
├── nginx/                    # Nginx reverse proxy config
│   ├── conf.d/              # Server configuration files
│   │   ├── default.conf     # Linux/Mac config
│   │   ├── default-windows.conf  # Windows config
│   │   └── common.conf      # Shared config
│   └── ssl/                 # SSL certificates (if HTTPS enabled)
├── scripts/                  # Management scripts
│   ├── windows/             # Windows batch files
│   │   ├── start.bat       # Start services
│   │   ├── stop.bat        # Stop services
│   │   └── ...
│   ├── lib/                 # Python library modules
│   │   ├── docker.py       # Docker operations
│   │   ├── health.py       # Health checks
│   │   └── config.py       # Configuration management
│   └── cli.py              # Python CLI entry point
├── storage/                  # Data storage (volumes)
│   ├── uploads/             # User uploaded files
│   ├── logs/                # Application logs
│   └── mysql/               # MySQL data persistence
├── docker-compose.yml        # Development (Linux/Mac base config)
├── docker-compose.windows.yml # Development (Windows overrides)
├── docker-compose.prod.yml   # Production configuration
├── Makefile                  # Make commands (Linux/Mac)
├── .env.example             # Environment variable template
└── README.md                # Project documentation
```

**Component Responsibilities**:

**Frontend (Next.js)**:
- User interface and interaction
- State management with React hooks
- API communication with backend
- Client-side routing and navigation
- Static assets and public resources

**Backend (FastAPI)**:
- REST API endpoints
- Business logic and data processing
- Database ORM operations (SQLAlchemy)
- Authentication and authorization
- WebSocket support for real-time features

**Nginx**:
- Reverse proxy for load balancing
- SSL/TLS termination
- Static file serving
- Request routing and URL rewriting
- Security headers and CORS handling

**Database (MySQL)**:
- Persistent data storage
- Relational data model
- Transaction management
- Backup and recovery support

**Cache (Redis)**:
- Session storage
- API response caching
- Real-time data pub/sub
- Queue management

**Scripts**:
- Cross-platform CLI (Python)
- Windows-specific batch files
- Health checks and diagnostics
- Docker container management

**Storage**:
- Persistent volumes for data
- User uploaded files
- Application logs
- Database backups

**Docker Compose Files**:

| File | Purpose | Platform |
|------|---------|----------|
| `docker-compose.yml` | Base configuration | Linux/Mac (can be extended) |
| `docker-compose.windows.yml` | Windows overrides | Windows (extends base) |
| `docker-compose.prod.yml` | Production config | Production deployment |

**Environment Configuration**:

`.env.example` - Template for all required environment variables:
- Database credentials
- Secret keys and tokens
- API URLs and endpoints
- Service configuration
- Platform-specific settings

**Reference**: [README.md](../../README.md)

**Related**:
- concepts/architecture.md - System architecture overview
- guides/quickstart-linux-mac.md - Setup using this structure
