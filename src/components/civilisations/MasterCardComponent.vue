<template>
    <article class="civilization-panel">
        <div class="panel-accent" :style="{ background: badge.line }"></div>

        <div class="panel-scroll">
            <header class="panel-hero">
                <img class="hero-visual" alt="" :src="civBackground" />
                <div class="hero-hatch"></div>
                <div class="hero-gradient"></div>

                <div class="panel-controls">
                    <button
                        type="button"
                        title="Précédente (←)"
                        aria-label="Civilisation précédente"
                        @click="$emit('previous')"
                    >
                        <i class="ph ph-caret-left" aria-hidden="true"></i>
                    </button>
                    <button
                        type="button"
                        title="Suivante (→)"
                        aria-label="Civilisation suivante"
                        @click="$emit('next')"
                    >
                        <i class="ph ph-caret-right" aria-hidden="true"></i>
                    </button>
                    <span v-if="position" class="panel-position">{{ position }}</span>
                    <button
                        class="panel-close"
                        type="button"
                        title="Fermer (Échap)"
                        aria-label="Fermer le panneau"
                        @click="$emit('close')"
                    >
                        <i class="ph ph-x" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="panel-identity">
                    <div class="civilization-icon">
                        <img v-if="civ_icon" :src="civ_icon" alt="" />
                    </div>
                    <h1 class="panel-name">{{ displayName }}</h1>
                    <div class="tier-summary">
                        <div class="tier-meta">
                            <span>TIER {{ badge.letter }}</span>
                            <strong :style="{ color: badge.label }">{{ badge.rank }}</strong>
                        </div>
                        <CivTierComponent :tier_id="tier_id" :size="52" />
                    </div>
                </div>
            </header>

            <div class="meander panel-rule" aria-hidden="true"></div>

            <div class="panel-content">
                <div v-if="tags_id?.length" class="panel-tags">
                    <CivTagComponent
                        v-for="tag_id in tags_id"
                        :key="tag_id"
                        :tag_id="tag_id"
                        variant="panel"
                    />
                </div>

                <section v-if="civ_leader_effect" class="panel-section">
                    <span class="section-label section-label-accent">
                        <i class="ph ph-star-four" aria-hidden="true"></i>Bonus de civilisation
                    </span>
                    <div class="bonus-block">
                        <strong v-if="civ_trait_name">{{ cleanName(civ_trait_name) }}</strong>
                        <p>{{ civ_leader_effect }}</p>
                    </div>
                </section>

                <section v-if="civ_leader" class="panel-section">
                    <span class="section-label">
                        <i class="ph ph-crown-simple" aria-hidden="true"></i>Dirigeant
                    </span>
                    <div class="leader-block">
                        <div class="leader-portrait">
                            <img v-if="civ_leader_icon" :src="civ_leader_icon" alt="" />
                        </div>
                        <div class="leader-text">
                            <h2 class="leader-name">{{ cleanName(civ_leader) }}</h2>
                            <span v-if="civ_leader_subtitle" class="leader-subtitle">{{
                                civ_leader_subtitle
                            }}</span>
                            <p v-if="civ_leader_text">{{ civ_leader_text }}</p>
                        </div>
                    </div>
                </section>

                <div v-if="units.length || buildings.length" class="unique-columns">
                    <section class="panel-section">
                        <span class="section-label">
                            <i class="ph ph-sword" aria-hidden="true"></i>Unités uniques
                        </span>
                        <div v-for="item in units" :key="item.name" class="unique-item">
                            <span class="unique-icon">
                                <img v-if="item.icon" :src="item.icon" alt="" />
                            </span>
                            {{ item.name }}
                        </div>
                    </section>
                    <section class="panel-section">
                        <span class="section-label">
                            <i class="ph ph-castle-turret" aria-hidden="true"></i>Bâtiments uniques
                        </span>
                        <div v-for="item in buildings" :key="item.name" class="unique-item">
                            <span class="unique-icon">
                                <img v-if="item.icon" :src="item.icon" alt="" />
                            </span>
                            {{ item.name }}
                        </div>
                    </section>
                </div>

                <section v-if="desc" class="panel-section">
                    <span class="section-label">
                        <i class="ph ph-book-open-text" aria-hidden="true"></i>Histoire
                    </span>
                    <p class="civilization-description">{{ desc }}</p>
                </section>
            </div>
        </div>

        <footer class="panel-navigation">
            <button class="panel-previous" type="button" @click="$emit('previous')">
                <i class="ph ph-arrow-left" aria-hidden="true"></i>
                <span class="nav-text">
                    <small>Précédente</small>
                    <strong>{{ cleanName(previous_name) || displayName }}</strong>
                </span>
            </button>
            <button class="panel-next" type="button" @click="$emit('next')">
                <span class="nav-text">
                    <small>Suivante</small>
                    <strong>{{ cleanName(next_name) || displayName }}</strong>
                </span>
                <i class="ph ph-arrow-right" aria-hidden="true"></i>
            </button>
        </footer>
    </article>
