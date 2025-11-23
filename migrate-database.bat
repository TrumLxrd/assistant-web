@echo off
REM =====================================================
REM Database Migration Script
REM Migrates sessions table to new structure
REM =====================================================

echo.
echo ========================================
echo   Database Migration Tool
echo   Sessions Table Update
echo ========================================
echo.

REM Check if MySQL is accessible
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL not found in PATH
    echo Please ensure MySQL is installed and added to system PATH
    echo.
    pause
    exit /b 1
)

echo Step 1: Creating backup...
echo.

REM Create backup directory if it doesn't exist
if not exist "database\backups" mkdir "database\backups"

REM Generate timestamp for backup filename
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set backup_file=database\backups\backup_%datetime:~0,8%_%datetime:~8,6%.sql

echo Creating backup at: %backup_file%
echo.

REM Prompt for MySQL password
set /p mysql_password="Enter MySQL root password: "

REM Create backup
mysqldump -u root -p%mysql_password% attendance_system > "%backup_file%" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to create backup
    echo Please check:
    echo   - MySQL is running
    echo   - Password is correct
    echo   - Database 'attendance_system' exists
    echo.
    pause
    exit /b 1
)

echo Backup created successfully!
echo.

echo Step 2: Running migration...
echo.

REM Run migration
mysql -u root -p%mysql_password% attendance_system < "database\migrations\001_update_sessions_table.sql" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Migration failed
    echo.
    echo To restore from backup, run:
    echo mysql -u root -p attendance_system ^< "%backup_file%"
    echo.
    pause
    exit /b 1
)

echo Migration completed successfully!
echo.

echo Step 3: Verifying migration...
echo.

REM Verify table structure
mysql -u root -p%mysql_password% -e "USE attendance_system; DESCRIBE sessions;" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Could not verify table structure
    echo.
) else (
    echo.
    echo Table structure verified!
)

echo.
echo ========================================
echo   Migration Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Restart the backend server
echo   2. Clear browser cache (Ctrl + F5)
echo   3. Test the sessions functionality
echo.
echo Backup saved at: %backup_file%
echo.
pause
