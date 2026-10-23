<template>
    <main class="home">
        <!-- Two counter-rotating hex orbits, bleeding out of the top right corner -->
        <div class="orbits" aria-hidden="true">
            <svg class="orbit-outer" viewBox="-100 -100 200 200" fill="none">
                <path d="M0-92L79.7-46V46L0 92L-79.7 46V-46Z" class="ring" />
                <path d="M0-74L64.1-37V37L0 74L-64.1 37V-37Z" class="ring dotted" />
                <path d="M0-56L48.5-28V28L0 56L-48.5 28V-28Z" class="ring accent" />
                <circle cx="0" cy="-92" r="1.4" class="node" />
                <circle cx="79.7" cy="46" r="1" class="node dim" />
                <circle cx="-79.7" cy="46" r="1" class="node faint" />
            </svg>
            <svg class="orbit-inner" viewBox="-100 -100 200 200" fill="none">
                <path d="M0-38L32.9-19V19L0 38L-32.9 19V-19Z" class="ring accent-mid" />
                <path d="M-32.9-19L32.9 19M32.9-19L-32.9 19M0-38V38" class="ring faint" />
                <circle cx="0" cy="0" r="64" class="ring faint dashed" />
            </svg>
        </div>

        <section class="hero">
            <p class="eyebrow"><span class="beacon"></span>{{ ui.homeEyebrow }}</p>
            <h1>
                {{ ui.homeTitle }}<br /><span class="accent">{{ ui.homeTitleAccent }}</span>
            </h1>
            <p class="lede">{{ ui.homeLede }}</p>
        </section>

        <div class="section-rule">
            <h2>{{ ui.homeChooseGame }}</h2>
            <span class="rule" aria-hidden="true"></span>
        </div>

        <div class="cards">
            <RouterLink
                v-for="(card, index) in cards"
                :key="card.numeral"
                class="card"
                :class="`card-${card.numeral.toLowerCase()}`"
                :to="card.path"
                :style="{ animationDelay: `${0.15 + index * 0.1}s` }"
            >
                <span class="pattern" aria-hidden="true"></span>
                <span class="card-glow" aria-hidden="true"></span>

                <!-- Era decoration: Roman temple, cathedral, atomic diagram -->
                <span class="deco" aria-hidden="true">
                    <template v-if="card.numeral === 'V'">
                        <span class="deco-meander"></span>
                        <svg viewBox="0 0 200 160" class="deco-art" fill="none" stroke-width="1">
                            <path d="M16 52L100 16L184 52Z" />
                            <path d="M40 46L100 24L160 46" />
                            <circle cx="100" cy="38" r="5" />
                            <path d="M16 52H184V62H16Z" />
                            <path d="M16 66H184" />
                            <path d="M28 70H48M30 70V138M46 70V138M34 74V136M38 74V136M42 74V136" />
                            <path d="M64 70H84M66 70V138M82 70V138M70 74V136M74 74V136M78 74V136" />
                            <path
                                d="M116 70H136M118 70V138M134 70V138M122 74V136M126 74V136M130 74V136"
                            />
                            <path
                                d="M152 70H172M154 70V138M170 70V138M158 74V136M162 74V136M166 74V136"
                            />
                            <path d="M12 140H188M6 147H194M0 154H200" />
                        </svg>
                    </template>
                    <template v-else-if="card.numeral === 'VI'">
                        <svg
                            viewBox="0 0 160 200"
                            class="deco-art tall"
                            fill="none"
                            stroke-width="1"
                        >
                            <path d="M16 200V96A96 96 0 0 1 80 4A96 96 0 0 1 144 96V200" />
                            <path d="M28 200V98A82 82 0 0 1 80 20A82 82 0 0 1 132 98V200" />
                            <path
                                d="M36 200V134A46 46 0 0 1 58 96A46 46 0 0 1 80 134V200M80 134A46 46 0 0 1 102 96A46 46 0 0 1 124 134V200"
                            />
                            <circle cx="80" cy="66" r="20" />
                            <circle cx="80" cy="57" r="8" />
                            <circle cx="89" cy="66" r="8" />
                            <circle cx="80" cy="75" r="8" />
                            <circle cx="71" cy="66" r="8" />
                            <path d="M58 150V200M102 150V200" stroke-dasharray="2 3" />
                        </svg>
                        <span class="deco-caption gothic">
                            <span>✠</span><span>Anno Domini</span><span>✠</span>
                        </span>
                    </template>
                    <template v-else>
                        <span class="deco-frame">
                            <span class="corner tl"></span>
                            <span class="corner tr"></span>
                            <span class="corner bl"></span>
                            <span class="corner br"></span>
                            <span class="cross-v"></span>
                            <span class="cross-h"></span>
                        </span>
                        <svg viewBox="-100 -100 200 200" class="deco-orbit" fill="none">
                            <ellipse cx="0" cy="0" rx="92" ry="30" stroke-dasharray="1 3" />
                            <circle cx="88" cy="-9" r="2.5" fill="currentColor" />
                        </svg>
                        <span class="deco-caption mono">
                            <span>Fig. 07</span><span>{{ ui.homeEraFlow }}</span>
                        </span>
                        <span class="deco-ticks"></span>
                    </template>
                </span>

                <div class="card-top">
                    <p class="year">{{ card.year }}</p>
                    <span class="pips" aria-hidden="true">
                        <span
                            v-for="pip in 3"
                            :key="pip"
                            class="pip"
                            :class="{ lit: pip <= index + 1 }"
                        ></span>
                    </span>
                    <p class="era">{{ card.era }}</p>
                    <p class="tag" :class="{ live: card.available }">
                        <PhIcon :name="card.available ? 'check' : 'hourglass-medium'" />{{
                            card.available ? ui.homeAvailable : ui.homeSoon
                        }}
                    </p>
                </div>

                <p class="numeral" aria-hidden="true">{{ card.numeral }}</p>

                <div class="card-bottom">
                    <p class="card-name">{{ card.name }}</p>
                    <p class="card-line">{{ card.line }}</p>
                    <p class="cta" :class="{ live: card.available }">
                        {{ card.available ? ui.homeCtaAvailable : ui.homeCtaSoon }}
                        <PhIcon name="arrow-right" class="cta-arrow" />
                    </p>
                </div>
            </RouterLink>
        </div>

        <footer class="home-footer">
            <span class="footer-brand">Better-Civ</span>
            <span>{{ ui.homeDisclaimer }}</span>
        </footer>
    </main>
