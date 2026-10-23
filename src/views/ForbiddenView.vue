<template>
    <main class="status">
        <p class="eyebrow"><PhIcon name="lock-simple" />403</p>
        <h1>{{ t.ui.forbiddenTitle }}</h1>
        <p class="status-text">{{ t.ui.forbiddenText }}</p>
        <RouterLink class="status-link" :to="DEFAULT_GAME_PATH">{{ t.ui.backHome }}</RouterLink>
    </main>
</template>

<script setup lang="ts">
    /**
     * 403 page. The site has no login, so only a hand-typed /403 reaches it.
     */
    // IMPORT
    // ##############
    import PhIcon from '../components/icons/PhIcon.vue';
    import { DEFAULT_GAME_PATH } from '../data/games';
    import { useMessages } from '../i18n/useMessages';

    // VARIABLES
    // ##############
    const t = useMessages();
</script>

<style scoped>
    .status {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 120px 0 160px;
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
        font-size: clamp(28px, 4vw, 44px);
        font-weight: 500;
        line-height: 1.1;
    }
    .status-text {
        max-width: 48ch;
        margin: 0;
        color: var(--color-neutral-400);
        font-size: 15px;
    }
    .status-link {
        margin-top: 6px;
        padding: 5.6px 10px;
        border: 1px solid var(--color-accent);
        border-radius: var(--radius-md);
        color: var(--color-accent);
        font-family: var(--font-heading);
        font-size: 14px;
        font-weight: 500;
    }
    .status-link:hover {
        background: color-mix(in srgb, var(--color-accent) 12%, transparent);
    }
</style>
