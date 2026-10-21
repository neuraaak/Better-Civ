<template>
    <span class="civ-tag" :class="`civ-tag-${variant}`" :style="{ '--tag-color': color }">
        <PhIcon :name="icon" class="category-icon" />
        {{ label }}
    </span>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { TagId } from '../../../data/taxonomy';
    import { useMessages } from '../../../i18n/useMessages';
    import PhIcon from '../../icons/PhIcon.vue';
    import { categoryColor, categoryIcon } from '../tierDesign';

    const props = withDefaults(
        defineProps<{
            tag_id: TagId;
            /**
             * `card` sits over the portrait visual, `classic` on the classic card body,
             * `panel` is the larger detail-panel tag.
             */
            variant?: 'card' | 'classic' | 'panel';
        }>(),
        { variant: 'card' }
    );

    const t = useMessages();
    const label = computed(() => t.value.tags[props.tag_id]);
    const color = computed(() => categoryColor(props.tag_id));
    const icon = computed(() => categoryIcon(props.tag_id));
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
    .civ-tag-classic {
        background: var(--color-neutral-900);
    }
    .civ-tag-panel {
        gap: 7px;
        height: 26px;
        padding: 0 10px;
        background: var(--color-neutral-900);
        color: var(--color-neutral-200);
        font-size: 12px;
    }
    .category-icon {
        font-size: 13px;
        color: var(--tag-color);
    }
    .civ-tag-panel .category-icon {
        font-size: 15px;
    }
</style>
