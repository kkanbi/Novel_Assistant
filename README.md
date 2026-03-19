# 📖 소설 작성기 v0.3.1

**웹 기반 소설 작성 전문 애플리케이션**

혼자서도, 여럿이서도 사용할 수 있는 오픈소스 소설 작성 도구입니다.

---

## ✨ 주요 기능

### 📝 작성 기능
- **회차 관리**: 권별/회차별 체계적 관리
- **실시간 통계**: 글자수, 원고지 매수, 진행률
- **자동 저장**: 작업 내용 자동 백업
- **집중 모드**: 방해 없이 글쓰기에 집중
- **포모도로 타이머**: 시간 관리

### 📊 기획 도구
- **코어 설정**: 작품 핵심 정보 관리
- **캐릭터**: 등장인물 프로필 & AI 자동생성
- **세계관**: 배경 설정 및 용어 정리
- **트리트먼트**: 부/섹션/에피소드 구조화
- **버전 비교**: 이전 버전과 비교

### 🤖 AI 기능
- **AI 퇴고**: Claude API로 맞춤법/문장/일관성 검토
- **캐릭터 AI 생성**: 역할 기반 자동 캐릭터 생성
- **API 사용량 추적**: 비용 관리

### 🎨 기타
- **다크/라이트 모드**: 눈에 편한 테마
- **Google Drive 연동**: 클라우드 저장/불러오기
- **단축키**: 빠른 작업

---

## 🚀 빠른 시작

### 가장 간단한 방법 (0초)
```
index.html 더블클릭 → 끝!
```

### 더 깔끔하게 (3초)
```bash
START-SERVER.bat 더블클릭
→ http://localhost:8080 자동 실행
```

### 자세한 설명
- **QUICK-START.md**: 1분 안에 시작하기
- **SETUP-GUIDE.md**: 3가지 배포 방법 완벽 가이드

---

## 📚 문서

| 문서 | 설명 |
|------|------|
| **QUICK-START.md** | 1분 안에 시작하는 방법 |
| **SETUP-GUIDE.md** | 상세 설정 가이드 (로컬/서버/배포) |
| **CHANGELOG.md** | 버전별 변경 이력 |
| **cloudflare-worker-proxy.js** | CORS 프록시 (GitHub Pages용) |

---

## 🏗️ 프로젝트 구조

```
novel_writer/
├── index.html                # 메인 앱
├── START-SERVER.bat          # 로컬 서버 실행
├── src/
│   ├── main.js              # 진입점
│   ├── core/                # 핵심 데이터 (state, storage, data)
│   ├── modules/             # 기능 모듈
│   │   ├── editor.js        # 에디터
│   │   ├── episodes.js      # 회차 관리
│   │   ├── characters.js    # 캐릭터
│   │   ├── review.js        # AI 검토
│   │   ├── character-ai.js  # AI 캐릭터 생성
│   │   ├── dashboard.js     # 대시보드
│   │   ├── treatment.js     # 트리트먼트
│   │   └── ...
│   ├── ui/                  # UI 컴포넌트
│   └── utils/               # 유틸리티
│       ├── constants.js     # 설정
│       ├── api-usage.js     # API 사용량 추적
│       ├── api-helper.js    # API 호출 헬퍼
│       └── helpers.js
├── styles.css               # 스타일
├── backup/v0.0.0/           # 초기 버전 백업
└── docs/
    ├── QUICK-START.md       # 빠른 시작
    └── SETUP-GUIDE.md       # 설정 가이드
```

---

## 🔑 필요한 것 (선택)

### Google Drive 연동하려면
- Gmail 계정 (무료)
- 로그인만 하면 됨

### Claude AI 사용하려면
- Anthropic API 키
- https://console.anthropic.com 에서 발급
- 무료 크레딧 제공

---

## 🌐 배포 방법

### 1. 로컬 HTML 파일 (가장 간단)
- 설정: 없음
- 사용: `index.html` 더블클릭

### 2. 로컬 서버 (추천)
- 설정: Python 설치
- 사용: `START-SERVER.bat` 실행

### 3. GitHub Pages (공개)
- 설정: Cloudflare Workers 프록시
- 사용: URL로 어디서나 접속

**자세한 내용**: `SETUP-GUIDE.md` 참조

---

## 🔒 보안

- API 키는 브라우저에만 저장 (서버 전송 안 함)
- Google OAuth는 파일 접근 권한만 요청
- 로컬 저장소 사용 (외부 서버 없음)

---

## 📝 라이선스

MIT License

---

## 🤝 기여

이슈와 PR은 언제나 환영입니다!

---

**🎉 즐거운 소설 작성 되세요!**

GitHub: https://github.com/kkanbi/SideProject_Plan
