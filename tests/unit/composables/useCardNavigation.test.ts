import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useCardNavigation } from '@/composables/useCardNavigation';
import type { Civilization } from '@/types';

const list = ref<Civilization[]>([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
]);

describe('useCardNavigation', () => {
    it('gives the neighbours of the selection and wraps around', () => {
        const selected = ref<number | null>(1);
        const { index, previous, next } = useCardNavigation(list, selected);

        expect(index.value).toBe(0);
        expect(previous.value?.id).toBe(3);
        expect(next.value?.id).toBe(2);

        selected.value = 3;
        expect(next.value?.id).toBe(1);
    });

    it('steps to the first or last civilization when the selection is hidden', () => {
        const { index, previous, next } = useCardNavigation(list, ref(42));

        expect(index.value).toBe(-1);
        expect(next.value?.id).toBe(1);
        expect(previous.value?.id).toBe(3);
    });

    it('has no neighbours in an empty list', () => {
        const { previous, next } = useCardNavigation(ref([]), ref(1));

        expect(previous.value).toBeNull();
        expect(next.value).toBeNull();
    });
});
