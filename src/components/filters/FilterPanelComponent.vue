<template>
    <section
        :id="id"
        class="filter-panel"
        :class="{ open }"
        :aria-label="ui.filters"
        :aria-hidden="!open"
        :inert="!open"
    >
        <section class="filter-group">
            <header class="filter-group-heading">
                <h2>{{ ui.category }}</h2>
                <p>{{ ui.categoryHint }}</p>
            </header>
            <div class="category-tiles">
                <div
                    v-for="tile in categoryTiles"
                    :key="tile.tagId"
                    data-testid="category-tile"
                    class="category-tile"
                    :class="{ included: tile.included, excluded: tile.excluded }"
                    :style="{ '--tag-color': tile.color }"
                >
                    <!-- Pointer shortcut for "+": keyboard users reach the same action on it -->
                    <button
                        type="button"
                        class="category-tile-main"
                        tabindex="-1"
                        @click="$emit('toggle-include', tile.tagId)"
                    >
                        <span class="category-tile-icon"><PhIcon :name="tile.icon" /></span>
                        <span class="category-tile-text">
                            <span class="category-tile-label">{{ tile.label }}</span>
                            <span class="filter-count">{{ tile.count }}</span>
                        </span>
                    </button>
                    <span class="category-tile-actions">
                        <button
                            type="button"
                            class="include-button"
                            :title="ui.include"
                            :aria-label="`${ui.include} · ${tile.label}`"
                            :aria-pressed="tile.included"
                            @click="$emit('toggle-include', tile.tagId)"
                        >
                            <PhIcon name="plus" />
                        </button>
                        <button
                            type="button"
                            class="exclude-button"
                            :title="ui.exclude"
                            :aria-label="`${ui.exclude} · ${tile.label}`"
                            :aria-pressed="tile.excluded"
                            @click="$emit('toggle-exclude', tile.tagId)"
                        >
                            <PhIcon name="minus" />
                        </button>
                    </span>
                </div>
            </div>
        </section>

        <section class="filter-group">
            <header class="filter-group-heading">
                <h2>{{ ui.tier }}</h2>
                <p>{{ ui.tierHint }}</p>
            </header>
            <div class="tier-tiles">
                <button
                    v-for="tile in tierTiles"
                    :key="tile.tierId"
                    type="button"
                    data-testid="tier-tile"
                    class="tier-tile"
                    :class="{ selected: tile.selected }"
                    :aria-pressed="tile.selected"
                    @click="$emit('toggle-tier', tile.tierId)"
                >
                    <CivTierComponent :tier_id="tile.tierId" :size="34" :dimmed="tile.dimmed" />
                    <span v-if="tile.selected" class="tier-check" aria-hidden="true">
                        <PhIcon name="check" />
                    </span>
                    <span class="tier-tile-rank" :style="{ color: tile.labelColor }">{{
                        tile.rank
                    }}</span>
                    <span class="filter-count">{{ tile.count }}</span>
                </button>
            </div>
        </section>

        <footer class="filter-panel-footer">
            <button type="button" class="filter-reset" @click="$emit('clear')">
                <PhIcon name="arrow-counter-clockwise" />{{ ui.resetShort }}
            </button>
            <button type="button" class="filter-apply" @click="$emit('close')">
                {{ ui.showResults.replace('{count}', resultLabel) }}
            </button>
        </footer>
    </section>
</template>

<script setup lang="ts">
    /**
     * Filter panel opened from the "Filtres" button: category tiles that can be
     * included (+) or excluded (−), and tier tiles that can be picked together.
     */
    import { computed } from 'vue';
    import { TAG_IDS, TIER_IDS, type TagId, type TierId } from '../../data/taxonomy';
    import { useMessages } from '../../i18n/useMessages';
    import { useAppStore } from '../../stores/app';
    import type { Civilization } from '../../types';
    import CivTierComponent from '../civilisations/subcomponents/CivTierComponent.vue';
    import { categoryColor, categoryIcon, tierBadge, toRoman } from '../civilisations/tierDesign';
    import PhIcon from '../icons/PhIcon.vue';

    const props = defineProps<{
        id: string;
        open: boolean;
        /** Every loaded civilization: the tile counts ignore the active filters. */
        civilisations: Civilization[];
        includedTagIds: TagId[];
        excludedTagIds: TagId[];
        selectedTierIds: TierId[];
        /** "12 résultats", shown on the closing button. */
        resultLabel: string;
    }>();

    defineEmits<{
        'toggle-include': [tagId: TagId];
        'toggle-exclude': [tagId: TagId];
        'toggle-tier': [tierId: TierId];
        clear: [];
        close: [];
    }>();

    const store = useAppStore();
    const t = useMessages();
    const ui = computed(() => t.value.ui);

    /** Roman count shown on a tile, a dash when no civilization matches. */
    function romanCount(total: number): string {
        return toRoman(total) || '—';
    }

    const categoryTiles = computed(() =>
        TAG_IDS.map(tagId => ({
            tagId,
            label: t.value.tags[tagId],
            icon: categoryIcon(tagId),
            color: categoryColor(tagId),
            count: romanCount(
                props.civilisations.filter(civ => (civ.tags_id ?? []).includes(tagId)).length
            ),
            included: props.includedTagIds.includes(tagId),
            excluded: props.excludedTagIds.includes(tagId),
        }))
    );

    const tierTiles = computed(() =>
        TIER_IDS.map(tierId => {
            const badge = tierBadge(tierId, store.lang);
            const selected = props.selectedTierIds.includes(tierId);
            return {
                tierId,
                rank: badge.rank,
                labelColor: badge.label,
                count: romanCount(props.civilisations.filter(civ => civ.tier_id === tierId).length),
                selected,
                dimmed: props.selectedTierIds.length > 0 && !selected,
            };
        })
    );
