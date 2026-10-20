<template>
    <label class="language-select">
        <PhIcon name="globe-simple" />
        <span class="language-current">{{ currentLabel }}</span>
        <PhIcon name="caret-down" class="language-caret" />
        <select :value="store.lang" :aria-label="t.ui.language" @change="updateLanguage">
            <option v-for="option in options" :key="option.code" :value="option.code">
                {{ option.label }} {{ option.flag }}
            </option>
        </select>
    </label>
</template>

<script setup lang="ts">
    /**
     * Select Language Component - Language selector dropdown
     * A native <select> laid over a ghost button, so the control keeps native
     * keyboard and screen-reader behaviour while matching the design.
     */
    // IMPORT
    // ##############
    import { computed } from 'vue';
    import { isLang, LANGUAGES } from '../../i18n/languages';
    import { useMessages } from '../../i18n/useMessages';
    import { useAppStore } from '../../stores/app';
    import PhIcon from '../icons/PhIcon.vue';

    // VARIABLES
    // ##############
    const store = useAppStore();
    const t = useMessages();
    const options = LANGUAGES;

    // COMPUTED
    // ##############
    const currentLabel = computed(
        () => options.find(option => option.code === store.lang)?.label ?? 'FR'
    );

    // FUNCTIONS
    // ##############
    function updateLanguage(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        if (isLang(value)) store.setLanguage(value);
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
