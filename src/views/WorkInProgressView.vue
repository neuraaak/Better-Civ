<template>
    <main class="wip">
        <div class="watermark" aria-hidden="true">{{ game.numeral }}</div>

        <div class="wip-grid">
            <div class="wip-column">
                <div class="wip-intro">
                    <p class="eyebrow">
                        <PhIcon name="flask" />{{ game.name }} · {{ ui.wipEyebrow }}
                    </p>
                    <h1>{{ ui.wipTitle }}</h1>
                    <p class="lede">{{ intro }}</p>
                </div>

                <section class="research" :aria-label="researchName">
                    <span class="research-tick" aria-hidden="true"></span>
                    <div class="research-head">
                        <div class="gauge" :style="gaugeStyle" aria-hidden="true">
                            <span class="gauge-rim"></span>
                            <span class="gauge-face"><PhIcon name="scroll" /></span>
                        </div>
                        <div class="research-name">
                            <p class="meta">{{ ui.wipResearch }}</p>
                            <p class="research-title">{{ researchName }}</p>
                        </div>
                        <div class="research-turns">
                            <p class="turns">{{ turnsRoman }}</p>
                            <p class="meta">{{ ui.wipTurnsLeft }}</p>
                        </div>
                    </div>

                    <div
                        class="bar"
                        role="progressbar"
                        :aria-valuenow="research.progress"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        <div class="bar-fill" :style="{ width: `${research.progress}%` }">
                            <span class="bar-sheen" aria-hidden="true"></span>
                        </div>
                    </div>

                    <ol class="stages">
                        <li v-for="stage in stages" :key="stage.label" class="stage">
                            <span
                                class="stage-line"
                                :style="stage.lineStyle"
                                aria-hidden="true"
                            ></span>
                            <span class="stage-dot" :class="stage.state">
                                <span class="stage-pulse" aria-hidden="true"></span>
                                <PhIcon :name="stage.icon" />
                            </span>
                            <p class="stage-key">{{ stage.key }}</p>
                            <p class="stage-label">{{ stage.label }}</p>
                        </li>
                    </ol>
                </section>

                <RouterLink class="back" :to="DEFAULT_GAME_PATH">
                    <PhIcon name="arrow-left" />{{ backLabel }}
                </RouterLink>
            </div>

            <aside class="preview">
                <div class="ghost" aria-hidden="true">
                    <div v-for="row in ghostRows" :key="row.tierId" class="ghost-row">
                        <CivTierComponent :tier_id="row.tierId" />
                        <div class="ghost-cards">
                            <span
                                v-for="card in row.cards"
                                :key="card"
                                class="ghost-card"
                                :style="{ boxShadow: `inset 0 0 0 1px ${row.frame}` }"
                            ></span>
                        </div>
                    </div>
                </div>
                <div class="preview-veil" aria-hidden="true"></div>
                <div class="preview-foot">
                    <span class="preview-icon"><PhIcon name="lock-simple" /></span>
                    <div>
                        <p class="preview-title">{{ ui.wipPreviewLocked }}</p>
                        <p class="preview-sub">{{ previewSub }}</p>
                    </div>
                </div>
            </aside>
        </div>
    </main>
</template>

