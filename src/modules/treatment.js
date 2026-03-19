// treatment.js - 트리트먼트 트리뷰 모듈
import { state } from '../core/state.js';
import { autoSaveLocal } from '../core/storage.js';

let els = {};

function ensureTreatment() {
    if (!state.project || typeof state.project !== 'object') return;
    if (!state.project.treatment || typeof state.project.treatment !== 'object') {
        state.project.treatment = { parts: [] };
    }
    if (!Array.isArray(state.project.treatment.parts)) {
        state.project.treatment.parts = [];
    }
}

export function initTreatment(elements) {
    els = elements;
    ensureTreatment();

    // 트리 클릭 이벤트
    els.treatmentTree.addEventListener('click', (e) => {
        // 액션 버튼 처리
        const actionBtn = e.target.closest('.tree-action-btn');
        if (actionBtn) {
            e.stopPropagation();
            const action = actionBtn.dataset.action;
            const item = actionBtn.closest('.tree-item');
            handleTreeAction(action, item);
            return;
        }

        // 헤더 클릭 시 토글
        const header = e.target.closest('.tree-header');
        if (header) {
            const item = header.closest('.tree-item');
            item.classList.toggle('open');
        }
    });

    // 입력 이벤트
    els.treatmentTree.addEventListener('input', (e) => {
        if (e.target.classList.contains('tree-textarea')) {
            const item = e.target.closest('.tree-item');
            const field = e.target.dataset.episodeField;
            updateEpisodeField(item, field, e.target.value);
        }
    });

    // 태그 관련 이벤트
    els.treatmentTree.addEventListener('click', (e) => {
        // 태그 추가 버튼
        if (e.target.classList.contains('episode-tag-add')) {
            e.stopPropagation();
            const item = e.target.closest('.tree-item');
            addEpisodeTag(item);
        }
        // 태그 제거 버튼
        else if (e.target.classList.contains('episode-tag-remove')) {
            e.stopPropagation();
            const tag = e.target.parentElement.dataset.tag;
            const item = e.target.closest('.tree-item');
            removeEpisodeTag(item, tag);
        }
    });

    // 부 추가 버튼
    document.getElementById('addTreatmentPart')?.addEventListener('click', () => {
        ensureTreatment();
        const partNum = state.project.treatment.parts.length + 1;
        const title = prompt('부 이름:', partNum + '부');
        if (title && title.trim()) {
            state.project.treatment.parts.push({
                id: 'part_' + Date.now(),
                title: title.trim(),
                sections: []
            });
            renderTreatmentTree();
            autoSaveLocal();
        }
    });
}

export function renderTreatmentTree() {
    ensureTreatment();
    els.treatmentTree.innerHTML = '';

    if (state.project.treatment.parts.length === 0) {
        state.project.treatment.parts = [{
            id: 'part_' + Date.now(),
            title: '1부',
            sections: [{ id: 'sec_' + Date.now(), title: '기', episodes: [] }]
        }];
    }

    state.project.treatment.parts.forEach(part => {
        els.treatmentTree.appendChild(createPartElement(part));
    });
}

function createPartElement(part) {
    const item = document.createElement('div');
    item.className = 'tree-item open';
    item.dataset.partId = part.id;

    item.innerHTML = `
        <div class="tree-header">
            <span class="tree-toggle">▶</span>
            <span class="tree-icon">📁</span>
            <span class="tree-label">${part.title}</span>
            <div class="tree-actions">
                <button class="tree-action-btn" data-action="add-section" title="섹션 추가">+📁</button>
                <button class="tree-action-btn" data-action="rename" title="이름 변경">✏️</button>
                <button class="tree-action-btn delete" data-action="delete" title="삭제">🗑️</button>
            </div>
        </div>
        <div class="tree-children"></div>
    `;

    const children = item.querySelector('.tree-children');
    (part.sections || []).forEach(section => {
        children.appendChild(createSectionElement(part.id, section));
    });

    return item;
}

