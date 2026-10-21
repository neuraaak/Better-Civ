<template>
    <div class="page">
        <div v-if="DISPLAY_OPTIONS.ambientGlow" class="ambient-glow" aria-hidden="true"></div>
        <div class="ambient-dots" aria-hidden="true"></div>

        <div class="page-inner">
            <HeaderComponent />
            <ContentComponent :civilisations="civilizations" :status="status" @retry="retry" />
        </div>
    </div>
</template>

<script setup lang="ts">
    // IMPORT
    // ##############
    import { defineAsyncComponent, onMounted, watchEffect } from 'vue';
    import { useCivilizations } from './composables/useCivilizations';
    import { DISPLAY_OPTIONS } from './data/displayOptions';
    import { htmlLang } from './i18n/languages';
    import { useAppStore } from './stores/app';

    // Lazy loading des composants lourds
    const HeaderComponent = defineAsyncComponent(
        () => import('./components/layout/HeaderComponent.vue')
    );
    const ContentComponent = defineAsyncComponent(
        () => import('./components/layout/ContentComponent.vue')
    );

    // VARIABLES
    // ##############
    const store = useAppStore();
    const { civilizations, status, retry } = useCivilizations(() => store.lang);

    // HOOKS
    // ##############
    onMounted(() => {
        document.title = 'Better Civ5';
    });
    // Screen readers and hyphenation follow the language picked in the selector
    watchEffect(() => {
        document.documentElement.lang = htmlLang(store.lang);
    });
</script>

<style scoped>
    .page {
        position: relative;
        min-height: 100vh;
        overflow-x: clip;
        color: var(--color-text);
        background: var(--color-bg);
        font-family: var(--font-body);
    }
    .ambient-glow,
    .ambient-dots {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }
    .ambient-glow {
        background:
            radial-gradient(
                900px 520px at 12% -8%,
                color-mix(in srgb, var(--color-accent) 16%, transparent),
                transparent 70%
            ),
            radial-gradient(
                700px 500px at 100% 0%,
                color-mix(in srgb, var(--color-section) 60%, transparent),
                transparent 70%
            );
    }
    .ambient-dots {
        background-image: radial-gradient(
            color-mix(in srgb, var(--color-text) 7%, transparent) 1px,
            transparent 1px
        );
        background-size: 22px 22px;
        -webkit-mask-image: linear-gradient(to bottom, #000, transparent 640px);
        mask-image: linear-gradient(to bottom, #000, transparent 640px);
    }
    .page-inner {
        position: relative;
        max-width: 1480px;
        margin: 0 auto;
        padding: 0 40px 80px;
    }
    @media (max-width: 800px) {
        .page-inner {
            padding-inline: 16px;
        }
    }
</style>
