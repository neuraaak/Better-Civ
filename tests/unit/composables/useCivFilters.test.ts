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

    it('combines search, category and tier filters', () => {
        const { filtered, searchedText, selectedTagId, toggleTier } = setup();

        searchedText.value = 'EGY';
        expect(ids(filtered.value)).toEqual([2]);

        searchedText.value = '';
        selectedTagId.value = 2;
        expect(ids(filtered.value)).toEqual([3]);

        selectedTagId.value = null;
        toggleTier(2);
        expect(ids(filtered.value)).toEqual([1]);
        toggleTier(2);
        expect(filtered.value).toHaveLength(4);
    });

    it('does not match the plural part of a name', () => {
        const { filtered, searchedText } = setup();

        searchedText.value = 'arabians';

        expect(filtered.value).toHaveLength(0);
    });

    it('resets every filter', () => {
        const { filtered, groups, searchedText, selectedTagId, selectedTierId, reset } = setup();
        searchedText.value = 'zzz';
        selectedTagId.value = 1;
        selectedTierId.value = 0;
        expect(groups.value).toEqual([]);

        reset();

        expect(filtered.value).toHaveLength(4);
    });
});
