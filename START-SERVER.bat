@echo off
echo ====================================
echo   소설 작성기 로컬 서버 시작
echo ====================================
echo.
echo 서버 시작 중...
echo.
cd /d "%~dp0"
start http://localhost:8080
python -m http.server 8080
echo.
echo 서버가 시작되었습니다!
echo 브라우저에서 http://localhost:8080 을 열어주세요.
echo.
echo 종료하려면 Ctrl+C를 누르세요.
pause