</script>

<style scoped>
    .filter-panel {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        width: min(640px, 100%);
        border-radius: var(--radius-lg);
        background: var(--color-surface);
        box-shadow:
            var(--shadow-lg),
            0 0 0 1px var(--color-neutral-800),
            0 0 40px color-mix(in srgb, var(--color-accent) 12%, transparent);
        opacity: 0;
        pointer-events: none;
        transform: translateY(-6px);
        transition:
            opacity 0.18s,
            transform 0.18s;
    }
    .filter-panel.open {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
    }
    button {
        border: 0;
        padding: 0;
        color: inherit;
        background: transparent;
        font: inherit;
        cursor: pointer;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 16px;
    }
    .filter-group:first-child {
        padding-bottom: 4px;
    }
    .filter-group-heading {
        display: flex;
        align-items: baseline;
        gap: 10px;
    }
    .filter-group-heading h2 {
        margin: 0;
        color: var(--color-neutral-500);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .filter-group-heading p {
        margin: 0;
        color: var(--color-neutral-500);
        font-size: 11px;
    }
    .filter-count {
        color: var(--color-neutral-500);
        font: 500 10px/1 var(--font-mono);
    }

    /* — category tiles — */
    .category-tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 6px;
    }
    .category-tile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 8px 10px 0;
        border-radius: var(--radius-md);
    }
    /* Spreads over the tile's vertical padding so the whole tile stays clickable */
    .category-tile-main {
        display: flex;
        flex: 1;
        align-items: center;
        align-self: stretch;
        gap: 10px;
        min-width: 0;
        margin-block: -10px;
        padding: 10px 0 10px 10px;
        text-align: left;
    }
    .category-tile:hover {
        background: var(--color-neutral-800);
    }
    .category-tile.included,
    .category-tile.excluded {
        background: var(--color-neutral-800);
    }
    .category-tile.included {
        box-shadow:
            inset 0 0 0 1px var(--color-accent),
            0 0 16px color-mix(in srgb, var(--color-accent) 20%, transparent);
    }
    .category-tile.excluded {
        box-shadow: inset 0 0 0 1px oklch(0.62 0.14 25);
    }
    .category-tile-icon {
        display: flex;
        width: 32px;
        height: 32px;
        flex: none;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: color-mix(in srgb, var(--color-neutral-900) 70%, transparent);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
        color: var(--tag-color);
        font-size: 18px;
    }
    .category-tile.excluded .category-tile-icon .ph {
        opacity: 0.4;
    }
    .category-tile-text {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
    }
    .category-tile-label {
        overflow: hidden;
        color: var(--color-neutral-300);
        font-size: 13px;
        font-weight: 500;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .category-tile.included .category-tile-label {
        color: var(--color-text);
    }
    .category-tile.excluded .category-tile-label {
        color: var(--color-neutral-500);
        text-decoration: line-through;
    }
    .category-tile-actions {
        display: flex;
        flex: none;
        flex-direction: column;
        gap: 3px;
    }
    .include-button,
    .exclude-button {
        display: flex;
        width: 20px;
        height: 20px;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        color: var(--color-neutral-500);
        box-shadow: inset 0 0 0 1px var(--color-neutral-700);
        font-size: 11px;
    }
    .include-button:hover {
        color: var(--color-accent-200);
    }
    .exclude-button:hover {
        color: oklch(0.8 0.1 25);
    }
    .included .include-button {
        color: var(--color-accent-100);
        background: var(--color-accent-700);
        box-shadow: none;
    }
    .excluded .exclude-button {
        color: oklch(0.95 0.03 25);
        background: oklch(0.42 0.12 25);
        box-shadow: none;
    }

    /* — tier tiles — */
    .tier-tiles {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 6px;
    }
    .tier-tile {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        padding: 12px 6px 10px;
        border-radius: var(--radius-md);
    }
    .tier-tile:hover,
    .tier-tile.selected {
        background: var(--color-neutral-800);
    }
    .tier-tile.selected {
        box-shadow:
            inset 0 0 0 1px var(--color-accent),
            0 0 16px color-mix(in srgb, var(--color-accent) 20%, transparent);
    }
    .tier-check {
        position: absolute;
        top: 6px;
        right: 6px;
        display: flex;
        width: 16px;
        height: 16px;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        color: var(--color-accent-100);
        background: var(--color-accent-700);
        font-size: 10px;
    }
    .tier-tile-rank {
        font: 500 10px/1 var(--font-mono);
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    /* — footer — */
    .filter-panel-footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        box-shadow: inset 0 1px 0 var(--color-neutral-800);
    }
    .filter-reset,
    .filter-apply {
        display: flex;
        align-items: center;
        gap: 6px;
        height: 34px;
        border-radius: var(--radius-md);
        font-size: 13px;
    }
    .filter-reset {
        padding: 0 10px;
        color: var(--color-neutral-400);
    }
    .filter-reset .ph {
        font-size: 14px;
    }
    .filter-reset:hover {
        color: var(--color-text);
        background: var(--color-neutral-900);
    }
    .filter-apply {
        margin-left: auto;
        padding: 0 14px;
        color: var(--color-accent-200);
        box-shadow: inset 0 0 0 1px var(--color-accent);
        font-weight: 500;
    }
    .filter-apply:hover {
        background: color-mix(in srgb, var(--color-accent) 14%, transparent);
    }
</style>
