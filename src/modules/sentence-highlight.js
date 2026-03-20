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

/** 섹션 이름 → 타입 변환 (review.js와 동일) */
function getSectionType(name) {
    if (name.includes('맞춤법') || name.includes('띄어쓰기')) return 'spelling';
    if (name.includes('어색') || name.includes('표현')) return 'awkward';
    if (name.includes('일관성') || name.includes('설정')) return 'consistency';
    if (name.includes('반복')) return 'repetition';
    if (name.includes('흐름') || name.includes('연결')) return 'flow';
    return 'default';
}

/**
 * 검토 결과에서 { text, type } 목록 추출
 */
function getProblematicTexts() {
    const vol = state.project.currentVolume;
    const epIdx = state.currentEpisodeIndex;
    const ep = state.project.volumes?.[vol]?.episodes?.[epIdx];
    if (!ep?.reviewResult) return [];

    const problems = [];
    const seen = new Set();
    let currentType = 'default';

    ep.reviewResult.split('\n').forEach(line => {
        if (line.startsWith('## ')) {
            currentType = getSectionType(line.slice(3));
        } else if (line.startsWith('- ')) {
            const arrowMatch = line.match(/'([^']+)'\s*→/);
            if (arrowMatch && !seen.has(arrowMatch[1]) && arrowMatch[1].length >= 2) {
                seen.add(arrowMatch[1]);
                problems.push({ text: arrowMatch[1], type: currentType });
                return;
            }
            for (const m of line.matchAll(/'([^']+)'/g)) {
                if (!seen.has(m[1]) && m[1].length >= 2) {
                    seen.add(m[1]);
                    problems.push({ text: m[1], type: currentType });
                }
            }
        }
    });
    return problems;
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
        // 검토결과 기반: 타입별 색상으로 하이라이트
        html = escapeHtml(text);
        problems.forEach(({ text: problem, type }) => {
            const escaped = escapeHtml(problem);
            const regex = new RegExp(escapeRegex(escaped), 'g');
            html = html.replace(regex, `<span class="review-problem-${type}">${escaped}</span>`);
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