function createSectionElement(partId, section) {
    const item = document.createElement('div');
    item.className = 'tree-item open';
    item.dataset.partId = partId;
    item.dataset.sectionId = section.id;

    item.innerHTML = `
        <div class="tree-header">
            <span class="tree-toggle">▶</span>
            <span class="tree-icon">📂</span>
            <span class="tree-label">${section.title}</span>
            <div class="tree-actions">
                <button class="tree-action-btn" data-action="add-episode" title="회차 추가">+📄</button>
                <button class="tree-action-btn" data-action="rename" title="이름 변경">✏️</button>
                <button class="tree-action-btn delete" data-action="delete" title="삭제">🗑️</button>
            </div>
        </div>
        <div class="tree-children"></div>
    `;

    const children = item.querySelector('.tree-children');
    (section.episodes || []).forEach(episode => {
        children.appendChild(createEpisodeElement(partId, section.id, episode));
    });

    return item;
}

function createEpisodeElement(partId, sectionId, episode) {
    const item = document.createElement('div');
    item.className = 'tree-item leaf';
    item.dataset.partId = partId;
    item.dataset.sectionId = sectionId;
    item.dataset.episodeId = episode.id;

    const episodeData = {
        summary: episode.summary || episode.content || '',
        setting: episode.setting || '',
        events: episode.events || '',
        characterChange: episode.characterChange || '',
        direction: episode.direction || '',
        tags: episode.tags || [],
        memo: episode.memo || ''
    };

    // 태그 HTML 생성
    const tagsHtml = episodeData.tags.map(tag =>
        `<span class="episode-tag" data-tag="${tag}">${tag} <button class="episode-tag-remove">×</button></span>`
    ).join('');

    item.innerHTML = `
        <div class="tree-header">
            <span class="tree-toggle">▶</span>
            <span class="tree-icon">📄</span>
            <span class="tree-label">${episode.title}</span>
            <div class="tree-actions">
                <button class="tree-action-btn" data-action="save-checkpoint" title="체크포인트 저장">💾</button>
                <button class="tree-action-btn" data-action="view-history" title="버전 히스토리">📋</button>
                <button class="tree-action-btn" data-action="rename" title="이름 변경">✏️</button>
                <button class="tree-action-btn delete" data-action="delete" title="삭제">🗑️</button>
            </div>
        </div>
        <div class="tree-content">
            <div class="treatment-episode-section">
                <label class="treatment-episode-label">태그</label>
                <div class="episode-tags-container">
                    ${tagsHtml}
                    <button class="episode-tag-add">+ 태그 추가</button>
                </div>
            </div>
            <div class="treatment-episode-section">
                <label class="treatment-episode-label">메모</label>
                <textarea class="tree-textarea" data-episode-field="memo" placeholder="이 회차에 대한 메모를 작성하세요...">${episodeData.memo}</textarea>
            </div>
            <div class="treatment-episode-section">
                <label class="treatment-episode-label">전개 요약</label>
                <textarea class="tree-textarea" data-episode-field="summary" placeholder="이 회차의 전개를 작성하세요...">${episodeData.summary}</textarea>
            </div>
            <div class="treatment-episode-section">
                <label class="treatment-episode-label">배경</label>
                <textarea class="tree-textarea" data-episode-field="setting" placeholder="시간, 장소, 분위기...">${episodeData.setting}</textarea>
            </div>
            <div class="treatment-episode-section">
                <label class="treatment-episode-label">사건</label>
                <textarea class="tree-textarea" data-episode-field="events" placeholder="주요 사건들...">${episodeData.events}</textarea>
            </div>
            <div class="treatment-episode-section">
                <label class="treatment-episode-label">캐릭터 심리 변화</label>
                <textarea class="tree-textarea" data-episode-field="characterChange" placeholder="심리적 변화, 태도 변화...">${episodeData.characterChange}</textarea>
            </div>
            <div class="treatment-episode-section">
                <label class="treatment-episode-label">연출 가이드</label>
                <textarea class="tree-textarea" data-episode-field="direction" placeholder="묘사 가이드...">${episodeData.direction}</textarea>
            </div>
        </div>
    `;

    return item;
}

