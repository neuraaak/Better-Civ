<template>
    <HeaderComponent class="fixed" />
    <ContentComponent :civilisations="civ_data" />

    <!-- Composant de démonstration du lazy loading -->
</template>

<script setup>
    // IMPORT
    // ##############
    import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
    import { translationStore } from './stores/index';
    import { defineAsyncComponent } from 'vue';

    // Lazy loading des composants lourds
    const HeaderComponent = defineAsyncComponent(
        () => import('./components/layout/HeaderComponent.vue')
    );
    const ContentComponent = defineAsyncComponent(
        () => import('./components/layout/ContentComponent.vue')
    );

    // VARIABLES
    // ##############
    const store = translationStore();

    // Afficher la démonstration du lazy loading
    //
    const civ_data = ref([]);
    const civ_tiers_and_tags = ref([
        { id: 1, tags_id: [5, 6], tier_id: 1 }, // 'America'
        { id: 2, tags_id: [5, 2], tier_id: 0 }, // 'Arabia'
        { id: 3, tags_id: [6, 1], tier_id: 2 }, // 'Aztecs'
        { id: 4, tags_id: [6], tier_id: 2 }, // 'China'
        { id: 5, tags_id: [4], tier_id: 2 }, // 'Egypt'
        { id: 6, tags_id: [6], tier_id: 1 }, // 'England'
        { id: 7, tags_id: [1], tier_id: 4 }, // 'France'
        { id: 8, tags_id: [6, 5], tier_id: 1 }, // 'Germany'
        { id: 9, tags_id: [0], tier_id: 1 }, // 'Greece'
        { id: 10, tags_id: [0], tier_id: 4 }, // 'India'
        { id: 11, tags_id: [0], tier_id: 4 }, // 'Iroquois'
        { id: 12, tags_id: [6, 1], tier_id: 3 }, // 'Japan'
        { id: 13, tags_id: [6], tier_id: 3 }, // 'Ottomans'
        { id: 14, tags_id: [0], tier_id: 0 }, // 'Persia'
        { id: 15, tags_id: [4], tier_id: 4 }, // 'Rome'
        { id: 16, tags_id: [4], tier_id: 2 }, // 'Russia'
        { id: 17, tags_id: [0], tier_id: 3 }, // 'Siam'
        { id: 18, tags_id: [6], tier_id: 1 }, // 'Songhai'
        { id: 19, tags_id: [6], tier_id: 1 }, // 'Mongolia'
        { id: 20, tags_id: [0], tier_id: 1 }, // 'Incas'
        { id: 21, tags_id: [1], tier_id: 2 }, // 'Spain'
        { id: 22, tags_id: [6], tier_id: 2 }, // 'Polynesia'
        { id: 23, tags_id: [6], tier_id: 2 }, // 'Denmark'
        { id: 24, tags_id: [3], tier_id: 0 }, // 'Korea'
        { id: 25, tags_id: [3], tier_id: 0 }, // 'Babylon'
        { id: 26, tags_id: [0], tier_id: 3 }, // 'Austria'
        { id: 27, tags_id: [2], tier_id: 4 }, // 'Byzantium'
        { id: 28, tags_id: [0], tier_id: 4 }, // 'Carthage'
        { id: 29, tags_id: [2], tier_id: 2 }, // 'Celts'
        { id: 30, tags_id: [6], tier_id: 2 }, // 'Ethiopia'
        { id: 31, tags_id: [6, 4], tier_id: 1 }, // 'Huns'
        { id: 32, tags_id: [0], tier_id: 1 }, // 'Mayans'
        { id: 33, tags_id: [0], tier_id: 2 }, // 'Netherlands'
        { id: 34, tags_id: [0], tier_id: 2 }, // 'Sweden'
        { id: 35, tags_id: [3], tier_id: 3 }, // 'Assyria'
        { id: 36, tags_id: [1], tier_id: 2 }, // 'Brazil'
        { id: 37, tags_id: [0], tier_id: 4 }, // 'Indonesia'
        { id: 38, tags_id: [5, 1], tier_id: 2 }, // 'Morocco'
        { id: 39, tags_id: [0], tier_id: 0 }, // 'Poland'
        { id: 40, tags_id: [5], tier_id: 4 }, // 'Portugal'
        { id: 41, tags_id: [0], tier_id: 2 }, // 'Shoshone'
        { id: 42, tags_id: [5], tier_id: 1 }, // 'Venice'
        { id: 43, tags_id: [6], tier_id: 0 }, // 'Zulus'
    ]);

    // COMPUTED
    // ##############
    const fetchUrl = computed(
        () =>
            `https://eyefyre.github.io/civvapi/v1/${store.getLanguage}/civilizations/civilizations.json`
    );

    // WATCHER
    // ##############
    watch(
        () => store.getLanguage,
        () => {
            // Calls fetchCivilizations every time the language changes
            fetchCivilizations();
        },
        { immediate: true }
    ); // { immediate: true } ensures that fetchCivilizations is called when the component mounts

    // HOOKS
    // ##############
    onMounted(() => {
        document.title = 'Better Civ5';
        document.documentElement.lang = 'fr';
        window.addEventListener('mousemove', movingBackground);
        fetchCivilizations();
    });

    onBeforeUnmount(() => {
        window.removeEventListener('mousemove', movingBackground);
    });

    // FUNCTIONS
    // ##############
    function movingBackground(event) {
        const { clientX, clientY } = event;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Reduces movement to 10% of mouse position and reverses direction
        const positionX = 50 - (clientX / screenWidth) * 2;
        const positionY = 50 - (clientY / screenHeight) * 2;

        document.body.style.backgroundPosition = `${positionX}% ${positionY}%`;
    }

    async function fetchCivilizations() {
        try {
            const response = await fetch(fetchUrl.value);
            if (!response.ok) throw new Error('Network response was not ok');
            let data = await response.json();
            civ_data.value = mergeCivilizationData(data);
            // console.log(civ_data.value)
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    function mergeCivilizationData(civilizations) {
        return civilizations.map(civ => {
            // Finds the corresponding object in additionalData
            let additionalInfo = civ_tiers_and_tags.value.find(addCiv => addCiv.id === civ.id);

            // If found, adds the new properties to the civ object
            if (additionalInfo) {
                return {
                    ...civ,
                    tags_id: additionalInfo.tags_id,
                    tier_id: additionalInfo.tier_id,
                };
            }

            // If not found, returns the civ object without modifications
            return civ;
        });
    }
</script>