<script setup lang="ts">
    /**
     * Page of a game that is not ranked yet (handoff "Work in progress"): research
     * progress, its four stages and a locked preview of the tier list to come.
     * The game comes from the route, see router/index.ts.
     */
    // IMPORT
    // ##############
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import CivTierComponent from '../components/civilisations/subcomponents/CivTierComponent.vue';
    import { TIER_BADGES, toRoman } from '../components/civilisations/tierDesign';
    import PhIcon from '../components/icons/PhIcon.vue';
    import type { PhosphorIconName } from '../components/icons/phosphorIcons';
    import { DEFAULT_GAME_PATH, GAMES, type Game, type Research } from '../data/games';
    import type { TierId } from '../data/taxonomy';
    import { useMessages } from '../i18n/useMessages';

    // CONSTANTS
    // ##############
    /** One icon per stage of `wipStages`, in the same order. */
    const STAGE_ICONS: readonly PhosphorIconName[] = [
        'database',
        'sword',
        'ranking',
        'flag-banner',
    ];

    // VARIABLES
    // ##############
    const route = useRoute();
    const t = useMessages();
    const ui = computed(() => t.value.ui);

    const game = computed<Game>(
        () => GAMES.find(entry => entry.path === route.path) ?? GAMES[GAMES.length - 1]
    );
    /** Every game routed here owns a research block; the fallback keeps the page safe. */
    const research = computed<Research>(
        () => game.value.research ?? { progress: 0, turns: 0, stage: 0, ghost: [0, 0, 0, 0, 0] }
    );
    const rankedGame = computed(() => GAMES.find(entry => entry.available));

    const intro = computed(() =>
        game.value.numeral === 'VI' ? ui.value.wipIntroCiv6 : ui.value.wipIntroCiv7
    );
    const researchName = computed(() => ui.value.wipTierList.replace('{game}', game.value.name));
    const turnsRoman = computed(() => toRoman(research.value.turns));
    const previewSub = computed(() => ui.value.wipPreviewSub.replace('{turns}', turnsRoman.value));
    const backLabel = computed(() =>
        ui.value.wipBackToDefault.replace('{game}', rankedGame.value?.name ?? '')
    );
    const gaugeStyle = computed(() => ({
        '--gauge-angle': `${research.value.progress * 3.6}deg`,
    }));

    const stages = computed(() =>
        t.value.wipStages.map((stage, index) => {
            const done = index < research.value.stage;
            const current = index === research.value.stage;
            const state = done ? 'done' : current ? 'current' : 'todo';
            return {
                ...stage,
                key: current ? ui.value.wipInProgress : done ? ui.value.wipDone : stage.key,
                icon: done ? ('check' as PhosphorIconName) : STAGE_ICONS[index],
                state,
                lineStyle: {
                    background: done
                        ? 'var(--color-accent)'
                        : current
                          ? 'linear-gradient(90deg, var(--color-accent), var(--color-neutral-800))'
                          : 'var(--color-neutral-800)',
                    opacity: index === t.value.wipStages.length - 1 ? 0 : 1,
                },
            };
        })
    );

    /** One row per tier, holding as many blurred placeholder cards as the research says. */
    const ghostRows = computed(() =>
        TIER_BADGES.map((badge, index) => ({
            tierId: index as TierId,
            frame: badge.frame,
            cards: Array.from({ length: research.value.ghost[index] ?? 0 }, (_, card) => card),
        }))
    );
</script>

