/**
 * Tests automatisés pour le système de lazy loading
 * 
 * Pour exécuter ces tests :
 * 1. Ouvrir la console du navigateur
 * 2. Copier-coller ce script
 * 3. Exécuter les tests
 */

class LazyLoadingTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    }
    this.tests = []
  }

  // Méthode pour ajouter un test
  test(name, testFunction) {
    this.tests.push({ name, testFunction })
  }

  // Méthode pour exécuter tous les tests
  async runAll() {
    console.log('🧪 Démarrage des tests de lazy loading...')
    console.log('=' .repeat(50))

    for (const test of this.tests) {
      try {
        await test.testFunction()
        console.log(`✅ ${test.name}`)
        this.results.passed++
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`)
        this.results.failed++
      }
      this.results.total++
    }

    this.printResults()
  }

  // Affichage des résultats
  printResults() {
    console.log('=' .repeat(50))
    console.log('📊 Résultats des tests:')
    console.log(`✅ Tests réussis: ${this.results.passed}`)
    console.log(`❌ Tests échoués: ${this.results.failed}`)
    console.log(`📈 Total: ${this.results.total}`)
    console.log(`🎯 Taux de réussite: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`)
  }

  // Test de l'Intersection Observer
  async testIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      throw new Error('IntersectionObserver non supporté')
    }
  }

  // Test du composable useLazyLoading
  async testUseLazyLoading() {
    // Vérifier que le composable est disponible
    if (typeof window.useLazyLoading === 'undefined') {
      throw new Error('Composable useLazyLoading non trouvé')
    }
  }

  // Test des composants LazyImage
  async testLazyImageComponents() {
    const lazyImages = document.querySelectorAll('.lazy-image-container')
    if (lazyImages.length === 0) {
      throw new Error('Aucun composant LazyImage trouvé')
    }
  }

  // Test des composants LazyIcon
  async testLazyIconComponents() {
    const lazyIcons = document.querySelectorAll('.lazy-icon-container')
    if (lazyIcons.length === 0) {
      throw new Error('Aucun composant LazyIcon trouvé')
    }
  }

  // Test du chargement progressif
  async testProgressiveLoading() {
    const images = document.querySelectorAll('img[data-src]')
    if (images.length === 0) {
      throw new Error('Aucune image avec data-src trouvée')
    }
  }

  // Test des états de chargement
  async testLoadingStates() {
    const placeholders = document.querySelectorAll('.lazy-image-placeholder, .lazy-icon-placeholder')
    if (placeholders.length === 0) {
      throw new Error('Aucun placeholder de chargement trouvé')
    }
  }

  // Test de la gestion d'erreur
  async testErrorHandling() {
    // Créer une image avec une URL invalide pour tester la gestion d'erreur
    const testImage = new Image()
    testImage.src = 'invalid-url-test'
    
    return new Promise((resolve, reject) => {
      testImage.onerror = () => resolve()
      testImage.onload = () => reject(new Error('Image invalide chargée avec succès'))
      
      setTimeout(() => {
        reject(new Error('Timeout pour le test de gestion d\'erreur'))
      }, 1000)
    })
  }

  // Test des performances
  async testPerformance() {
    const startTime = performance.now()
    
    // Simuler le scroll pour déclencher le lazy loading
    window.scrollTo(0, document.body.scrollHeight)
    
    // Attendre que les images se chargent
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const endTime = performance.now()
    const loadTime = endTime - startTime
    
    if (loadTime > 5000) {
      throw new Error(`Temps de chargement trop lent: ${loadTime.toFixed(2)}ms`)
    }
  }

  // Test de la mémoire
  async testMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory
      const usedMemory = memory.usedJSHeapSize / 1024 / 1024 // MB
      
      if (usedMemory > 100) {
        throw new Error(`Utilisation mémoire excessive: ${usedMemory.toFixed(2)}MB`)
      }
    }
  }
}

// Configuration des tests
const tester = new LazyLoadingTester()

// Ajout des tests
tester.test('Intersection Observer Support', () => tester.testIntersectionObserver())
tester.test('Composable useLazyLoading', () => tester.testUseLazyLoading())
tester.test('Composants LazyImage', () => tester.testLazyImageComponents())
tester.test('Composants LazyIcon', () => tester.testLazyIconComponents())
tester.test('Chargement progressif', () => tester.testProgressiveLoading())
tester.test('États de chargement', () => tester.testLoadingStates())
tester.test('Gestion d\'erreur', () => tester.testErrorHandling())
tester.test('Performance', () => tester.testPerformance())
tester.test('Utilisation mémoire', () => tester.testMemoryUsage())

// Fonction pour exécuter les tests
window.runLazyLoadingTests = () => {
  tester.runAll()
}

// Fonction pour tester manuellement
window.testLazyLoading = {
  // Test rapide
  quick: () => {
    console.log('🚀 Test rapide du lazy loading...')
    tester.test('Test rapide', async () => {
      await tester.testIntersectionObserver()
      await tester.testLazyImageComponents()
    })
    tester.runAll()
  },
  
  // Test complet
  full: () => {
    console.log('🔍 Test complet du lazy loading...')
    tester.runAll()
  },
  
  // Test de performance
  performance: () => {
    console.log('⚡ Test de performance...')
    tester.test('Performance test', () => tester.testPerformance())
    tester.runAll()
  }
}

console.log('🧪 Tests de lazy loading chargés!')
console.log('Utilisez:')
console.log('- window.runLazyLoadingTests() pour tous les tests')
console.log('- window.testLazyLoading.quick() pour un test rapide')
console.log('- window.testLazyLoading.full() pour un test complet')
console.log('- window.testLazyLoading.performance() pour un test de performance') 