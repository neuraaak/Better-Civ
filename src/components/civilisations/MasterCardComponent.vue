<template>
    <article class="civilization-panel" :style="tierPalette">
        <div class="panel-accent" :style="{ background: tierPalette['--tier-line'] }"></div>
        <header class="panel-hero">
            <img class="hero-visual" alt="" :src="civBackground" />
            <div class="hero-grain"></div>
            <p class="hero-label">illustration · {{ displayName }}</p>
            <div class="hero-gradient"></div>
            <div class="panel-controls">
                <button
                    type="button"
                    aria-label="Civilisation précédente"
                    @click="$emit('previous')"
                >
                    ‹
                </button>
                <button type="button" aria-label="Civilisation suivante" @click="$emit('next')">
                    ›
                </button>
                <span class="panel-position">{{ position }}</span>
                <button
                    class="panel-close"
                    type="button"
                    aria-label="Fermer le panneau"
                    @click="$emit('close')"
                >
                    ×
                </button>
            </div>
        </header>

        <div class="panel-content">
            <section class="panel-heading">
                <div>
                    <div class="identity-row">
                        <img v-if="civ_icon" class="civilization-icon" :src="civ_icon" alt="" />
                        <h1 class="panel-name">{{ displayName }}</h1>
                    </div>
                    <div v-if="tags_id?.length" class="panel-tags">
                        <CivTagComponent v-for="tag_id in tags_id" :key="tag_id" :tag_id="tag_id" />
                    </div>
                </div>
                <div class="tier-summary">
                    <div class="tier-meta">
                        <span>TIER {{ tier.letter }}</span>
                        <strong :style="{ color: tier.label }">{{ tier.rank }}</strong>
                    </div>
                    <CivTierComponent :tier_id="tier_id" class="panel-tier-badge" />
                </div>
            </section>

            <div class="ornament" aria-hidden="true"></div>

            <section v-if="civ_leader_effect" class="ability-block">
                <span>Atout du dirigeant</span>
                <p>{{ civ_leader_effect }}</p>
            </section>

            <section v-if="civ_leader" class="leader-block">
                <img v-if="civ_leader_icon" :src="civ_leader_icon" alt="" />
                <div>
                    <span>Dirigeant</span>
                    <h2 class="leader-name">{{ civ_leader?.split('|')[0] }}</h2>
                </div>
            </section>

            <section v-if="uniqueItems.length" class="unique-section">
                <span class="section-label">Éléments uniques</span>
                <div class="unique-grid">
                    <div
                        v-for="item in uniqueItems"
                        :key="`${item.type}-${item.name}`"
                        class="unique-item"
                    >
                        <img v-if="item.icon" :src="item.icon" alt="" />
                        <div>
                            <span>{{ item.type }}</span>
                            <strong>{{ item.name }}</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="desc" class="description-block">
                <span class="section-label">À propos</span>
                <p class="civilization-description">{{ desc }}</p>
            </section>
        </div>

        <footer class="panel-navigation">
            <button class="panel-previous" type="button" @click="$emit('previous')">
                <span aria-hidden="true">←</span>
                <span
                    ><small>Précédente</small
                    ><strong>{{ previous_name || displayName }}</strong></span
                >
            </button>
            <span class="panel-position">{{ position }}</span>
            <button class="panel-next" type="button" @click="$emit('next')">
                <span
                    ><small>Suivante</small><strong>{{ next_name || displayName }}</strong></span
                >
                <span aria-hidden="true">→</span>
            </button>
        </footer>
    </article>
</template>

