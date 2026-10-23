<template>
    <span class="civ-medallion" :style="sizes">
        <span class="medallion-ring"></span>
        <span class="medallion-face">
            <PhIcon v-if="!icon" name="flag-banner" class="medallion-fallback" />
            <img v-else :src="icon" alt="" />
            <span class="medallion-gloss"></span>
        </span>
        <!-- Wrapper, so this drop shadow stacks with the badge's own tier glow -->
        <span class="medallion-badge">
            <CivTierComponent :tier_id="tier_id" :size="badge_size" />
        </span>
    </span>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { TierId } from '../../../data/taxonomy';
    import { useAppStore } from '../../../stores/app';
    import PhIcon from '../../icons/PhIcon.vue';
    import { tierBadge } from '../tierDesign';
    import CivTierComponent from './CivTierComponent.vue';

    const props = withDefaults(
        defineProps<{
            /** Civilization emblem; a flag glyph stands in when the database has none. */
            icon?: string;
            tier_id?: TierId;
            /** Medallion edge in px — the design uses 44, 62 and 96. */
            size?: number;
            /** Tier badge edge in px, pinned to the bottom right of the medallion. */
            badge_size?: number;
        }>(),
        { icon: '', tier_id: undefined, size: 62, badge_size: 30 }
    );

    const store = useAppStore();
    const badge = computed(() => tierBadge(props.tier_id, store.lang));
    const sizes = computed(() => ({
        '--medallion-size': `${props.size}px`,
        '--badge-size': `${props.badge_size}px`,
        '--tier-frame': badge.value.frame,
        '--tier-label': badge.value.label,
    }));
</script>

<style scoped>
    .civ-medallion {
        position: relative;
        display: inline-block;
        width: var(--medallion-size);
        height: var(--medallion-size);
        flex: none;
    }
    .medallion-ring,
    .medallion-face,
    .medallion-gloss {
        position: absolute;
        border-radius: 50%;
    }
    /* Dashed outer ring, in the tier colour */
    .medallion-ring {
        inset: -6px;
        border: 1px dashed var(--tier-frame);
    }
    .medallion-face {
        display: grid;
        inset: 0;
        place-items: center;
        overflow: hidden;
        background: radial-gradient(circle at 40% 30%, var(--color-neutral-800), var(--color-bg));
        box-shadow:
            0 0 0 1.5px var(--tier-label),
            0 0 22px var(--tier-frame);
    }
    .medallion-face img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .medallion-fallback {
        /* Scaled off the medallion, as the handoff sizes it at 62 and 96px */
        color: var(--color-neutral-600);
        font-size: calc(var(--medallion-size) * 0.38);
    }
    .medallion-gloss {
        inset: 0;
        background: radial-gradient(
            circle at 35% 25%,
            color-mix(in srgb, var(--color-text) 14%, transparent),
            transparent 45%
        );
    }
    .medallion-badge {
        position: absolute;
        right: calc(var(--badge-size) * -0.35);
        bottom: calc(var(--badge-size) * -0.2);
        display: flex;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    }
</style>
