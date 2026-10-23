<template>
    <main class="status">
        <p class="eyebrow"><PhIcon :name="state.icon" />{{ state.code }}</p>
        <h1>{{ state.title }}</h1>
        <p class="status-text">{{ state.text }}</p>
        <RouterLink class="status-link" :to="DEFAULT_GAME_PATH">{{ t.ui.backHome }}</RouterLink>
    </main>
</template>

<script setup lang="ts">
    /**
     * Single page behind the status routes (404, 403). The route's `meta.status`
     * picks the copy, see router/index.ts.
     */
    // IMPORT
    // ##############
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import PhIcon from '../components/icons/PhIcon.vue';
    import { DEFAULT_GAME_PATH } from '../data/games';
    import { useMessages } from '../i18n/useMessages';
    import type { PhosphorIconName } from '../components/icons/phosphorIcons';

    // VARIABLES
    // ##############
    const route = useRoute();
    const t = useMessages();

    const state = computed(() => {
        const ui = t.value.ui;
        switch (route.meta.status) {
            case 'forbidden':
                return {
                    code: '403',
                    icon: 'lock-simple' as PhosphorIconName,
                    title: ui.forbiddenTitle,
                    text: ui.forbiddenText,
                };
            default:
                return {
                    code: '404',
                    icon: 'globe-simple' as PhosphorIconName,
                    title: ui.notFoundTitle,
                    text: ui.notFoundText,
                };
        }
    });
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
