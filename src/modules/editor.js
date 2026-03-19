// editor.js - 에디터 관련 로직
import { state } from '../core/state.js';
import { autoSaveLocal } from '../core/storage.js';
import { calculateStats } from '../utils/helpers.js';

let els = {};

/**
 * 에디터 모듈 초기화
 * @param {Object} elements - DOM 요소 객체
 */
export function initEditor(elements) {
    els = elements;

    // 이벤트 리스너 등록
    els.episodeContent.addEventListener('input', handleContentChange);
    els.episodeTitle.addEventListener('input', handleTitleChange);
}

/**
 * 본문 변경 이벤트 핸들러
 */
function handleContentChange() {
    updateStats();
    const ep = getCurrentEpisode();
    if (ep) {
        ep.content = els.episodeContent.value;
        ep.charCount = els.episodeContent.value.replace(/\s/g, '').length;
        ep.lastModified = new Date().toISOString();
    }
}

/**
 * 제목 변경 이벤트 핸들러
 */
function handleTitleChange() {
    const ep = getCurrentEpisode();
    if (ep) {
        ep.title = els.episodeTitle.value;
    }
}

/**
 * 통계 업데이트
 */
export function updateStats() {
    const text = els.episodeContent.value;
    const { withSpaces, withoutSpaces, pages } = calculateStats(text);

    els.charWithSpaces.textContent = withSpaces.toLocaleString();
    els.charWithoutSpaces.textContent = withoutSpaces.toLocaleString();
    els.manuscriptPages.textContent = pages;

    const ep = getCurrentEpisode();
    if (ep) {
        ep.charCount = withoutSpaces;
    }
}

/**
 * 현재 에피소드 로드
 */
export function loadCurrentEpisode() {
    const ep = getCurrentEpisode();
    if (!ep) return;

    els.episodeNumDisplay.textContent = `${ep.number}화`;
    els.episodeTitle.value = ep.title;
    els.episodeContent.value = ep.content;
    updateStats();

    // 검토 결과 로드
    if (ep.reviewResult && ep.reviewResult.data) {
        // review 모듈에서 처리
        if (window.displayReviewResult) {
            window.displayReviewResult(ep.reviewResult.data);
        }
    } else {
        els.aiResult.textContent = 'AI 검토 결과가 여기 표시됩니다.';
        els.aiResult.className = 'result-content';
    }
}

/**
 * 현재 에피소드 저장
 */
export function saveCurrentEpisode() {
    const ep = getCurrentEpisode();
    if (!ep) return;

    ep.title = els.episodeTitle.value;
    ep.content = els.episodeContent.value;
    ep.charCount = els.episodeContent.value.replace(/\s/g, '').length;
}

/**
 * 현재 볼륨 가져오기
 */
function getCurrentVolume() {
    return state.project.volumes[state.project.currentVolume];
}

/**
 * 현재 에피소드 가져오기
 */
function getCurrentEpisode() {
    const vol = getCurrentVolume();
    return vol ? vol.episodes[state.currentEpisodeIndex] : null;
}

/**
 * 텍스트 위치로 스크롤 (가운데 정렬)
 * @param {string} searchText
 */
export function scrollToText(searchText) {
    const content = els.episodeContent.value;
    const index = content.indexOf(searchText);

    if (index === -1) return;

    // 텍스트 선택
    els.episodeContent.focus();
    els.episodeContent.setSelectionRange(index, index + searchText.length);

    // 더미 요소를 사용해 정확한 픽셀 위치 계산
    const textBeforeCursor = content.substring(0, index);

    const dummy = document.createElement('div');
    dummy.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        width: ${els.episodeContent.clientWidth}px;
        font-family: 'Nanum Myeongjo', serif;
        font-size: 17px;
        line-height: 1.9;
        padding: 24px;
    `;
    dummy.textContent = textBeforeCursor;
    document.body.appendChild(dummy);

    const cursorTopPosition = dummy.offsetHeight;
    document.body.removeChild(dummy);

    // 가운데 정렬을 위한 스크롤 위치 계산
    const textareaHeight = els.episodeContent.clientHeight;
    const scrollPosition = Math.max(0, cursorTopPosition - (textareaHeight / 2));

    els.episodeContent.scrollTop = scrollPosition;
}
