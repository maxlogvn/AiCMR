"""
Commander Management Skill - Working Examples
===========================================

This file demonstrates how to use commander CLI for various
system management tasks in AiCMR.

Use these examples as reference when managing the system.
"""

# ===================================================================
# EXAMPLE 1: System Startup
# ===================================================================

def example_1_start_system():
    """
    Example: Starting the AiCMR system
    """
    print("\n" + "="*80)
    print("Example 1: Starting System")
    print("="*80)

    print("\nStep 1: Check prerequisites")
    print("-" * 80)
    print("# Check Docker is running")
    print("docker info")
    print()
    print("# Check disk space")
    print("df -h")
    print()
    print("# Verify .env file exists")
    print("ls -la .env")

    print("\nStep 2: Start all containers")
    print("-" * 80)
    print("./commander up")
    print()
    print("Expected output:")
    print("✅ Building containers...")
    print("✅ Starting containers...")
    print("✅ Health check passed...")
    print("✅ System ready!")

    print("\nStep 3: Verify system is running")
    print("-" * 80)
    print("# Quick health check")
    print("./commander health")
    print()
    print("# Verify backend")
    print("curl http://localhost:8000/health")
    print()
    print("# Verify frontend")
    print("# Open http://localhost:3000 in browser")


# ===================================================================
# EXAMPLE 2: Health Monitoring
# ===================================================================

def example_2_health_monitoring():
    """
    Example: Monitoring system health
    """
    print("\n" + "="*80)
    print("Example 2: Health Monitoring")
    print("="*80)

    print("\nOption 1: Quick health check (5 seconds)")
    print("-" * 80)
    print("./commander health")
    print()
    print("Returns:")
    print("✅ Backend: Healthy")
    print("✅ Frontend: Healthy")
    print("✅ MySQL Database: Healthy")
    print("✅ Redis Cache: Healthy")

    print("\nOption 2: Detailed status")
    print("-" * 80)
    print("./commander status")
    print()
    print("Returns:")
    print("📊 Container Status")
    print("NAME           STATUS    PORTS")
    print("aicmr-backend  Up 2h     0.0.0.0:8000->8000/tcp")
    print("aicmr-frontend Up 2h     0.0.0.0:3000->3000/tcp")
    print("aicmr-mysql    Up 2h     0.0.0.0:3306->3306/tcp")
    print("aicmr-redis   Up 2h     0.0.0.0:6379->6379/tcp")

    print("\nOption 3: Full diagnostics")
    print("-" * 80)
    print("./commander diagnose")
    print()
    print("Returns:")
    print("🔍 System Diagnostics")
    print("Network: ✅ OK")
    print("Volumes: ✅ OK")
    print("Environment: ✅ OK")
    print("Containers: ✅ OK")


# ===================================================================
# EXAMPLE 3: Viewing Logs
# ===================================================================

def example_3_viewing_logs():
    """
    Example: Viewing and analyzing logs
    """
    print("\n" + "="*80)
    print("Example 3: Viewing Logs")
    print("="*80)

    print("\nScenario 1: View all service logs")
    print("-" * 80)
    print("./commander logs")
    print()
    print("This shows combined logs from all services in real-time.")

    print("\nScenario 2: View specific service logs")
    print("-" * 80)
    print("# Backend logs")
    print("./commander logs backend")
    print()
    print("# Frontend logs")
    print("./commander logs frontend")
    print()
    print("# Database logs")
    print("./commander logs mysql")

    print("\nScenario 3: Follow logs for debugging")
    print("-" * 80)
    print("# Tail last 50 lines of backend logs")
    print("docker logs aicmr-backend --tail 50")
    print()
    print("# Follow logs in real-time (Ctrl+C to exit)")
    print("docker logs aicmr-backend -f")

    print("\nScenario 4: Search logs for errors")
    print("-" * 80)
    print("# Find all ERROR entries")
    print("docker logs aicmr-backend 2>&1 | grep ERROR")
    print()
    print("# Find Python exceptions")
    print("docker logs aicmr-backend 2>&1 | grep -i exception")
    print()
    print("# Find recent errors (last 20 lines)")
    print("docker logs aicmr-backend --tail 20 | grep -i error")


