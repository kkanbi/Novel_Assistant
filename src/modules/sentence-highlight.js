// sentence-highlight.js - 문장 하이라이트 (검토결과 기반 + 문장길이 폴백)
import { state } from '../core/state.js';

let isHighlightActive = false;
let highlightOverlay = null;

export function initSentenceHighlight() {
    const btnToggle = document.getElementById('btnToggleHighlight');
    if (btnToggle) {
        btnToggle.addEventListener('click', toggleHighlight);
    }
}

export function toggleHighlight() {
    isHighlightActive = !isHighlightActive;
    const btn = document.getElementById('btnToggleHighlight');
    const editor = document.getElementById('episodeContent');

    if (isHighlightActive) {
        btn.style.background = 'var(--accent)';
        btn.style.color = 'var(--bg-primary)';
        applyHighlight(editor);
        editor.addEventListener('input', handleEditorInput);
        editor.addEventListener('scroll', syncScrollPosition);
    } else {
        btn.style.background = '';
        btn.style.color = '';
        removeHighlight();
        editor.removeEventListener('input', handleEditorInput);
        editor.removeEventListener('scroll', syncScrollPosition);
    }
}

function handleEditorInput(e) {
    applyHighlight(e.target);
}

/**
 * 검토 결과에서 문제 텍스트(원문) 목록 추출
 * 패턴: '원문' → '수정안'  또는  '원문'
 */
function getProblematicTexts() {
    const vol = state.project.currentVolume;
    const epIdx = state.currentEpisodeIndex;
    const ep = state.project.volumes?.[vol]?.episodes?.[epIdx];
    if (!ep?.reviewResult) return [];

    const problems = new Set();
    ep.reviewResult.split('\n').forEach(line => {
        if (!line.startsWith('- ')) return;
        // '원문' → '수정안' 패턴에서 원문만 추출
        const arrowMatch = line.match(/'([^']+)'\s*→/);
        if (arrowMatch) {
            problems.add(arrowMatch[1]);
            return;
        }
        // 그 외 따옴표 안의 텍스트 추출
        for (const m of line.matchAll(/'([^']+)'/g)) {
            problems.add(m[1]);
        }
    });
    return [...problems].filter(p => p.length >= 2);
}

function applyHighlight(editor) {
    const text = editor.value;
    if (!text) return;

    if (!highlightOverlay) {
        highlightOverlay = document.createElement('div');
        highlightOverlay.className = 'highlight-overlay';
        editor.parentElement.appendChild(highlightOverlay);
    }

    const problems = getProblematicTexts();

    let html;
    if (problems.length > 0) {
        // 검토결과 기반: 문제 텍스트를 빨간색으로 하이라이트
        html = escapeHtml(text);
        problems.forEach(problem => {
            const escaped = escapeHtml(problem);
            const regex = new RegExp(escapeRegex(escaped), 'g');
            html = html.replace(regex, `<span class="review-problem">${escaped}</span>`);
        });
    } else {
        // 폴백: 문장 길이 기반 하이라이트 (한국어 기준 조정)
        const sentences = text.split(/([.!?。]\s+|[.!?。]$)/);
        html = '';
        sentences.forEach(sentence => {
            const len = sentence.replace(/\s/g, '').length;
            if (len > 100) {
                html += `<span class="long-sentence">${escapeHtml(sentence)}</span>`;
            } else if (len > 60) {
                html += `<span class="medium-sentence">${escapeHtml(sentence)}</span>`;
            } else {
                html += escapeHtml(sentence);
            }
        });
    }

    highlightOverlay.innerHTML = html;
    syncScrollPosition();
}

function syncScrollPosition() {
    if (!highlightOverlay) return;
    const editor = document.getElementById('episodeContent');
    highlightOverlay.scrollTop = editor.scrollTop;
}

function removeHighlight() {
    if (highlightOverlay) {
        highlightOverlay.remove();
        highlightOverlay = null;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isHighlightEnabled() {
    return isHighlightActive;
}
