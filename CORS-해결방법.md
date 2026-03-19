# CORS 문제 해결 방법

## 문제 상황
`localhost:3000`에서도 Claude API 호출 시 CORS 에러 발생

```
Access to fetch at 'https://api.anthropic.com/v1/messages' from origin 'http://localhost:3000' has been blocked by CORS policy
```

---

## ✅ 해결 방법 (3가지)

### 방법 1: CORS 비활성화 배치 파일 (가장 간단)

```bash
START-SERVER-NOCORS.bat 더블클릭
```

**장점:**
- 클릭 한 번으로 해결
- 추가 설정 불필요

**단점:**
- Chrome이 별도 프로필로 실행됨
- 북마크/확장 프로그램 동기화 안 됨

**⚠️ 주의:**
- 이 모드로 은행/쇼핑 사이트 방문 금지!
- 사용 후 창 닫기

---

### 방법 2: Chrome 확장 프로그램 설치 (추천)

**1단계: 확장 프로그램 설치**

Chrome 웹 스토어에서 다음 중 하나 설치:
- **"Allow CORS: Access-Control-Allow-Origin"**
- **"CORS Unblock"**
- **"Moesif Origin & CORS Changer"**

**2단계: 사용**
1. 확장 프로그램 아이콘 클릭
2. **ON** 으로 변경
3. 페이지 새로고침 (F5)
4. Claude API 사용!

**3단계: 사용 후 OFF**
- 소설 작성기 사용 후 반드시 **OFF**
- 보안 위험 있음

**장점:**
- 일반 Chrome 사용
- 켰다 껐다 쉬움

**단점:**
- 확장 프로그램 설치 필요
- 보안 주의 필요

---

### 방법 3: Cloudflare Workers 프록시 (완벽한 해결)

**설정 시간:** 5분
**장점:** 영구 해결, 안전함

**1단계: Cloudflare Workers 가입**
- https://workers.cloudflare.com 접속
- 무료 계정 생성

**2단계: Worker 생성**
1. "Create a Worker" 클릭
2. `cloudflare-worker-proxy.js` 파일 내용 복사
3. 에디터에 붙여넣기
4. "Save and Deploy" 클릭

**3단계: Worker URL 복사**
- 예: `https://novel-proxy.your-name.workers.dev`

**4단계: 코드 수정**

`src/utils/constants.js` 파일:
```javascript
export const CLAUDE_CONFIG = {
    MODEL: 'claude-3-5-sonnet-20241022',
    MAX_TOKENS: 2048,
    PRICING: {
        INPUT_PER_MILLION: 3,
        OUTPUT_PER_MILLION: 15
    },
    WORKER_URL: 'https://novel-proxy.your-name.workers.dev'  // 여기!
};
```

**5단계: 테스트**
- 페이지 새로고침
- Claude API 검토 요청
- 작동 확인!

**장점:**
- 완벽한 해결
- 안전함
- localhost에서도 작동
- GitHub Pages에서도 작동

**단점:**
- 초기 설정 5분 소요

---

## 🎯 추천

### 지금 당장 써야 한다면
→ **방법 1** (START-SERVER-NOCORS.bat)

### 계속 쓸 거라면
→ **방법 2** (Chrome 확장 프로그램)

### 제대로 해결하려면
→ **방법 3** (Cloudflare Workers)

---

## ❓ 왜 localhost도 CORS가 나나요?

**원인:**
- Anthropic API 서버가 모든 브라우저 요청을 차단
- `localhost`, `file://` 모두 차단
- 오직 서버-to-서버 통신만 허용

**해결:**
- 브라우저 CORS 검사 비활성화 (방법 1, 2)
- 또는 프록시 서버 사용 (방법 3)

---

## 🔒 보안 주의

**CORS 비활성화 시:**
- ⚠️ 악의적인 웹사이트가 API 키 탈취 가능
- ⚠️ 은행/쇼핑 사이트 절대 방문 금지
- ⚠️ 사용 후 반드시 비활성화

**안전한 사용:**
1. CORS 비활성화
2. 소설 작성기만 사용
3. 즉시 CORS 재활성화
4. 다른 사이트 방문
