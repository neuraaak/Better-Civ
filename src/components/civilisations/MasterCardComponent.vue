<template>
    <article ref="panel" class="civilization-panel" :style="palette">
        <div class="panel-bar">
            <button
                type="button"
                :title="ui.previous"
                :aria-label="ui.previous"
                @click="$emit('previous')"
            >
                <PhIcon name="caret-left" />
            </button>
            <button type="button" :title="ui.next" :aria-label="ui.next" @click="$emit('next')">
                <PhIcon name="caret-right" />
            </button>
            <span v-if="position" class="panel-position">{{ position }}</span>
            <button
                class="panel-close"
                type="button"
                :title="ui.close"
                :aria-label="ui.close"
                @click="$emit('close')"
            >
                <PhIcon name="x" />
            </button>
            <div class="frieze bar-frieze" aria-hidden="true"></div>
        </div>

        <div ref="scroller" class="panel-scroll">
            <header class="panel-hero">
                <div class="hero-hex" aria-hidden="true"></div>
                <div class="hero-halo" aria-hidden="true"></div>
                <div class="hero-flute left" aria-hidden="true"></div>
                <div class="hero-flute right" aria-hidden="true"></div>

                <CivTierComponent :tier_id="civ.tier_id" :size="76" />
                <p class="hero-rank">{{ ui.tier }} {{ badge.letter }} · {{ badge.rank }}</p>
                <h1 class="hero-name">{{ displayName }}</h1>
                <div class="hero-rules" aria-hidden="true"><i></i><i></i><i></i></div>
                <div v-if="civ.tags_id?.length" class="panel-tags">
                    <CivTagComponent
                        v-for="tag_id in civ.tags_id"
                        :key="tag_id"
                        :tag_id="tag_id"
                        variant="panel"
                    />
                </div>
            </header>

            <div class="panel-content">
                <section v-if="bonus?.effect" class="bonus-block">
                    <div class="bonus-accent" aria-hidden="true"></div>
                    <span class="section-label section-label-accent">
                        <PhIcon name="star-four" />{{ ui.bonus }}
                    </span>
                    <strong v-if="bonus.name">{{ cleanName(bonus.name) }}</strong>
                    <p>{{ bonus.effect }}</p>
                </section>

                <section v-if="leader?.name" class="panel-section">
                    <h2 class="section-heading">
                        <PhIcon name="crown-simple" /><span>{{ ui.leader }}</span>
                    </h2>
                    <div class="leader-block">
                        <div class="leader-portrait">
                            <img v-if="leader.icon" :src="leader.icon" alt="" />
                        </div>
                        <div class="leader-text">
                            <strong class="leader-name">{{ cleanName(leader.name) }}</strong>
                            <span v-if="leader.subtitle" class="leader-subtitle">{{
                                leader.subtitle
                            }}</span>
                            <p v-if="leader.historical_info?.[0]?.text">
                                {{ leader.historical_info[0].text }}
                            </p>
                        </div>
                    </div>
                </section>

                <section v-if="items.length" class="panel-section">
                    <h2 class="section-heading">
                        <PhIcon name="seal-check" /><span>{{ ui.uniqueElements }}</span>
                    </h2>
                    <div class="item-tabs" role="tablist">
                        <button
                            v-for="tab in tabs"
                            :key="tab.key"
                            type="button"
                            role="tab"
                            class="item-tab"
                            :class="{ active: tab.key === activeTab, empty: !tab.count }"
                            :aria-selected="tab.key === activeTab"
                            :disabled="!tab.count"
                            @click="activeTab = tab.key"
                        >
                            <PhIcon :name="tab.icon" />{{ tab.label }}
                            <span class="item-tab-count">{{ tab.count }}</span>
                        </button>
                    </div>

                    <article v-for="item in items" :key="item.name" class="unique-item">
                        <div class="item-body">
                            <div class="item-head">
                                <span class="item-icon">
                                    <img v-if="item.icon" :src="item.icon" alt="" />
                                    <PhIcon v-else :name="item.fallbackIcon" />
                                </span>
                                <div class="item-title">
                                    <strong>{{ item.name }}</strong>
                                    <span>{{ item.sub }}</span>
                                </div>
                            </div>
                            <div v-if="item.stats.length" class="item-stats">
                                <div v-for="stat in item.stats" :key="stat.key" class="item-stat">
                                    <span class="item-stat-key">
                                        <PhIcon :name="stat.icon" />{{ stat.key }}
                                    </span>
                                    <span class="item-stat-value">{{ stat.value }}</span>
                                </div>
                            </div>
                            <div v-if="item.yields.length" class="item-chips">
                                <span class="item-chips-label">{{ ui.yieldsLabel }}</span>
                                <span
                                    v-for="output in item.yields"
                                    :key="output.label"
                                    class="item-chip"
                                >
                                    <PhIcon
                                        :name="output.icon"
                                        :style="{ color: output.color }"
                                    />{{ output.value }} {{ output.label }}
                                </span>
                            </div>
                            <div v-if="item.terrains.length" class="item-chips">
                                <span class="item-chips-label">{{ ui.terrainsLabel }}</span>
                                <span
                                    v-for="terrain in item.terrains"
                                    :key="terrain"
                                    class="item-chip plain"
                                    >{{ terrain }}</span
                                >
                            </div>
                            <p v-if="item.description" class="item-description">
                                {{ item.description }}
                            </p>
                        </div>
                        <button
                            v-if="item.strategy"
                            type="button"
                            class="item-strategy-toggle"
                            :aria-expanded="expanded.has(item.name)"
                            @click="toggleStrategy(item.name)"
                        >
                            <PhIcon name="lightbulb" />{{ ui.strategyTips }}
                            <PhIcon
                                name="caret-down"
                                class="item-caret"
                                :class="{ open: expanded.has(item.name) }"
                            />
                        </button>
                        <p v-if="item.strategy && expanded.has(item.name)" class="item-strategy">
                            {{ item.strategy }}
                        </p>
                    </article>
                </section>

                <section v-if="history" class="panel-section">
                    <h2 class="section-heading">
                        <PhIcon name="book-open-text" /><span>{{ ui.history }}</span>
                    </h2>
                    <p class="civilization-description">{{ history }}</p>
                </section>
            </div>
        </div>

        <footer class="panel-navigation">
            <button class="panel-previous" type="button" @click="$emit('previous')">
                <PhIcon name="arrow-left" />
                <span class="nav-text">
                    <small>{{ ui.previous }}</small>
                    <strong>{{ cleanName(previous_name) || displayName }}</strong>
                </span>
            </button>
            <button class="panel-next" type="button" @click="$emit('next')">
                <span class="nav-text">
                    <small>{{ ui.next }}</small>
                    <strong>{{ cleanName(next_name) || displayName }}</strong>
                </span>
                <PhIcon name="arrow-right" />
            </button>
        </footer>
    </article>
