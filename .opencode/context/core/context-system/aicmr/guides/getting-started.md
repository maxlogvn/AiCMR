# Guide: Getting Started

**Core Idea**: Set up AiCMR development environment by installing Docker, configuring environment variables, running containers, and completing initial system installation through the web interface.

**Key Points**:
1. Install Docker and Docker Compose on your system
2. Clone the repository and navigate to project directory
3. Create .env file with required environment variables (SECRET_KEY, DATABASE_URL, etc.)
4. Run docker compose up -d --build to start all services
5. Access http://aicmr.local/install to create admin account and configure system

**Quick Example**:
```bash
# Start the system
docker compose up -d --build

# Check logs
docker compose logs -f backend

# Access the application
open http://aicmr.local
```

**Reference**: docs/01-getting-started.md

**Related**: guides/backend-development.md, guides/frontend-development.md