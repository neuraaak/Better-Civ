<template>
    <span
        class="tier-badge"
        :class="`tier-${badge.key}`"
        :style="badgeStyle"
        :aria-label="label"
        :title="label"
    >
        <span class="tier-rim"></span>
        <span class="tier-face"></span>
        <span class="tier-letter">{{ badge.letter }}</span>
    </span>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { TierId } from '../../../data/taxonomy';
    import { useAppStore } from '../../../stores/app';
    import { tierBadge } from '../tierDesign';

    const props = withDefaults(
        defineProps<{
            tier_id?: TierId;
            /** Badge edge in px — the design uses 24, 32, 40, 52 and 58. */
            size?: number;
            /** Dims the badge (tier filter chips that are not selected). */
            dimmed?: boolean;
        }>(),
        { tier_id: undefined, size: 40, dimmed: false }
    );

    // Letter sizes taken from the handoff for each badge size it uses.
    const LETTER_SIZES: Record<number, number> = { 24: 11, 32: 13, 40: 16, 52: 20, 58: 24 };

    const store = useAppStore();
    const badge = computed(() => tierBadge(props.tier_id, store.lang));
    const label = computed(() => `Tier ${badge.value.letter} · ${badge.value.rank}`);
    const badgeStyle = computed(() => ({
        '--tier-size': `${props.size}px`,
        '--tier-font': `${LETTER_SIZES[props.size] ?? Math.round(props.size * 0.4)}px`,
        '--tier-shape': badge.value.shape,
        '--tier-face-shape': badge.value.faceShape,
        '--tier-inset': badge.value.inset,
        '--tier-nudge': badge.value.nudge,
        '--tier-rim': badge.value.rim,
        '--tier-face': badge.value.face,
        '--tier-fg': badge.value.fg,
        '--tier-glow': badge.value.glow,
        '--tier-anim': badge.value.anim,
        opacity: props.dimmed ? 0.35 : 1,
    }));
</script>

<style scoped>
    .tier-badge {
        position: relative;
        display: inline-block;
        flex: none;
        width: var(--tier-size);
        height: var(--tier-size);
        vertical-align: middle;
        filter: var(--tier-glow);
        transition: opacity 0.2s ease;
    }
    .tier-rim,
    .tier-face {
        position: absolute;
    }
    .tier-rim {
        inset: 0;
        clip-path: var(--tier-shape);
        background: var(--tier-rim);
        animation: var(--tier-anim);
    }
    .tier-face {
        inset: var(--tier-inset);
        clip-path: var(--tier-face-shape);
        background: var(--tier-face);
    }
    .tier-letter {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: var(--tier-nudge);
        color: var(--tier-fg);
        font: 600 var(--tier-font) / 1 var(--font-heading);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    }
    @media (prefers-reduced-motion: reduce) {
        .tier-rim {
            animation: none;
        }
    }
</style>
