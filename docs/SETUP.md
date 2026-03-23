# 🚀 소설 작성기 - 완벽 설정 가이드

**3가지 사용 방법을 한눈에 비교하고 선택하세요!**

---

## 📊 빠른 비교표

| 항목 | 방법 1: 로컬 HTML | 방법 2: 로컬 서버 ⭐ | 방법 3: GitHub Pages |
|------|------------------|-------------------|---------------------|
| **실행 방법** | index.html 더블클릭 | START-SERVER.bat | URL 접속 |
| **설정 시간** | 0초 | 3초 | 5분 |
| **Google Drive** | ✅ 작동 | ✅ 작동 | ⚠️ 설정 필요 |
| **Claude API** | ✅ 작동 | ✅ 작동 | ⚠️ 프록시 필요 |
| **Python 필요** | ❌ | ✅ | ❌ |
| **인터넷 필요** | ❌ | ❌ | ✅ |
| **다른 기기 접속** | ❌ | ❌ | ✅ |
| **추천 대상** | 급할 때 | 개인 사용 🎯 | 공개 배포 |

---

## 🎯 방법 1: 구 버전 HTML 파일

⚠️ **주의**: 최신 `index.html`은 ES6 모듈을 사용하므로 파일로 직접 열 수 없습니다.

### 사용 방법
```
C:\Users\cgb22\Desktop\novel_writer\novel_writer_v3_step3.html 더블클릭
```

### 필요한 설정
**없음!** 그냥 파일 열면 끝입니다.

### 작동하는 기능
- ✅ **Google Drive 로그인**: 작동 (OAuth 설정 필요할 수 있음)
- ✅ **Claude API 검토**: 작동
- ⚠️ **최신 기능 없음**: 구 버전이므로 일부 기능 제한

### 왜 index.html은 안 되나요?
- 최신 브라우저가 보안상 `file://` 프로토콜에서 ES6 모듈(`import/export`) 로딩을 차단합니다
- Chrome, Edge, Firefox 모두 동일
- 해결책: **방법 2 (로컬 서버)** 사용

### 장점
- 설정 시간 0초
- Python 설치 불필요
- 즉시 사용 가능
- 오프라인 작동

### 단점
- URL이 `file:///C:/...` 형태
- 파일 관리 수동
- 같은 컴퓨터에서만 사용

### 추천 대상
- 급하게 테스트할 때
- 설정하기 싫을 때
- 혼자만 쓸 때
- 간단히 써보고 싶을 때

### 사용 팁
- 작업 후 **Ctrl+S**로 저장 (localStorage에 자동 저장됨)
- 주기적으로 "다운로드" 버튼으로 JSON 백업
- Google Drive 연동하면 자동 백업 가능

---

## ⭐ 방법 2: 로컬 서버 (추천!)

### 사용 방법
```bash
1. START-SERVER.bat 더블클릭
2. 브라우저에서 자동으로 http://localhost:3000 열림
3. 끝!
```

### 필요한 설정

#### 1단계: Python 확인 (대부분 이미 설치되어 있음)
```bash
python --version
```
- 없으면: https://python.org 에서 설치

#### 2단계: 서버 실행
- `START-SERVER.bat` 더블클릭
- 또는 터미널에서:
  ```bash
  cd C:\Users\cgb22\Desktop\novel_writer
  python -m http.server 3000
  ```

#### 3단계 (선택): Google OAuth 설정
대부분의 경우 설정 없이도 작동합니다. 에러가 나면 아래 설정:

1. https://console.cloud.google.com 접속
2. 프로젝트 선택 (또는 새로 생성)
3. **OAuth 동의 화면**:
   - 사용자 유형: **외부**
   - 테스트 사용자: 본인 Gmail 추가
4. **사용자 인증 정보**:
   - 승인된 JavaScript 원본 추가:
     ```
     http://localhost:3000
     http://127.0.0.1:3000
     ```

