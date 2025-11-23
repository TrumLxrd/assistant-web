@echo off
title Attendance System - Startup
color 0A

echo ========================================================
echo   🎯 Assistant Attendance System - Starting...
echo ========================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if backend dependencies are installed
if not exist "backend\node_modules\" (
    echo 📦 Installing backend dependencies...
    cd /d "%~dp0backend"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        cd /d "%~dp0"
        echo ❌ ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
    cd /d "%~dp0"
    echo ✅ Backend dependencies installed
    echo.
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo ❌ ERROR: backend\.env file not found
    echo Please create backend\.env with your MySQL credentials
    echo.
    pause
    exit /b 1
)

echo ========================================================
echo   Starting Server (Port 5000)...
echo ========================================================
echo.

REM Start server in a new window
start "Attendance System Server - Port 5000" cmd /k "cd /d "%~dp0backend" && echo Starting server... && node server.js"

REM Wait for server to start
timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo   ✅ Attendance System Started Successfully!
echo ========================================================
echo.
echo 📱 Assistant PWA:     http://localhost:5000/assistant/
echo 🔐 Admin Dashboard:   http://localhost:5000/admin/
echo 🔧 Backend API:       http://localhost:5000/api
echo.
echo ========================================================
echo   Test Credentials
echo ========================================================
echo.
echo 👤 Admin:
echo    Email:    admin@attendance.com
echo    Password: Admin@2024
echo.
echo 👤 Assistant:
echo    Email:    assistant1@attendance.com
echo    Password: Assistant@2024
echo.
echo ========================================================
echo.
echo ⚠️  To stop the server, close the server window
echo    or press Ctrl+C in the server window
echo.
echo 💡 Tip: Ctrl+Click the links in the server window
echo.
echo Opening admin dashboard in your browser...
timeout /t 2 /nobreak >nul

REM Open browser to admin login page
start http://localhost:5000/admin/

echo.
echo ✅ Server is running!
echo.
pause
