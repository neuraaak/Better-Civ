<template>
    <header class="header">
        <div class="brand">
            <div class="brand-mark">
                <img
                    src="/img/logo.webp"
                    alt="Logo Better-Civ"
                    class="logo"
                    width="32"
                    height="32"
                />
            </div>
            <div class="brand-text">
                <p class="brand-title">Tier List</p>
                <p class="brand-subtitle">Civilisations · Méta actuelle</p>
            </div>
        </div>
        <SelectLanguageComponent class="language-selector" />
    </header>
    <div class="meander header-rule" aria-hidden="true"></div>
</template>

<script setup lang="ts">
    /**
     * Header Component - Brand bar with logo and language selector
     */
    // IMPORT
    // ##############
    import SelectLanguageComponent from '../global/SelectLanguageComponent.vue';
</script>

<style scoped>
    .header {
        display: flex;
        align-items: center;
        gap: 16px;
        height: 76px;
        color: var(--color-text);
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .brand-mark {
        display: grid;
        width: 40px;
        height: 40px;
        place-items: center;
        border-radius: var(--radius-md);
        background: var(--color-surface);
        box-shadow:
            var(--shadow-sm),
            0 0 24px color-mix(in srgb, var(--color-accent) 25%, transparent);
    }
    .logo {
        width: 32px;
        height: 32px;
        object-fit: contain;
    }
    .brand-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .brand-title,
    .brand-subtitle {
        margin: 0;
        line-height: 1;
    }
    .brand-title {
        font: 500 16px/1 var(--font-heading);
        letter-spacing: -0.01em;
    }
    .brand-subtitle {
        color: var(--color-neutral-500);
        font: 400 12px/1 var(--font-body);
    }
    .language-selector {
        margin-left: auto;
    }

    @media (max-width: 640px) {
        .brand-subtitle {
            display: none;
        }
    }
</style>
