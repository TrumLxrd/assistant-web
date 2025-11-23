@echo off
echo ================================================
echo   MySQL Database Setup for Attendance System
echo ================================================
echo.

REM Set MySQL path
set MYSQL="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

echo Step 1: Creating database...
%MYSQL% -u root -p -e "CREATE DATABASE IF NOT EXISTS attendance_system;"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create database. Check your MySQL password.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating tables...
%MYSQL% -u root -p attendance_system < database\schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create tables.
    pause
    exit /b 1
)

echo.
echo Step 3: Loading sample data...
%MYSQL% -u root -p attendance_system < database\seed.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to load sample data.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   SUCCESS! Database setup complete.
echo ================================================
echo.
echo Next steps:
echo 1. Edit backend\.env and set your MySQL password
echo 2. Run: cd backend
echo 3. Run: node generate-hash.js
echo 4. Update database\seed.sql with the hashes
echo 5. Run this script again to reload data
echo.
pause
