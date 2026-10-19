<template>
    <main class="content">
        <section class="hero">
            <p class="eyebrow">
                <i class="ph ph-bank" aria-hidden="true"></i>{{ ui.ranking }} ·
                {{ toRoman(civilisations.length) }} {{ ui.civilizations }}
            </p>
            <h1>{{ ui.heroTitle }}</h1>
        </section>

        <section class="controls" :aria-label="ui.filters">
            <label class="search-control">
                <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
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
                    <i class="ph ph-x" aria-hidden="true"></i>
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
                    v-for="tag in tagList"
                    :key="tag.id"
                    type="button"
                    class="category-chip"
                    :class="{ active: selectedTagId === tag.id }"
                    :aria-pressed="selectedTagId === tag.id"
                    @click="selectedTagId = tag.id"
                >
                    <span class="dot" :style="{ background: categoryColor(tag.id) }"></span
                    >{{ tagLabel(tag.id) }}
                </button>
            </div>

            <div class="chip-group tier-filter" role="group" aria-label="Tiers">
                <button
                    v-for="tier in tierList"
                    :key="tier.id"
                    type="button"
                    class="tier-chip"
                    :class="{ active: selectedTierId === tier.id }"
                    :aria-pressed="selectedTierId === tier.id"
                    :title="`${tierLabel(tier.id)} · ${badge(tier.id).rank}`"
                    @click="selectedTierId = selectedTierId === tier.id ? null : tier.id"
                >
                    <CivTierComponent
                        :tier_id="tier.id"
                        :size="24"
                        :dimmed="selectedTierId !== null && selectedTierId !== tier.id"
                    />
                </button>
            </div>

            <div class="result-actions">
                <span class="result-count"
                    >{{ filteredCivilisations.length }} {{ ui.results }}</span
                >
                <div class="sort-toggle" role="group" :aria-label="ui.filters">
                    <button
                        type="button"
                        :class="{ active: groupMode === 'tier' }"
                        :aria-pressed="groupMode === 'tier'"
                        @click="groupMode = 'tier'"
                    >
                        <i class="ph ph-ranking" aria-hidden="true"></i>{{ ui.byTier }}
                    </button>
                    <button
                        type="button"
                        :class="{ active: groupMode === 'alpha' }"
                        :aria-pressed="groupMode === 'alpha'"
                        @click="groupMode = 'alpha'"
                    >
                        <i class="ph ph-sort-ascending" aria-hidden="true"></i>{{ ui.alphabetical }}
                    </button>
                </div>
            </div>
        </section>

        <section v-if="tierGroups.length" class="tier-list">
            <section
                v-for="group in tierGroups"
                :key="group.id"
                data-testid="tier-section"
                class="tier-section"
            >
                <header v-if="groupMode === 'tier'" class="tier-heading">
                    <CivTierComponent :tier_id="group.id" :size="58" />
                    <div class="tier-heading-text">
                        <div class="tier-heading-title">
                            <h2>{{ tierLabel(group.id) }}</h2>
                            <span class="tier-rank" :style="{ color: badge(group.id).label }">{{
                                badge(group.id).rank
                            }}</span>
                        </div>
                        <p>{{ badge(group.id).sub }}</p>
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
                        :desc="civ.historical_info?.[0]?.text || ''"
                        :tags_id="civ.tags_id"
                        :tier_id="civ.tier_id"
                        :civ_leader_effect="civ.leader?.trait?.effect || ''"
                        :selected="selectedState && selectedCard === civ.id"
                    />
                </div>
            </section>
        </section>

        <section v-else class="empty-state">
            <h2>{{ ui.noResults }}</h2>
            <button type="button" @click="resetFilters">{{ ui.reset }}</button>
        </section>
    </main>

    <div class="content-overlay" :class="{ hidden: !selectedState }" @click="closeOverlay"></div>
    <aside
        id="master-card"
        class="detail-panel"
        :class="{ open: selectedState }"
        :aria-hidden="!selectedState"
        :inert="!selectedState"
        :aria-label="ui.details"
    >
        <MasterCardComponent
            v-if="selectedCiv"
            :id="selectedCiv.id"
            :key="selectedCiv.id"
            :name="selectedCiv.name"
            :civ_icon="selectedCiv.icon"
            :desc="selectedCiv.historical_info?.[0]?.text || ''"
            :tags_id="selectedCiv.tags_id"
            :tier_id="selectedCiv.tier_id"
            :civ_trait_name="selectedCiv.leader?.trait?.name"
            :civ_leader_effect="selectedCiv.leader?.trait?.effect"
            :civ_leader="selectedCiv.leader?.name"
            :civ_leader_icon="selectedCiv.leader?.icon"
            :civ_leader_subtitle="selectedCiv.leader?.subtitle"
            :civ_leader_text="selectedCiv.leader?.historical_info?.[0]?.text"
            :civ_units="selectedCiv.unique_units"
            :civ_building="selectedCiv.unique_buildings"
            :position="selectedCardPosition"
            :previous_name="previousCivilization?.name"
            :next_name="nextCivilization?.name"
            @close="closeOverlay"
            @previous="navigateBy(-1)"
            @next="navigateBy(1)"
        />
    </aside>
