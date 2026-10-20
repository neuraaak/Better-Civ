import { computed, type ComputedRef } from 'vue';
import { useAppStore } from '../stores/app';
import { messages, type Messages } from './messages';

/** Messages of the current language, reactive to language changes. */
export function useMessages(): ComputedRef<Messages> {
    const store = useAppStore();
    return computed(() => messages(store.lang));
}
