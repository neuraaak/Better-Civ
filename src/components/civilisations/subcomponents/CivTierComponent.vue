<template>
    <span
        class="tier-badge"
        :class="`tier-${badge.key}`"
        :style="badgeStyle"
        :aria-label="label"
        :title="label"
    >
        <svg v-if="badge.laurel" class="tier-laurel" viewBox="-50 -50 100 100" aria-hidden="true">
            <ellipse
                v-for="(leaf, index) in LAUREL_LEAVES"
                :key="index"
                cx="0"
                cy="0"
                rx="6"
                ry="2.3"
                :transform="leaf"
            />
        </svg>
        <span class="tier-rim"></span>
        <span v-if="badge.ornament !== 'none'" class="tier-ornament" :class="badge.ornament"></span>
        <span class="tier-face"></span>
        <span class="tier-letter">{{ badge.letter }}</span>
    </span>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { TierId } from '../../../data/taxonomy';
    import { useAppStore } from '../../../stores/app';
    import { LAUREL_LEAVES, tierBadge } from '../tierDesign';

    const props = withDefaults(
        defineProps<{
            tier_id?: TierId;
            /** Badge edge in px — the design uses 18, 30, 32, 34, 40, 52 and 58. */
            size?: number;
            /** Dims the badge (tier filter tiles that are not selected). */
            dimmed?: boolean;
        }>(),
        { tier_id: undefined, size: 40, dimmed: false }
    );

    // Letter sizes taken from the handoff for each badge size it uses.
    const LETTER_SIZES: Record<number, number> = {
        18: 9,
        24: 11,
        30: 12,
        32: 13,
        34: 14,
        40: 16,
        52: 20,
        58: 24,
    };

    const store = useAppStore();
    const badge = computed(() => tierBadge(props.tier_id, store.lang));
    const label = computed(() => `Tier ${badge.value.letter} · ${badge.value.rank}`);
    const badgeStyle = computed(() => ({
        '--tier-size': `${props.size}px`,
        '--tier-font': `${LETTER_SIZES[props.size] ?? Math.round(props.size * 0.4)}px`,
        '--tier-rim': badge.value.rim,
        '--tier-face': badge.value.face,
        '--tier-fg': badge.value.fg,
        '--tier-orn': badge.value.orn,
        '--tier-leaf': badge.value.leaf,
        '--tier-glow': badge.value.glow,
        '--tier-anim': badge.value.anim,
        opacity: props.dimmed ? 0.4 : 1,
    }));
</script>

<style scoped>
    /* Every tier is the same struck coin; the metal, the ornament band and the
       laurel of the legend tier are what tell them apart. */
    .tier-badge {
        position: relative;
        display: inline-block;
        width: var(--tier-size);
        height: var(--tier-size);
        flex: none;
        vertical-align: middle;
        filter: var(--tier-glow);
        transition: opacity 0.2s ease;
    }
    .tier-rim,
    .tier-ornament,
    .tier-face {
        position: absolute;
        border-radius: 50%;
    }
    .tier-rim {
        inset: 0;
        background: var(--tier-rim);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-text) 18%, transparent);
    }
    /* Band struck between the rim and the face, masked to a thin annulus */
    .tier-ornament {
        inset: 6%;
    }
    .tier-ornament.key {
        background: repeating-conic-gradient(
            var(--tier-orn) 0 6deg,
            transparent 6deg 8deg,
            var(--tier-orn) 8deg 9.5deg,
            transparent 9.5deg 15deg
        );
        -webkit-mask-image: radial-gradient(circle, transparent 64%, #000 65% 76%, transparent 77%);
        mask-image: radial-gradient(circle, transparent 64%, #000 65% 76%, transparent 77%);
        animation: var(--tier-anim);
    }
    .tier-ornament.beads {
        background: repeating-conic-gradient(var(--tier-orn) 0 4deg, transparent 4deg 12deg);
        -webkit-mask-image: radial-gradient(circle, transparent 66%, #000 67% 75%, transparent 76%);
        mask-image: radial-gradient(circle, transparent 66%, #000 67% 75%, transparent 76%);
    }
    .tier-ornament.ring {
        inset: 10%;
        box-shadow: inset 0 0 0 1px var(--tier-orn);
    }
    .tier-face {
        inset: 19%;
        background: var(--tier-face);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.55);
    }
    .tier-letter {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--tier-fg);
        font: 600 var(--tier-font) / 1 var(--font-display);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    }
    .tier-laurel {
        position: absolute;
        top: -16%;
        left: -16%;
        width: 132%;
        height: 132%;
        overflow: visible;
        fill: var(--tier-leaf);
    }
    @media (prefers-reduced-motion: reduce) {
        .tier-ornament.key {
            animation: none;
        }
    }
</style>
