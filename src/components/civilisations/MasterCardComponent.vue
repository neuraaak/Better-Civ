<template>
    <div class="h-full rounded-xl">
        <div class="content w-full h-full rounded-xl overflow-hidden">
            <div
                class="back absolute flex justify-center items-center w-full h-full bg-zinc-800"
                style="background-color: rgb(39 39 42) !important"
            >
                <div
                    class="back-content absolute flex justify-center items-center bg-zinc-900 rounded-xl"
                >
                    <Card
                        class="mastercard bg-zinc-950 rounded-xl hover:border-zinc-800 flex flex-col h-full justify-items-stretch"
                        style="
                            width: 100%;
                            overflow: hidden;
                            background-color: rgb(9 9 11) !important;
                            border-radius: 0.75rem !important;
                        "
                        @click=""
                    >
                        <template #header>
                            <img
                                :src="civBackground"
                                alt="user header"
                                class="object-cover object-top w-full h-[220px]"
                                style="border-radius: 0.75rem 0.75rem 0 0"
                            />
                        </template>

                        <template #title>
                            <div class="flex flex-row items-baseline gap-0 px-4 pb-1 mt-1">
                                <div class="flex h-full">
                                    <img
                                        :src="civ_icon"
                                        class="object-contain object-bottom h-[36px] w-auto translate-y-1"
                                        alt="Icon of the civilization"
                                    />
                                </div>
                                <h1
                                    class="shrink font-mono font-bold tracking-tighter pl-3"
                                    :class="sizeClass"
                                >
                                    {{ name?.split('|')[0] }}
                                </h1>
                                <div class="grow shrink-0 -translate-y-1 pl-4">
                                    <CivTierComponent :key="tier_id" :tier_id="tier_id" class="">
                                    </CivTierComponent>
                                </div>
                            </div>
                        </template>

                        <template #subtitle>
                            <!-- Description -->
                            <div id="desc">
                                <h3 class="font-mono font-bold text-md px-4">
                                    {{ descriptionLabel }}
                                </h3>
                                <p
                                    class="font-sans italic font-light text-sm leading-5 px-4 max-h-16"
                                    style="overflow-y: scroll"
                                >
                                    {{ desc }}
                                </p>
                            </div>
                        </template>

                        <template #content>
                            <div class="overflow-y-auto">
                                <!-- Categories -->
                                <div
                                    id="category"
                                    class="bg-zinc-900 rounded-md mt-4 mx-4 px-2 py-1"
                                    style="background-color: rgb(24 24 27) !important"
                                >
                                    <div class="flex flex-row flex-wrap gap-x-1 mt-2 mb-2">
                                        <CivTagComponent
                                            v-for="tag_id in tags_id"
                                            :key="tag_id"
                                            :tag_id="tag_id"
                                        >
                                        </CivTagComponent>
                                    </div>
                                </div>

                                <!-- Leader -->
                                <div
                                    id="leader"
                                    class="bg-zinc-900 rounded-md mt-3 mx-4 px-2 py-1"
                                    style="background-color: rgb(24 24 27) !important"
                                >
                                    <!-- <h3 class="font-mono font-bold text-md">{{ civ_leader }}</h3> -->
                                    <div class="flex flex-row gap-x-1">
                                        <div
                                            v-if="civ_leader_icon !== undefined"
                                            class="flex h-full shrink-0 w-16"
                                        >
                                            <img
                                                :src="civ_leader_icon"
                                                class="object-contain object-bottom max-h-full w-full translate-y-1"
                                                alt="Icon of the civilization"
                                            />
                                        </div>
                                        <div
                                            class="flex flex-col flex-grow shrink flex-nowrap gap-x-1 mb-2"
                                        >
                                            <h2 class="font-mono font-bold text-2xl pl-1 pt-1">
                                                {{ civ_leader?.split('|')[0] }}
                                            </h2>
                                            <p
                                                v-html="civLeaderEffectWithIcons"
                                                class="font-sans font-light text-sm pl-1 -translate-y-0.5"
                                            ></p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Unique items -->
                                <div class="flex flex-row gap-x-3">
                                    <!-- Unique unit -->
                                    <div
                                        class="flex flex-col bg-zinc-900 rounded-md w-1/2 mt-3 ml-4 px-2 py-1"
                                        style="background-color: rgb(24 24 27) !important"
                                    >
                                        <h3 class="font-mono font-bold text-sm text-left ml-1 mt-1">
                                            {{ unitsLabel }}
                                        </h3>
                                        <div v-for="(unit, index) in unitData" :key="unit.name">
                                            <div class="flex flex-row gap-x-1 h-8">
                                                <div class="flex h-full shrink-0 w-6">
                                                    <img
                                                        v-if="unit.icon !== undefined"
                                                        :src="unit.icon"
                                                        class="object-contain object-center h-full w-full"
                                                        :alt="unit.name.split('|')[0]"
                                                    />
                                                </div>
                                                <div
                                                    class="flex flex-col flex-grow shrink flex-nowrap gap-x-1 mb-2"
                                                >
                                                    <h3
                                                        v-if="unit.name !== undefined"
                                                        class="font-sans font-normal text-sm my-1 pl-1 pt-1"
                                                    >
                                                        {{ unit.name.split('|')[0] }}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div
                                                v-if="index != unitData.length - 1"
                                                class="bg-zinc-800 h-[1px] mt-1"
                                            ></div>
                                        </div>
                                    </div>

                                    <!-- Unique building -->
                                    <div
                                        class="flex flex-col bg-zinc-900 rounded-md w-1/2 mt-3 mr-4 px-2 py-1"
                                        style="background-color: rgb(24 24 27) !important"
                                    >
                                        <h3 class="font-mono font-bold text-sm text-left ml-1 mt-1">
                                            {{ buildingsLabel }}
                                        </h3>
                                        <div v-for="(building, index) in buildingData">
                                            <div class="flex flex-row gap-x-1 h-8">
                                                <div class="flex h-full shrink-0 w-6">
                                                    <img
                                                        v-if="building.name !== undefined"
                                                        :src="building.icon"
                                                        class="object-contain object-center h-full w-full"
                                                        :alt="building.name.split('|')[0]"
                                                    />
                                                </div>
                                                <div
                                                    class="flex flex-col flex-grow shrink flex-nowrap gap-x-1 mb-2"
                                                >
                                                    <h3
                                                        v-if="building.name !== undefined"
                                                        class="font-sans font-normal text-sm my-1 pl-1 pt-1"
                                                    >
                                                        {{ building.name.split('|')[0] }}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div
                                                v-if="index != buildingData.length - 1"
                                                class="bg-zinc-800 h-[1px] mt-1"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template #footer>
                            <div class="flex flex-row flex-wrap gap-x-2 pl-3 mt-1"></div>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    /**
     * Master Card Component - Detailed civilization information display
     * Shows comprehensive civilization data including units, buildings, and leader information
     */
    // IMPORT
    // ##############
    import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
    import { translationStore } from '../../stores/index';
    import Card from 'primevue/card';
    import CivTierComponent from './subcomponents/CivTierComponent.vue'; // cspell:ignore subcomponents
    import CivTagComponent from './subcomponents/CivTagComponent.vue'; // cspell:ignore subcomponents

    // VARIABLES
    // ##############
    const props = defineProps({
        id: Number,
        name: String,
        desc: String,
        tags_id: Array,
        tier_id: Number,
        civ_icon: String,
        civ_leader: String,
        civ_leader_icon: String,
        civ_leader_effect: String,
        civ_units: Array,
        civ_building: Array,
    });

    const store = translationStore();

    // Component data
    const unitData = ref([]);
    const buildingData = ref([]);
    const descriptionLabel = ref('');
    const unitsLabel = ref('');
    const buildingsLabel = ref('');
    const keywordIcons = ref([]);
    const sizeClass = ref('');

    // Update translated labels based on current language
    const updateLabels = () => {
        descriptionLabel.value = store.getTranslation('description');
        unitsLabel.value = store.getTranslation('unique_units');
        buildingsLabel.value = store.getTranslation('unique_buildings');
    };

    // Set font size based on language (smaller for CJK languages)
    const sizeLabelUnicode = () => {
        sizeClass.value = ['jp', 'kr', 'zh'].includes(store.lang)
            ? 'text-[2.5rem] leading-[3.75rem] translate-y-0.5'
            : 'text-[2.75rem] leading-[3.5rem]';
    };

    // Initialize keyword icons from store
    const buildKeywordIcons = () => {
        keywordIcons.value = store.getIconKeywordsDict;
    };

    // COMPUTED
    const civBackground = computed(() => {
        return `/img/card-cover2.jpg`;
    });

    const civLeaderEffectWithIcons = computed(() => {
        let text = props.civ_leader_effect?.replace(/\[.*?\]/g, '').trim();

        keywordIcons.value.forEach(({ text: keyword, icon }) => {
            const iconPath = icon;
            let regex = null;
            if (['ru', 'jp', 'kr', 'zh'].includes(store.lang)) {
                regex = new RegExp(`${keyword}`, 'ui');
            } else {
                regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            }

            if (text !== undefined) {
                text = text.replace(
                    regex,
                    `<span class="keyword-icon translate-y-[0.2rem]" style="display: inline-flex; align-items: center; height: 20px;"><img src="${iconPath}" alt="${keyword}" style="display: inline; height: 16px; vertical-align: middle;">${keyword}</span>`
                );
            }
        });

        return text;
    });

    // WATCHER
    // ##############
    watch(
        () => store.getLanguage,
        () => {
            buildKeywordIcons();
        },
        { immediate: false }
    );

    watch(
        () => store.getLanguage,
        () => {
            updateLabels();
            sizeLabelUnicode();
            // Call fetchUnitsBuildings whenever language changes
            fetchUnitsBuildings();
        },
        { immediate: true }
    ); // { immediate: true } ensures that fetchUnitsBuildings is called on component mount

    // HOOKS
    // ##############
    onMounted(() => {
        fetchUnitsBuildings();
        buildKeywordIcons();

        const handleMouseMove = e => {
            for (const card of document.getElementsByClassName('mastercard')) {
                const rect = card.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Cleanup on component destruction
        onUnmounted(() => {
            document.removeEventListener('mousemove', handleMouseMove);
        });
    });

    // FUNCTIONS
    // ##############
    async function fetchUnitsBuildings() {
        // Load unit data
        const units = props.civ_units || []; // Ensure array exists
        const unitFetches = units.map(async unit => {
            try {
                if (!unit.url) {
                    return { ...unit, icon: undefined };
                }
                const response = await fetch(unit.url.replace('/en/', `/${store.getLanguage}/`));
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                return { ...unit, icon: data.icon }; // Keep name and add icon
            } catch (error) {
                console.error('Error fetching unit data:', error);
                return { ...unit, icon: undefined }; // Handle error by keeping unit name
            }
        });

        // Load building data
        const buildings = props.civ_building || []; // Ensure array exists
        const buildingFetches = buildings.map(async building => {
            try {
                if (!building.url) {
                    return { ...building, icon: undefined };
                }
                const response = await fetch(
                    building.url.replace('/en/', `/${store.getLanguage}/`)
                );
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                return { ...building, icon: data.icon }; // Keep name and add icon
            } catch (error) {
                console.error('Error fetching building data:', error);
                return { ...building, icon: undefined }; // Handle error by keeping building name
            }
        });

        // Resolve all promises and store results
        unitData.value = await Promise.all(unitFetches);
        buildingData.value = await Promise.all(buildingFetches);
    }

    function getTranslation(key) {
        const item = translations.find(translation => translation.key === key);
        const translationObj = item.translations.find(t => t.lang === store.lang);
        return translationObj ? translationObj.text : key; // Return default key if no translation found
    }
</script>

<style scoped>
    /* Card content with 3D transform support */
    .content {
        transform-style: preserve-3d;
        transition: transform 300ms;
    }

    /* Animated background gradient */
    .back::before {
        position: absolute;
        content: ' ';
        display: block;
        width: 120%;
        height: 120%;
        background-image: linear-gradient(
            to right,
            rgb(39 39 42) 0%,
            rgb(82 82 91) 7%,
            rgb(113 113 122) 25%,
            rgb(82 82 91) 38%,
            rgb(24 24 27) 50%,
            rgb(82 82 91) 66%,
            rgb(113 113 122) 75%,
            rgb(82 82 91) 92%,
            rgb(39 39 42) 100%
        );
        animation: rotation_481 24000ms infinite cubic-bezier(0.172, 0.5, 0.662, 1);
        box-sizing: content-box !important;
    }

    /* Background content with padding */
    .back-content {
        width: calc(100% - 8px);
        height: calc(100% - 8px);
    }

    /* Background rotation animation */
    @keyframes rotation_481 {
        0% {
            transform: rotateZ(0deg);
        }

        100% {
            transform: rotateZ(360deg);
        }
    }

    /* Master card hover effects */
    .mastercard:hover::before {
        opacity: 1;
    }

    /* Master card pseudo-elements for mouse tracking effects */
    .mastercard::before,
    .mastercard::after {
        pointer-events: none;
        border-radius: inherit;
        content: '';
        height: 100%;
        left: 0px;
        opacity: 0;
        position: absolute;
        top: 0px;
        transition: opacity 500ms;
        width: 100%;
    }

    /* Primary mouse tracking effect */
    .mastercard::before {
        background: radial-gradient(
            800px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.06),
            transparent 40%
        );
        z-index: 3;
    }

    /* Secondary mouse tracking effect */
    .mastercard::after {
        background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.4),
            transparent 40%
        );
        z-index: 1;
    }
</style>