</template>

<script setup lang="ts">
    import { useSwipe } from '@vueuse/core';
    import { computed, ref, watch } from 'vue';
    import type { UniqueItemDto } from '../../api/civApi';
    import { useMessages } from '../../i18n/useMessages';
    import { useAppStore } from '../../stores/app';
    import type { Civilization } from '../../types';
    import { cleanName } from '../../utils/civName';
    import PhIcon from '../icons/PhIcon.vue';
    import type { PhosphorIconName } from '../icons/phosphorIcons';
    import CivTagComponent from './subcomponents/CivTagComponent.vue';
    import CivTierComponent from './subcomponents/CivTierComponent.vue';
    import { tierBadge, YIELD_VISUALS } from './tierDesign';

    // TYPES
    // ##############
    type ItemKind = 'units' | 'buildings' | 'improvements';

    interface PanelStat {
        icon: PhosphorIconName;
        key: string;
        value: string;
    }

    interface PanelItem {
        name: string;
        icon: string;
        /** Drawn when the database has no icon for the item. */
        fallbackIcon: PhosphorIconName;
        sub: string;
        stats: PanelStat[];
        yields: { icon: PhosphorIconName; color: string; label: string; value: string }[];
        terrains: string[];
        description: string;
        strategy: string;
    }

    const props = withDefaults(
        defineProps<{
            civ: Civilization;
            /** "III / XII" position of the civilization in the visible list. */
            position?: string;
            previous_name?: string;
            next_name?: string;
        }>(),
        { position: '', previous_name: undefined, next_name: undefined }
    );

    const emit = defineEmits<{ close: []; previous: []; next: [] }>();

    const store = useAppStore();
    const t = useMessages();
    const ui = computed(() => t.value.ui);
    const badge = computed(() => tierBadge(props.civ.tier_id, store.lang));
    const palette = computed(() => ({
        '--tier-frame': badge.value.frame,
        '--tier-label': badge.value.label,
        '--frieze-color': badge.value.line,
    }));
    const displayName = computed(() => cleanName(props.civ.name));
    const leader = computed(() => props.civ.leader);
    const bonus = computed(() => leader.value?.trait);
    const history = computed(() => props.civ.historical_info?.[0]?.text ?? '');

    const ICONS: Record<ItemKind, PhosphorIconName> = {
        units: 'sword',
        buildings: 'castle-turret',
        improvements: 'mountains',
    };

    const groups = computed<Record<ItemKind, PanelItem[]>>(() => ({
        units: (props.civ.unique_units ?? []).map(item => panelItem(item, 'units')),
        buildings: (props.civ.unique_buildings ?? []).map(item => panelItem(item, 'buildings')),
        improvements: (props.civ.unique_improvements ?? []).map(item =>
            panelItem(item, 'improvements')
        ),
    }));
    const tabs = computed(() =>
        (Object.keys(ICONS) as ItemKind[]).map(key => ({
            key,
            icon: ICONS[key],
            label: ui.value[
                key === 'units'
                    ? 'tabUnits'
                    : key === 'buildings'
                      ? 'tabBuildings'
                      : 'tabImprovements'
            ],
            count: groups.value[key].length,
        }))
    );
    const activeTab = ref<ItemKind>('units');
    // An empty tab cannot be picked, so fall back on the first one that has items
    watch(
        groups,
        value => {
            if (!value[activeTab.value].length) {
                activeTab.value =
                    (Object.keys(ICONS) as ItemKind[]).find(key => value[key].length) ?? 'units';
            }
        },
        { immediate: true }
    );
    const items = computed(() => groups.value[activeTab.value]);

    const expanded = ref(new Set<string>());
    function toggleStrategy(name: string) {
        const next = new Set(expanded.value);
        if (!next.delete(name)) next.add(name);
        expanded.value = next;
    }

    // Touch: swipe sideways between civilizations, down from the top to close
    const panel = ref<HTMLElement | null>(null);
    const scroller = ref<HTMLElement | null>(null);
    let startedAtTop = false;
    useSwipe(panel, {
        threshold: 60,
        onSwipeStart() {
            startedAtTop = (scroller.value?.scrollTop ?? 0) <= 0;
        },
        onSwipeEnd(_event, direction) {
            if (direction === 'left') emit('next');
            else if (direction === 'right') emit('previous');
            else if (direction === 'down' && startedAtTop) emit('close');
        },
    });

    /** Yield label: only food, gold and happiness need a key of their own. */
    function yieldLabel(type: string): string {
        const fromCategory: Record<string, number> = {
            culture: 1,
            faith: 2,
            science: 3,
            production: 6,
        };
        const index = fromCategory[type];
        if (index !== undefined) return t.value.tags[index] ?? type;
        if (type === 'food') return ui.value.yieldFood;
        if (type === 'gold') return ui.value.yieldGold;
        if (type === 'happiness') return ui.value.yieldHappiness;
        return type;
    }

    function statsOf(item: Exclude<UniqueItemDto, string>, kind: ItemKind): PanelStat[] {
        const stats: PanelStat[] = [];
        if (item.cost !== undefined) {
            stats.push({
                icon: 'hammer',
                key: kind === 'units' ? ui.value.statProduction : ui.value.statCost,
                value: String(item.cost),
            });
        }
        if (item.movement !== undefined) {
            stats.push({
                icon: 'footprints',
                key: ui.value.statMovement,
                value: String(item.movement),
            });
        }
        if (item.upkeep !== undefined) {
            stats.push({
                icon: 'coins',
                key: ui.value.statUpkeep,
                value: `${item.upkeep} ${ui.value.goldPerTurn}`,
            });
        }
        if (item.tech) {
            stats.push({
                icon: 'flask',
                key: ui.value.statTechnology,
                value: cleanName(item.tech),
            });
        }
        return stats;
    }

    function panelItem(item: UniqueItemDto, kind: ItemKind): PanelItem {
        const dto = typeof item === 'string' ? { name: item } : item;
        const sub =
            kind === 'units'
                ? ui.value.uniqueUnit
                : kind === 'buildings'
                  ? ui.value.uniqueBuilding
                  : ui.value.tileImprovement;
        return {
            name: cleanName(dto.name),
            icon: dto.icon ?? '',
            fallbackIcon: ICONS[kind],
            sub,
            stats: statsOf(dto, kind),
            yields: (dto.yields ?? []).map(output => ({
                ...(YIELD_VISUALS[output.type] ?? { icon: 'star-four' as const, color: 'inherit' }),
                label: yieldLabel(output.type),
                value: output.amount > 0 ? `+${output.amount}` : String(output.amount),
            })),
            terrains: (dto.terrains ?? []).map(cleanName),
            description: dto.description ?? '',
            strategy: dto.strategy ?? '',
        };
    }
