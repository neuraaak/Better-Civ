/**
 * Main store for managing translations and application state
 * Handles multilingual translations, tag and tier correspondences,
 * as well as card selection state
 */
import { defineStore } from 'pinia';
import type { StoreState } from '../types';

export const translationStore = defineStore('translationStore', {
    state: (): StoreState => ({
        cardLabels: [
            {
                key: 'description',
                translations: [
                    { lang: 'en', text: 'Description' },
                    { lang: 'de', text: 'Beschreibung' },
                    { lang: 'es', text: 'Descripción' },
                    { lang: 'fr', text: 'Description' },
                    { lang: 'it', text: 'Descrizione' },
                    { lang: 'jp', text: '説明' },
                    { lang: 'kr', text: '설명' },
                    { lang: 'pl', text: 'Opis' },
                    { lang: 'ru', text: 'Описание' },
                    { lang: 'zh', text: '描述' },
                ],
            },
            {
                key: 'unique_units',
                translations: [
                    { lang: 'en', text: 'Unique Units' },
                    { lang: 'de', text: 'Einzigartige Einheiten' },
                    { lang: 'es', text: 'Unidades únicas' },
                    { lang: 'fr', text: 'Unités uniques' },
                    { lang: 'it', text: 'Unità uniche' },
                    { lang: 'jp', text: 'ユニークユニット' },
                    { lang: 'kr', text: '독특한 부대' },
                    { lang: 'pl', text: 'Unikalne jednostki' },
                    { lang: 'ru', text: 'Уникальные юниты' },
                    { lang: 'zh', text: '独特单位' },
                ],
            },
            {
                key: 'unique_buildings',
                translations: [
                    { lang: 'en', text: 'Unique Buildings' },
                    { lang: 'de', text: 'Einzigartige Gebäude' },
                    { lang: 'es', text: 'Edificios únicos' },
                    { lang: 'fr', text: 'Bâtiments uniques' },
                    { lang: 'it', text: 'Edifici unici' },
                    { lang: 'jp', text: 'ユニークビルディング' },
                    { lang: 'kr', text: '독특한 건물' },
                    { lang: 'pl', text: 'Unikalne budynki' },
                    { lang: 'ru', text: 'Уникальные здания' },
                    { lang: 'zh', text: '独特建筑' },
                ],
            },
        ],
        tagsCorrespondence: [
            {
                id: 0,
                label: [
                    { lang: 'en', text: 'Versatile' },
                    { lang: 'de', text: 'Vielseitig' },
                    { lang: 'es', text: 'Versátil' },
                    { lang: 'fr', text: 'Polyvalent' },
                    { lang: 'it', text: 'Versatile' },
                    { lang: 'jp', text: '多用途' },
                    { lang: 'kr', text: '변하기 쉬운' },
                    { lang: 'pl', text: 'Wszechstronny' },
                    { lang: 'ru', text: 'Универсальный' },
                    { lang: 'zh', text: '多才多艺的' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-blue-900 to-yellow-700 text-stone-100',
            },
            {
                id: 1,
                label: [
                    { lang: 'en', text: 'Culture' },
                    { lang: 'de', text: 'Kultur' },
                    { lang: 'es', text: 'Cultura' },
                    { lang: 'fr', text: 'Culture' },
                    { lang: 'it', text: 'Cultura' },
                    { lang: 'jp', text: '文化' },
                    { lang: 'kr', text: '문화' },
                    { lang: 'pl', text: 'Kultura' },
                    { lang: 'ru', text: 'Культура' },
                    { lang: 'zh', text: '文化' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-purple-900 to-purple-700 text-purple-200',
            },
            {
                id: 2,
                label: [
                    { lang: 'en', text: 'Faith' },
                    { lang: 'de', text: 'Glaube' },
                    { lang: 'es', text: 'Fe' },
                    { lang: 'fr', text: 'Foi' },
                    { lang: 'it', text: 'Fede' },
                    { lang: 'jp', text: '信仰' },
                    { lang: 'kr', text: '신앙' },
                    { lang: 'pl', text: 'Wiara' },
                    { lang: 'ru', text: 'Вера' },
                    { lang: 'zh', text: '信仰' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-yellow-900 to-yellow-700 text-yellow-200',
            },
            {
                id: 3,
                label: [
                    { lang: 'en', text: 'Science' },
                    { lang: 'de', text: 'Wissenschaft' },
                    { lang: 'es', text: 'Ciencia' },
                    { lang: 'fr', text: 'Science' },
                    { lang: 'it', text: 'Scienza' },
                    { lang: 'jp', text: '科学' },
                    { lang: 'kr', text: '과학' },
                    { lang: 'pl', text: 'Nauka' },
                    { lang: 'ru', text: 'Наука' },
                    { lang: 'zh', text: '科学' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-blue-900 to-blue-700 text-blue-200',
            },
            {
                id: 4,
                label: [
                    { lang: 'en', text: 'Military' },
                    { lang: 'de', text: 'Militär' },
                    { lang: 'es', text: 'Militar' },
                    { lang: 'fr', text: 'Militaire' },
                    { lang: 'it', text: 'Militare' },
                    { lang: 'jp', text: '軍事' },
                    { lang: 'kr', text: '군사' },
                    { lang: 'pl', text: 'Wojskowy' },
                    { lang: 'ru', text: 'Военный' },
                    { lang: 'zh', text: '军事' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-red-900 to-red-700 text-red-200',
            },
            {
                id: 5,
                label: [
                    { lang: 'en', text: 'Trade' },
                    { lang: 'de', text: 'Handel' },
                    { lang: 'es', text: 'Comercio' },
                    { lang: 'fr', text: 'Commerce' },
                    { lang: 'it', text: 'Commercio' },
                    { lang: 'jp', text: '貿易' },
                    { lang: 'kr', text: '무역' },
                    { lang: 'pl', text: 'Handel' },
                    { lang: 'ru', text: 'Торговля' },
                    { lang: 'zh', text: '贸易' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-green-900 to-green-700 text-green-200',
            },
            {
                id: 6,
                label: [
                    { lang: 'en', text: 'Production' },
                    { lang: 'de', text: 'Produktion' },
                    { lang: 'es', text: 'Producción' },
                    { lang: 'fr', text: 'Production' },
                    { lang: 'it', text: 'Produzione' },
                    { lang: 'jp', text: '生産' },
                    { lang: 'kr', text: '생산' },
                    { lang: 'pl', text: 'Produkcja' },
                    { lang: 'ru', text: 'Производство' },
                    { lang: 'zh', text: '生产' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-orange-900 to-orange-700 text-orange-200',
            },
        ],
        tiersCorrespondence: [
            {
                id: 0,
                label: [
                    { lang: 'en', text: 'Tier S' },
                    { lang: 'de', text: 'Tier S' },
                    { lang: 'es', text: 'Tier S' },
                    { lang: 'fr', text: 'Tier S' },
                    { lang: 'it', text: 'Tier S' },
                    { lang: 'jp', text: 'ティアS' },
                    { lang: 'kr', text: '티어 S' },
                    { lang: 'pl', text: 'Tier S' },
                    { lang: 'ru', text: 'Уровень S' },
                    { lang: 'zh', text: 'S级' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-purple-900 to-purple-700 text-purple-200',
            },
            {
                id: 1,
                label: [
                    { lang: 'en', text: 'Tier A' },
                    { lang: 'de', text: 'Tier A' },
                    { lang: 'es', text: 'Tier A' },
                    { lang: 'fr', text: 'Tier A' },
                    { lang: 'it', text: 'Tier A' },
                    { lang: 'jp', text: 'ティアA' },
                    { lang: 'kr', text: '티어 A' },
                    { lang: 'pl', text: 'Tier A' },
                    { lang: 'ru', text: 'Уровень A' },
                    { lang: 'zh', text: 'A级' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-green-900 to-green-700 text-green-200',
            },
            {
                id: 2,
                label: [
                    { lang: 'en', text: 'Tier B' },
                    { lang: 'de', text: 'Tier B' },
                    { lang: 'es', text: 'Tier B' },
                    { lang: 'fr', text: 'Tier B' },
                    { lang: 'it', text: 'Tier B' },
                    { lang: 'jp', text: 'ティアB' },
                    { lang: 'kr', text: '티어 B' },
                    { lang: 'pl', text: 'Tier B' },
                    { lang: 'ru', text: 'Уровень B' },
                    { lang: 'zh', text: 'B级' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-blue-900 to-blue-700 text-blue-200',
            },
            {
                id: 3,
                label: [
                    { lang: 'en', text: 'Tier C' },
                    { lang: 'de', text: 'Tier C' },
                    { lang: 'es', text: 'Tier C' },
                    { lang: 'fr', text: 'Tier C' },
                    { lang: 'it', text: 'Tier C' },
                    { lang: 'jp', text: 'ティアC' },
                    { lang: 'kr', text: '티어 C' },
                    { lang: 'pl', text: 'Tier C' },
                    { lang: 'ru', text: 'Уровень C' },
                    { lang: 'zh', text: 'C级' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-yellow-900 to-yellow-700 text-yellow-200',
            },
            {
                id: 4,
                label: [
                    { lang: 'en', text: 'Tier D' },
                    { lang: 'de', text: 'Tier D' },
                    { lang: 'es', text: 'Tier D' },
                    { lang: 'fr', text: 'Tier D' },
                    { lang: 'it', text: 'Tier D' },
                    { lang: 'jp', text: 'ティアD' },
                    { lang: 'kr', text: '티어 D' },
                    { lang: 'pl', text: 'Tier D' },
                    { lang: 'ru', text: 'Уровень D' },
                    { lang: 'zh', text: 'D级' },
                ],
                checked: false,
                color: 'bg-gradient-to-r from-red-900 to-red-700 text-red-200',
            },
        ],
        translationDict: [
            {
                en: [
                    // Culture
                    { text: 'Culture', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: 'Faith', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: 'Science', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: 'Production', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: 'Gold', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                de: [
                    // Culture
                    { text: 'Kultur', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: 'Glaube', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: 'Wissenschaft', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: 'Produktion', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: 'Gold', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                es: [
                    // Culture
                    { text: 'Cultura', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: 'Fe', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: 'Ciencia', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: 'Producción', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: 'Oro', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                fr: [
                    // Culture
                    { text: 'Culture', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: 'Foi', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: 'Science', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: 'Production', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: 'Or', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                it: [
                    // Culture
                    { text: 'Cultura', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: 'Fede', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: 'Scienza', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: 'Produzione', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: 'Oro', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                jp: [
                    // Culture
                    { text: '文化', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: '信仰', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: '科学', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: '生産', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: '金', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                kr: [
                    // Culture
                    { text: '문화', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: '신앙', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: '과학', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: '생산', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: '금', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                pl: [
                    // Culture
                    { text: 'Kultura', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: 'Wiara', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: 'Nauka', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: 'Produkcja', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: 'Złoto', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                ru: [
                    // Culture
                    { text: 'Культура', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: 'Вера', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: 'Наука', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: 'Производство', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: 'Золото', icon: '/icons/20xGold5.webp' },
                ],
            },
            {
                zh: [
                    // Culture
                    { text: '文化', icon: '/icons/20xCulture5.webp' },
                    // Faith
                    { text: '信仰', icon: '/icons/20xFaith5.webp' },
                    // Science
                    { text: '科技值', icon: '/icons/20xScience5.webp' },
                    // Production
                    { text: '生產力', icon: '/icons/20xProduction5.webp' },
                    // Commerce
                    { text: '金幣', icon: '/icons/20xGold5.webp' },
                ],
            },
        ],
        lang: 'fr',
        cardId: null,
        selectedState: false,
    }),
    getters: {
        // LISTS
        getTagList: state => {
            return state.tagsCorrespondence;
        },
        getTierList: state => {
            return state.tiersCorrespondence;
        },
        // GETTER BY ID
        getTagPropertyById: state => (tagId: number, property: string) => {
            const tag = state.tagsCorrespondence.find(tag => tag.id === tagId);
            if (!tag) return undefined;

            if (property === 'color') {
                return tag.color;
            } else if (property === 'label') {
                const labelObject = tag.label.find(labelItem => labelItem.lang === state.lang);
                return labelObject ? labelObject.text : undefined;
            } else if (property === 'icon') {
                return undefined; // Not implemented yet
            } else {
                return (tag as any)[property];
            }
        },
        getTierPropertyById: state => (tierId: number, property: string) => {
            const tier = state.tiersCorrespondence.find(tier => tier.id === tierId);
            if (!tier) return undefined; // If tier not found, return undefined

            if (property === 'color') {
                // If the requested property is 'color', return the value directly
                return tier.color;
            } else if (property === 'label') {
                // If the requested property is 'label' and label is an array, find the text corresponding to the current language
                if (Array.isArray(tier.label)) {
                    const labelObject = tier.label.find(labelItem => labelItem.lang === state.lang);
                    return labelObject ? labelObject.text : undefined;
                } else {
                    // If 'label' is not an array, it means the tier object hasn't been updated yet
                    // to support multilingualism, so just return the value of 'label'
                    return tier.label;
                }
            } else {
                // For any other property, return the value as is (or undefined if not found)
                return (tier as any)[property];
            }
        },
        getTranslation: state => (key: string) => {
            const item = state.cardLabels.find(translation => translation.key === key);
            const translationObj = item?.translations.find(t => t.lang === state.lang);
            return translationObj ? translationObj.text : key; // Return the keyword by default if no translation is found
        },
        getIconKeywordsDict: state => {
            const dictForCurrentLang = state.translationDict.find(dict => dict[state.lang]);
            return dictForCurrentLang ? dictForCurrentLang[state.lang] : [];
        },
        // LANGUAGE
        getLanguage: state => {
            return state.lang;
        },
        // CARD STATE
        getSelectedState(state) {
            return state.selectedState;
        },
        getSelectedCard(state) {
            return state.cardId;
        },
    },
    actions: {
        // LANGUAGE
        setLanguage(newLang: string) {
            this.lang = newLang;
        },
        // CARD STATE
        setSelectedCard(cardId: number) {
            this.cardId = cardId;
        },
        setSelectedState(state?: boolean) {
            // Explicit open/close; toggles when called without argument
            this.selectedState = state ?? !this.selectedState;
            // console.log('click on card :', this.cardId, this.selectedState);
        },
    },
});