function handleTreeAction(action, item) {
    const partId = item.dataset.partId;
    const sectionId = item.dataset.sectionId;
    const episodeId = item.dataset.episodeId;

    const part = state.project.treatment.parts.find(p => p.id === partId);
    if (!part) return;

    if (action === 'add-section') {
        const title = prompt('섹션 이름:', '승');
        if (title && title.trim()) {
            part.sections = part.sections || [];
            part.sections.push({
                id: 'sec_' + Date.now(),
                title: title.trim(),
                episodes: []
            });
            renderTreatmentTree();
            autoSaveLocal();
        }
    } else if (action === 'add-episode') {
        const section = part.sections.find(s => s.id === sectionId);
        if (section) {
            const epNum = section.episodes.length + 1;
            const title = prompt('회차 제목:', epNum + '화');
            if (title && title.trim()) {
                section.episodes = section.episodes || [];
                section.episodes.push({
                    id: 'ep_' + Date.now(),
                    title: title.trim(),
                    tags: [],
                    memo: '',
                    summary: '',
                    setting: '',
                    events: '',
                    characterChange: '',
                    direction: ''
                });
                renderTreatmentTree();
                autoSaveLocal();
            }
        }
    } else if (action === 'rename') {
        const label = item.querySelector('.tree-label');
        const newName = prompt('새 이름:', label.textContent);
        if (newName && newName.trim()) {
            if (episodeId) {
                const section = part.sections.find(s => s.id === sectionId);
                const episode = section.episodes.find(ep => ep.id === episodeId);
                episode.title = newName.trim();
            } else if (sectionId) {
                const section = part.sections.find(s => s.id === sectionId);
                section.title = newName.trim();
            } else {
                part.title = newName.trim();
            }
            label.textContent = newName.trim();
            autoSaveLocal();
        }
    } else if (action === 'delete') {
        if (confirm('삭제할까요?')) {
            if (episodeId) {
                const section = part.sections.find(s => s.id === sectionId);
                section.episodes = section.episodes.filter(ep => ep.id !== episodeId);
            } else if (sectionId) {
                part.sections = part.sections.filter(s => s.id !== sectionId);
            } else {
                state.project.treatment.parts = state.project.treatment.parts.filter(p => p.id !== partId);
            }
            renderTreatmentTree();
            autoSaveLocal();
        }
    } else if (action === 'compare') {
        if (episodeId) {
            const section = part.sections.find(s => s.id === sectionId);
            const episode = section.episodes.find(ep => ep.id === episodeId);
            showVersionCompare(episode);
        }
    }
}

function updateEpisodeField(item, field, value) {
    const partId = item.dataset.partId;
    const sectionId = item.dataset.sectionId;
    const episodeId = item.dataset.episodeId;

    const part = state.project.treatment.parts.find(p => p.id === partId);
    if (!part) return;

    const section = part.sections.find(s => s.id === sectionId);
    if (!section) return;

    const episode = section.episodes.find(ep => ep.id === episodeId);
    if (!episode || !field) return;

    episode[field] = value;
}

/**
 * 태그 추가
 */
function addEpisodeTag(item) {
    const tagName = prompt('태그 이름 (예: 핵심 장면, 복선, 감정선):', '');
    if (!tagName || !tagName.trim()) return;

    const partId = item.dataset.partId;
    const sectionId = item.dataset.sectionId;
    const episodeId = item.dataset.episodeId;

    const part = state.project.treatment.parts.find(p => p.id === partId);
    if (!part) return;

    const section = part.sections.find(s => s.id === sectionId);
    if (!section) return;

    const episode = section.episodes.find(ep => ep.id === episodeId);
    if (!episode) return;

    if (!episode.tags) episode.tags = [];
    if (!episode.tags.includes(tagName.trim())) {
        episode.tags.push(tagName.trim());
        renderTreatmentTree();
        autoSaveLocal();
    }
}

/**
 * 태그 제거
 */
