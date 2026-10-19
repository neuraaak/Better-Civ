<template>
    <header class="header">
        <div class="brand">
            <div class="brand-mark">
                <img src="/img/logo.png" alt="Logo Better-Civ" class="logo" />
            </div>
            <div>
                <p class="brand-title">Tier List</p>
                <p class="brand-subtitle">Civilisations · Méta actuelle</p>
            </div>
        </div>
        <SelectLanguageComponent class="language-selector" />
    </header>
</template>

<script setup>
    /**
     * Header Component - Top navigation bar with logo and language selector
     */
    // IMPORT
    // ##############
    import SelectLanguageComponent from '../global/SelectLanguageComponent.vue';
</script>

<style scoped>
    .header {
        z-index: 100;
        position: fixed;
        inset: 0 0 auto;
        width: 100%;
        height: 4.75rem;
        padding: 0 2.5rem;
        border-bottom: 1px solid rgb(89 93 108 / 55%);
        background: rgb(22 24 38 / 88%);
        color: #e9e9ed;
        display: flex;
        align-items: center;
        justify-content: space-between;
        backdrop-filter: blur(16px);
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }
    .brand-mark {
        display: grid;
        width: 2.5rem;
        height: 2.5rem;
        place-items: center;
        border: 1px solid #3f424d;
        border-radius: 0.55rem;
        background: #232532;
        box-shadow: 0 0 1.5rem rgb(145 132 217 / 22%);
    }
    .logo {
        width: 2rem;
        height: 2rem;
        object-fit: contain;
    }
    .brand-title,
    .brand-subtitle {
        margin: 0;
    }
    .brand-title {
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.01em;
    }
    .brand-subtitle {
        margin-top: 0.12rem;
        color: #9397ab;
        font-size: 0.75rem;
    }
    .language-selector {
        margin: 0 !important;
    }

    nav a {
        color: #fff;
        text-decoration: none;
        margin-right: 15px;
    }

    nav a:hover {
        text-decoration: underline;
    }

    @media (max-width: 640px) {
        .header {
            padding-inline: 1rem;
        }
        .brand-subtitle {
            display: none;
        }
    }
</style>
