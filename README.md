# 소설 작성기 (Novel_Assistant)

웹 기반 소설 작성 전용 도구. Claude AI 퇴고 + Google Drive 연동.

---

## 빠른 시작

```bash
# 방법 1: 즉시 실행
index.html 더블클릭

# 방법 2: 로컬 서버 (추천)
START-SERVER.bat 더블클릭
→ http://localhost:3000
```

자세한 설정 → `docs/SETUP.md`

---

## Phase 현황

| Phase | 내용 | 상태 |
|-------|------|------|
| v0.0.0 | 초기 버전 | 완료 |
| v0.1.0 | 모듈 분리 리팩토링 | 완료 |
| v0.2.0 | 집중 모드 + 단축키 | 완료 |
| v0.3.0 | 대시보드 + 캐릭터 강화 | 완료 |
| v0.3.1 | AI 캐릭터 생성 + API 사용량 추적 | 완료 |
| v0.4.0 | AI 검토 강화 (하이라이트, 자동수정) | 완료 |
| v0.4.1 | 1차 개발 완료 | 완료 |
| **v0.5.0** | **잔여 버그 수정 + 안정화** | **예정** |

---

## 주요 기능

- **회차 관리**: 권/회차 구조, 실시간 글자수 통계
- **AI 퇴고**: Claude API로 맞춤법/문체/일관성 검토, 하이라이트, 자동수정
- **캐릭터**: 프로필 관리 + AI 자동생성
- **기획 도구**: 세계관, 트리트먼트(부-섹션-회차 트리)
- **대시보드**: 작성량 통계, 주간 히트맵
- **Google Drive**: 클라우드 저장/불러오기
- **집중 모드** / **단축키** / **다크·라이트 테마**

---

## 프로젝트 구조

```
Novel_Assistant/
├── index.html
├── styles.css
├── proxy_server.py
├── START-SERVER.bat
├── cloudflare-worker-proxy.js
├── src/
│   ├── core/          # state, storage, data
│   ├── modules/       # editor, episodes, characters, review, dashboard ...
│   ├── ui/            # tabs
│   └── utils/         # constants, helpers, api-usage
└── docs/
    ├── CLAUDE.md      # AI 세션 지시사항
    ├── PHASES.md      # Phase 계획 + Backlog
    ├── SETUP.md       # 환경 설정 + 트러블슈팅
    └── CHANGELOG.md   # 버전 히스토리
```

---

## Backlog

- [ ] 하이라이트 위치 오류 수정 (v0.5.0)
- [ ] 트리트먼트 내보내기 (PDF/TXT)
- [ ] 회차별 타임라인 시각화
- [ ] 캐릭터 관계도
- [ ] 모바일 최적화
- [ ] Vercel 배포
