<template>
    <main class="content">
        <section class="hero">
            <p class="eyebrow">
                <PhIcon name="bank" />{{ ui.ranking }} · {{ toRoman(civilisations.length) }}
                {{ ui.civilizations }}
            </p>
            <h1>{{ ui.heroTitle }}</h1>
        </section>

        <section class="controls" :aria-label="ui.filters">
            <label class="search-control">
                <PhIcon name="magnifying-glass" />
                <input
                    v-model="searchedText"
                    type="search"
                    :placeholder="ui.search"
                    :aria-label="ui.search"
                />
                <button
                    v-if="searchedText"
                    type="button"
                    class="search-clear"
                    :aria-label="ui.reset"
                    @click="searchedText = ''"
                >
                    <PhIcon name="x" />
                </button>
            </label>

            <div class="chip-group category-filter" role="group" :aria-label="ui.categories">
                <button
                    type="button"
                    class="category-chip"
                    :class="{ active: selectedTagId === null }"
                    :aria-pressed="selectedTagId === null"
                    @click="selectedTagId = null"
                >
                    <span class="dot" :style="{ background: 'var(--color-neutral-600)' }"></span
                    >{{ ui.all }}
                </button>
                <button
                    v-for="tagId in TAG_IDS"
                    :key="tagId"
                    type="button"
                    class="category-chip"
                    :class="{ active: selectedTagId === tagId }"
                    :aria-pressed="selectedTagId === tagId"
                    @click="selectedTagId = tagId"
                >
                    <span class="dot" :style="{ background: categoryColor(tagId) }"></span
                    >{{ t.tags[tagId] }}
                </button>
            </div>

            <div class="chip-group tier-filter" role="group" :aria-label="ui.tiers">
                <button
                    v-for="tierId in TIER_IDS"
                    :key="tierId"
                    type="button"
                    class="tier-chip"
                    :class="{ active: selectedTierId === tierId }"
                    :aria-pressed="selectedTierId === tierId"
                    :title="`${tierLabel(tierId)} · ${badge(tierId).rank}`"
                    @click="toggleTier(tierId)"
                >
                    <CivTierComponent
                        :tier_id="tierId"
                        :size="24"
                        :dimmed="selectedTierId !== null && selectedTierId !== tierId"
                    />
                </button>
            </div>

            <div class="result-actions">
                <span class="result-count">{{ filtered.length }} {{ ui.results }}</span>
                <div class="sort-toggle" role="group" :aria-label="ui.filters">
                    <button
                        type="button"
                        :class="{ active: groupMode === 'tier' }"
                        :aria-pressed="groupMode === 'tier'"
                        @click="groupMode = 'tier'"
                    >
                        <PhIcon name="ranking" />{{ ui.byTier }}
                    </button>
                    <button
                        type="button"
                        :class="{ active: groupMode === 'alpha' }"
                        :aria-pressed="groupMode === 'alpha'"
                        @click="groupMode = 'alpha'"
                    >
                        <PhIcon name="sort-ascending" />{{ ui.alphabetical }}
                    </button>
                </div>
            </div>
        </section>

        <section v-if="groups.length" class="tier-list">
            <section
                v-for="group in groups"
                :key="group.key"
                data-testid="tier-section"
                class="tier-section"
            >
                <header v-if="group.tierId !== null" class="tier-heading">
                    <CivTierComponent :tier_id="group.tierId" :size="58" />
                    <div class="tier-heading-text">
                        <div class="tier-heading-title">
                            <h2>{{ tierLabel(group.tierId) }}</h2>
                            <span class="tier-rank" :style="{ color: badge(group.tierId).label }">{{
                                badge(group.tierId).rank
                            }}</span>
                        </div>
                        <p>{{ badge(group.tierId).sub }}</p>
                    </div>
                    <div class="meander tier-rule" aria-hidden="true"></div>
                    <span class="tier-count">{{ toRoman(group.civilisations.length) }}</span>
                </header>
                <div class="grid-container">
                    <CivCardComponent
                        v-for="civ in group.civilisations"
                        :id="civ.id"
                        :key="civ.id"
                        :name="civ.name"
                        :tags_id="civ.tags_id"
                        :tier_id="civ.tier_id"
                        :selected="detailOpen && selectedCivId === civ.id"
                    />
                </div>
            </section>
        </section>

        <section v-else-if="status === 'error'" class="empty-state" role="alert">
            <h2>{{ ui.loadError }}</h2>
            <button type="button" @click="$emit('retry')">{{ ui.retry }}</button>
        </section>
        <section v-else-if="status === 'loading' && !civilisations.length" class="empty-state">
            <h2 aria-live="polite">{{ ui.loading }}</h2>
        </section>
        <section v-else class="empty-state">
            <h2>{{ ui.noResults }}</h2>
            <button type="button" @click="reset">{{ ui.reset }}</button>
        </section>
    </main>

    <div class="content-overlay" :class="{ hidden: !detailOpen }" @click="closeOverlay"></div>
    <aside
        id="master-card"
        ref="detailPanel"
        class="detail-panel"
        :class="{ open: detailOpen }"
        :aria-hidden="!detailOpen"
        :inert="!detailOpen"
        :aria-label="ui.details"
    >
        <MasterCardComponent
            v-if="selectedCiv"
            :key="selectedCiv.id"
            :civ="selectedCiv"
            :position="selectedCardPosition"
            :previous_name="previousCiv?.name"
            :next_name="nextCiv?.name"
            @close="closeOverlay"
            @previous="navigateBy(-1)"
            @next="navigateBy(1)"
        />
    </aside>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
    import { useCardNavigation } from '../../composables/useCardNavigation';
    import { useCivFilters } from '../../composables/useCivFilters';
    import type { LoadStatus } from '../../composables/useCivilizations';
    import { TAG_IDS, TIER_IDS, type TierId } from '../../data/taxonomy';
    import { useMessages } from '../../i18n/useMessages';
    import { useAppStore } from '../../stores/app';
    import type { Civilization } from '../../types';
    import CivCardComponent from '../civilisations/CivCardComponent.vue';
    import MasterCardComponent from '../civilisations/MasterCardComponent.vue';
    import CivTierComponent from '../civilisations/subcomponents/CivTierComponent.vue';
    import { categoryColor, tierBadge, toRoman } from '../civilisations/tierDesign';
    import PhIcon from '../icons/PhIcon.vue';

    const props = withDefaults(
        defineProps<{ civilisations: Civilization[]; status?: LoadStatus }>(),
        { status: 'ready' }
    );
    defineEmits<{ retry: [] }>();

    const store = useAppStore();
    const { selectedCivId, detailOpen } = storeToRefs(store);
    const t = useMessages();
    const ui = computed(() => t.value.ui);

    const {
        searchedText,
        selectedTagId,
        selectedTierId,
        groupMode,
        filtered,
        groups,
        toggleTier,
        reset,
    } = useCivFilters(
        () => props.civilisations,
        () => store.lang
    );
    const {
        index: selectedIndex,
        previous: previousCiv,
        next: nextCiv,
    } = useCardNavigation(filtered, selectedCivId);

    const selectedCiv = computed(
        () => props.civilisations.find(civ => civ.id === selectedCivId.value) ?? null
    );
    const selectedCardPosition = computed(() => {
        if (selectedIndex.value < 0) return '';
        return `${toRoman(selectedIndex.value + 1)} / ${toRoman(filtered.value.length)}`;
    });
    const badges = computed(
        () => new Map(TIER_IDS.map(tierId => [tierId, tierBadge(tierId, store.lang)]))
    );

    // Focus moves into the panel when it opens and back to the card that opened it
    const detailPanel = ref<HTMLElement | null>(null);
    let focusOrigin: HTMLElement | null = null;
    watch(detailOpen, async open => {
        if (open) {
            focusOrigin =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
            await nextTick();
            detailPanel.value?.querySelector<HTMLElement>('.panel-close')?.focus();
        } else if (focusOrigin?.isConnected) {
            focusOrigin.focus();
            focusOrigin = null;
        }
    });

    onMounted(() => window.addEventListener('keydown', navigateCards));
    onUnmounted(() => window.removeEventListener('keydown', navigateCards));

    function tierLabel(tierId: TierId): string {
        return t.value.tiers[tierId].label;
    }
    function badge(tierId: TierId) {
        return badges.value.get(tierId)!;
    }
    function closeOverlay() {
        store.closeDetail();
    }
    function navigateCards(event: KeyboardEvent) {
        if (!detailOpen.value) return;
        if (event.key === 'Escape') {
            closeOverlay();
            return;
        }
        if (event.key === 'ArrowRight') navigateBy(1);
        else if (event.key === 'ArrowLeft') navigateBy(-1);
    }
    function navigateBy(direction: 1 | -1) {
        const target = direction > 0 ? nextCiv.value : previousCiv.value;
        if (target) store.selectCiv(target.id);
    }
