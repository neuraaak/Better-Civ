import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue';
import { DISPLAY_OPTIONS, type GroupMode } from '../data/displayOptions';
import { TIER_IDS, type TagId, type TierId } from '../data/taxonomy';
import { htmlLang, type Lang } from '../i18n/languages';
import type { Civilization } from '../types';
import { searchKey } from '../utils/civName';

// TYPES
// ##############
export type { GroupMode };

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

function toggled<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter(item => item !== value) : [...list, value];
}

/**
 * Search, category and tier filters plus the grid ordering. `filtered` is the
 * order the grid shows, which is also the order the detail panel steps through.
 *
 * Categories are included or excluded: a civilization shows when it has at least
 * one included category and no excluded one. Several tiers can be picked at once.
 */
export function useCivFilters(
    civilizations: MaybeRefOrGetter<Civilization[]>,
    lang: MaybeRefOrGetter<Lang>,
    initialGroupMode: GroupMode = DISPLAY_OPTIONS.defaultGroupMode
) {
    const searchedText = ref('');
    const includedTagIds = ref<TagId[]>([]);
    const excludedTagIds = ref<TagId[]>([]);
    const selectedTierIds = ref<TierId[]>([]);
    const groupMode = ref<GroupMode>(initialGroupMode);

    // Normalized once per list rather than on every keystroke
    const searchKeys = computed(
        () => new Map(toValue(civilizations).map(civ => [civ.id, searchKey(civ.name)]))
    );
    const collator = computed(() => new Intl.Collator(htmlLang(toValue(lang))));

    const filtered = computed(() => {
        const query = searchKey(searchedText.value);
        const included = includedTagIds.value;
        const excluded = excludedTagIds.value;
        const tierIds = selectedTierIds.value;
        const keys = searchKeys.value;
        const compare = collator.value.compare;
        return toValue(civilizations)
            .filter(civ => {
                const tags = civ.tags_id ?? [];
                return (
                    (!included.length || included.some(tagId => tags.includes(tagId))) &&
                    !excluded.some(tagId => tags.includes(tagId)) &&
                    (!tierIds.length ||
                        (civ.tier_id !== undefined && tierIds.includes(civ.tier_id))) &&
                    (!query || keys.get(civ.id)!.includes(query))
                );
            })
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

    /** Number of category and tier filters in use (the search is not counted). */
    const activeCount = computed(
        () =>
            includedTagIds.value.length + excludedTagIds.value.length + selectedTierIds.value.length
    );

    /** A category is either included or excluded, never both. */
    function toggleInclude(tagId: TagId): void {
        includedTagIds.value = toggled(includedTagIds.value, tagId);
        excludedTagIds.value = excludedTagIds.value.filter(id => id !== tagId);
    }

    function toggleExclude(tagId: TagId): void {
        excludedTagIds.value = toggled(excludedTagIds.value, tagId);
        includedTagIds.value = includedTagIds.value.filter(id => id !== tagId);
    }

    function toggleTier(tierId: TierId): void {
        selectedTierIds.value = toggled(selectedTierIds.value, tierId);
    }

    /** Clears the category and tier filters, keeping the search. */
    function clearFilters(): void {
        includedTagIds.value = [];
        excludedTagIds.value = [];
        selectedTierIds.value = [];
    }

    function reset(): void {
        searchedText.value = '';
        clearFilters();
    }

    return {
        searchedText,
        includedTagIds,
        excludedTagIds,
        selectedTierIds,
        groupMode,
        filtered,
        groups,
        activeCount,
        toggleInclude,
        toggleExclude,
        toggleTier,
        clearFilters,
        reset,
    };
}
