<template>
    <header class="header">
        <a class="brand" href="/" aria-label="Better-Civ">
            <!-- Hexagon of the B badge, holding a meander-shaped "B" -->
            <svg
                class="brand-mark"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <linearGradient id="brand-mark-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" class="brand-stop-start" />
                        <stop offset="1" class="brand-stop-end" />
                    </linearGradient>
                </defs>
                <path
                    class="brand-hexagon"
                    d="M20 2.5L35.2 11.25V28.75L20 37.5L4.8 28.75V11.25Z"
                    stroke="url(#brand-mark-gradient)"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                />
                <path
                    d="M14 29V11H24.5V19H18.5V15H21"
                    stroke="url(#brand-mark-gradient)"
                    stroke-width="2.2"
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                />
                <path
                    d="M14 19H26.5V29H14"
                    stroke="url(#brand-mark-gradient)"
                    stroke-width="2.2"
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                />
            </svg>
            <span class="brand-text">
                <span class="brand-title"
                    >Better<span class="brand-dash">-</span><span class="brand-accent">Civ</span>
                </span>
                <span class="brand-subtitle">{{ t.ui.tagline }}</span>
            </span>
        </a>

        <nav class="game-nav" :aria-label="t.ui.games">
            <a
                v-for="game in GAMES"
                :key="game.numeral"
                class="game-link"
                :href="game.available ? '/' : undefined"
                :aria-current="game.available ? 'page' : undefined"
                :aria-disabled="game.available ? undefined : 'true'"
                :title="game.available ? undefined : t.ui.comingSoon"
            >
                <span class="game-numeral">{{ game.numeral }}</span
                >{{ game.name }}
                <PhIcon v-if="!game.available" name="lock-simple" class="game-lock" />
                <span v-else class="game-underline" aria-hidden="true"></span>
            </a>
        </nav>

        <SelectLanguageComponent class="language-selector" />
    </header>
    <div class="meander header-rule" aria-hidden="true"></div>
</template>

<script setup lang="ts">
    /**
     * Header Component - Brand, game navigation and language selector
     */
    // IMPORT
    // ##############
    import { useMessages } from '../../i18n/useMessages';
    import SelectLanguageComponent from '../global/SelectLanguageComponent.vue';
    import PhIcon from '../icons/PhIcon.vue';

    // CONSTANTS
    // ##############
    /** Only Civilization V is ranked for now; the other games show as locked tabs. */
    const GAMES = [
        { numeral: 'V', name: 'Civilization V', available: true },
        { numeral: 'VI', name: 'Civilization VI', available: false },
        { numeral: 'VII', name: 'Civilization VII', available: false },
    ] as const;

    // VARIABLES
    // ##############
    const t = useMessages();
</script>

<style scoped>
    .header {
        display: flex;
        align-items: center;
        gap: 16px;
        height: 76px;
        color: var(--color-text);
    }

    /* — brand — */
    .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        color: inherit;
        text-decoration: none;
    }
    .brand:hover {
        color: inherit;
    }
    .brand-mark {
        flex: none;
        filter: drop-shadow(0 0 10px color-mix(in srgb, var(--color-accent) 45%, transparent));
    }
    .brand-stop-start {
        stop-color: var(--color-accent-200);
    }
    .brand-stop-end {
        stop-color: var(--color-accent-600);
    }
    .brand-hexagon {
        fill: var(--color-surface);
    }
    .brand-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .brand-title {
        display: flex;
        align-items: baseline;
        font: 500 17px/1 var(--font-heading);
        letter-spacing: -0.02em;
    }
    .brand-dash {
        margin: 0 1px;
        color: var(--color-neutral-500);
    }
    .brand-accent {
        color: var(--color-accent-300);
    }
    .brand-subtitle {
        color: var(--color-neutral-500);
        font: 500 10px/1 var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }

    /* — game navigation — */
    .game-nav {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: 32px;
    }
    .game-link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        height: 34px;
        padding: 0 12px;
        border-radius: var(--radius-md);
        color: var(--color-text);
        font: 500 13px var(--font-body);
        text-decoration: none;
        white-space: nowrap;
    }
    .game-link[aria-current='page'] {
        background: color-mix(in srgb, var(--color-accent) 12%, transparent);
    }
    .game-link[aria-current='page'] .game-numeral {
        color: var(--color-accent-300);
    }
    .game-link[aria-disabled='true'] {
        color: var(--color-neutral-600);
        cursor: not-allowed;
    }
    .game-numeral {
        font: 500 11px var(--font-mono);
    }
    .game-lock {
        font-size: 12px;
    }
    /* Glowing underline that touches the meander rule below the header */
    .game-underline {
        position: absolute;
        right: 12px;
        bottom: -21px;
        left: 12px;
        height: 2px;
        border-radius: 2px;
        background: var(--color-accent);
        box-shadow: 0 0 10px var(--color-accent);
    }

    .language-selector {
        margin-left: auto;
    }

    @media (max-width: 800px) {
        .game-nav {
            display: none;
        }
    }
    @media (max-width: 640px) {
        .brand-subtitle {
            display: none;
        }
    }
</style>
