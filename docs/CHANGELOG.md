# 소설 작성기 변경 이력

## [v0.7.0] - 2026-04-02 ✏️ (에디터/트리트먼트 기능 개선)

### 🐛 버그 수정

- **회차 목록 글자수 실시간 업데이트** (`editor.js`)
  - 본문 타이핑 시 왼쪽 회차 목록의 글자수가 즉시 반영되지 않던 문제 수정
  - `handleContentChange()`에서 active 아이템 DOM 직접 갱신으로 해결

- **트리트먼트 체크포인트/버전히스토리 버튼 미동작** (`treatment.js`)
  - `handleTreeAction()`에 `save-checkpoint`, `view-history` 케이스 누락 → 추가

- **대시보드 volumes 키 오류** (`dashboard.js`)
  - `updateEpisodeProgress()`, `updateWordCloud()` 에서 `volumes['volume1']` 잘못된 키 사용
  - `volumes[currentVolume]`(숫자 키)로 수정 → 회차 완성도, 단어 클라우드 정상화

- **체크포인트 비교 시 잘못된 회차 표시** (`treatment.js`)
  - 에디터에 열린 화차 기준으로 비교하던 문제 수정
  - 트리트먼트 회차 제목에서 숫자 추출 → 소설 회차 자동 매칭 (`findNovelEpisodeIndex()`)

- **diff 뷰 스크롤 미동작** (`styles.css`)
  - `.diff-panel`에 `min-height: 0`, `overflow: hidden` 추가
  - `.diff-panel-body`에 `flex: 1`, `min-height: 0` 추가

### ✨ 새 기능

- **JSON 저장 파일명 개선** (`main.js`)
  - 기존: `소설이름_1권.json` → 변경: `소설이름_2026-04-02_3화.json`
  - 브라우저 다운로드 폴더에서 `(1)`, `(2)` 중복 방지

- **텍스트 내보내기** (`main.js`, `index.html`)
  - 왼쪽 패널에 "📝 텍스트 내보내기" 버튼 추가
  - 옵션: 1권 전체 / 회차별 개별 파일 / 회차 직접 선택
  - 출력 형식: `소설이름_1권_전체.txt` 또는 `소설이름_1권_1화.txt`

- **체크포인트 비교 → 본문 diff 뷰** (`treatment.js`, `styles.css`)
  - 트리트먼트 필드(메모/요약/배경) 비교 → 실제 소설 본문 텍스트 diff로 전면 교체
  - LCS 알고리즘 기반 라인 단위 diff
  - 삭제된 줄: 왼쪽 패널 빨간 배경 + 취소선 / 추가된 줄: 오른쪽 패널 초록 배경
  - diff 전 공백·줄바꿈 정규화 → 단순 줄바꿈 변경은 차이로 표시 안 함

- **삭제 문단 단위 복원** (`treatment.js`)
  - 비교 뷰에서 삭제된 청크마다 "↩ 이 부분 복원" 버튼 표시
  - 클릭 시 해당 텍스트를 현재 본문에 삽입 후 비교창 자동 갱신
  - 앵커(삭제 직전 same 라인) 기반 삽입 위치 자동 탐색

### 📝 변경 사항

- **이번권 진행 글자수** (`episodes.js`)
  - 공백 제외(`charCount`) → 공백 포함(`content.length`)으로 변경

### 📁 수정 파일
- `src/modules/editor.js`
- `src/modules/episodes.js`
- `src/modules/dashboard.js`
- `src/modules/treatment.js`
- `src/main.js`
- `index.html`
- `styles.css`

### 📝 세션 기록 (2026-04-02)
- 에디터 UX 개선 및 트리트먼트 체크포인트 기능 완성
- 대시보드 버그 수정으로 회차 완성도/단어 클라우드 정상화
- 체크포인트 비교를 본문 diff + 문단 복원 기능으로 업그레이드

---



### ✨ 새 기능
- **GitHub Pages 자동 배포**: `.github/workflows/deploy.yml` 추가
  - main 브랜치 push 시 자동 배포
  - 수동 트리거(`workflow_dispatch`) 지원
  - 배포 URL: `https://kkanbi.github.io/Novel_Assistant/`

### 📝 변경 사항
- `constants.js`: `WORKER_URL` 주석 명확화 (corsproxy.io 폴백 안내 추가)

