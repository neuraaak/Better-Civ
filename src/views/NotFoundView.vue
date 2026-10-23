<template>
    <main class="not-found">
        <div class="nf-column">
            <p class="eyebrow"><PhIcon name="compass" />{{ ui.notFoundEyebrow }}</p>
            <p class="code" aria-hidden="true">{{ code }}</p>
            <h1>{{ ui.notFoundTitle }}</h1>
            <p class="lede">{{ ui.notFoundText }}</p>
            <div class="actions">
                <RouterLink class="action primary" :to="DEFAULT_GAME_PATH">
                    <PhIcon name="house-line" />{{ ui.backHome }}
                </RouterLink>
                <button type="button" class="action" @click="goBack">
                    <PhIcon name="arrow-u-up-left" />{{ ui.backPrevious }}
                </button>
            </div>
        </div>

        <!-- Hex map of the missing tile: explored around it, fogged further out -->
        <div class="map" :style="mapStyle" aria-hidden="true">
            <span v-for="(hex, index) in hexes" :key="index" class="hex" :style="hex.style">
                <span class="hex-rim"></span>
                <span class="hex-face">
                    <PhIcon v-if="hex.icon" :name="hex.icon" />
                </span>
            </span>
            <span class="ping" :style="pingStyle">
                <span class="ping-ring"></span>
                <span class="ping-ring delayed"></span>
            </span>
            <span class="fog"></span>
        </div>
    </main>
</template>

<script setup lang="ts">
    /**
     * 404 page (handoff "404"): the missing page as an unexplored tile, at the
     * centre of a hex map that fades into the fog of war.
     */
    // IMPORT
    // ##############
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { toRoman } from '../components/civilisations/tierDesign';
    import PhIcon from '../components/icons/PhIcon.vue';
    import type { PhosphorIconName } from '../components/icons/phosphorIcons';
    import { DEFAULT_GAME_PATH } from '../data/games';
    import { useMessages } from '../i18n/useMessages';

    // CONSTANTS
    // ##############
    const COLUMNS = 11;
    const ROWS = 8;
    /** Column and row of the tile the visitor was looking for. */
    const CENTER = { column: 5, row: 3 };
    /** Terrain of the explored ring; the empty slots stay bare. */
    const TERRAIN: readonly (PhosphorIconName | '')[] = [
        'mountains',
        'tree-evergreen',
        'waves',
        'grains',
        'tree',
        '',
        '',
        '',
    ];

    // Hexagon geometry, in percent of the map width
    const WIDTH = 100 / (COLUMNS + 0.5);
    const HEIGHT = WIDTH / 0.866;
    const STEP_Y = HEIGHT * 0.75;
    const TOTAL_HEIGHT = STEP_Y * (ROWS - 1) + HEIGHT;

    // FUNCTIONS
    // ##############
    /** Offset coordinates to cube coordinates, so tiles can be measured apart. */
    function toCube(column: number, row: number): [number, number, number] {
        const x = column - (row - (row & 1)) / 2;
        return [x, row, -x - row];
    }

    function cubeDistance(a: [number, number, number], b: [number, number, number]): number {
        return Math.max(...a.map((value, index) => Math.abs(value - b[index])));
    }

    // VARIABLES
    // ##############
    const router = useRouter();
    const t = useMessages();
    const ui = computed(() => t.value.ui);
    const code = toRoman(404);

    const mapStyle = { aspectRatio: `${(100 / TOTAL_HEIGHT).toFixed(3)}` };
    const pingStyle = {
        left: `${CENTER.column * WIDTH + (CENTER.row & 1 ? WIDTH / 2 : 0) + WIDTH / 2}%`,
        top: `${((CENTER.row * STEP_Y + HEIGHT / 2) / TOTAL_HEIGHT) * 100}%`,
        width: `${WIDTH}%`,
    };

    const hexes = computed(() => {
        const center = toCube(CENTER.column, CENTER.row);
        return Array.from({ length: ROWS * COLUMNS }, (_, index) => {
            const row = Math.floor(index / COLUMNS);
            const column = index % COLUMNS;
            const distance = cubeDistance(toCube(column, row), center);
            const seed = (column * 7 + row * 13 + column * row) % TERRAIN.length;
            const missing = distance === 0;
            const explored = distance <= 2;
            const edge = distance === 3;
            return {
                icon: missing ? ('question' as PhosphorIconName) : explored ? TERRAIN[seed] : '',
                style: {
                    left: `${column * WIDTH + (row & 1 ? WIDTH / 2 : 0)}%`,
                    top: `${((row * STEP_Y) / TOTAL_HEIGHT) * 100}%`,
                    width: `${WIDTH - 0.6}%`,
                    opacity: explored ? 1 : edge ? 0.55 : 0.28,
                    '--hex-glow': missing
                        ? 'drop-shadow(0 0 14px color-mix(in srgb, var(--color-accent) 60%, transparent))'
                        : 'none',
                    '--hex-rim': missing
                        ? 'linear-gradient(150deg, var(--color-accent-200), var(--color-accent-500) 50%, var(--color-accent-800))'
                        : explored
                          ? 'var(--color-neutral-700)'
                          : 'var(--color-neutral-800)',
                    '--hex-inset': missing ? '5%' : '2.5%',
                    '--hex-face': missing
                        ? 'radial-gradient(circle at 45% 30%, var(--color-accent-700), var(--color-accent-900))'
                        : explored
                          ? 'linear-gradient(160deg, var(--color-neutral-800), var(--color-surface))'
                          : 'repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-text) 4%, transparent) 0 4px, var(--color-bg) 4px 8px)',
                    '--hex-icon-size': missing
                        ? 'clamp(18px, 2.4vw, 30px)'
                        : 'clamp(12px, 1.4vw, 18px)',
                    '--hex-icon-fg': missing
                        ? 'var(--color-accent-100)'
                        : 'var(--color-neutral-500)',
                },
            };
        });
    });

    // FUNCTIONS
    // ##############
    /** Goes back, or to the tier list when the 404 was the first page opened. */
    function goBack() {
        if (window.history.length > 1) {
            router.back();
            return;
        }
        router.push(DEFAULT_GAME_PATH);
    }
