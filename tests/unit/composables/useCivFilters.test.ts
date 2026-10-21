import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useCivFilters } from '@/composables/useCivFilters';
import type { Lang } from '@/i18n/languages';
import type { Civilization } from '@/types';

const civilizations: Civilization[] = [
    { id: 1, name: 'Zulus', tags_id: [6], tier_id: 2 },
    { id: 2, name: 'Égypte', tags_id: [4], tier_id: 1 },
    { id: 3, name: 'Arabia|Arabians', tags_id: [5, 2], tier_id: 1 },
    { id: 4, name: 'Mod civ' },
];

const setup = () => useCivFilters(ref(civilizations), ref<Lang>('fr'));
const ids = (list: Civilization[]) => list.map(civ => civ.id);

describe('useCivFilters', () => {
    it('orders by tier then name, unrated civilizations last', () => {
        const { filtered, groups } = setup();

        expect(ids(filtered.value)).toEqual([3, 2, 1, 4]);
        // Unrated civilizations have no tier section
        expect(groups.value.map(group => [group.tierId, ids(group.civilisations)])).toEqual([
            [1, [3, 2]],
            [2, [1]],
        ]);
    });

    it('orders by name only in alphabetical mode, in a single group', () => {
        const { filtered, groups, groupMode } = setup();

        groupMode.value = 'alpha';

        expect(ids(filtered.value)).toEqual([3, 2, 4, 1]);
        expect(groups.value).toHaveLength(1);
        expect(groups.value[0].tierId).toBeNull();
    });

    it('starts on the requested grouping', () => {
        const { groupMode } = useCivFilters(ref(civilizations), ref<Lang>('fr'), 'alpha');

        expect(groupMode.value).toBe('alpha');
    });

    it('searches on the name', () => {
        const { filtered, searchedText } = setup();

        searchedText.value = 'EGY';

        expect(ids(filtered.value)).toEqual([2]);
    });

    it('keeps civilizations with at least one included category', () => {
        const { filtered, toggleInclude } = setup();

        toggleInclude(6);
        toggleInclude(2);
        expect(ids(filtered.value)).toEqual([3, 1]);

        toggleInclude(6);
        expect(ids(filtered.value)).toEqual([3]);
    });

    it('drops civilizations with an excluded category, unrated ones included', () => {
        const { filtered, toggleExclude } = setup();

        toggleExclude(5);

        expect(ids(filtered.value)).toEqual([2, 1, 4]);
    });

    it('never includes and excludes the same category', () => {
        const { includedTagIds, excludedTagIds, toggleInclude, toggleExclude } = setup();

        toggleInclude(4);
        toggleExclude(4);
        expect(includedTagIds.value).toEqual([]);
        expect(excludedTagIds.value).toEqual([4]);

        toggleInclude(4);
        expect(includedTagIds.value).toEqual([4]);
        expect(excludedTagIds.value).toEqual([]);
    });

    it('combines included and excluded categories', () => {
        const { filtered, toggleInclude, toggleExclude } = setup();

        toggleInclude(2);
        toggleInclude(4);
        toggleExclude(5);

        expect(ids(filtered.value)).toEqual([2]);
    });

    it('keeps every selected tier and drops unrated civilizations', () => {
        const { filtered, selectedTierIds, toggleTier } = setup();

        toggleTier(2);
        toggleTier(1);
        expect(selectedTierIds.value).toEqual([2, 1]);
        expect(ids(filtered.value)).toEqual([3, 2, 1]);

        toggleTier(1);
        expect(ids(filtered.value)).toEqual([1]);
        toggleTier(2);
        expect(filtered.value).toHaveLength(4);
    });

    it('counts the category and tier filters in use, not the search', () => {
        const { activeCount, searchedText, toggleInclude, toggleExclude, toggleTier } = setup();

        searchedText.value = 'a';
        toggleInclude(1);
        toggleExclude(2);
        toggleTier(0);
        toggleTier(3);

        expect(activeCount.value).toBe(4);
    });

    it('does not match the plural part of a name', () => {
        const { filtered, searchedText } = setup();

        searchedText.value = 'arabians';

        expect(filtered.value).toHaveLength(0);
    });

    it('clears the category and tier filters but keeps the search', () => {
        const { filtered, searchedText, activeCount, toggleInclude, toggleTier, clearFilters } =
            setup();
        searchedText.value = 'egy';
        toggleInclude(6);
        toggleTier(2);
        expect(filtered.value).toHaveLength(0);

        clearFilters();

        expect(activeCount.value).toBe(0);
        expect(ids(filtered.value)).toEqual([2]);
    });

    it('resets every filter', () => {
        const { filtered, groups, searchedText, toggleExclude, toggleTier, reset } = setup();
        searchedText.value = 'zzz';
        toggleExclude(1);
        toggleTier(0);
        expect(groups.value).toEqual([]);

        reset();

        expect(searchedText.value).toBe('');
        expect(filtered.value).toHaveLength(4);
    });
});
