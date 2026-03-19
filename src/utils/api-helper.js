// api-helper.js - Claude API 호출 헬퍼 함수
import { CLAUDE_CONFIG } from './constants.js';

/**
 * Anthropic API URL 가져오기 (CORS 처리 포함)
 *
 * - 로컬 환경 (file://, localhost): 직접 API 호출
 * - GitHub Pages: 프록시 사용 또는 CORS 우회
 *
 * @returns {string} API 엔드포인트 URL
 */
export function getAnthropicApiUrl() {
    const baseUrl = 'https://api.anthropic.com/v1/messages';

    // GitHub Pages 환경 감지
    const isGitHubPages = window.location.hostname.includes('github.io');

    if (isGitHubPages) {
        // Cloudflare Workers 프록시가 설정되어 있으면 사용
        if (CLAUDE_CONFIG.WORKER_URL) {
            return CLAUDE_CONFIG.WORKER_URL;
        }

        // 프록시 미설정 시 corsproxy.io 사용 (임시 방편)
        console.warn('⚠️ Cloudflare Workers 프록시가 설정되지 않았습니다. corsproxy.io를 사용합니다.');
        console.warn('📋 SETUP-GUIDE.md를 참고하여 Cloudflare Workers를 설정하세요.');
        return 'https://corsproxy.io/?' + encodeURIComponent(baseUrl);
    }

    // 로컬 환경에서는 직접 호출
    return baseUrl;
}

/**
 * Claude API 요청 옵션 생성
 *
 * @param {string} apiKey - Anthropic API 키
 * @param {object} payload - 요청 페이로드
 * @returns {object} fetch 옵션
 */
export function createApiRequestOptions(apiKey, payload) {
    return {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(payload)
    };
}

/**
 * API 에러 메시지 생성
 *
 * @param {Error} error - 에러 객체
 * @returns {string} 사용자 친화적인 에러 메시지
 */
export function getApiErrorMessage(error) {
    let errorMessage = `❌ API 호출 실패: ${error.message}\n\n`;

    // CORS 에러 감지
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        errorMessage = `❌ CORS 오류: 브라우저 보안 정책으로 인해 API 호출이 차단되었습니다.\n\n`;
        errorMessage += '📋 해결 방법:\n\n';
        errorMessage += '1️⃣ Cloudflare Workers 프록시 설정 (5분, 추천)\n';
        errorMessage += '   - SETUP-GUIDE.md 문서의 "방법 3: GitHub Pages" 섹션 참조\n\n';
        errorMessage += '2️⃣ 로컬 서버 사용\n';
        errorMessage += '   - START-SERVER.bat 실행 후 http://localhost:8080 접속\n\n';
        errorMessage += '3️⃣ 로컬 HTML 파일 사용\n';
        errorMessage += '   - index.html 파일 직접 더블클릭\n\n';
        errorMessage += '💡 가장 간단: index.html 더블클릭 (0초 설정)';
    } else {
        // 일반적인 API 에러
        errorMessage += '가능한 원인:\n';
        errorMessage += '1. API 키가 올바르지 않습니다 (sk-ant-api-로 시작해야 함)\n';
        errorMessage += '2. API 키에 충분한 크레딧이 없습니다\n';
        errorMessage += '3. 네트워크 연결 문제\n';
        errorMessage += '4. API 서비스 일시 중단\n\n';
        errorMessage += '브라우저 개발자 도구(F12)의 Console 탭에서 자세한 에러를 확인하세요.';
    }

    return errorMessage;
}
