import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue';
import { TIER_IDS, type TagId, type TierId } from '../data/taxonomy';
import { htmlLang, type Lang } from '../i18n/languages';
import type { Civilization } from '../types';
import { searchKey } from '../utils/civName';

// TYPES
// ##############
export type GroupMode = 'tier' | 'alpha';

export interface CivilizationGroup {
    key: string;
    /** Tier of the section, `null` for the single alphabetical group. */
    tierId: TierId | null;
    civilisations: Civilization[];
}

// FUNCTIONS
// ##############
/** Unrated civilizations sort after every tier. */
function tierRank(civ: Civilization): number {
    return civ.tier_id ?? TIER_IDS.length;
}

/**
 * Search, category and tier filters plus the grid ordering. `filtered` is the
 * order the grid shows, which is also the order the detail panel steps through.
 */
export function useCivFilters(
    civilizations: MaybeRefOrGetter<Civilization[]>,
    lang: MaybeRefOrGetter<Lang>
) {
    const searchedText = ref('');
    const selectedTagId = ref<TagId | null>(null);
    const selectedTierId = ref<TierId | null>(null);
    const groupMode = ref<GroupMode>('tier');

    // Normalized once per list rather than on every keystroke
    const searchKeys = computed(
        () => new Map(toValue(civilizations).map(civ => [civ.id, searchKey(civ.name)]))
    );
    const collator = computed(() => new Intl.Collator(htmlLang(toValue(lang))));

    const filtered = computed(() => {
        const query = searchKey(searchedText.value);
        const tagId = selectedTagId.value;
        const tierId = selectedTierId.value;
        const keys = searchKeys.value;
        const compare = collator.value.compare;
        return toValue(civilizations)
            .filter(
                civ =>
                    (tagId === null || (civ.tags_id ?? []).includes(tagId)) &&
                    (tierId === null || civ.tier_id === tierId) &&
                    (!query || keys.get(civ.id)!.includes(query))
            )
            .sort(
                (left, right) =>
                    (groupMode.value === 'tier' ? tierRank(left) - tierRank(right) : 0) ||
                    compare(left.name, right.name)
            );
    });

    const groups = computed<CivilizationGroup[]>(() => {
        const visible = filtered.value;
        if (!visible.length) return [];
        if (groupMode.value === 'alpha')
            return [{ key: 'all', tierId: null, civilisations: visible }];
        // `visible` is sorted by tier, so each tier is one contiguous run
        const byTier = new Map<TierId, Civilization[]>();
        for (const civ of visible) {
            if (civ.tier_id === undefined) continue;
            const run = byTier.get(civ.tier_id);
            if (run) run.push(civ);
            else byTier.set(civ.tier_id, [civ]);
        }
        return [...byTier].map(([tierId, civilisations]) => ({
            key: `tier-${tierId}`,
            tierId,
            civilisations,
        }));
    });

    function toggleTier(tierId: TierId): void {
        selectedTierId.value = selectedTierId.value === tierId ? null : tierId;
    }

    function reset(): void {
        searchedText.value = '';
        selectedTagId.value = null;
        selectedTierId.value = null;
    }

    return {
        searchedText,
        selectedTagId,
        selectedTierId,
        groupMode,
        filtered,
        groups,
        toggleTier,
        reset,
    };
}
