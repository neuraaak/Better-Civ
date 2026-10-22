<template>
    <ContentComponent :civilisations="civilizations" :status="status" @retry="retry" />
</template>

<script setup lang="ts">
    /**
     * Civilization V tier list: civilizations from civvapi in the current language.
     */
    // IMPORT
    // ##############
    import ContentComponent from '../components/layout/ContentComponent.vue';
    import { useCivilizations } from '../composables/useCivilizations';
    import { useAppStore } from '../stores/app';

    // VARIABLES
    // ##############
    const store = useAppStore();
    const { civilizations, status, retry } = useCivilizations(() => store.lang);
</script>
