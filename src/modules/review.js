// review.js - AI 퇴고 모듈 (간소화 버전)
import { getCoreText } from './core-settings.js';
import { getCharactersText } from './characters.js';
import { getWorldText } from './world.js';
import { CLAUDE_CONFIG } from '../utils/constants.js';
import { addUsage, calculateCost, resetUsage, updateUsageDisplay } from '../utils/api-usage.js';
import { getAnthropicApiUrl, createApiRequestOptions, getApiErrorMessage } from '../utils/api-helper.js';

let claudeApiKey = '';
let els = {};

export function initReview(elements) {
    els = elements;

    // API 키 입력
    els.apiKey.addEventListener('input', () => {
        claudeApiKey = els.apiKey.value.trim();
        if (claudeApiKey.startsWith('sk-ant-')) {
            els.apiStatus.textContent = '✓ 설정됨';
            els.apiStatus.className = 'api-status connected';
        } else {
            els.apiStatus.textContent = 'API 키를 입력하세요';
            els.apiStatus.className = 'api-status';
        }
    });

    // AI 검토 버튼
    document.getElementById('btnAiCheck')?.addEventListener('click', async () => {
        if (!claudeApiKey || !claudeApiKey.startsWith('sk-ant-')) {
            alert('먼저 Claude API 키를 입력해주세요.');
            return;
        }

        const content = els.episodeContent.value.trim();
        if (!content) {
            alert('검토할 본문을 입력해주세요.');
            return;
        }

        await performAIReview(content);
    });

    // Reset 버튼
    document.getElementById('btnResetReview')?.addEventListener('click', () => {
        els.aiResult.textContent = '검토 결과가 초기화되었습니다.';
        els.aiResult.className = 'result-content';
    });

    // 사용량 리셋 버튼
    document.getElementById('btnResetUsage')?.addEventListener('click', () => {
        if (confirm('API 사용량 기록을 모두 초기화하시겠습니까?')) {
            resetUsage();
            alert('사용량이 초기화되었습니다.');
        }
    });

    // 초기 사용량 표시
    updateUsageDisplay();
}

/**
 * AI 검토 수행
 */
async function performAIReview(content) {
    // 검토 옵션 가져오기
    const checkSpelling = document.getElementById('checkSpelling').checked;
    const checkAwkward = document.getElementById('checkAwkward').checked;
    const checkConsistency = document.getElementById('checkConsistency').checked;
    const checkRepetition = document.getElementById('checkRepetition').checked;
    const checkFlow = document.getElementById('checkFlow').checked;

    // 최소 하나는 선택되어야 함
    if (!checkSpelling && !checkAwkward && !checkConsistency && !checkRepetition && !checkFlow) {
        alert('최소 하나의 검토 옵션을 선택해주세요.');
        return;
    }

    // 검토 항목 텍스트 생성
    const reviewItems = [];
    if (checkSpelling) reviewItems.push('맞춤법 및 띄어쓰기');
    if (checkAwkward) reviewItems.push('어색한 문장 표현');
    if (checkConsistency) reviewItems.push('설정 일관성');
    if (checkRepetition) reviewItems.push('반복되는 표현');
    if (checkFlow) reviewItems.push('문장 흐름 및 연결');

    // 작품 컨텍스트 수집
    const coreText = getCoreText();
    const charactersText = getCharactersText();
    const worldText = getWorldText();

    // 프롬프트 구성
    const prompt = `당신은 전문 소설 편집자입니다. 다음 소설 원고를 검토해주세요.

**작품 정보:**
${coreText}

**등장인물:**
${charactersText}

**세계관:**
${worldText}

**검토 항목:**
${reviewItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}

**원고:**
${content}

**검토 요청사항:**
위의 검토 항목들을 중심으로 원고를 분석하고, 구체적인 피드백을 제공해주세요.

**응답 형식:**
각 검토 항목별로 다음과 같이 작성해주세요:

## [검토 항목명]

### 발견된 문제점:
- 문제 1: [구체적인 설명]
- 문제 2: [구체적인 설명]
...

### 수정 제안:
- 제안 1: [구체적인 수정안]
- 제안 2: [구체적인 수정안]
...

문제가 없는 항목은 "양호함"으로 표시해주세요.`;

    try {
        // 로딩 상태 표시
        els.aiResult.textContent = '🤖 AI가 원고를 검토하고 있습니다...\n잠시만 기다려주세요.';
        els.aiResult.className = 'result-content loading';

        // API 호출 준비 (CORS 처리 자동)
        const payload = {
            model: CLAUDE_CONFIG.MODEL,
            max_tokens: 4000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        };

        // 환경에 맞는 API URL 가져오기 (로컬/GitHub Pages 자동 감지)
        const apiUrl = getAnthropicApiUrl();
        const requestOptions = createApiRequestOptions(claudeApiKey, payload);

        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            const errorMsg = errorData.error?.message || JSON.stringify(errorData);
            throw new Error(`API 오류 (${response.status}): ${errorMsg}`);
        }

        const result = await response.json();
        console.log('API Success Response:', result);

        if (!result.content || !result.content[0] || !result.content[0].text) {
            throw new Error('응답 형식이 올바르지 않습니다.');
        }

        const reviewResult = result.content[0].text;

        // 토큰 사용량 및 비용 계산
        const inputTokens = result.usage.input_tokens;
        const outputTokens = result.usage.output_tokens;
        const cost = calculateCost(inputTokens, outputTokens);

        // 사용량 기록
        addUsage('review', cost, inputTokens, outputTokens);

        // 결과 표시
        els.aiResult.textContent = reviewResult;
        els.aiResult.className = 'result-content';

        // 예상 비용 표시
        document.getElementById('estimatedCost').textContent = `$${cost.toFixed(4)}`;

    } catch (error) {
        console.error('AI Review Error:', error);

        // 헬퍼 함수로 일관된 에러 메시지 생성
        const errorMessage = getApiErrorMessage(error);

        els.aiResult.textContent = errorMessage;
        els.aiResult.className = 'result-content error';
    }
}

// estimateCost와 updateUsageDisplay는 api-usage.js로 이동됨
