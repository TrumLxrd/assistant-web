@echo off
title Attendance System - Shutdown
color 0C

echo ========================================================
echo   🛑 Stopping Attendance System...
echo ========================================================
echo.

echo Stopping Server (Node.js on port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Server stopped
    )
)

echo.
echo ========================================================
echo   ✅ All services stopped
echo ========================================================
echo.
pause