</template>

<script setup>
    import { computed } from 'vue';
    import CivTagComponent from './subcomponents/CivTagComponent.vue';
    import CivTierComponent from './subcomponents/CivTierComponent.vue';
    import { tierBadge } from './tierDesign';

    const props = defineProps({
        id: Number,
        name: String,
        desc: String,
        tags_id: Array,
        tier_id: Number,
        civ_icon: String,
        civ_trait_name: String,
        civ_leader: String,
        civ_leader_icon: String,
        civ_leader_subtitle: String,
        civ_leader_text: String,
        civ_leader_effect: String,
        civ_units: Array,
        civ_building: Array,
        position: String,
        previous_name: String,
        next_name: String,
    });

    defineEmits(['close', 'previous', 'next']);

    const badge = computed(() => tierBadge(props.tier_id));
    const displayName = computed(() => cleanName(props.name));
    const civBackground = computed(() => '/img/card-cover2.jpg');
    const units = computed(() => (props.civ_units || []).map(normalizeItem));
    const buildings = computed(() => (props.civ_building || []).map(normalizeItem));

    /** API names carry singular|plural forms ("Minuteman|Minutemen"). */
    function cleanName(value) {
        return value?.split('|')[0] ?? '';
    }
    function normalizeItem(item) {
        if (typeof item === 'string') return { name: cleanName(item), icon: '' };
        return { name: cleanName(item?.name), icon: item?.icon || '' };
    }
</script>