# ===================================================================
# EXAMPLE 4: Shell Access
# ===================================================================

def example_4_shell_access():
    """
    Example: Accessing service shells
    """
    print("\n" + "="*80)
    print("Example 4: Shell Access")
    print("="*80)

    print("\nScenario 1: Access backend shell")
    print("-" * 80)
    print("./commander shell backend")
    print()
    print("Once inside shell:")
    print("# Run Python commands")
    print("python -c 'print(\"Hello from backend\")'")
    print()
    print("# Check Python version")
    print("python --version")
    print()
    print("# List installed packages")
    print("pip list | grep fastapi")
    print()
    print("# Exit shell")
    print("exit")

    print("\nScenario 2: Access database shell")
    print("-" * 80)
    print("./commander shell mysql")
    print()
    print("Once inside shell:")
    print("# Connect to MySQL")
    print("mysql -u root -p'your_root_password_change_this'")
    print()
    print("# List databases")
    print("SHOW DATABASES;")
    print()
    print("# Use AiCMR database")
    print("USE aicmr;")
    print()
    print("# Show tables")
    print("SHOW TABLES;")
    print()
    print("# Count users")
    print("SELECT COUNT(*) FROM users;")
    print()
    print("# Exit MySQL")
    print("EXIT;")
    print()
    print("# Exit shell")
    print("exit")

    print("\nScenario 3: Run migrations")
    print("-" * 80)
    print("./commander shell backend")
    print()
    print("Once inside shell:")
    print("# Check current migration version")
    print("alembic current")
    print()
    print("# Run database migrations")
    print("alembic upgrade head")
    print()
    print("# View migration history")
    print("alembic history")
    print()
    print("# Exit shell")
    print("exit")

    print("\nScenario 4: Database backup")
    print("-" * 80)
    print("./commander shell mysql")
    print()
    print("Once inside shell:")
    print("# Backup database")
    print("mysqldump -u root -p'your_root_password_change_this' aicmr > /tmp/backup.sql")
    print()
    print("# Copy backup to host")
    print("# Exit shell first, then:")
    print("docker cp aicmr-mysql:/tmp/backup.sql ./backup.sql")
    print()
    print("# Exit shell")
    print("exit")


# ===================================================================
# EXAMPLE 5: Troubleshooting
# ===================================================================

def example_5_troubleshooting():
    """
    Example: Common troubleshooting scenarios
    """
    print("\n" + "="*80)
    print("Example 5: Troubleshooting")
    print("="*80)

    print("\nProblem 1: Backend not accessible")
    print("-" * 80)
    print("# Step 1: Check container status")
    print("./commander status")
    print("# Look for: aicmr-backend \"Up\"")
    print()
    print("# Step 2: Check backend logs")
    print("./commander logs backend | tail -50")
    print("# Look for: \"Uvicorn running on http://0.0.0.0:8000\"")
    print()
    print("# Step 3: Test from inside container")
    print("./commander shell backend")
    print("# In shell: curl http://localhost:8000/health")
    print()
    print("# Step 4: Restart if needed")
    print("./commander restart")

    print("\nProblem 2: Database connection errors")
    print("-" * 80)
    print("# Step 1: Check MySQL container")
    print("./commander status")
    print("# Look for: aicmr-mysql \"Up\"")
    print()
    print("# Step 2: Check MySQL logs")
    print("./commander logs mysql | grep -i error")
    print()
    print("# Step 3: Verify credentials")
    print("# Check .env file:")
    print("cat .env | grep DB_")
    print()
    print("# Step 4: Test connection from backend")
    print("./commander shell backend")
    print("# In shell:")
    print("python -c \"from app.core.database import engine; print('OK' if engine else 'FAIL')\"")
    print()
    print("# Step 5: Restart services if config changed")
    print("./commander restart")

    print("\nProblem 3: Out of memory")
    print("-" * 80)
    print("# Step 1: Check resource usage")
    print("./commander status")
    print("# Look at MEM column")
    print()
    print("# Step 2: Check system memory")
    print("docker stats --no-stream")
    print()
    print("# Step 3: Clean up")
    print("docker system prune -a")
    print()
    print("# Step 4: Restart to free memory")
    print("./commander restart")

    print("\nProblem 4: Container keeps restarting")
    print("-" * 80)
    print("# Step 1: Check restart count")
    print("./commander status")
    print("# Look for: \"Restart: N (X seconds ago)\"")
    print()
    print("# Step 2: View error logs")
    print("./commander logs [service] | tail -50")
    print()
    print("# Step 3: Identify crash pattern")
    print("# - Same error? → Code/config issue")
    print("# - Random errors? → Resource issue")
    print("# - DB error? → Check database")
    print()
    print("# Step 4: Stop crash loop")
    print("./commander down")
    print()
    print("# Step 5: Fix issue")
    print("# (Fix code or config)")
    print()
    print("# Step 6: Restart")
    print("./commander up")


