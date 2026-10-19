<template>
    <span class="civ-tag" :style="{ '--tag-color': color }">
        <span class="category-dot"></span>
        {{ label }}
    </span>
</template>

<script setup>
    import { computed } from 'vue';
    import { translationStore } from '../../../stores/index';

    const props = defineProps({
        tag_id: Number,
    });

    const store = translationStore();
    const label = computed(() => store.getTagPropertyById(props.tag_id, 'label') || 'Catégorie');
    const color = computed(
        () =>
            [
                'oklch(.76 .03 260)',
                'oklch(.74 .11 310)',
                'oklch(.8 .1 85)',
                'oklch(.74 .1 230)',
                'oklch(.7 .13 25)',
                'oklch(.74 .11 155)',
                'oklch(.74 .11 55)',
            ][props.tag_id] || 'oklch(.65 .02 260)'
    );
</script>

<style scoped>
    .civ-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.38rem;
        min-height: 1.4rem;
        padding: 0 0.5rem;
        border: 1px solid #3f424d;
        border-radius: 0.35rem;
        color: #cfd3e5;
        background: rgb(41 43 49 / 86%);
        font-size: 0.68rem;
        line-height: 1;
        white-space: nowrap;
    }
    .category-dot {
        width: 0.35rem;
        height: 0.35rem;
        border-radius: 50%;
        background: var(--tag-color);
        box-shadow: 0 0 0.45rem color-mix(in srgb, var(--tag-color) 60%, transparent);
    }
</style>
