import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAppStore } from '@/stores/app';

describe('useAppStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('starts in French with the detail panel closed', () => {
        const store = useAppStore();

        expect(store.lang).toBe('fr');
        expect(store.selectedCivId).toBeNull();
        expect(store.detailOpen).toBe(false);
    });

    it('changes the language', () => {
        const store = useAppStore();

        store.setLanguage('zh');

        expect(store.lang).toBe('zh');
    });

    it('opens, navigates and closes the detail panel', () => {
        const store = useAppStore();

        store.openDetail(3);
        expect(store.selectedCivId).toBe(3);
        expect(store.detailOpen).toBe(true);

        store.selectCiv(4);
        expect(store.selectedCivId).toBe(4);
        expect(store.detailOpen).toBe(true);

        store.closeDetail();
        expect(store.detailOpen).toBe(false);
        // Kept so the panel content stays during the closing animation
        expect(store.selectedCivId).toBe(4);
    });
});
