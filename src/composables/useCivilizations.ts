import { onScopeDispose, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { fetchCivilizations } from '../api/civDb';
import { withRatings } from '../data/civRatings';
import type { Lang } from '../i18n/languages';
import type { Civilization } from '../types';

// TYPES
// ##############
export type LoadStatus = 'loading' | 'error' | 'ready';

// CONSTANTS
// ##############
/** Per-language results, so switching back to a language does not refetch. */
const cache = new Map<Lang, Civilization[]>();

// FUNCTIONS
// ##############
export function clearCivilizationsCache(): void {
    cache.clear();
}

/**
 * Loads the rated civilization list for `lang` and reloads it when the language
 * changes. A pending request is aborted as soon as a newer one starts, so a slow
 * response can never overwrite the current language.
 */
export function useCivilizations(lang: MaybeRefOrGetter<Lang>) {
    const civilizations = shallowRef<Civilization[]>([]);
    const status = ref<LoadStatus>('loading');
    let controller: AbortController | null = null;

    async function load(force = false): Promise<void> {
        const current = toValue(lang);
        controller?.abort();
        controller = null;

        const cached = cache.get(current);
        if (cached && !force) {
            civilizations.value = cached;
            status.value = 'ready';
            return;
        }

        const request = new AbortController();
        controller = request;
        status.value = 'loading';
        try {
            const result = withRatings(await fetchCivilizations(current, request.signal));
            cache.set(current, result);
            if (request.signal.aborted) return;
            civilizations.value = result;
            status.value = 'ready';
        } catch (error) {
            if (request.signal.aborted) return;
            console.error('Failed to load civilizations:', error);
            // Do not leave the previous language's list on screen behind the error
            civilizations.value = [];
            status.value = 'error';
        }
    }

    watch(
        () => toValue(lang),
        () => load(),
        { immediate: true }
    );
    onScopeDispose(() => controller?.abort());

    return { civilizations, status, retry: () => load(true) };
}