### ✅ 동작 확인
- Google Drive 저장/불러오기: 정상
- Gemini AI 검토: 정상 (직접 브라우저 호출 허용)
- Claude AI 검토: Cloudflare Workers 미설정 시 corsproxy.io 폴백 → 불안정

### ⚠️ 잔여 작업
- **Cloudflare Workers 프록시 미설정**: Claude API 사용 시 필요
  - `cloudflare-worker-proxy.js` → Cloudflare 대시보드 배포 후 `WORKER_URL` 입력
  - 설정 방법: `docs/SETUP.md` — 방법 3: GitHub Pages → B. Claude API CORS 우회

### 📁 수정/추가 파일
- `.github/workflows/deploy.yml` — GitHub Actions 배포 워크플로우 (신규)
- `src/utils/constants.js` — WORKER_URL 주석 개선
- `docs/PHASES.md` — Phase 2 계획 전체 추가

### 📝 세션 기록 (2026-03-31)
- Phase 2 계획 수립 (v0.5.0 ~ v1.0.0, 브랜치 전략)
- GitHub Pages 배포 완료 — 핸드폰 접속 가능
- Claude API CORS 이슈 확인 → Cloudflare Workers 필요 (다음 세션)
- Gemini/Google Drive는 GitHub Pages에서 정상 동작 확인

---

## [v0.4.1] - 2026-03-21 🛠️ (1차 개발 완료)

### 🐛 버그 수정

#### 퇴고 탭 아코디언 클릭 무반응
- **증상**: "AI 모델 설정 / 검토 옵션" 헤더가 ▼ 아이콘 포함 UI는 완성됐으나, 클릭해도 접히지 않음
- **원인**: CSS 클래스 방식(`.collapsed`)이 탭 시스템의 display 관리와 충돌
- **해결**: `body.style.display`를 JS에서 직접 `'none'`/`''`으로 제어하도록 변경

### ⚠️ 알려진 이슈 (다음 세션 재개 시 작업 예정)

#### 하이라이트 위치 오류 (미해결)
- **증상**: 하이라이트 버튼 클릭 시 본문 텍스트 위가 아닌 이상한 위치(줄 오른쪽, 큰 블록 등)에 표시됨
- **관련 파일**: `src/modules/sentence-highlight.js`
- **재현**: 검토 요청 후 하이라이트 버튼 클릭
- **메모**: v0.4.0에서 줄 단위 처리, 스크롤바 보정 등 시도했으나 완전 해결 안 됨. 오버레이 좌표 계산 로직(`getBoundingClientRect` vs `offsetTop` 방식) 재검토 필요

### 📝 세션 기록 (2026-03-21)
- 1차 개발 완료: 퇴고 탭 아코디언 접기/펼치기 수정으로 마무리
- 잔여 작업: 하이라이트 위치 오류 1건

---

## [v0.4.0] - 2026-03-21 🔍

### ✨ 새 기능
- **검토 결과 하이라이트**: 하이라이트 버튼 클릭 시 AI 검토 결과에 언급된 문장을 본문에 색상으로 표시
  - 검토 항목 유형별 색상 구분 (맞춤법/어색한표현/일관성/반복/흐름)
  - 검토 결과 없을 때는 문장 길이 기반 폴백 하이라이트
- **검토 카드 클릭 자동수정**: 검토 결과 카드 클릭 시 원문→수정안 자동 치환 + 해당 위치로 스크롤
  - 첫 클릭: 자동수정 + 취소선(완료 표시)
  - 이후 클릭: 해당 텍스트 위치로 스크롤
- **검토 결과 마크다운 렌더링**: `## 섹션`, `[N. 항목명]` 등 AI 출력을 색상 카드 UI로 렌더링
- **검토 결과 Google Drive 저장**: 저장 시 reviewResult 포함, 불러오기 시 검토 결과도 복원
- **글자수 이중 표시**: 회차 목록에 `공백포함 / 공백제외`자 형태로 두 가지 수치 동시 표시

### 🐛 버그 수정

#### AI 검토 타임아웃 (AbortError)
- **증상**: AI 검토 요청이 항상 실패, 콘솔에 `AbortError: signal is aborted without reason`
- **원인**: `proxy_server.py`의 `urllib.request.urlopen()`에 timeout 미설정 → 시스템 기본값(약 9초)으로 연결 끊김
- **해결**: `urlopen(req, timeout=120)` 추가, 클라이언트 `TIMEOUT_MS`도 120000ms로 상향

