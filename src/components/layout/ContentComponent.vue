<template>
    <main class="content">
        <!-- Backdrop of the Civilization V page: hexagon weave, temple and numeral -->
        <div class="decor-hex" aria-hidden="true"></div>
        <svg
            class="decor-temple"
            viewBox="0 0 200 160"
            fill="none"
            stroke="var(--color-neutral-500)"
            stroke-width=".6"
            aria-hidden="true"
        >
            <path d="M16 52L100 16L184 52Z"></path>
            <path d="M40 46L100 24L160 46"></path>
            <circle cx="100" cy="38" r="5"></circle>
            <path d="M16 52H184V62H16Z"></path>
            <path d="M16 66H184"></path>
            <path d="M28 70H48M30 70V138M46 70V138M34 74V136M38 74V136M42 74V136"></path>
            <path d="M64 70H84M66 70V138M82 70V138M70 74V136M74 74V136M78 74V136"></path>
            <path d="M116 70H136M118 70V138M134 70V138M122 74V136M126 74V136M130 74V136"></path>
            <path d="M152 70H172M154 70V138M170 70V138M158 74V136M162 74V136M166 74V136"></path>
            <path d="M12 140H188M6 147H194M0 154H200"></path>
        </svg>
        <div class="decor-numeral" aria-hidden="true">{{ game.numeral }}</div>

        <section class="hero">
            <p class="eyebrow">
                <PhIcon name="bank" />{{ ui.ranking }} · {{ toRoman(civilisations.length) }}
                {{ ui.civilizations }}
            </p>
            <h1>{{ ui.heroTitle }}</h1>
            <div class="hero-meta">
                <span class="hero-game">{{ game.name }} · {{ game.year }}</span>
                <span class="hero-steps" aria-hidden="true">
                    <i v-for="(_, index) in GAMES" :key="index" :class="{ on: index === 0 }"></i>
                </span>
                <span class="hero-era">{{ heroEra }}</span>
            </div>
        </section>

        <!-- Catches the click beside the open filter panel; Escape closes it from the keyboard -->
        <button
            v-if="filtersOpen"
            type="button"
            class="filters-backdrop"
            tabindex="-1"
            :aria-label="ui.close"
            @click="closeFilters"
        ></button>
        <section class="controls" :class="{ 'bar-hidden': barHidden }" :aria-label="ui.filters">
            <div class="controls-row">
                <label class="search-control">
                    <PhIcon name="magnifying-glass" />
                    <input
                        v-model="searchedText"
                        type="search"
                        :placeholder="ui.search"
                        :aria-label="ui.search"
                        @focus="searchFocused = true"
                        @blur="searchFocused = false"
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

                <button
                    ref="filtersToggle"
                    type="button"
                    class="filters-toggle"
                    :class="{ open: filtersOpen, active: activeCount > 0 }"
                    aria-controls="filter-panel"
                    :aria-expanded="filtersOpen"
                    @click="filtersOpen = !filtersOpen"
                >
                    <PhIcon name="sliders-horizontal" />{{ ui.filtersButton }}
                    <span v-if="activeCount" class="filters-count">{{ activeCount }}</span>
                    <PhIcon name="caret-down" class="filters-caret" />
                </button>
                <!-- On mobile the panel is a bottom sheet: out of the sticky bar, whose
                     blur and slide would otherwise anchor its fixed position -->
                <Teleport to="body" :disabled="!isMobile">
                    <FilterPanelComponent
                        id="filter-panel"
                        ref="filterPanel"
                        :open="filtersOpen"
                        :civilisations="civilisations"
                        :included-tag-ids="includedTagIds"
                        :excluded-tag-ids="excludedTagIds"
                        :selected-tier-ids="selectedTierIds"
                        :result-label="resultLabel"
                        @toggle-include="toggleInclude"
                        @toggle-exclude="toggleExclude"
                        @toggle-tier="toggleTier"
                        @clear="clearFilters"
                        @close="closeFilters"
                    />
                </Teleport>

                <div class="result-actions">
                    <span class="result-count">{{ resultLabel }}</span>
                    <div class="sort-toggle" role="group" :aria-label="ui.filters">
                        <button
                            type="button"
                            :class="{ active: groupMode === 'tier' }"
                            :aria-pressed="groupMode === 'tier'"
                            :title="ui.byTier"
                            @click="groupMode = 'tier'"
                        >
                            <PhIcon name="ranking" /><span class="sort-label">{{ ui.byTier }}</span>
                        </button>
                        <button
                            type="button"
                            :class="{ active: groupMode === 'alpha' }"
                            :aria-pressed="groupMode === 'alpha'"
                            :title="ui.alphabetical"
                            @click="groupMode = 'alpha'"
                        >
                            <PhIcon name="sort-ascending" /><span class="sort-label">{{
                                ui.alphabeticalShort
                            }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <ActiveFiltersComponent
                v-if="activeCount"
                :included-tag-ids="includedTagIds"
                :excluded-tag-ids="excludedTagIds"
                :selected-tier-ids="selectedTierIds"
                @toggle-include="toggleInclude"
                @toggle-exclude="toggleExclude"
                @toggle-tier="toggleTier"
                @clear="clearFilters"
            />
        </section>

        <section v-if="groups.length" class="tier-list">
            <section
                v-for="group in groups"
                :key="group.key"
                data-testid="tier-section"
                class="tier-section"
            >
                <header v-if="group.tierId !== null" class="tier-heading">
                    <CivTierComponent :tier_id="group.tierId" :size="isMobile ? 40 : 58" />
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
                        :leader_name="civ.leader?.name"
                        :selected="detailOpen && selectedCivId === civ.id"
                        :variant="cardStyle"
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
        :style="{ '--panel-frame': tierBadge(selectedCiv?.tier_id, store.lang).frame }"
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
    import { useMediaQuery, useScrollLock } from '@vueuse/core';
    import { storeToRefs } from 'pinia';
    import { computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
    import { useCardNavigation } from '../../composables/useCardNavigation';
    import { useCivFilters } from '../../composables/useCivFilters';
    import { useHideOnScroll } from '../../composables/useHideOnScroll';
    import type { LoadStatus } from '../../composables/useCivilizations';
    import { DISPLAY_OPTIONS, type CardStyle, type GroupMode } from '../../data/displayOptions';
    import { GAMES } from '../../data/games';
    import { TIER_IDS, type TierId } from '../../data/taxonomy';
    import { useMessages } from '../../i18n/useMessages';
    import { useAppStore } from '../../stores/app';
    import type { Civilization } from '../../types';
    import CivCardComponent from '../civilisations/CivCardComponent.vue';
    import MasterCardComponent from '../civilisations/MasterCardComponent.vue';
    import CivTierComponent from '../civilisations/subcomponents/CivTierComponent.vue';
    import { tierBadge, toRoman } from '../civilisations/tierDesign';
    import ActiveFiltersComponent from '../filters/ActiveFiltersComponent.vue';
    import FilterPanelComponent from '../filters/FilterPanelComponent.vue';
    import PhIcon from '../icons/PhIcon.vue';

    const props = withDefaults(
        defineProps<{
            civilisations: Civilization[];
            status?: LoadStatus;
            /** Card layout, see data/displayOptions.ts. */
            cardStyle?: CardStyle;
            /** Grouping shown on load. */
            defaultGroupMode?: GroupMode;
        }>(),
        {
            status: 'ready',
            cardStyle: DISPLAY_OPTIONS.cardStyle,
            defaultGroupMode: DISPLAY_OPTIONS.defaultGroupMode,
        }
    );
    defineEmits<{ retry: [] }>();

    const store = useAppStore();
    const { selectedCivId, detailOpen } = storeToRefs(store);
    const t = useMessages();
    const ui = computed(() => t.value.ui);

    const {
        searchedText,
        includedTagIds,
        excludedTagIds,
        selectedTierIds,
        groupMode,
        filtered,
        groups,
        activeCount,
        toggleInclude,
        toggleExclude,
        toggleTier,
        clearFilters,
        reset,
    } = useCivFilters(
        () => props.civilisations,
        () => store.lang,
        props.defaultGroupMode
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
    const resultLabel = computed(() => {
        const count = filtered.value.length;
        return `${count} ${count === 1 ? ui.value.result : ui.value.results}`;
    });
    // The page only serves Civilization V; its era copy lives with the home cards
    const game = GAMES[0];
    const heroEra = computed(() =>
        [t.value.homeGames[0]?.era, game.expansion].filter(Boolean).join(' · ')
    );
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

    // The filter panel closes on Escape, on a click beside it and from its own button
    const filtersOpen = ref(false);
    const filtersToggle = ref<HTMLButtonElement | null>(null);
    const filterPanel = ref<InstanceType<typeof FilterPanelComponent> | null>(null);
    function closeFilters() {
        const panel = filterPanel.value?.$el as HTMLElement | undefined;
        // The closed panel is inert: hand the focus back to its button rather than to <body>
        if (panel?.contains(document.activeElement)) filtersToggle.value?.focus();
        filtersOpen.value = false;
    }

    // Phone layout: bottom-sheet filters, two-row bar that hides on the way down
    const isMobile = useMediaQuery('(max-width: 800px)');
    const searchFocused = ref(false);
    const { hidden: barHidden } = useHideOnScroll(
        () => isMobile.value && !filtersOpen.value && !searchFocused.value
    );
    // The page stays put behind the detail panel and the filter sheet
    const scrollLocked = useScrollLock(typeof document === 'undefined' ? null : document.body);
    watchEffect(() => {
        scrollLocked.value = detailOpen.value || (filtersOpen.value && isMobile.value);
    });

    onMounted(() => window.addEventListener('keydown', onKeydown));
    onUnmounted(() => window.removeEventListener('keydown', onKeydown));

    function tierLabel(tierId: TierId): string {
        return t.value.tiers[tierId].label;
    }
    function badge(tierId: TierId) {
        return badges.value.get(tierId)!;
    }
    function closeOverlay() {
        store.closeDetail();
    }
    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && filtersOpen.value) {
            closeFilters();
            return;
        }
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
        position: relative;
        color: var(--color-text);
    }

    /* — page backdrop — */
    .decor-hex,
    .decor-temple,
    .decor-numeral {
        position: absolute;
        z-index: -1;
        pointer-events: none;
        user-select: none;
    }
    .decor-hex {
        top: 0;
        right: -40px;
        width: min(1100px, 90vw);
        height: 900px;
        background-image: var(--hex-pattern);
        background-size: 28px 49px;
        opacity: 0.07;
        -webkit-mask-image: radial-gradient(ellipse 60% 55% at 75% 25%, #000, transparent 75%);
        mask-image: radial-gradient(ellipse 60% 55% at 75% 25%, #000, transparent 75%);
    }
    .decor-temple {
        top: 120px;
        right: 4%;
        width: min(560px, 46vw);
        opacity: 0.22;
        -webkit-mask-image: linear-gradient(to bottom, #000 30%, transparent 95%);
        mask-image: linear-gradient(to bottom, #000 30%, transparent 95%);
    }
    .decor-numeral {
        top: 70px;
        right: -60px;
        color: transparent;
        font: 600 min(40vw, 560px) / 0.8 var(--font-display);
        -webkit-text-stroke: 1.5px color-mix(in srgb, var(--color-accent) 24%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, #000 10%, transparent 80%);
        mask-image: linear-gradient(to bottom, #000 10%, transparent 80%);
    }
    @media (max-width: 800px) {
        .decor-temple,
        .decor-numeral {
            display: none;
        }
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

    .hero-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 8px;
    }
    .hero-game,
    .hero-era {
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .hero-game {
        color: var(--color-neutral-500);
    }
    .hero-era {
        color: var(--color-neutral-600);
    }
    .hero-steps {
        display: flex;
        gap: 3px;
    }
    .hero-steps i {
        width: 14px;
        height: 3px;
        border-radius: 2px;
        background: var(--color-neutral-800);
    }
    .hero-steps i.on {
        background: var(--color-accent);
        box-shadow: 0 0 6px var(--color-accent);
    }

    /* — sticky filter bar — */
    .filters-backdrop {
        position: fixed;
        inset: 0;
        z-index: 5;
        cursor: default;
    }
    .controls {
        position: sticky;
        top: 0;
        z-index: 6;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 0 -40px;
        padding: 12px 40px;
        background: color-mix(in srgb, var(--color-bg) 82%, transparent);
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        transition: transform 0.25s ease;
    }
    /* Slid out while scrolling down on mobile; keyboard focus brings it back */
    .controls.bar-hidden:not(:focus-within) {
        transform: translateY(calc(-100% - 1px));
    }
    .controls-row {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
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
        flex: 1 1 240px;
        align-items: center;
        gap: 8px;
        max-width: 420px;
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
    .filters-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 38px;
        padding: 0 12px 0 13px;
        border-radius: var(--radius-md);
        color: var(--color-neutral-300);
        box-shadow: var(--shadow-sm);
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
    }
    .filters-toggle > .ph {
        font-size: 16px;
    }
    .filters-toggle.open,
    .filters-toggle.active {
        color: var(--color-accent-200);
        box-shadow: inset 0 0 0 1px var(--color-accent);
    }
    .filters-toggle.open,
    .filters-toggle:hover {
        background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    }
    .filters-count {
        display: flex;
        min-width: 18px;
        height: 18px;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
        border-radius: 9px;
        color: var(--color-accent-100);
        background: var(--color-accent-700);
        box-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 50%, transparent);
        font: 600 11px/1 var(--font-body);
    }
    .filters-toggle .filters-caret {
        font-size: 12px;
        color: var(--color-neutral-500);
        transition: transform 0.2s;
    }
    .filters-toggle.open .filters-caret {
        transform: rotate(180deg);
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
        width: 660px;
        max-width: calc(100vw - 24px);
        overflow: hidden;
        border-radius: var(--radius-lg);
        background: linear-gradient(
            to bottom,
            var(--color-surface),
            color-mix(in srgb, var(--color-surface) 60%, var(--color-bg))
        );
        box-shadow:
            var(--shadow-lg),
            0 0 0 1px var(--panel-frame),
            0 0 70px color-mix(in srgb, var(--color-accent) 14%, transparent);
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
        .filters-backdrop {
            z-index: 24;
            background: color-mix(in srgb, var(--color-neutral-900) 55%, transparent);
        }
        .controls {
            margin-inline: calc(-1 * max(16px, env(safe-area-inset-left)))
                calc(-1 * max(16px, env(safe-area-inset-right)));
            padding: 10px max(16px, env(safe-area-inset-right)) 10px
                max(16px, env(safe-area-inset-left));
        }
        .search-control {
            flex-basis: 100%;
            max-width: none;
        }
        .result-actions {
            flex: 1;
            justify-content: flex-end;
        }
        /* Icon-only sort buttons: the label stays for screen readers */
        .sort-label {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
        }
        .sort-toggle button {
            width: 40px;
            height: 38px;
            justify-content: center;
            padding: 0;
        }
        .sort-toggle .ph {
            font-size: 17px;
        }
        .tier-heading {
            gap: 12px;
        }
        .tier-heading p {
            display: none;
        }
        .grid-container {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 12px;
        }
    }
    @media (max-width: 640px) {
        /* Cards turn into compact rows, see CivCardComponent */
        .tier-list {
            gap: 28px;
        }
        .tier-section {
            gap: 12px;
        }
        .grid-container {
            grid-template-columns: minmax(0, 1fr);
            gap: 8px;
        }
        /* Full-screen panel, swipeable (see MasterCardComponent) */
        .detail-panel {
            inset: 0;
            width: 100%;
            max-width: none;
            border-radius: 0;
            transform: translateX(100%);
        }
    }
</style>
