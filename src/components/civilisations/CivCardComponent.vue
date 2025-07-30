<template>
    <Card
        class="bg-zinc-950 border-4 border-zinc-900 rounded-xl hover:border-zinc-800 flex flex-col h-full justify-items-stretch pb-1"
        style="
            width: 100%;
            overflow: hidden;
            background-color: rgb(9 9 11) !important;
            border-radius: 0.75rem !important;
        "
        @click="toggleSelected"
    >
        <template #header>
            <img alt="user header" :src="imagePath" />
        </template>

        <template #title>
            <div class="flex flex-row items-baseline gap-0 pb-1">
                <h1 class="shrink font-mono font-bold px-3 pt-2" :class="sizeClass">
                    {{ name?.split('|')[0] }}
                </h1>
                <CivTierComponent
                    :key="tier_id"
                    :tier_id="tier_id"
                    class="shrink-0 -translate-y-0.5 pr-3"
                >
                </CivTierComponent>
            </div>
        </template>

        <template #subtitle>
            <p
                class="font-sans italic font-light text-sm leading-5 px-3 h-16"
                style="overflow-y: scroll"
            >
                {{ desc }}
            </p>
            <div
                id="leader"
                class="bg-zinc-900 rounded-md mt-2 mx-2 px-2 pb-2 max-h-[3.75rem] min-h-[3.75rem] overflow-y-auto"
            >
                <p
                    v-html="civLeaderEffectWithIcons"
                    class="font-sans font-light text-sm pl-1 py-1"
                ></p>
            </div>
        </template>

        <template #content>
            <div class="h-1"></div>
        </template>

        <template #footer>
            <div class="flex flex-row flex-wrap gap-x-2 px-3 mt-2 pb-3">
                <CivTagComponent
                    v-for="tag_id in tags_id"
                    :key="tag_id"
                    :tag_id="tag_id"
                ></CivTagComponent>
            </div>
        </template>
    </Card>
</template>

<script setup>
    /**
     * Civilization Card Component - Displays civilization information in a card format
     * Shows civilization name, tier, description, leader effect, and tags
     */
    // IMPORT
    // ##############
    import { ref, watch, computed, onMounted } from 'vue';
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
        civ_leader_effect: String,
    });

    const store = translationStore();

    // Component state
    const selectedState = ref(false);
    const selectedCard = ref(null);
    const keywordIcons = ref([]);
    const sizeClass = ref('');

    // Initialize keyword icons from store
    const buildKeywordIcons = () => {
        keywordIcons.value = store.getIconKeywordsDict;
    };

    // Set font size based on language (smaller for CJK languages)
    const sizeLabelUnicode = () => {
        sizeClass.value = ['jp', 'kr', 'zh'].includes(store.lang)
            ? 'text-[1.4rem] leading-8'
            : 'text-2xl';
    };

    // COMPUTED
    const imagePath = computed(() => {
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
    watch(() => store.getLanguage, buildKeywordIcons);

    watch(
        () => store.getLanguage,
        () => {
            sizeLabelUnicode();
        },
        { immediate: true }
    ); // { immediate: true } ensures that sizeLabelUnicode is called on component mount

    // HOOKS
    // ##############
    onMounted(buildKeywordIcons);

    // FUNCTIONS
    function toggleSelected() {
        selectedCard.value = props.id;
        store.setSelectedCard(selectedCard.value);
        //
        selectedState.value = !selectedState.value;
        store.setSelectedState(selectedState.value);
    }
</script>

<style scoped>
    .h-30 {
        height: 6.5rem;
    }

    .card-height {
        height: 24rem;
        max-height: 24rem;
    }
</style>
../../stores/index./subcomponents/CivTagComponent.vue./subcomponents/CivTierComponent.vue