</script>

<style scoped>
    .content {
        color: var(--color-text);
    }

    /* — hero — */
    .hero {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 40px 0 28px;
    }
    .eyebrow {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        color: var(--color-accent-400);
        font: 500 11px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .eyebrow .ph {
        font-size: 14px;
    }
    h1 {
        margin: 0;
        font-size: 44px;
        font-weight: 500;
        line-height: 1.12;
        letter-spacing: -0.025em;
        text-wrap: balance;
    }

    /* — sticky filter bar — */
    .controls {
        position: sticky;
        top: 0;
        z-index: 5;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        margin: 0 -40px;
        padding: 12px 40px;
        background: color-mix(in srgb, var(--color-bg) 82%, transparent);
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
    }
    button {
        border: 0;
        padding: 0;
        color: inherit;
        background: transparent;
        font: inherit;
        cursor: pointer;
    }
    .search-control {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 280px;
        max-width: 100%;
        height: 38px;
        padding: 0 12px;
        border-radius: var(--radius-md);
        background: var(--color-surface);
        box-shadow: var(--shadow-sm);
    }
    .search-control:focus-within {
        box-shadow: 0 0 0 1px var(--color-accent);
    }
    .search-control > .ph {
        font-size: 16px;
        color: var(--color-neutral-500);
    }
    .search-control input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        color: var(--color-text);
        background: transparent;
        font: 400 14px var(--font-body);
        caret-color: var(--color-accent);
    }
    .search-control input::-webkit-search-cancel-button {
        display: none;
    }
    .search-clear {
        display: flex;
        font-size: 14px;
        color: var(--color-neutral-500);
    }
    .search-clear:hover {
        color: var(--color-text);
    }
    .chip-group {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 3px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
    }
    .category-chip {
        display: flex;
        align-items: center;
        gap: 7px;
        height: 30px;
        padding: 0 11px;
        border-radius: 6px;
        color: var(--color-neutral-400);
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
    }
    .category-chip:hover {
        color: var(--color-text);
    }
    .category-chip.active {
        color: var(--color-text);
        background: var(--color-neutral-800);
    }
    .dot {
        width: 7px;
        height: 7px;
        flex: none;
        border-radius: 50%;
    }
    .tier-filter {
        flex-wrap: nowrap;
    }
    .tier-chip {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 30px;
        border-radius: 6px;
    }
    .tier-chip:hover {
        background: var(--color-neutral-900);
    }
    .tier-chip.active {
        background: var(--color-neutral-800);
    }
    .result-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: auto;
    }
    .result-count {
        color: var(--color-neutral-500);
        font-size: 13px;
    }
    .sort-toggle {
        display: flex;
        overflow: hidden;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
    }
    .sort-toggle button {
        display: flex;
        align-items: center;
        gap: 7px;
        height: 36px;
        padding: 0 12px;
        color: var(--color-neutral-400);
        font-size: 13px;
        white-space: nowrap;
    }
    .sort-toggle button:not(.active):hover {
        background: color-mix(in srgb, var(--color-text) 7%, transparent);
    }
    .sort-toggle button.active {
        color: var(--color-accent-300);
        box-shadow: inset 0 0 0 1px var(--color-accent);
    }
    .sort-toggle .ph {
        font-size: 15px;
    }

    /* — tier sections — */
    .tier-list {
        display: flex;
        flex-direction: column;
        gap: 36px;
        padding-top: 20px;
    }
    .tier-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .tier-heading {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .tier-heading-text {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .tier-heading-title {
        display: flex;
        align-items: baseline;
        gap: 10px;
    }
    .tier-heading h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: -0.01em;
    }
    .tier-rank {
        font: 500 11px var(--font-mono);
        letter-spacing: 0.18em;
        text-transform: uppercase;
    }
    .tier-heading p {
        margin: 0;
        color: var(--color-neutral-500);
        font-size: 13px;
    }
    .tier-rule {
        flex: 1;
        opacity: 0.55;
        -webkit-mask-image: linear-gradient(to right, #000, #000 calc(100% - 48px), transparent);
        mask-image: linear-gradient(to right, #000, #000 calc(100% - 48px), transparent);
    }
    .tier-count {
        color: var(--color-neutral-500);
        font: 500 12px var(--font-mono);
        letter-spacing: 0.08em;
    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
        gap: 16px;
    }

    /* — empty state — */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 80px 0;
    }
    .empty-state h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
    }
    .empty-state button {
        padding: 5.6px 10px;
        border: 1px solid var(--color-accent);
        border-radius: var(--radius-md);
        color: var(--color-accent);
        font-family: var(--font-heading);
        font-size: 14px;
        font-weight: 500;
    }
    .empty-state button:hover {
        background: color-mix(in srgb, var(--color-accent) 12%, transparent);
    }

    /* — detail panel — */
    .content-overlay {
        position: fixed;
        inset: 0;
        z-index: 20;
        background: color-mix(in srgb, var(--color-neutral-900) 55%, transparent);
        -webkit-backdrop-filter: blur(2px);
        backdrop-filter: blur(2px);
        opacity: 1;
        transition: opacity 0.25s ease;
    }
    .content-overlay.hidden {
        pointer-events: none;
        opacity: 0;
    }
    .detail-panel {
        position: fixed;
        top: 12px;
        right: 12px;
        bottom: 12px;
        z-index: 21;
        width: 560px;
        max-width: calc(100vw - 24px);
        overflow: hidden;
        border-radius: var(--radius-lg);
        background: linear-gradient(
            to bottom,
            var(--color-surface),
            color-mix(in srgb, var(--color-surface) 70%, var(--color-bg))
        );
        box-shadow:
            var(--shadow-lg),
            0 0 60px color-mix(in srgb, var(--color-accent) 14%, transparent);
        transform: translateX(calc(100% + 24px));
        transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .detail-panel.open {
        transform: translateX(0);
    }

    @media (max-width: 800px) {
        h1 {
            font-size: 34px;
        }
        .controls {
            margin: 0 -16px;
            padding: 12px 16px;
        }
        .search-control {
            width: 100%;
        }
        .chip-group {
            flex-wrap: nowrap;
            max-width: 100%;
            overflow-x: auto;
        }
        .result-actions {
            width: 100%;
            margin-left: 0;
            justify-content: space-between;
        }
        .tier-heading p {
            display: none;
        }
        .grid-container {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 12px;
        }
    }
</style>
