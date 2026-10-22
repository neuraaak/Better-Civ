import { useEventListener } from '@vueuse/core';
import { ref, toValue, watch, type MaybeRefOrGetter } from 'vue';

export interface HideOnScrollOptions {
    /** Scroll depth (px) above which the bar always shows. */
    offset?: number;
    /** Scroll distance (px) ignored before the direction counts, against jitter. */
    tolerance?: number;
}

/** Hides a sticky bar while the page scrolls down and brings it back on the way up. */
export function useHideOnScroll(
    enabled: MaybeRefOrGetter<boolean>,
    { offset = 160, tolerance = 6 }: HideOnScrollOptions = {}
) {
    const hidden = ref(false);
    let lastY = 0;

    function onScroll() {
        const y = window.scrollY;
        if (!toValue(enabled) || y <= offset) {
            hidden.value = false;
        } else if (Math.abs(y - lastY) < tolerance) {
            // Small moves add up until they pass the tolerance
            return;
        } else {
            hidden.value = y > lastY;
        }
        lastY = y;
    }

    useEventListener(window, 'scroll', onScroll, { passive: true });
    watch(
        () => toValue(enabled),
        on => {
            if (!on) hidden.value = false;
        }
    );

    return { hidden };
}
