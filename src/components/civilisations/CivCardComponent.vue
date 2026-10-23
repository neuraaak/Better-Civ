<template>
    <article
        class="civ-card"
        :class="[`${variant}-card`, { selected }]"
        role="button"
        tabindex="0"
        :style="tierPalette"
        :aria-label="t.ui.openDetails.replace('{name}', displayName)"
        :aria-pressed="selected"
        @click="openDetails"
        @keydown.enter.prevent="openDetails"
        @keydown.space.prevent="openDetails"
    >
        <template v-if="variant === 'portrait'">
            <img class="card-visual" alt="" :src="imagePath" loading="lazy" decoding="async" />
            <div class="card-hatch"></div>
            <div class="card-hex"></div>
            <div class="card-halo"></div>
            <div class="card-gradient"></div>
            <div class="tier-frame"></div>
            <div class="frieze card-frieze"></div>
            <div class="card-flute left"></div>
            <div class="card-flute right"></div>

            <CivTierComponent
                :tier_id="tier_id"
                :size="compact ? 40 : 52"
                class="card-tier-badge"
            />
            <p class="card-rank">{{ badge.rank }}</p>

            <div class="card-footer">
                <h2>{{ displayName }}</h2>
                <p v-if="leader" class="card-leader">{{ leader }}</p>
                <div class="card-rules" aria-hidden="true"><i></i><i></i><i></i></div>
                <div v-if="tags_id?.length" class="card-tags">
                    <CivTagComponent v-for="tag_id in tags_id" :key="tag_id" :tag_id="tag_id" />
                </div>
            </div>
        </template>

        <template v-else>
            <div class="classic-media">
                <img class="card-visual" alt="" :src="imagePath" loading="lazy" decoding="async" />
                <div class="card-hatch"></div>
            </div>
            <div class="classic-body">
                <div class="classic-title">
                    <h2>{{ displayName }}</h2>
                    <CivTierComponent :tier_id="tier_id" :size="32" />
                </div>
                <div v-if="tags_id?.length" class="card-tags">
                    <CivTagComponent
                        v-for="tag_id in tags_id"
                        :key="tag_id"
                        :tag_id="tag_id"
                        variant="classic"
                    />
                </div>
            </div>
        </template>
    </article>
</template>

<script setup lang="ts">
    import { useMediaQuery } from '@vueuse/core';
    import { computed } from 'vue';
    import type { CardStyle } from '../../data/displayOptions';
    import type { TagId, TierId } from '../../data/taxonomy';
    import { useMessages } from '../../i18n/useMessages';
    import { useAppStore } from '../../stores/app';
    import { cleanName } from '../../utils/civName';
    import CivTagComponent from './subcomponents/CivTagComponent.vue';
    import CivTierComponent from './subcomponents/CivTierComponent.vue';
    import { tierBadge } from './tierDesign';

    const props = withDefaults(
        defineProps<{
            id: number;
            name: string;
            tags_id?: TagId[];
            tier_id?: TierId;
            /** Leader name, shown under the civilization on the portrait card. */
            leader_name?: string;
            selected?: boolean;
            /** Card layout, see data/displayOptions.ts. */
            variant?: CardStyle;
        }>(),
        {
            tags_id: () => [],
            tier_id: undefined,
            leader_name: undefined,
            selected: false,
            variant: 'portrait',
        }
    );

    const store = useAppStore();
    const t = useMessages();
    const displayName = computed(() => cleanName(props.name));
    const leader = computed(() => cleanName(props.leader_name));
    // Below 640px the card is a row (see the stylesheet): the badge shrinks with it
    const compact = useMediaQuery('(max-width: 640px)');
    const imagePath = computed(() => '/img/civ5-card-bg.webp');
    const badge = computed(() => tierBadge(props.tier_id, store.lang));
    const tierPalette = computed(() => ({
        '--tier-line': badge.value.line,
        '--tier-frame': badge.value.frame,
        '--tier-label': badge.value.label,
        '--frieze-color': badge.value.line,
    }));

    function openDetails() {
        store.openDetail(props.id);
    }