<style scoped>
    .wip {
        position: relative;
    }
    /* Giant outlined numeral of the game, bleeding off the right edge */
    .watermark {
        position: absolute;
        top: 24px;
        right: -40px;
        color: transparent;
        font: 500 min(44vw, 620px) / 0.8 var(--font-heading);
        letter-spacing: -0.06em;
        -webkit-text-stroke: 1.5px color-mix(in srgb, var(--color-accent) 22%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, #000 10%, transparent 85%);
        mask-image: linear-gradient(to bottom, #000 10%, transparent 85%);
        pointer-events: none;
    }
    .wip-grid {
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr));
        gap: 56px;
        align-items: start;
        padding-top: 56px;
    }
    .wip-column {
        display: flex;
        max-width: 600px;
        flex-direction: column;
        gap: 36px;
    }
    .wip-intro {
        display: flex;
        flex-direction: column;
        gap: 14px;
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
        font-family: var(--font-heading);
        font-size: clamp(30px, 4vw, 48px);
        font-weight: 500;
        letter-spacing: -0.03em;
        line-height: 1.05;
        text-wrap: balance;
    }
    .lede {
        max-width: 520px;
        margin: 0;
        color: var(--color-neutral-400);
        font-size: 16px;
        line-height: 1.6;
        text-wrap: pretty;
    }
    .meta {
        margin: 0;
        color: var(--color-neutral-500);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }

    /* — research card — */
    .research {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 22px;
        padding: 18px;
        border-radius: var(--radius-lg);
        background: linear-gradient(
            160deg,
            var(--color-surface),
            color-mix(in srgb, var(--color-surface) 55%, var(--color-bg))
        );
        box-shadow:
            var(--shadow-md),
            0 0 0 1px var(--color-neutral-800);
    }
    .research-tick {
        position: absolute;
        top: 0;
        left: 18px;
        width: 72px;
        height: 2px;
        border-radius: 2px;
        background: var(--color-accent);
        box-shadow: 0 0 12px var(--color-accent);
    }
    .research-head {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    /* Hexagonal progress ring: the conic-gradient is the progress, the face hides its middle */
    .gauge {
        position: relative;
        width: 52px;
        height: 52px;
        flex: none;
        filter: drop-shadow(0 0 10px color-mix(in srgb, var(--color-accent) 55%, transparent));
    }
    .gauge-rim,
    .gauge-face {
        position: absolute;
        clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    }
    .gauge-rim {
        inset: 0;
        background: conic-gradient(
            var(--color-accent-300) 0 var(--gauge-angle),
            var(--color-neutral-800) var(--gauge-angle) 360deg
        );
    }
    .gauge-face {
        inset: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(
            circle at 40% 30%,
            var(--color-accent-700),
            var(--color-accent-900)
        );
        color: var(--color-accent-100);
        font-size: 22px;
    }
    .research-name {
        display: flex;
        min-width: 0;
        flex: 1;
        flex-direction: column;
        gap: 4px;
    }
    .research-title {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: -0.01em;
    }
    .research-turns {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        text-align: right;
    }
    .turns {
        margin: 0;
        color: var(--color-accent-200);
        font: 500 22px / 1 var(--font-heading);
        letter-spacing: -0.02em;
    }
    .bar {
        position: relative;
        height: 8px;
        overflow: hidden;
        border-radius: 4px;
        background: var(--color-neutral-900);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
    }
    .bar-fill {
        position: absolute;
        inset: 0 auto 0 0;
        overflow: hidden;
        border-radius: 4px;
        background: linear-gradient(90deg, var(--color-accent-700), var(--color-accent-300));
        box-shadow: 0 0 14px var(--color-accent);
        transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .bar-sheen {
        position: absolute;
        inset: 0;
        width: 40%;
        background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--color-text) 45%, transparent),
            transparent
        );
        animation: dc-sheen 2.4s ease-in-out infinite;
    }

    /* — stages — */
    .stages {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .stage {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    /* Joins a stage to the next one, behind the gap of the grid */
    .stage-line {
        position: absolute;
        top: 17px;
        right: -4px;
        left: 40px;
        height: 2px;
        border-radius: 2px;
    }
    .stage-dot {
        position: relative;
        display: flex;
        width: 36px;
        height: 36px;
        flex: none;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 16px;
    }
    .stage-dot.done {
        background: var(--color-accent-700);
        color: var(--color-accent-100);
    }
    .stage-dot.current {
        background: var(--color-accent-900);
        box-shadow:
            0 0 0 1.5px var(--color-accent),
            0 0 18px color-mix(in srgb, var(--color-accent) 45%, transparent);
        color: var(--color-accent-200);
    }
    .stage-dot.todo {
        background: var(--color-neutral-900);
        box-shadow: inset 0 0 0 1px var(--color-neutral-700);
        color: var(--color-neutral-600);
    }
    .stage-pulse {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        box-shadow: 0 0 0 1.5px var(--color-accent);
        opacity: 0;
    }
    .stage-dot.current .stage-pulse {
        animation: dc-pulse 1.8s ease-out infinite;
    }
    .stage-key {
        margin: 0;
        color: var(--color-neutral-600);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    .stage-label {
        margin: 3px 0 0;
        color: var(--color-neutral-500);
        font-size: 13px;
        font-weight: 500;
        line-height: 1.3;
    }
    .stage:has(.done) .stage-key {
        color: var(--color-neutral-400);
    }
    .stage:has(.current) .stage-key {
        color: var(--color-accent-300);
    }
    .stage:has(.done) .stage-label,
    .stage:has(.current) .stage-label {
        color: var(--color-text);
    }

    .back {
        display: flex;
        align-self: flex-start;
        align-items: center;
        gap: 6px;
        color: var(--color-neutral-400);
        font-size: 13px;
    }
    .back:hover {
        color: var(--color-accent-300);
    }

    /* — locked preview — */
    .preview {
        position: relative;
        overflow: hidden;
        border-radius: var(--radius-lg);
        background: color-mix(in srgb, var(--color-surface) 60%, transparent);
        box-shadow:
            var(--shadow-lg),
            0 0 0 1px var(--color-neutral-800);
    }
    .ghost {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 20px 20px 96px;
        filter: blur(3px) saturate(0.7);
        opacity: 0.75;
    }
    .ghost-row {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .ghost-cards {
        display: flex;
        min-width: 0;
        flex: 1;
        gap: 8px;
        overflow: hidden;
    }
    .ghost-card {
        width: 58px;
        flex: none;
        aspect-ratio: 3 / 4;
        border-radius: 8px;
        background-color: var(--color-neutral-900);
        background-image: repeating-linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-text) 5%, transparent) 0 6px,
            transparent 6px 12px
        );
    }
    .preview-veil {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at 30% 50%,
            color-mix(in srgb, var(--color-bg) 75%, transparent),
            transparent 75%
        );
    }
    .preview-foot {
        position: absolute;
        right: 24px;
        bottom: 24px;
        left: 24px;
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .preview-icon {
        display: flex;
        width: 44px;
        height: 44px;
        flex: none;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
        background: var(--color-surface);
        box-shadow:
            0 0 0 1px var(--color-neutral-700),
            var(--shadow-md);
        color: var(--color-accent-300);
        font-size: 20px;
    }
    .preview-title {
        margin: 0;
        font-size: 15px;
        font-weight: 500;
    }
    .preview-sub {
        margin: 3px 0 0;
        color: var(--color-neutral-400);
        font-size: 13px;
    }

    @media (max-width: 800px) {
        .wip-grid {
            gap: 36px;
            padding-top: 32px;
        }
        /* Kept behind the text instead of across it, and dimmer */
        .watermark {
            top: auto;
            bottom: -8%;
            font-size: 46vw;
            -webkit-text-stroke-width: 1px;
            -webkit-mask-image: linear-gradient(to top, #000 10%, transparent 85%);
            mask-image: linear-gradient(to top, #000 10%, transparent 85%);
        }
        .wip-column {
            gap: 28px;
        }
        .research {
            gap: 18px;
        }
        /* Two stages per row: four columns leave no room for their labels */
        .stages {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px 8px;
        }
        .stage-line {
            display: none;
        }
        .preview-foot {
            right: 16px;
            left: 16px;
        }
        .ghost {
            padding: 16px 16px 92px;
        }
    }
    @media (max-width: 480px) {
        .gauge {
            width: 44px;
            height: 44px;
        }
        .gauge-face {
            font-size: 18px;
        }
        .research-title {
            font-size: 16px;
        }
        .turns {
            font-size: 18px;
        }
        .stage-dot {
            width: 32px;
            height: 32px;
            font-size: 14px;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .bar-sheen,
        .stage-dot.current .stage-pulse {
            animation: none;
        }
    }
</style>