<script setup>
    import { computed } from 'vue';
    import CivTagComponent from './subcomponents/CivTagComponent.vue';
    import CivTierComponent from './subcomponents/CivTierComponent.vue';

    const props = defineProps({
        id: Number,
        name: String,
        desc: String,
        tags_id: Array,
        tier_id: Number,
        civ_icon: String,
        civ_leader: String,
        civ_leader_icon: String,
        civ_leader_effect: String,
        civ_units: Array,
        civ_building: Array,
        position: String,
        previous_name: String,
        next_name: String,
    });

    defineEmits(['close', 'previous', 'next']);

    const tiers = [
        {
            letter: 'S',
            rank: 'Légende',
            label: 'oklch(0.86 0.1 85)',
            line: 'linear-gradient(90deg, oklch(0.8 0.14 20), oklch(0.84 0.13 85), oklch(0.8 0.14 155), oklch(0.78 0.13 230), oklch(0.74 0.15 300))',
        },
        { letter: 'A', rank: 'Empire', label: '#b5abfc', line: '#9184d9' },
        { letter: 'B', rank: 'Royaume', label: 'oklch(0.84 0.11 88)', line: 'oklch(0.8 0.13 85)' },
        { letter: 'C', rank: 'Cité', label: 'oklch(0.82 0.01 260)', line: 'oklch(0.85 0.01 260)' },
        { letter: 'D', rank: 'Tribu', label: 'oklch(0.72 0.08 60)', line: 'oklch(0.62 0.08 50)' },
    ];

    const tier = computed(() => tiers[props.tier_id] ?? tiers[4]);
    const displayName = computed(() => props.name?.split('|')[0] ?? '');
    const civBackground = computed(() => '/img/card-cover2.jpg');
    const tierPalette = computed(() => ({ '--tier-line': tier.value.line }));
    const uniqueItems = computed(() => [
        ...(props.civ_units || []).map(item => normalizeItem(item, 'Unité')),
        ...(props.civ_building || []).map(item => normalizeItem(item, 'Bâtiment')),
    ]);

    function normalizeItem(item, type) {
        if (typeof item === 'string') return { name: item.split('|')[0], icon: '', type };
        return { name: item?.name?.split('|')[0] || '', icon: item?.icon || '', type };
    }
</script>