<style scoped>
    .civilization-panel {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        color: var(--color-text);
    }
    .panel-accent {
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        left: 0;
        height: 2px;
    }
    .panel-scroll {
        flex: 1;
        min-height: 0;
        overflow: auto;
    }

    /* — hero — */
    .panel-hero {
        position: relative;
        height: 240px;
        background-color: var(--color-neutral-900);
    }
    .hero-visual,
    .hero-hatch,
    .hero-gradient {
        position: absolute;
        pointer-events: none;
    }
    .hero-visual {
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.56;
        filter: saturate(0.7) contrast(1.05);
    }
    .hero-hatch {
        inset: 0;
        background: repeating-linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-text) 4%, transparent) 0 8px,
            transparent 8px 16px
        );
    }
    .hero-gradient {
        inset: auto 0 0 0;
        height: 140px;
        background: linear-gradient(to bottom, transparent, var(--color-surface));
    }
    .panel-controls {
        position: absolute;
        top: 12px;
        right: 12px;
        left: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .panel-controls button {
        display: flex;
        width: 34px;
        height: 34px;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 0;
        border-radius: var(--radius-md);
        color: var(--color-neutral-300);
        background: color-mix(in srgb, var(--color-bg) 70%, transparent);
        box-shadow: var(--shadow-sm);
        font-size: 15px;
        cursor: pointer;
    }
    .panel-controls button:hover {
        color: var(--color-accent-300);
        box-shadow: 0 0 0 1px var(--color-accent);
    }
    .panel-controls .panel-close {
        margin-left: auto;
    }
    .panel-controls .panel-close:hover {
        color: var(--color-text);
        box-shadow: var(--shadow-md);
    }
    .panel-position {
        margin-left: 6px;
        padding: 4px 8px;
        border-radius: 6px;
        color: var(--color-neutral-400);
        background: color-mix(in srgb, var(--color-bg) 70%, transparent);
        font: 500 11px var(--font-mono);
    }
    .panel-identity {
        position: absolute;
        right: 24px;
        bottom: 4px;
        left: 24px;
        display: flex;
        align-items: flex-end;
        gap: 14px;
    }
    .civilization-icon {
        display: grid;
        width: 52px;
        height: 52px;
        flex: none;
        place-items: center;
        overflow: hidden;
        border-radius: 50%;
        background: var(--color-bg);
        box-shadow: 0 0 0 1px var(--color-neutral-700);
    }
    .civilization-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .panel-name {
        flex: 1;
        min-width: 0;
        margin: 0;
        font-size: 34px;
        font-weight: 500;
        letter-spacing: -0.025em;
        line-height: 1.05;
        overflow-wrap: anywhere;
    }
    .tier-summary {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 2px;
    }
    .tier-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
    }
    .tier-meta span {
        color: var(--color-neutral-500);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
    }
    .tier-meta strong {
        font: 500 11px var(--font-mono);
        letter-spacing: 0.18em;
        text-transform: uppercase;
    }
    .panel-rule {
        margin: 10px 24px 0;
        opacity: 0.6;
    }

    /* — body — */
    .panel-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 18px 24px 28px;
    }
    .panel-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
    .panel-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
    }
    .section-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--color-neutral-500);
        font: 500 11px var(--font-mono);
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    .section-label .ph {
        font-size: 13px;
    }
    .section-label-accent {
        color: var(--color-accent-400);
    }
    .bonus-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 14px 16px;
        border-radius: var(--radius-md);
        background: linear-gradient(
            135deg,
            var(--color-accent-900),
            color-mix(in srgb, var(--color-accent-900) 40%, transparent)
        );
        box-shadow: inset 0 0 0 1px var(--color-accent-800);
    }
    .bonus-block strong {
        color: var(--color-accent-200);
        font-size: 15px;
        font-weight: 500;
    }
    .bonus-block p {
        margin: 0;
        color: var(--color-neutral-200);
        font-size: 14px;
        line-height: 1.55;
        text-wrap: pretty;
    }
    .leader-block {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 14px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
    }
    .leader-portrait {
        width: 56px;
        height: 56px;
        flex: none;
        overflow: hidden;
        border-radius: 50%;
        background-color: var(--color-neutral-900);
        background-image: repeating-linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-text) 6%, transparent) 0 4px,
            transparent 4px 8px
        );
        box-shadow:
            0 0 0 1.5px var(--color-accent),
            0 0 18px color-mix(in srgb, var(--color-accent) 30%, transparent);
    }
    .leader-portrait img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .leader-text {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
    }
    .leader-name {
        margin: 0;
        font-size: 17px;
        font-weight: 500;
        line-height: 1.3;
        letter-spacing: -0.01em;
    }
    .leader-subtitle {
        color: var(--color-accent-300);
        font-size: 12px;
    }
    .leader-text p {
        display: -webkit-box;
        margin: 3px 0 0;
        overflow: hidden;
        color: var(--color-neutral-300);
        font-size: 13.5px;
        line-height: 1.5;
        text-wrap: pretty;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        line-clamp: 4;
    }
    .unique-columns {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 10px;
    }
    .unique-item {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 46px;
        padding: 0 10px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        font-size: 14px;
        line-height: 1.2;
    }
    .unique-icon {
        width: 28px;
        height: 28px;
        flex: none;
        overflow: hidden;
        border-radius: 6px;
        background: var(--color-neutral-900);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
    }
    .unique-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .civilization-description {
        margin: 0;
        color: var(--color-neutral-400);
        font-size: 14px;
        line-height: 1.65;
        text-wrap: pretty;
    }

    /* — pinned footer — */
    .panel-navigation {
        display: grid;
        flex: none;
        grid-template-columns: 1fr 1fr;
        box-shadow: 0 -1px 0 var(--color-neutral-800);
    }
    .panel-navigation button {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        padding: 14px 24px;
        border: 0;
        color: var(--color-text);
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
    }
    .panel-navigation button:hover {
        background: color-mix(in srgb, var(--color-text) 5%, transparent);
    }
    .panel-navigation .ph {
        font-size: 16px;
        color: var(--color-neutral-500);
    }
    .nav-text {
        display: flex;
        min-width: 0;
        flex-direction: column;
        gap: 1px;
    }
    .nav-text small {
        color: var(--color-neutral-500);
        font-size: 11px;
    }
    .nav-text strong {
        overflow: hidden;
        font-size: 14px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .panel-navigation .panel-next {
        justify-content: flex-end;
        text-align: right;
        box-shadow: -1px 0 0 var(--color-neutral-800);
    }

    @media (max-width: 420px) {
        .panel-identity {
            right: 16px;
            left: 16px;
            gap: 10px;
        }
        .panel-name {
            font-size: 26px;
        }
        .tier-meta {
            display: none;
        }
        .panel-content {
            padding-inline: 16px;
        }
        .unique-columns {
            grid-template-columns: 1fr;
        }
        .panel-navigation button {
            padding-inline: 16px;
        }
    }
</style>
