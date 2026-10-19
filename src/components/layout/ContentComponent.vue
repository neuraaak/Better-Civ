<template>
    <div class="content-overlay" :class="{ hidden: !selectedState }" @click="closeOverlay">
        <div id="master-card" class="detail-panel" @click.stop>
            <MasterCardComponent
                v-if="selectedCardIndex >= 0"
                :id="filteredCivilisations[selectedCardIndex]?.id"
                :key="filteredCivilisations[selectedCardIndex]?.id"
                :name="filteredCivilisations[selectedCardIndex]?.name"
                :civ_icon="filteredCivilisations[selectedCardIndex]?.icon"
                :desc="filteredCivilisations[selectedCardIndex]?.historical_info?.[0]?.text || ''"
                :tags_id="filteredCivilisations[selectedCardIndex]?.tags_id"
                :tier_id="filteredCivilisations[selectedCardIndex]?.tier_id"
                :civ_leader="filteredCivilisations[selectedCardIndex]?.leader.name"
                :civ_leader_icon="filteredCivilisations[selectedCardIndex]?.leader.icon"
                :civ_leader_effect="filteredCivilisations[selectedCardIndex]?.leader.trait.effect"
                :civ_units="filteredCivilisations[selectedCardIndex]?.unique_units"
                :civ_building="filteredCivilisations[selectedCardIndex]?.unique_buildings"
                :position="selectedCardPosition"
                :previous_name="previousCivilization?.name"
                :next_name="nextCivilization?.name"
                @close="closeOverlay"
                @previous="navigateBy(-1)"
                @next="navigateBy(1)"
            />
        </div>
    </div>

    <main class="content">
        <section class="hero">
            <p class="eyebrow">Classement · {{ civilisations.length }} civilisations</p>
            <h1>Quelle civilisation jouer ?</h1>
            <p class="hero-copy">
                Comparez les civilisations de Civilization V selon leur tier et leur style de jeu.
            </p>
        </section>

        <section class="fixedcontent controls" aria-label="Filtres des civilisations">
            <label class="search-control">
                <span aria-hidden="true">⌕</span>
                <input
                    v-model="searchedText"
                    type="search"
                    placeholder="Rechercher une civilisation"
                />
                <button
                    v-if="searchedText"
                    type="button"
                    aria-label="Effacer la recherche"
                    @click="searchedText = ''"
                >
                    ×
                </button>
            </label>

            <div class="filter-group" aria-label="Catégories">
                <button
                    type="button"
                    :class="{ active: selectedTagId === null }"
                    @click="selectedTagId = null"
                >
                    Toutes
                </button>
                <button
                    v-for="tag in tagList"
                    :key="tag.id"
                    type="button"
                    :class="{ active: selectedTagId === tag.id }"
                    @click="selectedTagId = selectedTagId === tag.id ? null : tag.id"
                >
                    <span class="dot"></span>{{ tagLabel(tag.id) }}
                </button>
            </div>

            <div class="filter-group tier-filter" aria-label="Tiers">
                <button
                    v-for="tier in tierList"
                    :key="tier.id"
                    type="button"
                    :class="['tier-chip', { active: selectedTierId === tier.id }]"
                    :title="tierLabel(tier.id)"
                    @click="selectedTierId = selectedTierId === tier.id ? null : tier.id"
                >
                    <CivTierComponent :tier_id="tier.id" class="filter-tier-badge" />
                </button>
            </div>

            <div class="result-actions">
                <span
                    >{{ filteredCivilisations.length }} résultat{{
                        filteredCivilisations.length > 1 ? 's' : ''
                    }}</span
                >
                <div class="sort-toggle">
                    <button
                        type="button"
                        :class="{ active: groupMode === 'tier' }"
                        @click="groupMode = 'tier'"
                    >
                        Par tier
                    </button>
                    <button
                        type="button"
                        :class="{ active: groupMode === 'alpha' }"
                        @click="groupMode = 'alpha'"
                    >
                        A → Z
                    </button>
                </div>
            </div>
        </section>

        <div class="legacy-controls" aria-hidden="true">
            <SelectInputComponent
                v-model="selectedTags"
                multiple
                :options="tagList"
                label="name"
                getPropertyFunc="getTagPropertyById"
                @update:selectedOptions="handleCheckedTags"
            />
            <SelectInputComponent
                v-model="selectedTiers"
                multiple
                :options="tierList"
                label="name"
                getPropertyFunc="getTierPropertyById"
                @update:selectedOptions="handleCheckedTiers"
            />
            <SearchInputComponent
                v-model="searchedText"
                :civilizations="filteredCivilisations"
                @update:searchText="handleSearchedText"
            />
        </div>

        <section v-if="tierGroups.length" class="tier-list">
            <section
                v-for="group in tierGroups"
                :key="group.id"
                data-testid="tier-section"
                class="tier-section"
            >
                <header v-if="groupMode === 'tier'" class="tier-heading">
                    <CivTierComponent :tier_id="group.id" class="section-tier-badge" />
                    <div>
                        <h2>{{ tierLabel(group.id) }}</h2>
                        <p>
                            {{ group.civilisations.length }} civilisation{{
                                group.civilisations.length > 1 ? 's' : ''
                            }}
                        </p>
                    </div>
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
                    />
                </div>
            </section>
        </section>

        <section v-else class="empty-state">
            <h2>Aucune civilisation ne correspond</h2>
            <button type="button" @click="resetFilters">Réinitialiser les filtres</button>
        </section>
    </main>