</script>

<style scoped>
    .civ-card {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        border-radius: var(--radius-lg);
        background: var(--color-surface);
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }
    .civ-card.selected {
        box-shadow:
            0 0 0 1.5px var(--color-accent),
            0 0 30px color-mix(in srgb, var(--color-accent) 35%, transparent);
    }
    /* Mouse only: on touch screens the lift would stick after the tap */
    @media (hover: hover) {
        .classic-card:hover {
            transform: translateY(-4px);
            box-shadow:
                0 0 0 1px var(--color-accent),
                0 14px 36px rgba(0, 0, 0, 0.55),
                0 0 32px color-mix(in srgb, var(--color-accent) 28%, transparent);
        }
        /* The portrait card glows in its own tier colour, not in the accent */
        .portrait-card:hover {
            transform: translateY(-5px);
            box-shadow:
                0 0 0 1px var(--tier-frame),
                0 18px 40px -12px rgba(0, 0, 0, 0.6),
                0 0 36px var(--tier-frame);
        }
        .portrait-card.selected:hover {
            box-shadow:
                0 0 0 1.5px var(--color-accent),
                0 0 30px color-mix(in srgb, var(--color-accent) 35%, transparent);
        }
    }

    .card-visual,
    .card-hatch,
    .card-hex,
    .card-halo,
    .card-gradient,
    .tier-frame,
    .card-frieze,
    .card-flute {
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
    .card-hatch {
        z-index: -1;
        inset: 0;
        background: repeating-linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-text) 4%, transparent) 0 8px,
            transparent 8px 16px
        );
    }
    h2 {
        margin: 0;
        color: var(--color-text);
        font-weight: 500;
    }
    .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    /* — portrait — */
    .portrait-card {
        aspect-ratio: 3 / 4;
        background: linear-gradient(165deg, var(--color-surface), var(--color-bg) 90%);
    }
    .card-gradient {
        inset: auto 0 0 0;
        height: 60%;
        background: linear-gradient(
            to bottom,
            transparent,
            color-mix(in srgb, var(--color-bg) 88%, transparent) 50%,
            var(--color-bg)
        );
    }
    /* Hexagon weave and tier halo, both lit up on hover */
    .card-hex {
        inset: 0;
        background-image: var(--hex-pattern);
        background-size: 28px 49px;
        opacity: 0.06;
        -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 34%, #000, transparent 80%);
        mask-image: radial-gradient(ellipse 70% 50% at 50% 34%, #000, transparent 80%);
        transition: opacity 0.35s;
    }
    .card-halo {
        top: 32%;
        left: 50%;
        width: 150%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, var(--tier-frame), transparent 55%);
        opacity: 0.45;
        transform: translate(-50%, -50%);
        transition: opacity 0.35s;
    }
    .tier-frame {
        inset: 7px;
        border-radius: 10px;
        box-shadow: inset 0 0 0 1px var(--tier-frame);
    }
    .card-frieze {
        top: 14px;
        right: 14px;
        left: 14px;
        opacity: 0.5;
        transition: opacity 0.3s;
    }
    /* Fluted columns down both sides of the portrait */
    .card-flute {
        top: 34px;
        bottom: 34px;
        width: 7px;
        background: repeating-linear-gradient(90deg, var(--tier-frame) 0 1px, transparent 1px 3px);
        opacity: 0.45;
        -webkit-mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 20%,
            #000 80%,
            transparent
        );
        mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
        transition: opacity 0.3s;
    }
    .card-flute.left {
        left: 13px;
    }
    .card-flute.right {
        right: 13px;
    }
    .card-tier-badge {
        position: absolute;
        top: 34px;
        left: 50%;
        transform: translateX(-50%);
        transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    .card-rank {
        position: absolute;
        top: 94px;
        right: 0;
        left: 0;
        margin: 0;
        color: var(--tier-label);
        font: 500 9px/1 var(--font-mono);
        letter-spacing: 0.22em;
        text-align: center;
        text-transform: uppercase;
    }
    .card-footer {
        position: absolute;
        right: 22px;
        bottom: 20px;
        left: 22px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 9px;
        text-align: center;
    }
    .portrait-card h2 {
        font: 600 19px/1.1 var(--font-display);
        letter-spacing: 0.05em;
        text-wrap: balance;
    }
    .card-leader {
        margin: 0;
        color: var(--color-neutral-500);
        font: 500 10px/1 var(--font-mono);
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    /* Three tapered rules, widest last */
    .card-rules {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        gap: 2px;
    }
    .card-rules i {
        height: 1px;
        background: var(--tier-frame);
    }
    .card-rules i:nth-child(1) {
        width: 44%;
    }
    .card-rules i:nth-child(2) {
        width: 58%;
        opacity: 0.7;
    }
    .card-rules i:nth-child(3) {
        width: 72%;
        opacity: 0.45;
    }
    .portrait-card .card-tags {
        justify-content: center;
    }

    @media (hover: hover) {
        .portrait-card:hover .card-hex {
            opacity: 0.16;
        }
        .portrait-card:hover .card-halo {
            opacity: 1;
        }
        .portrait-card:hover .card-frieze,
        .portrait-card:hover .card-flute {
            opacity: 0.9;
        }
        .portrait-card:hover .card-tier-badge {
            transform: translateX(-50%) scale(1.08);
        }
    }

    /* — classic — */
    .classic-card {
        display: flex;
        flex-direction: column;
    }
    .classic-media {
        position: relative;
        z-index: 0;
        aspect-ratio: 16 / 10;
        overflow: hidden;
        background: var(--color-neutral-900);
    }
    .classic-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px 14px 16px;
    }
    .classic-title {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .classic-card h2 {
        flex: 1;
        min-width: 0;
        font-size: 17px;
        letter-spacing: -0.01em;
        line-height: 1.2;
    }

    /* — phone: the portrait card becomes a compact row — */
    @media (max-width: 640px) {
        .portrait-card {
            display: flex;
            align-items: center;
            gap: 14px;
            min-height: 84px;
            padding: 12px 14px;
            aspect-ratio: auto;
        }
        .portrait-card .card-gradient {
            inset: 0;
            height: auto;
            background: linear-gradient(
                to right,
                var(--color-bg) 30%,
                color-mix(in srgb, var(--color-bg) 55%, transparent)
            );
        }
        .portrait-card .tier-frame {
            inset: 5px;
            border-radius: 11px;
        }
        /* The portrait ornaments need the portrait's height: the row drops them
           and keeps a single tier-coloured edge instead */
        .portrait-card .card-hex,
        .portrait-card .card-halo,
        .portrait-card .card-frieze,
        .portrait-card .card-rank {
            display: none;
        }
        .portrait-card .card-flute.right {
            display: none;
        }
        .portrait-card .card-flute.left {
            top: 50%;
            bottom: auto;
            left: 5px;
            width: 2px;
            height: 44%;
            background: var(--tier-line);
            opacity: 1;
            transform: translateY(-50%);
            -webkit-mask-image: none;
            mask-image: none;
        }
        /* In the flow, but still painted above the absolute visual layers */
        .portrait-card .card-tier-badge {
            position: relative;
            top: auto;
            left: auto;
            transform: none;
        }
        .portrait-card .card-footer {
            position: relative;
            inset: auto;
            flex: 1;
            min-width: 0;
            align-items: flex-start;
            gap: 6px;
            text-align: left;
        }
        .portrait-card h2 {
            font-size: 17px;
        }
        .portrait-card .card-leader,
        .portrait-card .card-rules {
            display: none;
        }
        .portrait-card .card-tags {
            justify-content: flex-start;
            gap: 4px;
        }
    }
</style>
