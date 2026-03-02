@echo off
echo ========================================
echo   Smart Energy Dashboard - Startup
echo ========================================
echo.

echo [1/3] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is already running
) else (
    echo Starting MongoDB...
    start "MongoDB" cmd /k "mongod --dbpath C:\data\db"
    timeout /t 3 >nul
)

echo.
echo [2/3] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo.
echo [3/3] Opening Dashboard...
timeout /t 5 >nul
start http://localhost:8000/index.html

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo MongoDB: Running
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8000
echo.
echo Demo Account:
echo   Email: demo@energy.com
echo   Password: demo123
echo.
echo Press any key to open frontend server...
pause >nul

python -m http.server 8000