</template>

<script setup>
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import { translationStore } from '../../stores/index';
    import CivCardComponent from '../civilisations/CivCardComponent.vue';
    import MasterCardComponent from '../civilisations/MasterCardComponent.vue';
    import CivTierComponent from '../civilisations/subcomponents/CivTierComponent.vue';
    import { categoryColor, tierBadge, toRoman } from '../civilisations/tierDesign';
    import { uiCopy } from '../uiCopy';

    const props = defineProps({ civilisations: { type: Array, required: true } });
    const store = translationStore();
    const tagList = store.getTagList;
    const tierList = store.getTierList;
    const selectedTagId = ref(null);
    const selectedTierId = ref(null);
    const selectedState = ref(false);
    const selectedCard = ref(null);
    const searchedText = ref('');
    const groupMode = ref('tier');
    const ui = computed(() => uiCopy(store.getLanguage));

    const filteredCivilisations = computed(() => {
        const query = normalize(searchedText.value);
        const civilisations = props.civilisations.filter(civ => {
            const matchesTag =
                selectedTagId.value === null || (civ.tags_id || []).includes(selectedTagId.value);
            const matchesTier =
                selectedTierId.value === null || civ.tier_id === selectedTierId.value;
            const matchesName = !query || normalize(civ.name || '').includes(query);
            return matchesTag && matchesTier && matchesName;
        });

        // Alphabetical, then (stable) by tier when grouped — the order the grid
        // shows is the order the detail panel steps through.
        civilisations.sort((left, right) => left.name.localeCompare(right.name, store.lang));
        if (groupMode.value === 'tier')
            civilisations.sort((left, right) => left.tier_id - right.tier_id);
        return civilisations;
    });

    const selectedCiv = computed(
        () => props.civilisations.find(civ => civ.id === selectedCard.value) ?? null
    );
    const selectedCardIndex = computed(() =>
        filteredCivilisations.value.findIndex(civ => civ.id === selectedCard.value)
    );
    const selectedCardPosition = computed(() => {
        if (selectedCardIndex.value < 0) return '';
        return `${toRoman(selectedCardIndex.value + 1)} / ${toRoman(filteredCivilisations.value.length)}`;
    });
    const previousCivilization = computed(() => getRelativeCivilization(-1));
    const nextCivilization = computed(() => getRelativeCivilization(1));
    const tierGroups = computed(() => {
        const visible = filteredCivilisations.value;
        if (groupMode.value === 'alpha')
            return visible.length ? [{ id: 'all', civilisations: visible }] : [];
        return tierList
            .map(tier => ({
                id: tier.id,
                civilisations: visible.filter(civ => civ.tier_id === tier.id),
            }))
            .filter(group => group.civilisations.length);
    });

    watch(
        () => [store.getSelectedState, store.getSelectedCard],
        () => {
            selectedState.value = store.getSelectedState;
            selectedCard.value = store.getSelectedCard;
        },
        { immediate: true }
    );

    onMounted(() => window.addEventListener('keydown', navigateCards));
    onUnmounted(() => window.removeEventListener('keydown', navigateCards));

    function normalize(value) {
        return String(value)
            .split('|')[0]
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLocaleLowerCase()
            .trim();
    }
    function tierLabel(tierId) {
        return store.getTierPropertyById(tierId, 'label') || `Tier ${badge(tierId).letter}`;
    }
    function badge(tierId) {
        return tierBadge(tierId, store.getLanguage);
    }
    function tagLabel(tagId) {
        return store.getTagPropertyById(tagId, 'label') || 'Catégorie';
    }
    function closeOverlay() {
        store.setSelectedState(false);
    }
    function navigateCards(event) {
        if (!selectedState.value) return;
        if (event.key === 'Escape') {
            closeOverlay();
            return;
        }
        if (!filteredCivilisations.value.length || !['ArrowRight', 'ArrowLeft'].includes(event.key))
            return;
        navigateBy(event.key === 'ArrowRight' ? 1 : -1);
    }
    function navigateBy(direction) {
        const target = getRelativeCivilization(direction);
        if (!target) return;
        selectedCard.value = target.id;
        store.setSelectedCard(target.id);
    }
    function getRelativeCivilization(direction) {
        const count = filteredCivilisations.value.length;
        if (!count) return null;
        // A selection hidden by the filters steps to the first / last visible civilization.
        const current =
            selectedCardIndex.value < 0 ? (direction > 0 ? -1 : 0) : selectedCardIndex.value;
        return filteredCivilisations.value[(current + direction + count) % count];
    }
    function resetFilters() {
        selectedTagId.value = null;
        selectedTierId.value = null;
        searchedText.value = '';
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
