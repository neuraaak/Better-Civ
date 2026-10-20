/**
 * Mutable application state: current language and detail-panel selection.
 * Static reference data lives in src/data and translations in src/i18n.
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DEFAULT_LANG, type Lang } from '../i18n/languages';

export const useAppStore = defineStore('app', () => {
    const lang = ref<Lang>(DEFAULT_LANG);
    /** Civilization shown in the detail panel; kept after closing for the exit animation. */
    const selectedCivId = ref<number | null>(null);
    const detailOpen = ref(false);

    function setLanguage(next: Lang): void {
        lang.value = next;
    }
    function openDetail(civId: number): void {
        selectedCivId.value = civId;
        detailOpen.value = true;
    }
    function selectCiv(civId: number): void {
        selectedCivId.value = civId;
    }
    function closeDetail(): void {
        detailOpen.value = false;
    }

    return { lang, selectedCivId, detailOpen, setLanguage, openDetail, selectCiv, closeDetail };
});
