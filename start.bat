@echo off
REM Startup Script for AiCMR - Backend & Frontend
REM This script starts both backend and frontend services

echo ============================================
echo Starting AiCMR Application
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found! Please install Python 3.11+
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

echo [OK] Python and Node.js found
echo.

REM Start Backend
echo ============================================
echo Starting Backend (FastAPI)...
echo ============================================
start "AiCMR Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo [OK] Backend started on http://localhost:8000
echo.

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul
echo.

REM Start Frontend
echo ============================================
echo Starting Frontend (Next.js)...
echo ============================================
start "AiCMR Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo [OK] Frontend started on http://localhost:3000
echo.

echo ============================================
echo System Startup Complete!
echo ============================================
echo.
echo Services:
echo   - Backend API:   http://localhost:8000
echo   - API Docs:      http://localhost:8000/docs
echo   - Frontend:      http://localhost:3000
echo   - Health Check:   http://localhost:8000/health
echo.
echo Press Ctrl+C in each terminal to stop services
echo.

pause
