@echo off
echo ====================================
echo   소설 작성기 (CORS 비활성화)
echo ====================================
echo.

cd /d "%~dp0"

:: 기존 Chrome 프로세스 종료
echo [1단계] 기존 Chrome 종료 중...
taskkill /F /IM chrome.exe > nul 2>&1
timeout /t 1 /nobreak > nul

:: Python 서버 시작
echo [2단계] Python 서버 시작...
start /min python -m http.server 8080
timeout /t 2 /nobreak > nul

:: Chrome CORS 비활성화 모드로 실행
echo [3단계] Chrome CORS 비활성화 모드로 실행...

:: 임시 프로필 폴더 생성
set CHROME_TEMP_DIR=%TEMP%\chrome-nocors-%RANDOM%
mkdir "%CHROME_TEMP_DIR%" 2>nul

:: Chrome 실행 (CORS 완전 비활성화)
start "" chrome.exe ^
  --disable-web-security ^
  --disable-site-isolation-trials ^
  --disable-features=IsolateOrigins,site-per-process ^
  --user-data-dir="%CHROME_TEMP_DIR%" ^
  --no-first-run ^
  --no-default-browser-check ^
  http://localhost:8080

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
rd /s /q "%CHROME_TEMP_DIR%" 2>nul
echo 서버가 종료되었습니다.