### 작동하는 기능
- ✅ **Google Drive**: 완벽 작동
- ✅ **Claude API**: 완벽 작동 (CORS 문제 없음)
- ✅ **모든 기능**: 100% 작동
- ✅ **실시간 반영**: 코드 수정 시 새로고침만 하면 됨

### 장점
- GitHub Pages처럼 깔끔한 URL
- CORS 문제 전혀 없음
- 파일 수정 후 즉시 반영
- 완전 무료
- 프라이버시 보장 (로컬에서만 실행)

### 단점
- Python 설치 필요
- 매번 서버 실행 필요 (3초 소요)
- 같은 컴퓨터에서만 접속
- 서버 창을 닫으면 종료됨

### 추천 대상
- **개인 프로젝트로 계속 사용할 때** 🎯
- 제대로 개발하고 싶을 때
- CORS 문제 피하고 싶을 때
- 파일 수정 자주 할 때

### 사용 팁
- 서버 창을 닫지 말고 최소화만 하세요
- 종료: 서버 창에서 `Ctrl+C`
- 같은 WiFi의 다른 기기에서 접속:
  ```
  http://192.168.x.x:3000 (내 IP 주소 확인 후)
  ```

---

## 🌐 방법 3: GitHub Pages (공개 배포)

### 사용 방법
```
https://kkanbi.github.io/SideProject_Plan/Novel/index.html
```

### 필요한 설정

#### A. Google OAuth 설정 (5분)

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com

2. **프로젝트 선택/생성**
   - 기존 프로젝트 선택 또는 새로 생성

3. **OAuth 동의 화면 설정**
   - 왼쪽 메뉴 → "API 및 서비스" → "OAuth 동의 화면"
   - 사용자 유형: **외부** 선택
   - 앱 이름: `소설 작성기`
   - 사용자 지원 이메일: 본인 이메일
   - **테스트 사용자 추가**: 본인 Gmail 주소 입력
   - 저장

4. **OAuth 클라이언트 ID 설정**
   - 왼쪽 메뉴 → "사용자 인증 정보"
   - 기존 클라이언트 ID 클릭 또는 새로 생성
   - **승인된 JavaScript 원본** 추가:
     ```
     https://kkanbi.github.io
     ```
   - **승인된 리디렉션 URI** 추가:
     ```
     https://kkanbi.github.io/SideProject_Plan/Novel/
     ```
   - 저장

#### B. Claude API CORS 우회 (필수!)

**🔧 옵션 A: Cloudflare Workers 프록시 (5분, 추천)**

1. **Cloudflare Workers 가입**
   - https://workers.cloudflare.com 접속
   - 무료 계정 생성 (이메일 인증)

2. **Worker 생성**
   - "Create a Worker" 클릭
   - 왼쪽 에디터의 내용을 모두 지우기

3. **프록시 코드 복사**
   - 프로젝트의 `cloudflare-worker-proxy.js` 파일 열기
   - 전체 내용 복사
   - Cloudflare 에디터에 붙여넣기

4. **배포**
   - "Save and Deploy" 클릭
   - 성공 메시지 확인

5. **Worker URL 복사**
   - 생성된 URL 복사 (예: `https://novel-proxy.your-name.workers.dev`)

6. **코드 수정**

   `src/utils/constants.js` 파일 수정:
   ```javascript
   export const CLAUDE_CONFIG = {
       MODEL: 'claude-3-5-sonnet-20241022',
       MAX_TOKENS: 2048,
       PRICING: {
           INPUT_PER_MILLION: 3,
           OUTPUT_PER_MILLION: 15
       },
       WORKER_URL: 'https://novel-proxy.your-name.workers.dev'  // 추가!
   };
   ```

7. **GitHub에 푸시**
   ```bash
   git add .
   git commit -m "Add Cloudflare Workers proxy"
   git push
   ```

8. **1-2분 대기 후 테스트**

**⚡ 옵션 B: Chrome 확장 프로그램 (30초, 임시)**

1. Chrome 웹 스토어에서 "Allow CORS" 검색
2. 확장 프로그램 설치
3. 사용할 때만 활성화
4. ⚠️ **보안 위험**: 사용 후 반드시 비활성화!

