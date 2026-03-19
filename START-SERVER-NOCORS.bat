@echo off
echo ====================================
echo   소설 작성기 (CORS 비활성화)
echo ====================================
echo.

cd /d "%~dp0"

:: Python 서버 시작
echo [1단계] Python 서버 시작...
start /min python -m http.server 8080
timeout /t 2 /nobreak > nul

echo http://localhost:8080 에 접속하세요.

echo.
echo ====================================
echo   ✅ CORS 비활성화 모드로 실행됨
echo
echo   ⚠️  주의사항:
echo   - 이 Chrome 창에서만 소설 작성기 사용
echo   - 은행/쇼핑 사이트 방문 금지
echo   - 사용 후 이 창을 닫으세요
echo ====================================
echo.
echo 종료하려면 아무 키나 누르세요...
pause > nul

:: 정리
taskkill /F /IM python.exe > nul 2>&1
echo 서버가 종료되었습니다.
