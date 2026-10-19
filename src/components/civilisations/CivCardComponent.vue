<template>
    <article
        class="portrait-card"
        role="button"
        tabindex="0"
        :style="tierPalette"
        :aria-label="`Ouvrir les détails de ${displayName}`"
        @click="openDetails"
        @keydown.enter.prevent="openDetails"
        @keydown.space.prevent="openDetails"
    >
        <img class="card-visual" alt="" :src="imagePath" />
        <div class="card-grain"></div>
        <p class="visual-label">visuel · {{ displayName }}</p>
        <div class="card-gradient"></div>
        <div class="tier-frame"></div>
        <div class="tier-accent"></div>

        <CivTierComponent :tier_id="tier_id" class="card-tier-badge" />

        <div class="card-footer">
            <h2>{{ displayName }}</h2>
            <div v-if="tags_id?.length" class="card-tags">
                <CivTagComponent v-for="tag_id in tags_id" :key="tag_id" :tag_id="tag_id" />
            </div>
        </div>
    </article>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import { translationStore } from '../../stores/index';
    import CivTagComponent from './subcomponents/CivTagComponent.vue';
    import CivTierComponent from './subcomponents/CivTierComponent.vue';

    const props = defineProps({
        id: Number,
        name: String,
        desc: String,
        tags_id: Array,
        tier_id: Number,
        civ_leader_effect: String,
    });

    const store = translationStore();
    const selectedState = ref(false);
    const selectedCard = ref(null);

    const displayName = computed(() => props.name?.split('|')[0] ?? '');
    const imagePath = computed(() => '/img/card-cover2.jpg');
    const tierPalettes = [
        {
            line: 'linear-gradient(90deg, oklch(0.8 0.14 20), oklch(0.84 0.13 85), oklch(0.8 0.14 155), oklch(0.78 0.13 230), oklch(0.74 0.15 300))',
            frame: 'oklch(0.8 0.12 300 / 0.45)',
            hover: 'oklch(0.78 0.13 300)',
            glow: 'oklch(0.78 0.14 300 / 0.3)',
        },
        {
            line: '#9184d9',
            frame: 'rgb(145 132 217 / 40%)',
            hover: '#9184d9',
            glow: 'rgb(145 132 217 / 28%)',
        },
        {
            line: 'oklch(0.8 0.13 85)',
            frame: 'oklch(0.8 0.13 85 / 0.28)',
            hover: 'oklch(0.8 0.13 85)',
            glow: 'oklch(0.8 0.13 85 / 0.28)',
        },
        {
            line: 'oklch(0.85 0.01 260)',
            frame: 'oklch(0.85 0.01 260 / 0.18)',
            hover: 'oklch(0.85 0.01 260)',
            glow: 'oklch(0.85 0.01 260 / 0.2)',
        },
        {
            line: 'oklch(0.62 0.08 50)',
            frame: 'oklch(0.62 0.08 50 / 0.22)',
            hover: 'oklch(0.62 0.08 50)',
            glow: 'oklch(0.62 0.08 50 / 0.22)',
        },
    ];
    const tierPalette = computed(() => {
        const palette = tierPalettes[props.tier_id] ?? tierPalettes[4];
        return {
            '--tier-line': palette.line,
            '--tier-frame': palette.frame,
            '--tier-hover': palette.hover,
            '--tier-glow': palette.glow,
        };
    });

    function openDetails() {
        selectedCard.value = props.id;
        selectedState.value = true;
        store.setSelectedCard(selectedCard.value);
        store.setSelectedState(true);
    }
</script>

<style scoped>
    .portrait-card {
        position: relative;
        aspect-ratio: 3 / 4;
        isolation: isolate;
        overflow: hidden;
        border-radius: 0.9rem;
        background: #232532;
        box-shadow:
            0 0 0 1px rgb(145 132 217 / 12%),
            0 0.75rem 1.8rem rgb(0 0 0 / 35%);
        cursor: pointer;
        transition:
            transform 200ms ease,
            box-shadow 200ms ease;
    }

    .portrait-card:hover {
        transform: translateY(-0.25rem);
        box-shadow:
            0 0 0 1px var(--tier-hover),
            0 0.9rem 2.25rem rgb(0 0 0 / 55%),
            0 0 2rem var(--tier-glow);
    }

    .portrait-card:focus-visible {
        outline: 2px solid #b5abfc;
        outline-offset: 0.25rem;
    }

    .card-visual,
    .card-grain,
    .card-gradient,
    .tier-frame,
    .tier-accent {
        position: absolute;
        pointer-events: none;
    }

    .card-visual {
        z-index: -2;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.52;
        filter: saturate(0.7) contrast(1.05);
    }

    .card-grain {
        z-index: -1;
        inset: 0;
        background: repeating-linear-gradient(
            135deg,
            rgb(233 233 237 / 5%) 0 0.5rem,
            transparent 0.5rem 1rem
        );
    }

    .visual-label {
        position: absolute;
        z-index: 1;
        top: 3.125rem;
        left: 0.875rem;
        margin: 0;
        color: #8e92a3;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.625rem;
    }

    .card-gradient {
        z-index: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 62%;
        background: linear-gradient(to bottom, transparent, rgb(22 24 38 / 86%) 55%, #161826);
    }

    .tier-frame {
        z-index: 2;
        inset: 0.45rem;
        border: 1px solid var(--tier-frame);
        border-radius: 0.625rem;
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 8%);
    }

    .tier-accent {
        z-index: 2;
        top: 0.45rem;
        left: 50%;
        width: 36%;
        height: 0.125rem;
        border-radius: 999px;
        background: var(--tier-line);
        transform: translateX(-50%);
    }

    .card-tier-badge {
        position: absolute;
        z-index: 3;
        top: 0.875rem;
        left: 0.875rem;
        --tier-badge-size: 2.5rem;
    }

    .card-footer {
        position: absolute;
        z-index: 3;
        right: 1rem;
        bottom: 1rem;
        left: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
    }

    h2 {
        margin: 0;
        color: #f3f5fe;
        font-size: clamp(1.1rem, 1.8vw, 1.3125rem);
        font-weight: 500;
        letter-spacing: -0.015em;
        line-height: 1.1;
    }

    .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
    }
</style>