</script>

<style scoped>
    .civilization-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        color: var(--color-text);
    }

    /* — control bar — */
    .panel-bar {
        position: relative;
        display: flex;
        flex: none;
        align-items: center;
        gap: 6px;
        padding: max(12px, env(safe-area-inset-top)) 14px 12px;
    }
    .panel-bar button {
        display: flex;
        width: 34px;
        height: 34px;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 0;
        border-radius: var(--radius-md);
        color: var(--color-neutral-300);
        background: transparent;
        box-shadow: var(--shadow-sm);
        font-size: 15px;
        cursor: pointer;
    }
    .panel-bar button:hover {
        color: var(--color-accent-300);
        box-shadow: 0 0 0 1px var(--color-accent);
    }
    .panel-bar .panel-close {
        margin-left: auto;
    }
    .panel-position {
        margin-left: 6px;
        color: var(--color-neutral-400);
        font: 500 11px var(--font-mono);
        letter-spacing: 0.08em;
    }
    .bar-frieze {
        position: absolute;
        right: 14px;
        bottom: 0;
        left: 14px;
        opacity: 0.55;
    }
    .panel-scroll {
        flex: 1;
        min-height: 0;
        overflow: auto;
    }

    /* — hero — */
    .panel-hero {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        overflow: hidden;
        padding: 36px 40px 28px;
        text-align: center;
    }
    .panel-hero > * {
        position: relative;
    }
    .hero-hex,
    .hero-halo,
    .hero-flute {
        position: absolute;
        pointer-events: none;
    }
    .hero-hex {
        inset: 0;
        background-image: var(--hex-pattern);
        background-size: 28px 49px;
        opacity: 0.1;
        -webkit-mask-image: radial-gradient(ellipse 60% 70% at 50% 30%, #000, transparent 80%);
        mask-image: radial-gradient(ellipse 60% 70% at 50% 30%, #000, transparent 80%);
    }
    .hero-halo {
        top: 70px;
        left: 50%;
        width: 520px;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, var(--tier-frame), transparent 55%);
        transform: translate(-50%, -50%);
    }
    .hero-flute {
        top: 20px;
        bottom: 30px;
        width: 8px;
        background: repeating-linear-gradient(90deg, var(--tier-frame) 0 1px, transparent 1px 3px);
        opacity: 0.6;
        -webkit-mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 25%,
            #000 75%,
            transparent
        );
        mask-image: linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent);
    }
    .hero-flute.left {
        left: 14px;
    }
    .hero-flute.right {
        right: 14px;
    }
    .hero-rank {
        margin: 0;
        color: var(--tier-label);
        font: 500 10px/1 var(--font-mono);
        letter-spacing: 0.22em;
        text-transform: uppercase;
    }
    .hero-name {
        margin: 0;
        font: 600 34px/1.05 var(--font-display);
        letter-spacing: 0.04em;
        overflow-wrap: anywhere;
        text-wrap: balance;
    }
    .hero-rules {
        display: flex;
        width: 60%;
        flex-direction: column;
        align-items: center;
        gap: 2px;
    }
    .hero-rules i {
        height: 1px;
        background: var(--tier-frame);
    }
    .hero-rules i:nth-child(1) {
        width: 50%;
    }
    .hero-rules i:nth-child(2) {
        width: 70%;
        opacity: 0.7;
    }
    .hero-rules i:nth-child(3) {
        width: 90%;
        opacity: 0.45;
    }
    .panel-tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
        padding-top: 4px;
    }

    /* — body — */
    .panel-content {
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 8px 28px 36px;
    }
    .panel-section {
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-width: 0;
    }
    /* Section heading: icon, mono label, then a hairline to the right edge */
    .section-heading {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
    }
    .section-heading span {
        color: var(--color-neutral-400);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.16em;
        text-transform: uppercase;
        white-space: nowrap;
    }
    .section-heading::after {
        content: '';
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, var(--color-neutral-800), transparent);
    }
    .section-heading .ph,
    .section-label .ph {
        font-size: 14px;
        color: var(--color-accent-400);
    }
    .section-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font: 500 10px var(--font-mono);
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }
    .section-label-accent {
        color: var(--color-accent-300);
    }

    /* — civilization bonus — */
    .bonus-block {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 18px 20px;
        border-radius: var(--radius-md);
        background: linear-gradient(
            135deg,
            var(--color-accent-900),
            color-mix(in srgb, var(--color-accent-900) 35%, transparent)
        );
        box-shadow: inset 0 0 0 1px var(--color-accent-800);
    }
    .bonus-accent {
        position: absolute;
        top: 0;
        left: 20px;
        width: 64px;
        height: 2px;
        border-radius: 2px;
        background: var(--frieze-color);
    }
    .bonus-block strong {
        color: var(--color-accent-100);
        font-size: 17px;
        font-weight: 500;
        letter-spacing: -0.01em;
    }
    .bonus-block p {
        margin: 0;
        color: var(--color-neutral-200);
        font-size: 15px;
        line-height: 1.6;
        text-wrap: pretty;
    }

    /* — leader — */
    .leader-block {
        display: flex;
        align-items: flex-start;
        gap: 16px;
    }
    .leader-portrait {
        width: 64px;
        height: 64px;
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
            0 0 0 1.5px var(--tier-label),
            0 0 0 5px var(--color-surface),
            0 0 0 6px var(--tier-frame);
    }
    .leader-portrait img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .leader-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        padding-top: 4px;
    }
    .leader-name {
        font: 600 19px/1.15 var(--font-display);
        letter-spacing: 0.03em;
    }
    .leader-subtitle {
        color: var(--color-accent-300);
        font: 500 11px var(--font-mono);
        letter-spacing: 0.06em;
    }
    .leader-text p {
        margin: 4px 0 0;
        color: var(--color-neutral-300);
        font-size: 15px;
        line-height: 1.6;
        text-wrap: pretty;
    }

    /* — unique elements — */
    .item-tabs {
        display: flex;
        gap: 2px;
        padding: 3px;
        border-radius: var(--radius-md);
        background: var(--color-neutral-900);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
    }
    .item-tab {
        display: flex;
        flex: 1;
        min-width: 0;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 36px;
        padding: 0 8px;
        border: 0;
        border-radius: 6px;
        color: var(--color-neutral-400);
        background: transparent;
        font: 500 13px var(--font-body);
        white-space: nowrap;
        cursor: pointer;
        transition:
            background 0.2s,
            color 0.2s;
    }
    .item-tab .ph {
        font-size: 15px;
    }
    .item-tab:not(.empty):hover {
        color: var(--color-text);
    }
    .item-tab.active {
        color: var(--color-text);
        background: var(--color-surface);
        box-shadow:
            inset 0 0 0 1px var(--color-neutral-700),
            var(--shadow-sm);
    }
    .item-tab.empty {
        opacity: 0.4;
        cursor: default;
    }
    .item-tab-count {
        color: var(--color-neutral-500);
        font: 500 10px/1 var(--font-mono);
        letter-spacing: 0.04em;
    }
    .unique-item {
        overflow: hidden;
        border-radius: var(--radius-md);
        background: color-mix(in srgb, var(--color-neutral-900) 55%, transparent);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
    }
    .item-body {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
    }
    .item-head {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .item-icon {
        display: grid;
        width: 48px;
        height: 48px;
        flex: none;
        place-items: center;
        overflow: hidden;
        border-radius: 8px;
        color: var(--color-neutral-500);
        background-color: var(--color-bg);
        background-image: repeating-linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-text) 5%, transparent) 0 4px,
            transparent 4px 8px
        );
        box-shadow: inset 0 0 0 1px var(--tier-frame);
        font-size: 20px;
    }
    .item-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .item-title {
        display: flex;
        min-width: 0;
        flex: 1;
        flex-direction: column;
        gap: 5px;
    }
    .item-title strong {
        font: 600 17px/1.15 var(--font-display);
        letter-spacing: 0.03em;
    }
    .item-title span {
        color: var(--color-neutral-500);
        font: 500 10px/1 var(--font-mono);
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    .item-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 6px;
    }
    .item-stat {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 9px 11px;
        border-radius: 6px;
        background: var(--color-bg);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
    }
    .item-stat-key {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--color-neutral-500);
        font: 500 9px/1 var(--font-mono);
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    .item-stat-key .ph {
        font-size: 12px;
    }
    .item-stat-value {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.3;
    }
    .item-chips {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
    }
    .item-chips-label {
        margin-right: 4px;
        color: var(--color-neutral-500);
        font: 500 9px/1 var(--font-mono);
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    .item-chip {
        display: flex;
        height: 26px;
        align-items: center;
        gap: 6px;
        padding: 0 9px;
        border-radius: 6px;
        color: var(--color-neutral-200);
        background: var(--color-bg);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
        font-size: 12.5px;
    }
    .item-chip .ph {
        font-size: 14px;
    }
    .item-chip.plain {
        color: var(--color-neutral-300);
        background: transparent;
        box-shadow: inset 0 0 0 1px var(--color-neutral-700);
    }
    .item-description {
        margin: 0;
        color: var(--color-neutral-200);
        font-size: 15px;
        line-height: 1.6;
        text-wrap: pretty;
    }
    .item-strategy-toggle {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 8px;
        padding: 11px 16px;
        border: 0;
        color: var(--color-accent-300);
        background: transparent;
        box-shadow: inset 0 1px 0 var(--color-neutral-800);
        font: 500 13px var(--font-body);
        text-align: left;
        cursor: pointer;
    }
    .item-strategy-toggle:hover {
        color: var(--color-accent-200);
        background: color-mix(in srgb, var(--color-accent) 8%, transparent);
    }
    .item-strategy-toggle .ph {
        font-size: 15px;
    }
    .item-caret {
        margin-left: auto;
        font-size: 13px;
        transition: transform 0.2s;
    }
    .item-caret.open {
        transform: rotate(180deg);
    }
    .item-strategy {
        margin: 0;
        padding: 2px 16px 18px 39px;
        color: var(--color-neutral-300);
        font-size: 14.5px;
        line-height: 1.7;
        text-wrap: pretty;
    }

    .civilization-description {
        max-width: 62ch;
        margin: 0;
        color: var(--color-neutral-300);
        font-size: 15px;
        line-height: 1.75;
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
        padding: 14px 24px calc(14px + env(safe-area-inset-bottom));
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
        gap: 3px;
    }
    .nav-text small {
        color: var(--color-neutral-500);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .nav-text strong {
        overflow: hidden;
        font: 600 14px var(--font-display);
        letter-spacing: 0.03em;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .panel-navigation .panel-next {
        justify-content: flex-end;
        text-align: right;
        box-shadow: -1px 0 0 var(--color-neutral-800);
    }

    /* Full-screen panel on phones (see ContentComponent) */
    @media (max-width: 640px) {
        .panel-bar button {
            width: 40px;
            height: 40px;
            font-size: 17px;
        }
        .panel-hero {
            padding: 24px 28px 20px;
        }
        .hero-name {
            font-size: 28px;
        }
    }
    @media (max-width: 420px) {
        .panel-hero {
            padding-inline: 20px;
        }
        .hero-name {
            font-size: 24px;
        }
        .panel-content {
            gap: 24px;
            padding-inline: 16px;
        }
        .item-tab {
            flex-direction: column;
            gap: 2px;
            height: 48px;
            font-size: 11px;
        }
        .panel-navigation button {
            padding-inline: 16px;
        }
    }
</style>
