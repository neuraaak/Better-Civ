<template>
    <span class="civ-tag" :class="`civ-tag-${variant}`" :style="{ '--tag-color': color }">
        <span class="category-dot"></span>
        {{ label }}
    </span>
</template>

<script setup>
    import { computed } from 'vue';
    import { translationStore } from '../../../stores/index';
    import { categoryColor } from '../tierDesign';

    const props = defineProps({
        tag_id: Number,
        /** `card` sits over the portrait visual, `panel` is the larger detail-panel tag. */
        variant: { type: String, default: 'card' },
    });

    const store = translationStore();
    const label = computed(() => store.getTagPropertyById(props.tag_id, 'label') || 'Catégorie');
    const color = computed(() => categoryColor(props.tag_id));
</script>

<style scoped>
    .civ-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 22px;
        padding: 0 8px;
        border-radius: 6px;
        color: var(--color-neutral-300);
        font-size: 11px;
        line-height: 1;
        white-space: nowrap;
    }
    .civ-tag-card {
        background: color-mix(in srgb, var(--color-neutral-900) 80%, transparent);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
    }
    .civ-tag-panel {
        gap: 7px;
        height: 26px;
        padding: 0 10px;
        background: var(--color-neutral-900);
        color: var(--color-neutral-200);
        font-size: 12px;
    }
    .category-dot {
        width: 6px;
        height: 6px;
        flex: none;
        border-radius: 50%;
        background: var(--tag-color);
    }
    .civ-tag-panel .category-dot {
        width: 7px;
        height: 7px;
    }
</style>
