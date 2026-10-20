<template>
    <article
        class="portrait-card"
        :class="{ selected }"
        role="button"
        tabindex="0"
        :style="tierPalette"
        :aria-label="t.ui.openDetails.replace('{name}', displayName)"
        :aria-pressed="selected"
        @click="openDetails"
        @keydown.enter.prevent="openDetails"
        @keydown.space.prevent="openDetails"
    >
        <img class="card-visual" alt="" :src="imagePath" loading="lazy" decoding="async" />
        <div class="card-hatch"></div>
        <div class="card-gradient"></div>
        <div class="tier-frame"></div>
        <div class="tier-accent"></div>

        <CivTierComponent :tier_id="tier_id" :size="40" class="card-tier-badge" />

        <div class="card-footer">
            <h2>{{ displayName }}</h2>
            <div v-if="tags_id?.length" class="card-tags">
                <CivTagComponent v-for="tag_id in tags_id" :key="tag_id" :tag_id="tag_id" />
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { TagId, TierId } from '../../data/taxonomy';
    import { useMessages } from '../../i18n/useMessages';
    import { useAppStore } from '../../stores/app';
    import { cleanName } from '../../utils/civName';
    import CivTagComponent from './subcomponents/CivTagComponent.vue';
    import CivTierComponent from './subcomponents/CivTierComponent.vue';
    import { tierBadge } from './tierDesign';

    const props = withDefaults(
        defineProps<{
            id: number;
            name: string;
            tags_id?: TagId[];
            tier_id?: TierId;
            selected?: boolean;
        }>(),
        { tags_id: () => [], tier_id: undefined, selected: false }
    );

    const store = useAppStore();
    const t = useMessages();
    const displayName = computed(() => cleanName(props.name));
    const imagePath = computed(() => '/img/card-cover.webp');
    const tierPalette = computed(() => {
        const badge = tierBadge(props.tier_id);
        return { '--tier-line': badge.line, '--tier-frame': badge.frame };
    });

    function openDetails() {
        store.openDetail(props.id);
    }
</script>

<style scoped>
    .portrait-card {
        position: relative;
        aspect-ratio: 3 / 4;
        isolation: isolate;
        overflow: hidden;
        border-radius: var(--radius-lg);
        background: var(--color-surface);
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }
    .portrait-card.selected {
        box-shadow:
            0 0 0 1.5px var(--color-accent),
            0 0 30px color-mix(in srgb, var(--color-accent) 35%, transparent);
    }
    .portrait-card:hover {
        transform: translateY(-4px);
        box-shadow:
            0 0 0 1px var(--color-accent),
            0 14px 36px rgba(0, 0, 0, 0.55),
            0 0 32px color-mix(in srgb, var(--color-accent) 28%, transparent);
    }

    .card-visual,
    .card-hatch,
    .card-gradient,
    .tier-frame,
    .tier-accent {
        position: absolute;
        pointer-events: none;
    }
    .card-visual {
        z-index: -2;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.52;
        filter: saturate(0.7) contrast(1.05);
    }
    .card-hatch {
        z-index: -1;
        inset: 0;
        background: repeating-linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-text) 4%, transparent) 0 8px,
            transparent 8px 16px
        );
    }
    .card-gradient {
        inset: auto 0 0 0;
        height: 62%;
        background: linear-gradient(
            to bottom,
            transparent,
            color-mix(in srgb, var(--color-bg) 85%, transparent) 55%,
            var(--color-bg)
        );
    }
    .tier-frame {
        inset: 7px;
        border-radius: 10px;
        box-shadow: inset 0 0 0 1px var(--tier-frame);
    }
    .tier-accent {
        top: 7px;
        left: 50%;
        width: 36%;
        height: 2px;
        border-radius: 2px;
        background: var(--tier-line);
        transform: translateX(-50%);
    }
    .card-tier-badge {
        position: absolute;
        top: 14px;
        left: 14px;
    }
    .card-footer {
        position: absolute;
        right: 16px;
        bottom: 16px;
        left: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    h2 {
        margin: 0;
        color: var(--color-text);
        font-size: 21px;
        font-weight: 500;
        letter-spacing: -0.015em;
        line-height: 1.1;
    }
    .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
</style>