#### 하이라이트 모두 노란색
- **증상**: 하이라이트 버튼 눌러도 전부 노란색 (타입 구분 없음)
- **원인 1**: 구형식 검토 결과(`[N. 항목명]`, `` `백틱` ``)를 파서가 인식 못 함
- **원인 2**: 검토 결과 있어도 파싱 실패 시 문장길이 폴백(노란색)이 동작
- **해결**: 구형식 헤더 정규식 추가, 검토 결과 있을 때 폴백 비활성화

#### 하이라이트 이상한 위치에 표시
- **증상**: 텍스트 위가 아닌 줄 오른쪽 끝에 색상 사각형이 나타남, 큰 영역이 주황색으로 덮임
- **원인 1**: `\n`을 포함한 span이 렌더링되며 오버레이 위치가 어긋남
- **원인 2**: 텍스트 스크롤바로 인해 textarea 실제 콘텐츠 너비 < 오버레이 너비
- **원인 3**: `'g'` 플래그로 한 줄 내 모든 단어에 매칭 → 과잉 하이라이트
- **원인 4**: 구형식 백틱 추출 최소 2자 → 짧은 단어 오매칭
- **해결**:
  - 줄 단위 처리(`split('\n')`)로 span이 줄바꿈 넘지 않도록 수정
  - `highlightOverlay.style.right = (editor.offsetWidth - editor.clientWidth) + 'px'`로 스크롤바 너비 보정
  - `'g'` 플래그 제거 → 줄당 첫 번째 일치만 하이라이트
  - 백틱 추출 최소 길이 2자 → 5자

#### 검토 카드 두 번째 이후 클릭 무반응
- **증상**: 카드 첫 클릭은 파란 하이라이트+스크롤 동작, 두 번째/세 번째 클릭 시 아무 반응 없음
- **원인**: `applied` 상태에서 클릭 핸들러가 `return`으로 조기 종료
- **해결**: `applied` 여부와 관계없이 항상 `scrollToText()` 호출

#### Google Drive 콘솔 에러
- **증상**: 로그인 전 접근 시 `Cannot read properties of undefined (reading 'files')`
- **원인**: `response.result.files` 접근 시 `result`가 undefined
- **해결**: `response.result?.files?.length > 0` 옵셔널 체이닝 적용

### 🔧 내부 개선
- `review.js` ↔ `editor.js` 상호 import (런타임 호출이므로 순환 참조 안전)
- `scrollToText()` 반환값 bool로 변경 (성공 여부 체크)
- `replaceEditorText()` 신규 export: 원문 치환 후 저장 이벤트 자동 발생
- `getSectionType()`, `parseCardText()`, `escapeAttr()` 헬퍼 추가 (review.js)
- `escapeRegex()` 헬퍼 추가 (sentence-highlight.js)

### 📁 수정 파일
- `proxy_server.py` — urlopen timeout 추가
- `src/modules/review.js` — 마크다운 렌더링, 카드 클릭 핸들러, 자동수정
- `src/modules/editor.js` — replaceEditorText, scrollToText 개선, reviewResult 렌더링
- `src/modules/sentence-highlight.js` — 검토결과 기반 하이라이트, 오버레이 위치 보정
- `src/modules/google-drive.js` — optional chaining 에러 수정
- `src/modules/episodes.js` — 글자수 공백포함/제외 이중 표시
- `styles.css` — 타입별 하이라이트 색상 클래스, 검토 카드 색상 구분

---

## [v0.3.1] - 2026-01-04 🤖

### ✨ 새 기능
- **캐릭터 AI 자동생성**: Claude API를 활용한 캐릭터 정보 자동 생성
  - 이름, 역할, 장르 기반으로 전체 캐릭터 시트 자동 생성
  - 성격, 외형, 관계, 심리 변화 등 모든 항목 자동 채움
  - 생성 비용 실시간 표시

- **API 사용량 누적 관리**:
  - LocalStorage에 모든 API 사용 내역 저장
  - 검토 요청 + 캐릭터 생성 통합 사용량 추적
  - 브라우저 새로고침/리셋해도 누적 유지
  - 사용량 리셋 버튼으로 수동 초기화 가능

### 🎨 UI 개선
- 오른쪽 섹션 너비 확대: 380px → 420px (탭 텍스트 여유 공간 확보)
- 전체 컨테이너 최대 너비 확대: 1600px → 1800px
- 캐릭터 모달에 "AI 자동생성" 버튼 추가
- 퇴고 탭에 "사용량 리셋" 버튼 추가