# ===================================================================
# EXAMPLE 6: Development Workflow
# ===================================================================

def example_6_development_workflow():
    """
    Example: Complete development workflow
    """
    print("\n" + "="*80)
    print("Example 6: Development Workflow")
    print("="*80)

    print("\nWorkflow: After making code changes")
    print("-" * 80)

    print("# Step 1: Commit changes (git)")
    print("git add .")
    print("git commit -m \"Feature: Add new API endpoint\"")

    print("\n# Step 2: Rebuild containers")
    print("./commander rebuild")
    print()
    print("This will:")
    print("- Stop all containers")
    print("- Rebuild images with new code")
    print("- Restart all containers")
    print("- Run health check")

    print("\n# Step 3: Verify rebuild")
    print("./commander health")
    print()
    print("All services should show ✅ Healthy")

    print("\n# Step 4: Test functionality")
    print("# Test backend API")
    print("curl http://localhost:8000/health")
    print()
    print("# Test frontend")
    print("# Open http://localhost:3000")
    print()
    print("# Run specific test")
    print("cd backend && pytest tests/test_api.py -v")

    print("\n# Step 5: Monitor for issues")
    print("./commander logs")
    print("# Watch for any errors in the logs")

    print("\n# Step 6: If all good, push changes")
    print("git push")


# ===================================================================
# EXAMPLE 7: Database Operations
# ===================================================================

def example_7_database_operations():
    """
    Example: Common database operations
    """
    print("\n" + "="*80)
    print("Example 7: Database Operations")
    print("="*80)

    print("\nOperation 1: Create new migration")
    print("-" * 80)
    print("./commander shell backend")
    print()
    print("Once inside shell:")
    print("# Create migration")
    print("alembic revision --autogenerate -m \"Add user preferences\"")
    print()
    print("# Review generated file")
    print("cat alembic/versions/*.py")
    print()
    print("# Exit shell")
    print("exit")

    print("\nOperation 2: Apply migrations")
    print("-" * 80)
    print("./commander shell backend")
    print()
    print("Once inside shell:")
    print("# Upgrade to latest")
    print("alembic upgrade head")
    print()
    print("# Check current version")
    print("alembic current")
    print()
    print("# Exit shell")
    print("exit")

    print("\nOperation 3: Rollback migration")
    print("-" * 80)
    print("./commander shell backend")
    print()
    print("Once inside shell:")
    print("# Downgrade one step")
    print("alembic downgrade -1")
    print()
    print("# Verify")
    print("alembic current")
    print()
    print("# Exit shell")
    print("exit")

    print("\nOperation 4: Reset database (⚠️ DANGEROUS)")
    print("-" * 80)
    print("⚠️ WARNING: This will DELETE ALL DATA!")
    print("Only use in development!")
    print()
    print("./commander shell mysql")
    print()
    print("Once inside shell:")
    print("# Drop and recreate database")
    print("mysql -u root -p")
    print("DROP DATABASE aicmr;")
    print("CREATE DATABASE aicmr;")
    print("EXIT;")
    print()
    print("# Exit shell")
    print("exit")
    print()
    print("# Re-run migrations")
    print("./commander shell backend")
    print("alembic upgrade head")
    print("exit")