</script>

<style scoped>
    .not-found {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr));
        gap: 40px;
        align-items: center;
        padding-top: 64px;
    }
    .nf-column {
        display: flex;
        max-width: 560px;
        flex-direction: column;
        gap: 18px;
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
    /* 404 in Roman numerals, as a gradient carved out of the text */
    .code {
        margin: 0;
        background: linear-gradient(
            170deg,
            var(--color-accent-100),
            var(--color-accent-400) 55%,
            var(--color-accent-700)
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font: 500 clamp(96px, 14vw, 184px) / 0.85 var(--font-heading);
        letter-spacing: -0.05em;
        filter: drop-shadow(0 0 28px color-mix(in srgb, var(--color-accent) 40%, transparent));
    }
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-size: clamp(26px, 3.4vw, 36px);
        font-weight: 500;
        letter-spacing: -0.025em;
        line-height: 1.1;
        text-wrap: balance;
    }
    .lede {
        max-width: 460px;
        margin: 0;
        color: var(--color-neutral-400);
        font-size: 16px;
        line-height: 1.6;
        text-wrap: pretty;
    }
    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding-top: 8px;
    }
    .action {
        display: flex;
        height: 40px;
        align-items: center;
        gap: 8px;
        padding: 0 14px;
        border-radius: var(--radius-md);
        color: var(--color-neutral-300);
        font-family: var(--font-body);
        font-size: 13px;
    }
    .action:hover {
        background: color-mix(in srgb, var(--color-text) 6%, transparent);
        color: var(--color-text);
    }
    .action.primary {
        padding: 0 16px;
        box-shadow: inset 0 0 0 1px var(--color-accent);
        color: var(--color-accent-200);
        font-weight: 500;
    }
    .action.primary:hover {
        background: color-mix(in srgb, var(--color-accent) 14%, transparent);
        color: var(--color-accent-100);
    }
    .action.primary:active {
        background: color-mix(in srgb, var(--color-accent) 24%, transparent);
    }

    /* — hex map — */
    .map {
        position: relative;
        width: 100%;
        -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 45%, transparent 100%);
        mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 45%, transparent 100%);
    }
    .hex {
        position: absolute;
        aspect-ratio: 0.866;
        filter: var(--hex-glow);
    }
    .hex-rim,
    .hex-face {
        position: absolute;
        clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    }
    .hex-rim {
        inset: 0;
        background: var(--hex-rim);
    }
    .hex-face {
        display: flex;
        align-items: center;
        justify-content: center;
        inset: var(--hex-inset);
        background: var(--hex-face);
        color: var(--hex-icon-fg);
        font-size: var(--hex-icon-size);
    }
    .ping {
        position: absolute;
        aspect-ratio: 1;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    .ping-ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        box-shadow: 0 0 0 1.5px var(--color-accent);
        animation: dc-ping 2.4s ease-out infinite;
    }
    .ping-ring.delayed {
        animation-delay: 1.2s;
    }
    /* Clouds slowly sliding over the unexplored tiles */
    .fog {
        position: absolute;
        inset: -10%;
        background:
            radial-gradient(
                40% 30% at 20% 30%,
                color-mix(in srgb, var(--color-neutral-500) 16%, transparent),
                transparent 70%
            ),
            radial-gradient(
                35% 25% at 80% 70%,
                color-mix(in srgb, var(--color-neutral-500) 14%, transparent),
                transparent 70%
            );
        animation: dc-drift 18s ease-in-out infinite;
        pointer-events: none;
    }

    @media (max-width: 800px) {
        .not-found {
            gap: 28px;
            padding-top: 36px;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .ping-ring,
        .fog {
            animation: none;
        }
    }
</style>
