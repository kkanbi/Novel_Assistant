// sentence-highlight.js - 문장 길이 하이라이트
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

        // 실시간 업데이트
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

function applyHighlight(editor) {
    const text = editor.value;

    // 오버레이가 없으면 생성
    if (!highlightOverlay) {
        highlightOverlay = document.createElement('div');
        highlightOverlay.className = 'highlight-overlay';
        editor.parentElement.appendChild(highlightOverlay);
    }

    // 문장 분리 (마침표, 느낌표, 물음표 기준)
    const sentences = text.split(/([.!?]\s+|[.!?]$)/);
    let html = '';
    let charCount = 0;

    sentences.forEach(sentence => {
        const length = sentence.replace(/\s/g, '').length;

        if (length > 200) {
            html += `<span class="long-sentence">${escapeHtml(sentence)}</span>`;
        } else if (length > 150) {
            html += `<span class="medium-sentence">${escapeHtml(sentence)}</span>`;
        } else {
            html += escapeHtml(sentence);
        }

        charCount += length;
    });

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

export function isHighlightEnabled() {
    return isHighlightActive;
}
