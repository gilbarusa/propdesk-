@echo off
echo ============================================
echo   Willow Property Manager - Local Server
echo ============================================
echo.
echo Starting server at http://localhost:8080
echo Press Ctrl+C to stop
echo.
start http://localhost:8080
npx http-server . -p 8080 -c-1