### 📁 새 모듈
- `api-usage.js`: API 사용량 추적 및 관리
- `character-ai.js`: AI 캐릭터 자동생성

---

## [v0.3.0] - 2026-01-04 📊

### ✨ 새 기능
- **대시보드 탭**: 작성 통계 및 시각화 기능
  - 오늘/이번주/이번달 작성량 통계
  - 주간 활동 히트맵 (7일간 작성량 시각화)
  - 회차별 완성도 진행률 표시
  - 자주 쓴 단어 클라우드 (빈도 분석)

- **캐릭터 기능 강화**:
  - 캐릭터 이름 툴팁: 에디터에서 캐릭터 이름 선택 시 자동으로 정보 표시
  - 캐릭터 프리셋: 역할별(주인공/히로인/조력자/악역/조연) 성격 템플릿 제공

- **트리트먼트 강화**:
  - 회차별 태그 기능 (핵심 장면, 복선, 감정선 등)
  - 회차별 메모 필드 추가

### 🎨 UI 개선
- 하이라이트 버튼 위치 변경: 검토 결과 → 통계 바
- Reset 버튼 위치 변경: 통계 바 → 검토 결과 헤더

### 🔧 내부 개선
- 회차 수정 시 lastModified 타임스탬프 자동 업데이트
- 대시보드 통계 자동 갱신

### 📁 새 모듈
- `dashboard.js`: 대시보드 통계 및 시각화
- `character-tooltip.js`: 캐릭터 툴팁 및 프리셋

---

## [v0.2.0] - 2026-01-04 🎉

### ✨ 새 기능
- **집중 모드**: F11 키로 좌우 패널 숨기고 에디터만 전체화면으로
- **단축키 시스템**:
  - `Ctrl+S` (⌘+S): 저장
  - `Ctrl+E` (⌘+E): 새 회차 추가
  - `Ctrl+D` (⌘+D): 다운로드
  - `Ctrl+/` (⌘+/): 단축키 도움말
  - `F11`: 집중 모드 토글
  - `ESC`: 모달 닫기

### ⚡ 성능 개선
- 필드별 차등 디바운싱 적용
  - 본문 입력: 2초
  - 제목 입력: 0.5초
  - 설정 변경: 1초

### 📁 새 모듈
- `focus-mode.js`: 집중 모드
- `shortcuts.js`: 단축키 시스템

---

## [v0.1.0] - 2026-01-04

### 🔧 리팩토링
- ✅ app.js (2222줄) → 12개 모듈로 분리 완료
- ✅ 새로운 디렉토리 구조 적용:
  ```
  src/
  ├── core/          # 핵심 데이터 (state, storage, data)
  ├── modules/       # 기능 모듈 (editor, episodes, characters, google-drive, theme)
  ├── ui/            # UI 컴포넌트 (tabs)
  └── utils/         # 유틸리티 (constants, helpers)
  ```
- ✅ 중복 코드 제거 (탭 전환 로직 통합)
- ✅ ES6 모듈 시스템 도입
- ⚠️ 일부 기능 미완성 (world, treatment, review 모듈 추가 필요)

### 📦 백업
- v0.0.0: 초기 버전 백업 완료 (backup/v0.0.0/)

### 🐛 알려진 이슈
- world.js, treatment.js, review.js 모듈 미구현 (추후 추가)
- 브라우저 테스트 미완료
- Google Drive 기능 동작 확인 필요

---

## [v0.0.0] - 2026-01-04 (초기 버전)

### ✨ 주요 기능
- 소설 회차 관리 시스템
- Google Drive 연동 (저장/불러오기)
- Claude AI 퇴고 기능
- 작품 설정 관리
  - 코어 (로그라인, 장르, 주제)
  - 캐릭터 관리
  - 세계관 설정
  - 트리트먼트 (부-섹션-회차 트리 구조)
- 실시간 통계 (글자수, 원고지 매수)
- 권별 진행률 추적
- 다크/라이트 테마
- 폰트 변경 (나눔명조, 궁서체, 맑은고딕, 바탕체)

### 📝 파일 구조
```
novel_writer/
├── index.html
├── app.js (2222 lines)
├── state.js
├── storage.js
├── data.js
├── styles.css
└── backup/
    └── v0.0.0/
```

### 🐛 알려진 이슈
- app.js가 단일 파일로 너무 비대함 (유지보수 어려움)
- 중복 코드 다수 존재
- 에러 핸들링 부족
