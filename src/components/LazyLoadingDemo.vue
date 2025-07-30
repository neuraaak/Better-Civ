<template>
    <div class="lazy-demo-container">
        <h2>🧪 Test du Lazy Loading</h2>

        <!-- Section de test des images -->
        <section class="demo-section">
            <h3>📸 Test LazyImage</h3>
            <div class="image-grid">
                <LazyImage
                    v-for="(image, index) in testImages"
                    :key="index"
                    :src="image.url"
                    :alt="image.alt"
                    class="demo-image"
                />
            </div>
        </section>

        <!-- Section de test des icônes -->
        <section class="demo-section">
            <h3>🎨 Test LazyIcon</h3>
            <div class="icon-grid">
                <LazyIcon
                    v-for="(icon, index) in testIcons"
                    :key="index"
                    :name="icon.name"
                    :size="icon.size"
                    :color="icon.color"
                    class="demo-icon"
                />
            </div>
        </section>

        <!-- Section de test des composants -->
        <section class="demo-section">
            <h3>⚡ Test Composants Lazy</h3>
            <div class="component-grid">
                <div
                    v-for="(component, index) in testComponents"
                    :key="index"
                    class="component-item"
                >
                    <h4>{{ component.name }}</h4>
                    <component
                        :is="component.component"
                        v-if="component.shouldLoad"
                        :text="component.text"
                    />
                    <div v-else class="placeholder">
                        <LoadingSpinner size="sm" text="Chargement..." />
                    </div>
                </div>
            </div>
        </section>

        <!-- Contrôles de test -->
        <section class="demo-section">
            <h3>🎮 Contrôles de Test</h3>
            <div class="controls">
                <button @click="addMoreImages" class="btn btn-primary">
                    Ajouter plus d'images
                </button>
                <button @click="toggleSlowNetwork" class="btn btn-secondary">
                    {{ slowNetwork ? 'Réseau normal' : 'Réseau lent' }}
                </button>
                <button @click="clearCache" class="btn btn-warning">Vider le cache</button>
            </div>
        </section>

        <!-- Métriques de performance -->
        <section class="demo-section">
            <h3>📊 Métriques</h3>
            <div class="metrics">
                <div class="metric">
                    <span class="metric-label">Images chargées:</span>
                    <span class="metric-value">{{ loadedImages }}/{{ totalImages }}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Icônes chargées:</span>
                    <span class="metric-value">{{ loadedIcons }}/{{ totalIcons }}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Composants chargés:</span>
                    <span class="metric-value">{{ loadedComponents }}/{{ totalComponents }}</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { LazyImage, LazyIcon, LoadingSpinner } from './index';

    // Images de test
    const testImages = ref([
        { url: 'https://picsum.photos/300/200?random=1', alt: 'Image test 1' },
        { url: 'https://picsum.photos/300/200?random=2', alt: 'Image test 2' },
        { url: 'https://picsum.photos/300/200?random=3', alt: 'Image test 3' },
        { url: 'https://picsum.photos/300/200?random=4', alt: 'Image test 4' },
        { url: 'https://picsum.photos/300/200?random=5', alt: 'Image test 5' },
        { url: 'https://picsum.photos/300/200?random=6', alt: 'Image test 6' },
    ]);

    // Icônes de test (simulées)
    const testIcons = ref([
        { name: 'home', size: 24, color: '#007bff' },
        { name: 'user', size: 24, color: '#28a745' },
        { name: 'settings', size: 24, color: '#ffc107' },
        { name: 'search', size: 24, color: '#dc3545' },
    ]);

    // Composants de test
    const testComponents = ref([
        {
            name: 'Composant 1',
            component: null,
            shouldLoad: false,
            text: 'Composant chargé en lazy loading',
        },
        {
            name: 'Composant 2',
            component: null,
            shouldLoad: false,
            text: 'Autre composant lazy',
        },
    ]);

    // État de test
    const slowNetwork = ref(false);
    const loadedImages = ref(0);
    const loadedIcons = ref(0);
    const loadedComponents = ref(0);

    // Computed
    const totalImages = computed(() => testImages.value.length);
    const totalIcons = computed(() => testIcons.value.length);
    const totalComponents = computed(() => testComponents.value.length);

    // Méthodes de test
    const addMoreImages = () => {
        const newCount = testImages.value.length + 3;
        for (let i = testImages.value.length + 1; i <= newCount; i++) {
            testImages.value.push({
                url: `https://picsum.photos/300/200?random=${i}`,
                alt: `Image test ${i}`,
            });
        }
    };

    const toggleSlowNetwork = () => {
        slowNetwork.value = !slowNetwork.value;
        if (slowNetwork.value) {
            // Simuler un réseau lent
            console.log('🌐 Simulation réseau lent activée');
        } else {
            console.log('🌐 Réseau normal');
        }
    };

    const clearCache = () => {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        console.log('🗑️ Cache vidé');
    };

    // Chargement progressif des composants
    onMounted(() => {
        setTimeout(() => {
            testComponents.value[0].shouldLoad = true;
            loadedComponents.value++;
        }, 2000);

        setTimeout(() => {
            testComponents.value[1].shouldLoad = true;
            loadedComponents.value++;
        }, 4000);

        // Charger les tests automatiquement
        loadTests();
    });

    // Fonction pour charger les tests
    const loadTests = async () => {
        try {
            const response = await fetch('/tests/lazy-loading.test.js');
            const testScript = await response.text();

            // Exécuter le script de test
            const script = document.createElement('script');
            script.textContent = testScript;
            document.head.appendChild(script);

            console.log('🧪 Tests de lazy loading chargés automatiquement!');
        } catch (error) {
            console.log('⚠️ Impossible de charger les tests automatiquement');
            console.log('📋 Copiez le contenu de tests/lazy-loading.test.js dans la console');
        }
    };
</script>

<style scoped>
    .lazy-demo-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .demo-section {
        margin-bottom: 3rem;
        padding: 1.5rem;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        background-color: #f8f9fa;
    }

    .demo-section h3 {
        margin-bottom: 1rem;
        color: #495057;
        border-bottom: 2px solid #007bff;
        padding-bottom: 0.5rem;
    }

    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
    }

    .icon-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .component-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .component-item {
        padding: 1rem;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        background-color: white;
    }

    .component-item h4 {
        margin-bottom: 0.5rem;
        color: #495057;
    }

    .placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100px;
        background-color: #f8f9fa;
        border-radius: 4px;
    }

    .controls {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
    }

    .btn-primary {
        background-color: #007bff;
        color: white;
    }

    .btn-secondary {
        background-color: #6c757d;
        color: white;
    }

    .btn-warning {
        background-color: #ffc107;
        color: #212529;
    }

    .btn:hover {
        opacity: 0.8;
        transform: translateY(-1px);
    }

    .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .metric {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        background-color: white;
        border-radius: 4px;
        border: 1px solid #dee2e6;
    }

    .metric-label {
        font-weight: 500;
        color: #495057;
    }

    .metric-value {
        font-weight: bold;
        color: #007bff;
    }

    .demo-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .demo-icon {
        padding: 0.5rem;
        background-color: white;
        border-radius: 4px;
        border: 1px solid #dee2e6;
    }

    @media (max-width: 768px) {
        .lazy-demo-container {
            padding: 1rem;
        }

        .controls {
            flex-direction: column;
        }

        .image-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
