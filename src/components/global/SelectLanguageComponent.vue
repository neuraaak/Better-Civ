<template>
    <label class="language-select">
        <PhIcon name="globe-simple" />
        <span class="language-current">{{ currentLabel }}</span>
        <PhIcon name="caret-down" class="language-caret" />
        <select v-model="selectedLang" aria-label="Langue" @change="updateLanguage">
            <option v-for="option in options" :key="option.lang" :value="option.lang">
                {{ option.label }} {{ option.flag }}
            </option>
        </select>
    </label>
</template>

<script setup>
    import PhIcon from '../icons/PhIcon.vue';
    /**
     * Select Language Component - Language selector dropdown
     * A native <select> laid over a ghost button, so the control keeps native
     * keyboard and screen-reader behaviour while matching the design.
     */
    // IMPORT
    // ##############
    import { computed, ref } from 'vue';
    import { translationStore } from '../../stores/index';

    // VARIABLES
    // ##############
    const store = translationStore();

    // Available languages with flags and labels
    const options = ref([
        { label: 'EN', flag: '🇺🇸', lang: 'en' },
        { label: 'DE', flag: '🇩🇪', lang: 'de' },
        { label: 'ES', flag: '🇪🇸', lang: 'es' },
        { label: 'FR', flag: '🇫🇷', lang: 'fr' },
        { label: 'IT', flag: '🇮🇹', lang: 'it' },
        { label: 'JP', flag: '🇯🇵', lang: 'jp' },
        { label: 'KR', flag: '🇰🇷', lang: 'kr' },
        { label: 'PL', flag: '🇵🇱', lang: 'pl' },
        { label: 'RU', flag: '🇷🇺', lang: 'ru' },
        { label: 'ZH', flag: '🇨🇳', lang: 'zh' },
    ]);

    // Current selected language
    const selectedLang = ref('fr');

    // COMPUTED
    // ##############
    const currentLabel = computed(
        () => options.value.find(option => option.lang === selectedLang.value)?.label ?? 'FR'
    );

    // FUNCTIONS
    // ##############
    function updateLanguage() {
        store.setLanguage(selectedLang.value);
    }
</script>

<style scoped>
    .language-select {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 34px;
        padding: 0 12px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        color: var(--color-neutral-300);
        font-size: 13px;
        cursor: pointer;
    }
    .language-select:hover {
        background: color-mix(in srgb, var(--color-text) 7%, transparent);
    }
    .language-select:has(select:focus-visible) {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
    }
    .ph-globe-simple {
        font-size: 15px;
    }
    .language-caret {
        font-size: 12px;
        color: var(--color-neutral-500);
    }
    select {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        appearance: none;
    }
    option {
        color: var(--color-text);
        background: var(--color-surface);
    }
</style>
