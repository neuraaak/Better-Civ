<template>
    <div class="active-filters">
        <span
            v-for="pill in pills"
            :key="pill.key"
            data-testid="filter-pill"
            class="filter-pill"
            :class="{ excluded: pill.kind === 'exclude' }"
        >
            <span class="pill-kind">{{ pill.kindLabel }}</span>
            <CivTierComponent v-if="pill.tierId !== undefined" :tier_id="pill.tierId" :size="18" />
            <PhIcon
                v-else-if="pill.tagId !== undefined"
                :name="categoryIcon(pill.tagId)"
                class="pill-icon"
                :style="{ color: categoryColor(pill.tagId) }"
            />
            <span class="pill-label">{{ pill.label }}</span>
            <button
                type="button"
                class="pill-remove"
                :aria-label="ui.removeFilter.replace('{name}', pill.label)"
                @click="pill.remove"
            >
                <PhIcon name="x" />
            </button>
        </span>
        <button type="button" class="clear-all" @click="$emit('clear')">{{ ui.clearAll }}</button>
    </div>
</template>

<script setup lang="ts">
    /** Removable pills for the category and tier filters in use, under the filter bar. */
    import { computed } from 'vue';
    import { TIER_IDS, type TagId, type TierId } from '../../data/taxonomy';
    import { useMessages } from '../../i18n/useMessages';
    import { useAppStore } from '../../stores/app';
    import CivTierComponent from '../civilisations/subcomponents/CivTierComponent.vue';
    import { categoryColor, categoryIcon, tierBadge } from '../civilisations/tierDesign';
    import PhIcon from '../icons/PhIcon.vue';

    interface Pill {
        key: string;
        kind: 'include' | 'exclude' | 'tier';
        kindLabel: string;
        label: string;
        tagId?: TagId;
        tierId?: TierId;
        remove: () => void;
    }

    const props = defineProps<{
        includedTagIds: TagId[];
        excludedTagIds: TagId[];
        selectedTierIds: TierId[];
    }>();

    const emit = defineEmits<{
        'toggle-include': [tagId: TagId];
        'toggle-exclude': [tagId: TagId];
        'toggle-tier': [tierId: TierId];
        clear: [];
    }>();

    const store = useAppStore();
    const t = useMessages();
    const ui = computed(() => t.value.ui);

    const pills = computed<Pill[]>(() => [
        ...props.includedTagIds.map(tagId => ({
            key: `include-${tagId}`,
            kind: 'include' as const,
            kindLabel: ui.value.include,
            label: t.value.tags[tagId],
            tagId,
            remove: () => emit('toggle-include', tagId),
        })),
        ...props.excludedTagIds.map(tagId => ({
            key: `exclude-${tagId}`,
            kind: 'exclude' as const,
            kindLabel: ui.value.exclude,
            label: t.value.tags[tagId],
            tagId,
            remove: () => emit('toggle-exclude', tagId),
        })),
        // Tiers keep the S → D order whatever the order they were picked in
        ...TIER_IDS.filter(tierId => props.selectedTierIds.includes(tierId)).map(tierId => ({
            key: `tier-${tierId}`,
            kind: 'tier' as const,
            kindLabel: ui.value.tier,
            label: tierBadge(tierId, store.lang).rank,
            tierId,
            remove: () => emit('toggle-tier', tierId),
        })),
    ]);
</script>

<style scoped>
    .active-filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
    }
    button {
        border: 0;
        padding: 0;
        color: inherit;
        background: transparent;
        font: inherit;
        cursor: pointer;
    }
    .filter-pill {
        display: flex;
        align-items: center;
        gap: 7px;
        height: 28px;
        padding: 0 6px 0 10px;
        border-radius: 14px;
        color: var(--color-neutral-200);
        background: var(--color-neutral-900);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
        font-size: 12px;
        font-weight: 500;
        line-height: 1;
    }
    .pill-kind {
        color: var(--color-neutral-500);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .pill-icon {
        font-size: 14px;
    }
    .excluded .pill-label {
        text-decoration: line-through;
    }
    .pill-remove {
        display: flex;
        width: 18px;
        height: 18px;
        align-items: center;
        justify-content: center;
        border-radius: 9px;
        color: var(--color-neutral-500);
        font-size: 11px;
    }
    .pill-remove:hover {
        color: var(--color-text);
        background: var(--color-neutral-800);
    }
    .clear-all {
        display: flex;
        align-items: center;
        height: 28px;
        padding: 0 8px;
        color: var(--color-neutral-500);
        font-size: 12px;
    }
    .clear-all:hover {
        color: var(--color-accent-300);
    }
</style>
