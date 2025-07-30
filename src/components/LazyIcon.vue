<template>
    <span
        ref="target"
        class="lazy-icon-container"
        :class="{ 'is-loading': isLoading, 'has-error': hasError }"
    >
        <!-- Placeholder pendant le chargement -->
        <span v-if="isLoading && !isVisible" class="lazy-icon-placeholder">
            <div class="placeholder-spinner"></div>
        </span>

        <!-- Icône chargée -->
        <component
            v-else-if="iconComponent && !hasError"
            :is="iconComponent"
            :class="iconClass"
            v-bind="$attrs"
        />

        <!-- État d'erreur -->
        <span v-else-if="hasError" class="lazy-icon-error">
            <span class="error-icon">⚠️</span>
        </span>
    </span>
</template>

<script setup lang="ts">
    import { ref, computed, defineAsyncComponent, watch } from 'vue';
    import { useLazyLoading } from '@/composables/useLazyLoading';

    interface Props {
        name: string;
        size?: string | number;
        color?: string;
        className?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        size: '1em',
        color: 'currentColor',
        className: '',
    });

    const { target, isVisible } = useLazyLoading();
    const isLoading = ref(true);
    const hasError = ref(false);
    const iconComponent = ref<any>(null);

    // Classe CSS pour l'icône
    const iconClass = computed(() => {
        return `lazy-icon ${props.className}`.trim();
    });

    // Chargement dynamique de l'icône
    const loadIcon = async () => {
        if (isVisible.value && !iconComponent.value && !hasError.value) {
            try {
                isLoading.value = true;

                // Import dynamique de l'icône basé sur le nom
                const iconModule = await import(`@/assets/icons/${props.name}.svg`);
                iconComponent.value = defineAsyncComponent(() =>
                    Promise.resolve(iconModule.default)
                );

                isLoading.value = false;
            } catch (error) {
                console.error(`Erreur lors du chargement de l'icône ${props.name}:`, error);
                hasError.value = true;
                isLoading.value = false;
            }
        }
    };

    // Surveiller la visibilité pour charger l'icône
    watch(isVisible, visible => {
        if (visible) {
            loadIcon();
        }
    });

    // Styles dynamiques
    const iconStyles = computed(() => ({
        width: typeof props.size === 'number' ? `${props.size}px` : props.size,
        height: typeof props.size === 'number' ? `${props.size}px` : props.size,
        color: props.color,
    }));
</script>

<style scoped>
    .lazy-icon-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .lazy-icon {
        display: inline-block;
        width: v-bind('iconStyles.width');
        height: v-bind('iconStyles.height');
        color: v-bind('iconStyles.color');
        transition: opacity 0.2s ease-in-out;
    }

    .lazy-icon-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: v-bind('iconStyles.width');
        height: v-bind('iconStyles.height');
        background-color: #f8f9fa;
        border-radius: 4px;
    }

    .placeholder-spinner {
        width: 12px;
        height: 12px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .lazy-icon-error {
        display: flex;
        align-items: center;
        justify-content: center;
        width: v-bind('iconStyles.width');
        height: v-bind('iconStyles.height');
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        color: #721c24;
    }

    .error-icon {
        font-size: 0.75em;
    }

    .is-loading {
        opacity: 0.6;
    }

    .has-error {
        border-color: #dc3545;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