function removeEpisodeTag(item, tag) {
    const partId = item.dataset.partId;
    const sectionId = item.dataset.sectionId;
    const episodeId = item.dataset.episodeId;

    const part = state.project.treatment.parts.find(p => p.id === partId);
    if (!part) return;

    const section = part.sections.find(s => s.id === sectionId);
    if (!section) return;

    const episode = section.episodes.find(ep => ep.id === episodeId);
    if (!episode || !episode.tags) return;

    episode.tags = episode.tags.filter(t => t !== tag);
    renderTreatmentTree();
    autoSaveLocal();
}

/**
 * 체크포인트 저장
 */
function saveCheckpoint(partId, sectionId, episodeId) {
    const part = state.project.treatment.parts.find(p => p.id === partId);
    if (!part) return;

    const section = part.sections.find(s => s.id === sectionId);
    if (!section) return;

    const episode = section.episodes.find(ep => ep.id === episodeId);
    if (!episode) return;

    const message = prompt('체크포인트 메모 (선택사항):', '');
    if (message === null) return; // 취소

    // 체크포인트 배열 초기화
    if (!episode.checkpoints) {
        episode.checkpoints = [];
    }

    // 현재 상태 스냅샷 생성
    const checkpoint = {
        id: 'cp_' + Date.now(),
        timestamp: new Date().toISOString(),
        message: message.trim() || '체크포인트',
        data: {
            title: episode.title,
            tags: [...(episode.tags || [])],
            memo: episode.memo || '',
            summary: episode.summary || '',
            setting: episode.setting || '',
            events: episode.events || '',
            characterChange: episode.characterChange || '',
            direction: episode.direction || ''
        }
    };

    episode.checkpoints.push(checkpoint);
    autoSaveLocal();
    alert('체크포인트가 저장되었습니다!');
}

/**
 * 체크포인트 히스토리 보기
 */
function showCheckpointHistory(partId, sectionId, episodeId) {
    const part = state.project.treatment.parts.find(p => p.id === partId);
    if (!part) return;

    const section = part.sections.find(s => s.id === sectionId);
    if (!section) return;

    const episode = section.episodes.find(ep => ep.id === episodeId);
    if (!episode) return;

    if (!episode.checkpoints || episode.checkpoints.length === 0) {
        alert('저장된 체크포인트가 없습니다.');
        return;
    }

    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'checkpoint-modal';
    modal.innerHTML = `
        <div class="checkpoint-modal-content">
            <div class="checkpoint-modal-header">
                <h3>버전 히스토리 - ${episode.title}</h3>
                <button class="checkpoint-modal-close">×</button>
            </div>
            <div class="checkpoint-modal-body">
                <div class="checkpoint-list"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const listContainer = modal.querySelector('.checkpoint-list');

    // 최신순으로 정렬
    const sortedCheckpoints = [...episode.checkpoints].reverse();

    sortedCheckpoints.forEach((cp, index) => {
        const item = document.createElement('div');
        item.className = 'checkpoint-item';

        const date = new Date(cp.timestamp);
        const timeStr = date.toLocaleString('ko-KR');

        item.innerHTML = `
            <div class="checkpoint-header">
                <span class="checkpoint-time">${timeStr}</span>
                <span class="checkpoint-message">${cp.message}</span>
            </div>
            <div class="checkpoint-actions">
                <button class="checkpoint-btn" data-action="compare" data-checkpoint-id="${cp.id}">비교하기</button>
                <button class="checkpoint-btn" data-action="restore" data-checkpoint-id="${cp.id}">복원하기</button>
                <button class="checkpoint-btn delete" data-action="delete" data-checkpoint-id="${cp.id}">삭제</button>
            </div>
        `;

        listContainer.appendChild(item);
    });

    // 이벤트 핸들러
    modal.querySelector('.checkpoint-modal-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    listContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.checkpoint-btn');
        if (!btn) return;

        const checkpointId = btn.dataset.checkpointId;
        const action = btn.dataset.action;

        if (action === 'compare') {
            compareCheckpoint(episode, checkpointId);
        } else if (action === 'restore') {
            restoreCheckpoint(episode, checkpointId, modal);
        } else if (action === 'delete') {
            deleteCheckpoint(episode, checkpointId, modal);
        }
    });
}

/**
 * 체크포인트 비교
 */
function compareCheckpoint(episode, checkpointId) {
    const checkpoint = episode.checkpoints.find(cp => cp.id === checkpointId);
    if (!checkpoint) return;

    const current = {
        memo: episode.memo || '',
        summary: episode.summary || '',
        setting: episode.setting || '',
        events: episode.events || '',
        characterChange: episode.characterChange || '',
        direction: episode.direction || ''
    };

    const saved = checkpoint.data;

    // 비교 모달 생성
    const compareModal = document.createElement('div');
    compareModal.className = 'checkpoint-modal';
    compareModal.innerHTML = `
        <div class="checkpoint-modal-content checkpoint-compare-modal">
            <div class="checkpoint-modal-header">
                <h3>버전 비교</h3>
                <button class="checkpoint-modal-close">×</button>
            </div>
            <div class="checkpoint-modal-body">
                <div class="checkpoint-compare-info">
                    <strong>체크포인트:</strong> ${checkpoint.message}
                    <span class="checkpoint-time">(${new Date(checkpoint.timestamp).toLocaleString('ko-KR')})</span>
                </div>
                <div class="checkpoint-compare-content">
                    ${generateComparisonHTML('메모', saved.memo, current.memo)}
                    ${generateComparisonHTML('전개 요약', saved.summary, current.summary)}
                    ${generateComparisonHTML('배경', saved.setting, current.setting)}
                    ${generateComparisonHTML('사건', saved.events, current.events)}
                    ${generateComparisonHTML('캐릭터 심리 변화', saved.characterChange, current.characterChange)}
                    ${generateComparisonHTML('연출 가이드', saved.direction, current.direction)}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(compareModal);

    compareModal.querySelector('.checkpoint-modal-close').addEventListener('click', () => {
        compareModal.remove();
    });

    compareModal.addEventListener('click', (e) => {
        if (e.target === compareModal) {
            compareModal.remove();
        }
    });
}

