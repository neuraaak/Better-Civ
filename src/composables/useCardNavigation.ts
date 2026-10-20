import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type { Civilization } from '../types';

/** Index of the selected civilization in `list` (-1 when hidden) and its cyclic neighbours. */
export function useCardNavigation(
    list: MaybeRefOrGetter<Civilization[]>,
    selectedId: MaybeRefOrGetter<number | null>
) {
    const index = computed(() => toValue(list).findIndex(civ => civ.id === toValue(selectedId)));

    function relative(direction: 1 | -1): Civilization | null {
        const civilizations = toValue(list);
        const count = civilizations.length;
        if (!count) return null;
        // A selection hidden by the filters steps to the first / last visible civilization.
        const current = index.value < 0 ? (direction > 0 ? -1 : 0) : index.value;
        return civilizations[(current + direction + count) % count];
    }

    const previous = computed(() => relative(-1));
    const next = computed(() => relative(1));

    return { index, previous, next };
}
