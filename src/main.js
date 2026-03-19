// main.js - 메인 초기화 파일
import { state } from './core/state.js';
import { loadAutoSave } from './core/storage.js';
import { initAllTabs } from './ui/tabs.js';
import { initEditor, loadCurrentEpisode } from './modules/editor.js';
import { initEpisodes, updateEpisodesList, updateVolumeSelector, createNewVolume } from './modules/episodes.js';
import { initCharacters, renderCharacterGrid } from './modules/characters.js';
import { initGoogleDrive } from './modules/google-drive.js';
import { initTheme } from './modules/theme.js';
import { initCoreSettings, loadCoreData } from './modules/core-settings.js';
import { initWorld, renderWorldTags, renderWorldAccordion } from './modules/world.js';
import { initTreatment, renderTreatmentTree } from './modules/treatment.js';
import { initReview } from './modules/review.js';
import { initFocusMode } from './modules/focus-mode.js';
import { initShortcuts } from './modules/shortcuts.js';
import { initSentenceHighlight } from './modules/sentence-highlight.js';
import { initPomodoro } from './modules/pomodoro.js';
import { initDashboard, updateDashboard } from './modules/dashboard.js';
import { initCharacterTooltip } from './modules/character-tooltip.js';

// ============ DOM 요소 ============
const els = {
    googleStatusIcon: document.getElementById('googleStatusIcon'),
    googleStatusText: document.getElementById('googleStatusText'),
    googleEmail: document.getElementById('googleEmail'),
    btnGoogleAuth: document.getElementById('btnGoogleAuth'),
    projectTitle: document.getElementById('projectTitle'),
    currentVolume: document.getElementById('currentVolume'),
    totalVolumes: document.getElementById('totalVolumes'),
    volumeGoal: document.getElementById('volumeGoal'),
    episodesList: document.getElementById('episodesList'),
    episodeCount: document.getElementById('episodeCount'),
    volumeProgress: document.getElementById('volumeProgress'),
    progressFill: document.getElementById('progressFill'),
    episodeNumDisplay: document.getElementById('episodeNumDisplay'),
    episodeTitle: document.getElementById('episodeTitle'),
    episodeContent: document.getElementById('episodeContent'),
    saveStatus: document.getElementById('saveStatus'),
    charWithSpaces: document.getElementById('charWithSpaces'),
    charWithoutSpaces: document.getElementById('charWithoutSpaces'),
    manuscriptPages: document.getElementById('manuscriptPages'),
    apiKey: document.getElementById('apiKey'),
    apiStatus: document.getElementById('apiStatus'),
    aiResult: document.getElementById('aiResult'),
    fileModal: document.getElementById('fileModal'),
    modalFileList: document.getElementById('modalFileList'),
    btnModalOpen: document.getElementById('btnModalOpen'),
    characterGrid: document.getElementById('characterGrid'),
    characterModal: document.getElementById('characterModal'),
    emojiPicker: document.getElementById('emojiPicker'),
    worldTags: document.getElementById('worldTags'),
    worldAccordion: document.getElementById('worldAccordion'),
    treatmentTree: document.getElementById('treatmentTree')
};

// ============ 앱 초기화 ============
function initApp() {
    console.log('🚀 Novel Writer v0.1.0 초기화 중...');

    // 탭 시스템 초기화
    initAllTabs();

    // 각 모듈 초기화
    initEditor(els);
    initEpisodes(els);
    initCharacters(els);
    initGoogleDrive(els);
    initTheme();
    initCoreSettings();
    initWorld(els);
    initTreatment(els);
    initReview(els);
    initFocusMode();
    initShortcuts();
    initSentenceHighlight();
    initPomodoro();
    initDashboard(els);
    initCharacterTooltip();

    // 버튼 이벤트
    document.getElementById('btnNewVolume').addEventListener('click', createNewVolume);
    document.getElementById('btnDownload').addEventListener('click', downloadLocal);

    // 자동 저장 로드
    loadAutoSave({
        onAfterLoad: () => {
            loadProjectSettings();
            loadCurrentEpisode();
            updateEpisodesList();
            renderCharacterGrid();
            loadCoreData();
            renderWorldTags();
            renderWorldAccordion();
            renderTreatmentTree();
            updateDashboard();
        }
    });

    console.log('✅ 초기화 완료');
}

/**
 * 프로젝트 설정 로드
 */
function loadProjectSettings() {
    els.projectTitle.value = state.project.title || '';
    els.totalVolumes.value = state.project.totalVolumes || 1;
    els.volumeGoal.value = state.project.volumeGoal || 100000;

    updateVolumeSelector();
}

/**
 * 로컬 다운로드
 */
function downloadLocal() {
    // saveCurrentEpisode();

    const data = {
        ...state.project,
        savedAt: new Date().toISOString()
    };

    const filename = `${state.project.title || '소설'}_${state.project.currentVolume}권.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// 앱 시작
document.addEventListener('DOMContentLoaded', initApp);