**왜 프록시가 필요한가요?**
- 브라우저 보안 정책(CORS)으로 인해 GitHub Pages에서 직접 Claude API 호출이 차단됨
- Cloudflare Workers가 중간에서 요청을 전달하며 CORS 헤더 추가
- 완전 무료이며 안전한 방식

### 작동하는 기능
- ✅ **Google Drive**: OAuth 설정 후 작동
- ✅ **Claude API**: 프록시 설정 후 작동
- ✅ **어디서나 접속**: URL만 있으면 됨
- ✅ **자동 배포**: GitHub 푸시하면 1-2분 후 반영

### 장점
- URL 공유 가능
- 여러 기기에서 접속
- 스마트폰에서도 사용
- 무료 호스팅
- Git으로 버전 관리
- 포트폴리오로 활용 가능

### 단점
- 초기 설정 필요 (5분)
- Google OAuth 설정 필요
- CORS 프록시 설정 필수
- 인터넷 연결 필요

### 추천 대상
- 포트폴리오로 공개할 때
- 여러 기기에서 사용할 때
- 친구/가족과 공유할 때
- 어디서든 접속하고 싶을 때

---

## 🆘 문제 해결

### Google 로그인 에러

**"액세스 차단됨" 또는 "403 오류"**
1. Google Cloud Console에서 OAuth 설정 확인
2. 테스트 사용자에 본인 이메일 추가되었는지 확인
3. 승인된 JavaScript 원본에 사용 중인 URL 추가
4. 시크릿 창에서 다시 시도

**"invalid_request" 오류**
1. CLIENT_ID가 올바른지 확인
2. 리디렉션 URI 확인
3. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)

### Claude API 에러

**CORS 오류 (GitHub Pages)**
- Cloudflare Workers 프록시 설정 확인
- Worker URL이 constants.js에 제대로 입력되었는지 확인
- 또는 Chrome 확장 프로그램 사용

**"API 키 오류"**
- API 키가 `sk-ant-api-`로 시작하는지 확인
- API 키에 크레딧이 충분한지 확인
- https://console.anthropic.com 에서 확인

**"Failed to fetch"**
- 인터넷 연결 확인
- F12 → Console 탭에서 자세한 에러 확인

### 서버 실행 에러

**"Python을 찾을 수 없음"**
1. https://python.org 에서 Python 설치
2. 설치 시 "Add Python to PATH" 체크
3. 재부팅 후 다시 시도

**"포트 3000이 사용 중"**
- `START-SERVER.bat` 파일 수정
- `3000`을 `3001` 또는 `8000`으로 변경

---

## 💡 추천 조합

### 처음 사용하는 경우
1. **방법 1 (로컬 HTML)**로 5분 테스트
2. 마음에 들면 **방법 2 (로컬 서버)**로 전환
3. 공유하고 싶으면 **방법 3 (GitHub Pages)** 설정

### 혼자만 쓸 경우
→ **방법 2 (로컬 서버)** 추천! 🎯

### 여러 사람과 공유
→ **방법 3 (GitHub Pages)** + Cloudflare Workers

---

## 관련 문서

- `cloudflare-worker-proxy.js`: Cloudflare Workers 프록시 코드
- `docs/CHANGELOG.md`: 버전 히스토리

---

## 🔒 보안 팁

1. **API 키 관리**
   - API 키를 GitHub에 절대 올리지 마세요
   - 스크린샷 찍을 때 API 키 가리세요
   - 브라우저 종료 시 API 키는 자동 삭제됨

2. **Google Drive**
   - 로그아웃하려면 "Google Drive 연동 해제" 클릭
   - 토큰은 localStorage에 저장됨 (상대적으로 안전)

3. **CORS 확장 프로그램**
   - 사용 후 반드시 비활성화
   - 은행/쇼핑 사이트 방문 전에는 꼭 끄기

---

**🎉 이제 준비 완료! 즐거운 소설 작성 되세요!**