/**
 * 비교 HTML 생성
 */
function generateComparisonHTML(label, oldValue, newValue) {
    if (oldValue === newValue) {
        return `
            <div class="checkpoint-compare-section">
                <h4>${label}</h4>
                <div class="checkpoint-compare-unchanged">${escapeHtml(newValue) || '<em>비어있음</em>'}</div>
            </div>
        `;
    }

    return `
        <div class="checkpoint-compare-section">
            <h4>${label}</h4>
            <div class="checkpoint-compare-row">
                <div class="checkpoint-compare-old">
                    <strong>이전 버전:</strong>
                    <pre>${escapeHtml(oldValue) || '<em>비어있음</em>'}</pre>
                </div>
                <div class="checkpoint-compare-new">
                    <strong>현재 버전:</strong>
                    <pre>${escapeHtml(newValue) || '<em>비어있음</em>'}</pre>
                </div>
            </div>
        </div>
    `;
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 체크포인트 복원
 */
function restoreCheckpoint(episode, checkpointId, historyModal) {
    const checkpoint = episode.checkpoints.find(cp => cp.id === checkpointId);
    if (!checkpoint) return;

    if (!confirm('이 버전으로 복원하시겠습니까? 현재 내용은 덮어씌워집니다.')) {
        return;
    }

    // 복원
    episode.title = checkpoint.data.title;
    episode.tags = [...checkpoint.data.tags];
    episode.memo = checkpoint.data.memo;
    episode.summary = checkpoint.data.summary;
    episode.setting = checkpoint.data.setting;
    episode.events = checkpoint.data.events;
    episode.characterChange = checkpoint.data.characterChange;
    episode.direction = checkpoint.data.direction;

    renderTreatmentTree();
    autoSaveLocal();
    historyModal.remove();
    alert('체크포인트가 복원되었습니다!');
}

/**
 * 체크포인트 삭제
 */
function deleteCheckpoint(episode, checkpointId, historyModal) {
    if (!confirm('이 체크포인트를 삭제하시겠습니까?')) {
        return;
    }

    episode.checkpoints = episode.checkpoints.filter(cp => cp.id !== checkpointId);
    autoSaveLocal();
    historyModal.remove();
    alert('체크포인트가 삭제되었습니다.');
}

/**
 * 간단한 버전 비교 (LocalStorage 기반)
 */
function showVersionCompare(episode) {
    const savedData = localStorage.getItem('novelWriter_project');
    if (!savedData) {
        alert('저장된 이전 버전이 없습니다.');
        return;
    }

    try {
        const savedProject = JSON.parse(savedData);
        let savedEpisode = null;

        // 저장된 프로젝트에서 같은 ID의 에피소드 찾기
        if (savedProject.treatment && savedProject.treatment.parts) {
            outerLoop:
            for (const part of savedProject.treatment.parts) {
                for (const section of (part.sections || [])) {
                    for (const ep of (section.episodes || [])) {
                        if (ep.id === episode.id) {
                            savedEpisode = ep;
                            break outerLoop;
                        }
                    }
                }
            }
        }

        if (!savedEpisode) {
            alert('이전 저장 버전에서 이 회차를 찾을 수 없습니다.\n(새로 추가된 회차일 수 있습니다)');
            return;
        }

        // 비교 모달 생성
        const compareModal = document.createElement('div');
        compareModal.className = 'version-compare-modal';
        compareModal.innerHTML = `
            <div class="version-compare-content">
                <div class="version-compare-header">
                    <h3>📋 버전 비교 - ${episode.title}</h3>
                    <button class="version-compare-close">×</button>
                </div>
                <div class="version-compare-body">
                    <div class="version-compare-info">마지막 저장된 버전과 현재 작성 중인 내용을 비교합니다.</div>
                    ${generateSimpleComparisonHTML('메모', savedEpisode.memo, episode.memo)}
                    ${generateSimpleComparisonHTML('전개 요약', savedEpisode.summary, episode.summary)}
                    ${generateSimpleComparisonHTML('배경', savedEpisode.setting, episode.setting)}
                    ${generateSimpleComparisonHTML('사건', savedEpisode.events, episode.events)}
                    ${generateSimpleComparisonHTML('캐릭터 심리 변화', savedEpisode.characterChange, episode.characterChange)}
                    ${generateSimpleComparisonHTML('연출 가이드', savedEpisode.direction, episode.direction)}
                </div>
            </div>
        `;

        document.body.appendChild(compareModal);

        compareModal.querySelector('.version-compare-close').addEventListener('click', () => {
            compareModal.remove();
        });

        compareModal.addEventListener('click', (e) => {
            if (e.target === compareModal) {
                compareModal.remove();
            }
        });

    } catch (error) {
        console.error('Version compare error:', error);
        alert('버전 비교 중 오류가 발생했습니다.');
    }
}

/**
 * 간단한 비교 HTML 생성
 */
function generateSimpleComparisonHTML(label, oldValue, newValue) {
    oldValue = oldValue || '';
    newValue = newValue || '';

    if (oldValue === newValue) {
        if (!newValue) return ''; // 둘 다 비어있으면 표시 안 함
        return `
            <div class="version-compare-section">
                <h4>${label}</h4>
                <div class="version-compare-unchanged">변경사항 없음</div>
            </div>
        `;
    }

    return `
        <div class="version-compare-section">
            <h4>${label}</h4>
            <div class="version-compare-columns">
                <div class="version-compare-column">
                    <div class="version-compare-label">이전 저장 버전</div>
                    <pre class="version-compare-text version-old">${escapeHtml(oldValue) || '<em class="empty">비어있음</em>'}</pre>
                </div>
                <div class="version-compare-column">
                    <div class="version-compare-label">현재 작성 중</div>
                    <pre class="version-compare-text version-new">${escapeHtml(newValue) || '<em class="empty">비어있음</em>'}</pre>
                </div>
            </div>
        </div>
    `;
}

export function getTreatmentText() {
    ensureTreatment();
    let text = '';
    (state.project.treatment.parts || []).forEach(part => {
        text += '[' + part.title + ']\n';
        (part.sections || []).forEach(section => {
            text += '  ' + section.title + ':\n';
            (section.episodes || []).forEach(episode => {
                text += '    - ' + episode.title + '\n';
            });
        });
    });
    return text.trim() || '(없음)';
}