<style scoped>
    .civilization-panel {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        color: #f3f5fe;
        background: linear-gradient(to bottom, #232532, #161826);
    }
    .panel-accent {
        position: absolute;
        z-index: 3;
        top: 0;
        right: 0;
        left: 0;
        height: 0.125rem;
    }
    .panel-hero {
        position: relative;
        height: 15rem;
        overflow: hidden;
        background: #232532;
    }
    .hero-visual {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.56;
        filter: saturate(0.7) contrast(1.05);
    }
    .hero-grain {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            135deg,
            rgb(233 233 237 / 5%) 0 0.5rem,
            transparent 0.5rem 1rem
        );
    }
    .hero-label {
        position: absolute;
        z-index: 1;
        top: 4rem;
        left: 1.5rem;
        margin: 0;
        color: #8e92a3;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.625rem;
    }
    .hero-gradient {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 8.75rem;
        background: linear-gradient(to bottom, transparent, #232532);
    }
    .panel-controls {
        position: absolute;
        z-index: 2;
        top: 0.75rem;
        right: 0.75rem;
        left: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.375rem;
    }
    .panel-controls button {
        display: grid;
        width: 2.125rem;
        height: 2.125rem;
        place-items: center;
        border: 1px solid #595d6c;
        border-radius: 0.5rem;
        color: #cfd3e5;
        background: rgb(22 24 38 / 72%);
        font-size: 1.25rem;
        line-height: 1;
        cursor: pointer;
    }
    .panel-controls button:hover {
        border-color: var(--tier-line);
        background: #343744;
    }
    .panel-controls .panel-close {
        margin-left: auto;
        font-size: 1.35rem;
    }
    .panel-controls .panel-position {
        display: block;
        min-width: 0;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        color: #aeb3c6;
        background: rgb(22 24 38 / 72%);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.6875rem;
        letter-spacing: 0.08em;
    }
    .panel-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 1.5rem;
        padding: 0 1.5rem 1.75rem;
    }
    .panel-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        margin-top: -3.5rem;
    }
    .identity-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    .civilization-icon {
        width: 2.75rem;
        height: 2.75rem;
        object-fit: contain;
        filter: drop-shadow(0 0.2rem 0.35rem rgb(0 0 0 / 50%));
    }
    .panel-name {
        margin: 0;
        font-size: clamp(2rem, 7vw, 2.125rem);
        font-weight: 500;
        letter-spacing: -0.025em;
        line-height: 1.05;
    }
    .panel-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        margin-top: 0;
    }
    .tier-summary {
        display: flex;
        align-items: flex-end;
        gap: 0.625rem;
        flex: none;
    }
    .tier-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.125rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.625rem;
        letter-spacing: 0.14em;
        color: #8e92a3;
    }
    .tier-meta strong {
        font-size: 0.6875rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
    }
    .panel-tier-badge {
        --tier-badge-size: 3.25rem;
    }
    .ornament {
        height: 0.625rem;
        opacity: 0.6;
        background-image: repeating-linear-gradient(
            90deg,
            transparent 0 0.5rem,
            #595d6c 0.5rem 0.625rem,
            transparent 0.625rem 1rem
        );
        mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
    }
    .ability-block {
        padding: 0.875rem 1rem;
        border: 1px solid color-mix(in srgb, var(--tier-line) 38%, transparent);
        border-radius: 0.625rem;
        background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--tier-line) 16%, transparent),
            transparent
        );
    }
    .ability-block span,
    .section-label,
    .leader-block span,
    .unique-item span {
        color: #8e92a3;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.625rem;
        font-weight: 500;
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .ability-block p {
        margin: 0.35rem 0 0;
        color: #e3e5ee;
        font-size: 0.875rem;
        line-height: 1.55;
    }
    .leader-block {
        display: flex;
        align-items: center;
        gap: 0.875rem;
    }
    .leader-block img {
        width: 3.5rem;
        height: 3.5rem;
        object-fit: contain;
        border-radius: 50%;
        background: #1e202b;
        box-shadow:
            0 0 0 1px var(--tier-line),
            0 0 1.125rem color-mix(in srgb, var(--tier-line) 30%, transparent);
    }
    .leader-name {
        margin: 0.2rem 0 0;
        font-size: 1rem;
        font-weight: 500;
    }
    .unique-section,
    .description-block {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
    }
    .unique-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.625rem;
    }
    .unique-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        min-height: 4rem;
        padding: 0.625rem;
        border: 1px solid #3f424d;
        border-radius: 0.625rem;
        background: rgb(35 37 50 / 78%);
    }
    .unique-item img {
        width: 2rem;
        height: 2rem;
        object-fit: contain;
    }
    .unique-item div {
        display: flex;
        min-width: 0;
        flex-direction: column;
        gap: 0.25rem;
    }
    .unique-item strong {
        overflow: hidden;
        font-size: 0.8125rem;
        font-weight: 500;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .civilization-description {
        margin: 0;
        color: #aeb3c6;
        font-size: 0.875rem;
        line-height: 1.65;
        text-wrap: pretty;
    }
    .panel-navigation {
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-top: auto;
        border-top: 1px solid #3f424d;
    }
    .panel-navigation button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 0;
        padding: 0.875rem 1.25rem;
        border: 0;
        color: #e3e5ee;
        background: transparent;
        text-align: left;
        cursor: pointer;
    }
    .panel-navigation button:hover {
        background: rgb(233 233 237 / 5%);
    }
    .panel-navigation button > span:last-child {
        display: flex;
        min-width: 0;
        flex-direction: column;
        gap: 0.125rem;
    }
    .panel-navigation small {
        color: #8e92a3;
        font-size: 0.6875rem;
    }
    .panel-navigation strong {
        overflow: hidden;
        font-size: 0.8125rem;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .panel-next {
        justify-content: flex-end;
        border-left: 1px solid #3f424d !important;
        text-align: right !important;
    }
    @media (max-width: 420px) {
        .panel-content {
            padding-inline: 1rem;
        }
        .panel-heading {
            align-items: flex-start;
        }
        .panel-tier-badge {
            --tier-badge-size: 2.75rem;
        }
        .unique-grid {
            grid-template-columns: 1fr;
        }
        .panel-navigation button {
            padding-inline: 0.75rem;
        }
    }
</style>
