<template>
    <div class="search-container relative">
        <div class="input-wrapper relative">
            <input
                v-model="searchText"
                type="text"
                name="text"
                class="input bg-zinc-800 text-amber-500 border-amber-500 border-2 rounded-lg h-11 pr-10"
                placeholder="Search"
                @input="updateSearchText"
                @focus="showSuggestions = true"
                @blur="hideSuggestions"
            />

            <!-- Reset button -->
            <button
                v-if="searchText"
                @click="resetSearch"
                class="reset-btn absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-300 transition-colors"
                type="button"
                title="Clear search"
            >
                ✕
            </button>
        </div>

        <!-- Autocomplete suggestions -->
        <div
            v-if="showSuggestions && suggestions.length > 0"
            class="suggestions absolute top-full left-0 right-0 bg-zinc-900 border border-amber-500 rounded-lg mt-1 max-h-48 overflow-y-auto z-50"
        >
            <div
                v-for="suggestion in suggestions"
                :key="suggestion.id"
                class="suggestion px-3 py-2 hover:bg-zinc-800 cursor-pointer text-amber-500"
                @click="selectSuggestion(suggestion)"
            >
                {{ suggestion.name }}
            </div>
        </div>
    </div>
</template>

<script setup>
    /**
     * Search Input Component - Text input for searching civilizations with autocomplete
     * Emits search text updates to parent components
     */
    // IMPORT
    // ##############
    import { ref, computed, watch } from 'vue';

    // VARIABLES
    // ##############
    const props = defineProps({
        civilizations: {
            type: Array,
            default: () => [],
        },
    });

    const searchText = ref(''); // Track the search text input by the user
    const showSuggestions = ref(false);

    const emit = defineEmits(['update:searchText']);

    // COMPUTED
    // ##############
    const suggestions = computed(() => {
        if (!searchText.value || searchText.value.length < 2) return [];

        return props.civilizations
            .filter(civ => civ.name?.toLowerCase().includes(searchText.value.toLowerCase()))
            .slice(0, 8); // Limit to 8 suggestions
    });

    // FUNCTIONS
    // ##############
    function updateSearchText() {
        emit('update:searchText', searchText.value);
    }

    function selectSuggestion(suggestion) {
        searchText.value = suggestion.name;
        showSuggestions.value = false;
        updateSearchText();
    }

    function hideSuggestions() {
        // Delay hiding to allow click on suggestion
        setTimeout(() => {
            showSuggestions.value = false;
        }, 150);
    }

    function resetSearch() {
        searchText.value = '';
        showSuggestions.value = false;
        updateSearchText();
    }
</script>

<style scoped>
    .input {
        padding: 10px 25px;
        min-width: 300px;
    }

    .input:active {
        box-shadow: 2px 2px 15px #8707ff inset;
    }

    .suggestions {
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .suggestion:hover {
        background-color: rgb(63 63 70);
    }

    .reset-btn {
        font-size: 14px;
        font-weight: bold;
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .reset-btn:hover {
        background-color: rgba(245, 158, 11, 0.1);
    }
</style>
