import { afterEach, describe, expect, it } from 'vitest';
import { effectScope, nextTick, ref, type EffectScope } from 'vue';
import { useHideOnScroll } from '@/composables/useHideOnScroll';

describe('useHideOnScroll', () => {
    let scope: EffectScope | undefined;

    afterEach(() => {
        scope?.stop();
        scrollTo(0);
    });

    function scrollTo(y: number) {
        Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
        window.dispatchEvent(new Event('scroll'));
    }

    function setup(enabled = ref(true)) {
        scope = effectScope();
        return { enabled, ...scope.run(() => useHideOnScroll(enabled))! };
    }

    it('hides on the way down past the offset and shows on the way up', () => {
        const { hidden } = setup();

        scrollTo(100);
        expect(hidden.value).toBe(false);
        scrollTo(400);
        expect(hidden.value).toBe(true);
        scrollTo(300);
        expect(hidden.value).toBe(false);
    });

    it('ignores moves smaller than the tolerance', () => {
        const { hidden } = setup();

        scrollTo(400);
        expect(hidden.value).toBe(true);
        scrollTo(397);
        expect(hidden.value).toBe(true);
    });

    it('always shows near the top of the page', () => {
        const { hidden } = setup();

        scrollTo(400);
        scrollTo(500);
        expect(hidden.value).toBe(true);
        scrollTo(120);
        expect(hidden.value).toBe(false);
    });

    it('stays visible while disabled and shows again when disabled', async () => {
        const { hidden, enabled } = setup();

        scrollTo(400);
        expect(hidden.value).toBe(true);
        enabled.value = false;
        await nextTick();
        expect(hidden.value).toBe(false);
        scrollTo(800);
        expect(hidden.value).toBe(false);
    });
});