# ===================================================================
# EXAMPLE 8: Emergency Procedures
# ===================================================================

def example_8_emergency_procedures():
    """
    Example: Emergency system recovery procedures
    """
    print("\n" + "="*80)
    print("Example 8: Emergency Procedures")
    print("="*80)

    print("\nEmergency 1: Complete system crash")
    print("-" * 80)
    print("# Stop everything")
    print("./commander down")
    print()
    print("# Force remove all containers")
    print("docker rm -f $(docker ps -aq) 2>/dev/null || true")
    print()
    print("# Clean Docker")
    print("docker system prune -a --volumes")
    print()
    print("# Check Docker daemon")
    print("docker info")
    print("# If error: Restart Docker Desktop")
    print()
    print("# Fresh start")
    print("./commander up")

    print("\nEmergency 2: Disk space full")
    print("-" * 80)
    print("# Check disk space")
    print("df -h")
    print()
    print("# Clean Docker")
    print("docker system prune -a")
    print("docker volume prune")
    print()
    print("# Clear container logs")
    print("docker logs aicmr-backend --tail 0 > /dev/null 2>&1")
    print("docker logs aicmr-mysql --tail 0 > /dev/null 2>&1")
    print()
    print("# Restart services")
    print("./commander restart")

    print("\nEmergency 3: Port conflicts")
    print("-" * 80)
    print("# Find process using port 8000")
    print("# Windows:")
    print("netstat -ano | findstr :8000")
    print("taskkill /PID <pid> /F")
    print()
    print("# Linux/Mac:")
    print("lsof -i :8000")
    print("kill -9 <pid>")
    print()
    print("# Restart services")
    print("./commander restart")

    print("\nEmergency 4: Database corruption")
    print("-" * 80)
    print("⚠️ WARNING: Data loss possible!")
    print()
    print("# Stop services")
    print("./commander down")
    print()
    print("# Remove corrupted volume")
    print("docker volume rm aicmr_mysql")
    print()
    print("# Fresh start (will create new DB)")
    print("./commander up")
    print()
    print("# Run migrations")
    print("./commander shell backend")
    print("alembic upgrade head")
    print("exit")


# ===================================================================
# EXAMPLE 9: Performance Monitoring
# ===================================================================

def example_9_performance_monitoring():
    """
    Example: Monitoring system performance
    """
    print("\n" + "="*80)
    print("Example 9: Performance Monitoring")
    print("="*80)

    print("\nCheck 1: Container resource usage")
    print("-" * 80)
    print("./commander status")
    print("# Shows CPU, memory for each container")

    print("\nCheck 2: Detailed resource usage")
    print("-" * 80)
    print("# Real-time stats")
    print("docker stats --no-stream")
    print()
    print("# Output includes:")
    print("- CPU %")
    print("- Memory usage / limit")
    print("- Net I/O")
    print("- Block I/O")

    print("\nCheck 3: Docker system info")
    print("-" * 80)
    print("docker info")
    print()
    print("# Shows:")
    print("- Docker version")
    print("- Total containers")
    print("- Running containers")
    print("- Storage driver")
    print("- System resources")

    print("\nCheck 4: Disk space usage")
    print("-" * 80)
    print("df -h")
    print()
    print("# Look for:")
    print("- Docker directory space")
    print("- Volume disk usage")
    print("- Available space")

    print("\nCheck 5: Network statistics")
    print("-" * 80)
    print("# Check container network I/O")
    print("docker stats --no-stream --format \"table {{.Name}}\\t{{.NetIO}}\"")
    print()
    print("# List networks")
    print("docker network ls")


# ===================================================================
# EXAMPLE 10: Maintenance Tasks
# ===================================================================