</template>

<script setup>
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import { translationStore } from '../../stores/index';
    import CivCardComponent from '../civilisations/CivCardComponent.vue';
    import MasterCardComponent from '../civilisations/MasterCardComponent.vue';
    import CivTierComponent from '../civilisations/subcomponents/CivTierComponent.vue';
    import SearchInputComponent from '../global/SearchInputComponent.vue';
    import SelectInputComponent from '../global/SelectInputComponent.vue';

    const props = defineProps({ civilisations: { type: Array, required: true } });
    const store = translationStore();
    const tagList = store.getTagList;
    const tierList = store.getTierList;
    const selectedTags = ref([]);
    const selectedTiers = ref([]);
    const selectedTagId = ref(null);
    const selectedTierId = ref(null);
    const selectedState = ref(false);
    const selectedCard = ref(null);
    const searchedText = ref('');
    const groupMode = ref('tier');

    const filteredCivilisations = computed(() => {
        const query = normalize(searchedText.value);
        const selectedTagIds = selectedTags.value.map(tag => tag.id);
        const selectedTierIds = selectedTiers.value.map(tier => tier.id);

        return props.civilisations.filter(civ => {
            const tags = civ.tags_id || [];
            const matchesTags =
                (!selectedTagIds.length && selectedTagId.value === null) ||
                selectedTagIds.some(tagId => tags.includes(tagId)) ||
                tags.includes(selectedTagId.value);
            const matchesTiers =
                (!selectedTierIds.length && selectedTierId.value === null) ||
                selectedTierIds.includes(civ.tier_id) ||
                civ.tier_id === selectedTierId.value;
            const searchableText = `${civ.name || ''} ${civ.leader?.trait?.effect || ''}`;
            return (
                matchesTags && matchesTiers && (!query || normalize(searchableText).includes(query))
            );
        });
    });

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
        const sorted = [...filteredCivilisations.value].sort((left, right) =>
            left.name.localeCompare(right.name, store.lang)
        );
        if (groupMode.value === 'alpha')
            return sorted.length ? [{ id: 'all', civilisations: sorted }] : [];
        return tierList
            .map(tier => ({
                id: tier.id,
                civilisations: sorted.filter(civ => civ.tier_id === tier.id),
            }))
            .filter(group => group.civilisations.length);
    });

    watch(
        () => store.getSelectedState,
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
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase();
    }
    function tierLetter(tierId) {
        return ['S', 'A', 'B', 'C', 'D'][tierId] || '?';
    }
    function tierLabel(tierId) {
        return store.getTierPropertyById(tierId, 'label') || `Tier ${tierLetter(tierId)}`;
    }
    function tagLabel(tagId) {
        return store.getTagPropertyById(tagId, 'label') || 'Catégorie';
    }
    function handleCheckedTags(checkedTags) {
        selectedTags.value = checkedTags;
    }
    function handleCheckedTiers(checkedTiers) {
        selectedTiers.value = checkedTiers;
    }
    function handleSearchedText(searchText) {
        searchedText.value = searchText;
    }
    function closeOverlay() {
        store.setSelectedState(false);
    }
    function navigateCards(event) {
        if (
            !selectedState.value ||
            !filteredCivilisations.value.length ||
            !['ArrowRight', 'ArrowLeft'].includes(event.key)
        )
            return;
        navigateBy(event.key === 'ArrowRight' ? 1 : -1);
    }
    function navigateBy(direction) {
        if (!filteredCivilisations.value.length) return;
        const currentIndex = selectedCardIndex.value < 0 ? 0 : selectedCardIndex.value;
        const nextIndex =
            (currentIndex + direction + filteredCivilisations.value.length) %
            filteredCivilisations.value.length;
        selectedCard.value = filteredCivilisations.value[nextIndex].id;
        store.setSelectedCard(selectedCard.value);
    }
    function getRelativeCivilization(direction) {
        if (!filteredCivilisations.value.length) return null;
        const currentIndex = selectedCardIndex.value < 0 ? 0 : selectedCardIndex.value;
        const index =
            (currentIndex + direction + filteredCivilisations.value.length) %
            filteredCivilisations.value.length;
        return filteredCivilisations.value[index];
    }
    function toRoman(value) {
        const numerals = [
            [10, 'X'],
            [9, 'IX'],
            [5, 'V'],
            [4, 'IV'],
            [1, 'I'],
        ];
        return numerals.reduce((result, [number, numeral]) => {
            while (value >= number) {
                result += numeral;
                value -= number;
            }
            return result;
        }, '');
    }
    function resetFilters() {
        selectedTags.value = [];
        selectedTiers.value = [];
        selectedTagId.value = null;
        selectedTierId.value = null;
        searchedText.value = '';
    }
