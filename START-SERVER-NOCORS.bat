@echo off
echo ====================================
echo   소설 작성기 (CORS 비활성화)
echo ====================================
echo.

cd /d "%~dp0"

:: 프록시 서버 시작 (정적 파일 + Anthropic API 프록시)
echo [1단계] 프록시 서버 시작...
start /min python proxy_server.py
timeout /t 2 /nobreak > nul

echo http://localhost:8080 에 접속하세요.

echo.
echo ====================================
echo   ✅ 서버 실행 중 (CORS 자동 해결)
echo ====================================
echo.
echo 종료하려면 아무 키나 누르세요...
pause > nul

:: 정리
taskkill /F /IM python.exe > nul 2>&1
echo 서버가 종료되었습니다.