def example_10_maintenance_tasks():
    """
    Example: Routine maintenance tasks
    """
    print("\n" + "="*80)
    print("Example 10: Maintenance Tasks")
    print("="*80)

    print("\nTask 1: Daily health check")
    print("-" * 80)
    print("# Quick system check")
    print("./commander health")
    print()
    print("# Should be part of morning routine")

    print("\nTask 2: Weekly cleanup")
    print("-" * 80)
    print("# Remove unused Docker resources")
    print("docker system prune -a")
    print()
    print("# Remove dangling images")
    print("docker image prune")
    print()
    print("# Remove unused volumes")
    print("docker volume prune")

    print("\nTask 3: Database backup")
    print("-" * 80)
    print("# Access database shell")
    print("./commander shell mysql")
    print()
    print("# Inside shell:")
    print("mysqldump -u root -p aicmr > backup_$(date +%Y%m%d).sql")
    print("exit")
    print()
    print("# Copy backup to host")
    print("docker cp aicmr-mysql:/backup_$(date +%Y%m%d).sql ./backups/")

    print("\nTask 4: Log rotation (manual)")
    print("-" * 80)
    print("# Clear container logs")
    print("docker logs aicmr-backend --tail 0 > /dev/null 2>&1")
    print("docker logs aicmr-frontend --tail 0 > /dev/null 2>&1")
    print("docker logs aicmr-mysql --tail 0 > /dev/null 2>&1")
    print("docker logs aicmr-redis --tail 0 > /dev/null 2>&1")
    print()
    print("# Note: This is automatic on container restart")

    print("\nTask 5: System update")
    print("-" * 80)
    print("# Stop containers")
    print("./commander down")
    print()
    print("# Update Docker (if needed)")
    print("# Windows: Check Docker Desktop for updates")
    print("# Linux: sudo apt-get update && sudo apt-get upgrade docker-ce")
    print()
    print("# Update code (git pull)")
    print("git pull origin master")
    print()
    print("# Rebuild with latest code")
    print("./commander rebuild")
    print()
    print("# Verify")
    print("./commander health")


# ===================================================================
# RUNNING EXAMPLES
# ===================================================================

if __name__ == "__main__":
    """
    Run all examples to demonstrate commander usage
    """
    print("\n" + "="*80)
    print("COMMANDER MANAGEMENT SKILL - WORKING EXAMPLES")
    print("="*80)
    print()
    print("This file contains examples of how to use commander CLI")
    print("for various system management tasks in AiCMR.")
    print()
    print("To use these examples:")
    print("1. Read through the example functions below")
    print("2. Copy the commands you need")
    paste("3. Execute them in your terminal")
    print()
    print("Available examples:")
    print("- Example 1: Starting the system")
    print("- Example 2: Health monitoring")
    print("- Example 3: Viewing logs")
    print("- Example 4: Shell access")
    print("- Example 5: Troubleshooting")
    print("- Example 6: Development workflow")
    print("- Example 7: Database operations")
    print("- Example 8: Emergency procedures")
    print("- Example 9: Performance monitoring")
    print("- Example 10: Maintenance tasks")
    print()
    print("="*80)

    # Run example demonstrations
    example_1_start_system()
    example_2_health_monitoring()
    example_3_viewing_logs()
    example_4_shell_access()
    example_5_troubleshooting()
    example_6_development_workflow()
    example_7_database_operations()
    example_8_emergency_procedures()
    example_9_performance_monitoring()
    example_10_maintenance_tasks()

    print("\n" + "="*80)
    print("END OF EXAMPLES")
    print("="*80)


"""
SUMMARY
=======

Key Takeaways:

1. **ALWAYS use commander CLI** - Not docker compose directly
2. **Check status before acting** - ./commander status
3. **View logs for debugging** - ./commander logs [service]
4. **Use shell for operations** - ./commander shell [service]
5. **Health check regularly** - ./commander health
6. **Rebuild after code changes** - ./commander rebuild
7. **Know emergency procedures** - When things go wrong

Common Commands:
- ./commander up         # Start
- ./commander down       # Stop
- ./commander rebuild    # Rebuild
- ./commander health     # Quick check
- ./commander status     # Detailed status
- ./commander diagnose   # Full diagnostics
- ./commander logs       # View logs
- ./commander shell [svc] # Access shell

For quick reference, see README.md
For full documentation, see skill.md
"""