</script>

<style scoped>
    .content {
        min-height: 100vh;
        padding: 0 2.5rem 5rem;
        color: #e9e9ed;
        background: #161826;
    }
    .hero {
        max-width: 1480px;
        margin: 0 auto;
        padding: 8.5rem 0 2.25rem;
    }
    .eyebrow {
        margin: 0 0 0.5rem;
        color: #b5abfc;
        font:
            500 0.72rem/1.2 ui-monospace,
            monospace;
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    h1 {
        margin: 0;
        font-size: clamp(2.4rem, 5vw, 4rem);
        font-weight: 500;
        letter-spacing: -0.04em;
    }
    .hero-copy {
        color: #9397ab;
        margin: 0.75rem 0 0;
    }
    .controls {
        position: sticky;
        top: 0;
        z-index: 20;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        max-width: 1560px;
        margin: 0 auto;
        padding: 0.75rem 0;
        background: rgb(22 24 38 / 90%);
        backdrop-filter: blur(16px);
    }
    .search-control,
    .filter-group,
    .sort-toggle {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem;
        border: 1px solid #3f424d;
        border-radius: 0.55rem;
        background: #232532;
    }
    .search-control {
        width: min(100%, 18rem);
        padding: 0 0.75rem;
        gap: 0.55rem;
    }
    .search-control input {
        min-width: 0;
        flex: 1;
        height: 2.35rem;
        color: inherit;
        border: 0;
        outline: 0;
        background: transparent;
    }
    button {
        border: 0;
        color: #b2b6ca;
        background: transparent;
        cursor: pointer;
        font: inherit;
    }
    .search-control button {
        font-size: 1.2rem;
    }
    .filter-group button,
    .sort-toggle button {
        padding: 0.45rem 0.65rem;
        border-radius: 0.35rem;
        font-size: 0.82rem;
        white-space: nowrap;
    }
    .filter-group button.active,
    .sort-toggle button.active {
        color: #f5f4ff;
        background: #3f424d;
        box-shadow: inset 0 0 0 1px #9184d9;
    }
    .dot {
        display: inline-block;
        width: 0.38rem;
        height: 0.38rem;
        margin-right: 0.35rem;
        border-radius: 50%;
        background: #9184d9;
    }
    .tier-filter {
        gap: 0.15rem;
    }
    .tier-chip {
        display: grid;
        width: 2.2rem;
        height: 2rem;
        place-items: center;
    }
    :deep(.filter-tier-badge) {
        --tier-badge-size: 1.45rem;
    }
    .result-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-left: auto;
        color: #9397ab;
        font-size: 0.82rem;
    }
    .legacy-controls {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
    }
    .tier-list {
        max-width: 1480px;
        margin: 1.25rem auto 0;
        display: grid;
        gap: 2.25rem;
    }
    .tier-section {
        display: grid;
        gap: 1rem;
    }
    .tier-heading {
        display: flex;
        align-items: center;
        gap: 0.85rem;
    }
    :deep(.section-tier-badge) {
        --tier-badge-size: 3.25rem;
    }
    .tier-heading h2,
    .empty-state h2 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
    }
    .tier-heading p {
        margin: 0.2rem 0 0;
        color: #9397ab;
        font-size: 0.82rem;
    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
        gap: 1rem;
    }
    .empty-state {
        max-width: 1480px;
        margin: 5rem auto;
    }
    .empty-state button {
        margin-top: 1rem;
        padding: 0.65rem 0.9rem;
        color: #d2cefd;
        border: 1px solid #9184d9;
        border-radius: 0.5rem;
    }
    .content-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        justify-content: flex-end;
        padding: 0.75rem;
        background: rgb(22 24 38 / 62%);
        backdrop-filter: blur(3px);
        opacity: 1;
        transition: opacity 250ms ease;
    }
    .content-overlay.hidden {
        pointer-events: none;
        opacity: 0;
    }
    .detail-panel {
        width: min(28.75rem, 100%);
        overflow: auto;
        border: 1px solid #595d6c;
        border-radius: 0.9rem;
        background: #232532;
        box-shadow:
            0 1rem 3rem rgb(0 0 0 / 55%),
            0 0 3.75rem rgb(145 132 217 / 14%);
        transform: translateX(0);
        transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .content-overlay.hidden .detail-panel {
        transform: translateX(calc(100% + 1.5rem));
    }
    @media (max-width: 800px) {
        .content {
            padding-inline: 1rem;
        }
        .hero {
            padding-top: 6rem;
        }
        .controls {
            align-items: stretch;
        }
        .search-control {
            width: 100%;
        }
        .result-actions {
            width: 100%;
            margin-left: 0;
            justify-content: space-between;
        }
        .filter-group {
            overflow-x: auto;
        }
        .grid-container {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
    }
</style>