</template>

<script setup lang="ts">
    /**
     * Home page (handoff "Home"): the three games as era-styled cards, each one
     * leading to its tier list or to its work in progress page.
     */
    // IMPORT
    // ##############
    import { computed } from 'vue';
    import PhIcon from '../components/icons/PhIcon.vue';
    import { GAMES } from '../data/games';
    import { useMessages } from '../i18n/useMessages';

    // VARIABLES
    // ##############
    const t = useMessages();
    const ui = computed(() => t.value.ui);

    /** Games merged with their card copy; both lists share their order. */
    const cards = computed(() =>
        GAMES.map((game, index) => ({ ...game, ...t.value.homeGames[index] }))
    );
</script>

<style scoped>
    .home {
        position: relative;
        padding-bottom: 56px;
    }

    /* — orbits — */
    .orbits {
        position: absolute;
        top: -256px;
        right: -220px;
        width: 900px;
        height: 900px;
        opacity: 0.55;
        -webkit-mask-image: radial-gradient(circle, #000 30%, transparent 70%);
        mask-image: radial-gradient(circle, #000 30%, transparent 70%);
        pointer-events: none;
    }
    .orbits svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }
    .orbit-outer {
        animation: dc-spin 160s linear infinite;
    }
    .orbit-inner {
        animation: dc-spin 110s linear infinite reverse;
    }
    .ring {
        stroke: var(--color-neutral-700);
        stroke-width: 0.3;
    }
    .ring.dotted {
        stroke-dasharray: 1 2;
    }
    .ring.accent {
        stroke: var(--color-accent-700);
        stroke-width: 0.4;
    }
    .ring.accent-mid {
        stroke: var(--color-accent-500);
        stroke-width: 0.5;
    }
    .ring.faint {
        stroke: var(--color-neutral-800);
    }
    .ring.dashed {
        stroke-dasharray: 0.6 3;
    }
    .node {
        fill: var(--color-accent);
    }
    .node.dim {
        fill: var(--color-accent-300);
    }
    .node.faint {
        fill: var(--color-neutral-500);
    }

    /* — hero — */
    .hero {
        position: relative;
        display: flex;
        max-width: 820px;
        flex-direction: column;
        gap: 22px;
        padding: 88px 0 64px;
        animation: dc-rise 0.7s ease-out both;
    }
    .eyebrow {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
        color: var(--color-accent-400);
        font: 500 11px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .beacon {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--color-accent);
        box-shadow: 0 0 10px var(--color-accent);
        animation: dc-blink 2.4s ease-in-out infinite;
    }
    h1 {
        margin: 0;
        font: 500 clamp(52px, 8vw, 112px) / 0.92 var(--font-heading);
        letter-spacing: -0.045em;
        text-wrap: balance;
    }
    h1 .accent {
        background: linear-gradient(
            170deg,
            var(--color-accent-100),
            var(--color-accent-400) 55%,
            var(--color-accent-700)
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        filter: drop-shadow(0 0 28px color-mix(in srgb, var(--color-accent) 35%, transparent));
    }
    .lede {
        max-width: 520px;
        margin: 0;
        color: var(--color-neutral-400);
        font-size: 17px;
        line-height: 1.6;
        text-wrap: pretty;
    }

    .section-rule {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
        padding-bottom: 18px;
    }
    .section-rule h2 {
        margin: 0;
        color: var(--color-neutral-500);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
        white-space: nowrap;
    }
    .rule {
        height: 1px;
        flex: 1;
        background: linear-gradient(to right, var(--color-neutral-800), transparent);
    }

    /* — game cards — */
    /* Three cards, so an auto-fit grid leaves one stretched alone on its row:
       three columns, then one, with nothing in between. */
    .cards {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
    }
    @media (max-width: 980px) {
        .cards {
            grid-template-columns: minmax(0, 1fr);
            max-width: 560px;
        }
    }
    .card {
        position: relative;
        display: flex;
        min-height: 440px;
        container-type: inline-size;
        flex-direction: column;
        padding: 22px;
        overflow: hidden;
        border-radius: var(--radius-lg);
        background: var(--card-bg);
        box-shadow:
            inset 0 0 0 1px var(--color-neutral-800),
            var(--shadow-sm);
        color: var(--color-text);
        animation: dc-rise 0.7s ease-out both;
        transition:
            transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
            box-shadow 0.35s;
    }
    .card:hover {
        box-shadow:
            inset 0 0 0 1px var(--color-accent-600),
            0 24px 60px -20px color-mix(in srgb, var(--color-accent) 45%, transparent),
            var(--shadow-lg);
        color: var(--color-text);
        transform: translateY(-6px);
    }
    .pattern {
        position: absolute;
        inset: 0;
        background-image: var(--card-pattern);
        background-size: var(--card-pattern-size);
        opacity: var(--card-pattern-opacity);
        -webkit-mask-image: radial-gradient(ellipse 80% 60% at 70% 38%, #000, transparent 75%);
        mask-image: radial-gradient(ellipse 80% 60% at 70% 38%, #000, transparent 75%);
        transition: opacity 0.4s;
        pointer-events: none;
    }
    .card:hover .pattern {
        opacity: 0.16;
    }
    .card-glow {
        position: absolute;
        top: 38%;
        left: 50%;
        width: min(420px, 110cqw);
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            color-mix(in srgb, var(--color-accent) 30%, transparent),
            transparent 60%
        );
        opacity: var(--card-glow-opacity);
        transform: translate(-50%, -50%);
        transition: opacity 0.4s;
        pointer-events: none;
    }
    .card:hover .card-glow {
        opacity: 1;
    }

    /* — era decoration — */
    .deco {
        position: absolute;
        inset: 0;
        color: var(--color-neutral-500);
        opacity: 0.28;
        transition:
            color 0.4s,
            opacity 0.4s;
        pointer-events: none;
    }
    .card:hover .deco {
        color: var(--color-accent-400);
        opacity: 0.55;
    }
    .deco-art {
        position: absolute;
        top: 44%;
        left: 50%;
        width: 86%;
        stroke: currentColor;
        transform: translate(-50%, -50%);
    }
    .deco-art.tall {
        top: 45%;
        width: auto;
        height: 76%;
    }
    /* Greek fret running across the top of the Civilization V card */
    .deco-meander {
        position: absolute;
        top: 56px;
        right: 22px;
        left: 22px;
        height: 12px;
        background: currentColor;
        -webkit-mask: var(--meander) 0 0 / 12px 12px repeat-x;
        mask: var(--meander) 0 0 / 12px 12px repeat-x;
    }
    .deco-caption {
        position: absolute;
        top: 58px;
        right: 22px;
        left: 22px;
        display: flex;
        justify-content: space-between;
    }
    .deco-caption.gothic {
        font:
            400 14px / 1 'UnifrakturMaguntia',
            serif;
        letter-spacing: 0.3em;
    }
    .deco-caption.mono {
        font: 500 9px / 1 var(--font-mono);
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }
    .deco-frame {
        position: absolute;
        top: 20%;
        right: 14%;
        bottom: 34%;
        left: 14%;
    }
    .corner {
        position: absolute;
        width: 18px;
        height: 18px;
    }
    .corner.tl {
        top: 0;
        left: 0;
        border-top: 1px solid;
        border-left: 1px solid;
    }
    .corner.tr {
        top: 0;
        right: 0;
        border-top: 1px solid;
        border-right: 1px solid;
    }
    .corner.bl {
        bottom: 0;
        left: 0;
        border-bottom: 1px solid;
        border-left: 1px solid;
    }
    .corner.br {
        right: 0;
        bottom: 0;
        border-right: 1px solid;
        border-bottom: 1px solid;
    }
    .cross-v {
        position: absolute;
        top: -14px;
        bottom: -14px;
        left: 50%;
        width: 1px;
        background: linear-gradient(currentColor, transparent 18%, transparent 82%, currentColor);
    }
    .cross-h {
        position: absolute;
        top: 50%;
        right: -14px;
        left: -14px;
        height: 1px;
        background: linear-gradient(
            90deg,
            currentColor,
            transparent 14%,
            transparent 86%,
            currentColor
        );
    }
    .deco-orbit {
        position: absolute;
        top: 43%;
        left: 50%;
        width: 96%;
        stroke: currentColor;
        stroke-width: 0.8;
        transform: translate(-50%, -50%) rotate(-18deg);
    }
    .deco-ticks {
        position: absolute;
        top: calc(66% - 6px);
        right: 22px;
        left: 22px;
        height: 6px;
        background: repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 8px);
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent);
    }

    /* — card content — */
    .card-top {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .year,
    .era {
        margin: 0;
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .year {
        color: var(--color-neutral-500);
    }
    .era {
        color: var(--color-neutral-600);
    }
    .pips {
        display: flex;
        gap: 3px;
    }
    .pip {
        width: 14px;
        height: 3px;
        border-radius: 2px;
        background: var(--color-neutral-800);
    }
    .pip.lit {
        background: var(--color-accent-600);
    }
    .card:hover .pip.lit {
        background: var(--color-accent);
        box-shadow: 0 0 6px var(--color-accent);
    }
    .tag {
        display: flex;
        height: 22px;
        align-items: center;
        gap: 6px;
        margin: 0 0 0 auto;
        padding: 0 9px;
        border-radius: 11px;
        background: var(--color-neutral-900);
        box-shadow: inset 0 0 0 1px var(--color-neutral-800);
        color: var(--color-neutral-400);
        font: 500 10px var(--font-mono);
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    .tag.live {
        background: color-mix(in srgb, var(--color-accent) 14%, transparent);
        box-shadow: inset 0 0 0 1px var(--color-accent-700);
        color: var(--color-accent-200);
    }
    .tag .ph {
        font-size: 11px;
    }
    /* Era numeral, carved out of a gradient in the era's own typeface */
    .numeral {
        position: relative;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        margin: 0;
        /* Horizontal padding from the handoff: the gothic VI overshoots its box */
        padding: 28px 0.14em 28px 0.04em;
        background-image: var(--num-fill);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        font: var(--num-weight) var(--num-size) / 1 var(--num-font);
        letter-spacing: var(--num-track);
        white-space: nowrap;
        filter: var(--num-glow);
        transition:
            transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1),
            filter 0.4s;
    }
    .card:hover .numeral {
        background-image: var(--num-fill-hover);
        filter: drop-shadow(0 0 32px color-mix(in srgb, var(--color-accent) 55%, transparent));
        transform: scale(1.06);
    }
    .card-bottom {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .card-name {
        margin: 0;
        font: 500 26px / 1.1 var(--font-heading);
        letter-spacing: -0.025em;
    }
    .card-line {
        margin: 0;
        color: var(--color-neutral-400);
        font-size: 14px;
        line-height: 1.5;
        text-wrap: pretty;
    }
    .cta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0 0;
        padding-top: 14px;
        box-shadow: inset 0 1px 0 var(--color-neutral-800);
        color: var(--color-neutral-400);
        font-size: 13px;
        font-weight: 500;
    }
    .cta.live {
        color: var(--color-accent-200);
    }
    .card:hover .cta {
        color: var(--color-accent-200);
    }
    .cta-arrow {
        margin-left: auto;
        font-size: 15px;
        transition: transform 0.3s;
    }
    .card:hover .cta-arrow {
        transform: translateX(4px);
    }

    /* — one era per card: pattern, gradient and typeface — */
    .card-v {
        --card-bg: linear-gradient(165deg, var(--color-neutral-900), var(--color-bg) 85%);
        --card-pattern: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2228%22 height=%2249%22%3E%3Cpath d=%22M14 33L0 25V8L14 0L28 8V25L14 33V49M0 49V41L14 33M28 49V41L14 33%22 fill=%22none%22 stroke=%22%23e9e9ed%22 stroke-width=%22.6%22/%3E%3C/svg%3E');
        --card-pattern-size: 28px 49px;
        --card-pattern-opacity: 0.07;
        --card-glow-opacity: 0.15;
        --num-font: 'Cinzel', serif;
        --num-weight: 600;
        --num-size: clamp(120px, 38cqw, 184px);
        --num-track: 0;
        --num-fill: linear-gradient(
            180deg,
            var(--color-neutral-100),
            var(--color-neutral-400) 60%,
            var(--color-neutral-700)
        );
        --num-fill-hover: linear-gradient(
            180deg,
            var(--color-accent-100),
            var(--color-accent-300) 55%,
            var(--color-accent-700)
        );
        --num-glow: none;
    }
    .card-vi {
        --card-bg: linear-gradient(165deg, var(--color-surface), var(--color-bg) 85%);
        --card-pattern: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22%3E%3Cg fill=%22none%22 stroke=%22%23e9e9ed%22 stroke-width=%22.7%22%3E%3Ccircle cx=%2218%22 cy=%2212%22 r=%226%22/%3E%3Ccircle cx=%2224%22 cy=%2218%22 r=%226%22/%3E%3Ccircle cx=%2218%22 cy=%2224%22 r=%226%22/%3E%3Ccircle cx=%2212%22 cy=%2218%22 r=%226%22/%3E%3C/g%3E%3Cpath d=%22M0 0L3 3M36 0L33 3M0 36L3 33M36 36L33 33%22 stroke=%22%23e9e9ed%22 stroke-width=%22.7%22/%3E%3C/svg%3E');
        --card-pattern-size: 36px 36px;
        --card-pattern-opacity: 0.07;
        --card-glow-opacity: 0.3;
        --num-font: 'UnifrakturMaguntia', serif;
        --num-weight: 400;
        --num-size: clamp(128px, 40cqw, 196px);
        --num-track: 0;
        --num-fill: linear-gradient(
            170deg,
            var(--color-accent-200),
            var(--color-accent-500) 60%,
            var(--color-accent-800)
        );
        --num-fill-hover: linear-gradient(
            170deg,
            var(--color-accent-100),
            var(--color-accent-400) 55%,
            var(--color-accent-800)
        );
        --num-glow: none;
    }
    .card-vii {
        --card-bg:
            radial-gradient(
                120% 80% at 70% 20%,
                color-mix(in srgb, var(--color-section) 70%, transparent),
                transparent 70%
            ),
            linear-gradient(165deg, var(--color-surface), var(--color-bg) 85%);
        --card-pattern:
            linear-gradient(var(--color-text) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-text) 1px, transparent 1px);
        --card-pattern-size: 20px 20px;
        --card-pattern-opacity: 0.06;
        --card-glow-opacity: 0.55;
        --num-font: var(--font-heading);
        --num-weight: 500;
        --num-size: clamp(120px, 38cqw, 184px);
        --num-track: -0.07em;
        --num-fill: linear-gradient(
            170deg,
            var(--color-accent-100),
            var(--color-accent-300) 45%,
            var(--color-accent-600)
        );
        --num-fill-hover: linear-gradient(
            170deg,
            var(--color-accent-100),
            var(--color-accent-200) 40%,
            var(--color-accent-500)
        );
        --num-glow: drop-shadow(0 0 22px color-mix(in srgb, var(--color-accent) 35%, transparent));
    }

    .home-footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
        padding-top: 48px;
        color: var(--color-neutral-500);
        font-size: 12px;
    }
    .footer-brand {
        font: 500 10px var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }

    @media (max-width: 1200px) {
        .orbits {
            width: 720px;
            height: 720px;
            opacity: 0.4;
        }
    }
    @media (max-width: 800px) {
        .hero {
            gap: 18px;
            padding: 48px 0 40px;
        }
        .orbits {
            top: -300px;
            right: -340px;
            width: 620px;
            height: 620px;
        }
        .section-rule {
            padding-bottom: 14px;
        }
        .card {
            min-height: 380px;
        }
        .home-footer {
            padding-top: 36px;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .orbit-outer,
        .orbit-inner,
        .beacon,
        .hero,
        .card {
            animation: none;
        }
        .card:hover {
            transform: none;
        }
        .card:hover .numeral {
            transform: none;
        }
    }
</style>
