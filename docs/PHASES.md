# Novel_Assistant - Phase 계획

## Phase 현황

### 1차 개발 (완료)

| Phase | 내용 | 상태 |
|-------|------|------|
| v0.0.0 | 초기 버전 (단일 파일 app.js) | 완료 |
| v0.1.0 | 리팩토링 — app.js → 12개 모듈 분리 | 완료 |
| v0.2.0 | 집중 모드 + 단축키 시스템 | 완료 |
| v0.3.0 | 대시보드 + 캐릭터 강화 (툴팁, 프리셋) | 완료 |
| v0.3.1 | AI 캐릭터 자동생성 + API 사용량 추적 | 완료 |
| v0.4.0 | AI 검토 강화 (하이라이트, 카드 클릭 자동수정) | 완료 |
| v0.4.1 | 1차 개발 완료 — 퇴고 탭 아코디언 수정 | 완료 |

### 2차 개발 (Phase 2)

| Phase | 내용 | 상태 |
|-------|------|------|
| v0.5.0 | 잔여 버그 수정 + 안정화 | 예정 |
| v0.6.0 | GitHub Pages 배포 + Cloudflare Workers 프록시 | 진행중 |
| v0.7.0 | 모바일 반응형 UI 최적화 | 예정 |
| v0.8.0 | 트리트먼트 내보내기 (PDF/TXT) | 예정 |
| v0.9.0 | 캐릭터 관계도 시각화 | 예정 |
| v1.0.0 | 2차 개발 완료 — 안정화 | 예정 |

---

## 브랜치 전략

```
main              ← 안정 배포 버전 (GitHub Pages 서빙 대상)
claude/phase-2-*  ← Claude 에이전트 작업 전용 → 확인 후 main 머지
```

- **개발 방식**: main 브랜치에 직접 작업
- **버전 관리**: 각 버전 완성 시 `git tag v0.X.0` 으로 태그 추가
- **Claude 작업**: `claude/phase-2-*` 브랜치에서 진행 후 검토 + main 머지

---

## v0.5.0 — 잔여 버그 수정 (다음 세션)

### 작업 목록

- [ ] **하이라이트 위치 오류 수정**
  - 증상: 하이라이트 버튼 클릭 시 이상한 위치에 표시됨
  - 관련 파일: `src/modules/sentence-highlight.js`
  - 원인 추정: `getBoundingClientRect` vs `offsetTop` 방식 충돌
  - 참고: v0.4.0에서 줄 단위 처리, 스크롤바 보정 시도했으나 미해결

---

## v0.6.0 — GitHub Pages 배포 (핸드폰 접근용)

### 목표
로컬 서버 없이 URL(`https://kkanbi.github.io/Novel_Assistant/`)로 어디서나 접근 가능.

### 작업 목록

- [x] **GitHub Actions 워크플로우 생성**
  - 파일: `.github/workflows/deploy.yml`
  - main 브랜치 push 시 자동으로 GitHub Pages 배포

- [ ] **Cloudflare Workers 프록시 배포** (사용자 직접 실행, Claude API용)
  - `cloudflare-worker-proxy.js` 내용 복사 → Cloudflare 대시보드에 붙여넣기
  - 생성된 Worker URL 복사 (예: `https://novel-proxy.이름.workers.dev`)
  - `src/utils/constants.js`의 `WORKER_URL`에 입력

- [x] **Google OAuth URL 업데이트** — Google Drive 정상 동작 확인됨

- [x] **배포 테스트**
  - GitHub Pages URL 접속 확인 ✅
  - Google Drive 로그인/저장 확인 ✅
  - Gemini AI 동작 확인 ✅
  - Claude API: Cloudflare Workers 미설정으로 불안정 (다음 세션)

### 참고
> 자세한 설정 방법은 `docs/SETUP.md` — 방법 3: GitHub Pages 참조

---

## v0.7.0 — 모바일 반응형 UI 최적화

### 작업 목록

- [ ] **반응형 레이아웃 적용**
  - 현재 고정 너비(1800px) → 모바일에서 세로 스택 레이아웃으로 전환
  - 미디어 쿼리 (`@media (max-width: 768px)`) 추가
- [ ] **터치 인터페이스 최적화**
  - 버튼 최소 크기 44px (터치 타깃)
  - 스크롤 동작 개선
- [ ] **모바일 테스트**
  - iOS Safari, Android Chrome에서 주요 기능 동작 확인

---

## Backlog (Phase 2 이후)

- [ ] 회차별 타임라인 시각화
- [ ] 작성 목표 설정 (일/주 단위)
- [ ] 오프라인 PWA 지원
