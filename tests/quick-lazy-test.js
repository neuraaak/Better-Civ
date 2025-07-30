// Test rapide du lazy loading - Copier-coller dans la console
console.log('🧪 Test rapide du lazy loading...');

// Test 1: Intersection Observer
console.log('1. Test Intersection Observer...');
if ('IntersectionObserver' in window) {
    console.log('✅ IntersectionObserver supporté');
} else {
    console.log('❌ IntersectionObserver non supporté');
}

// Test 2: Composants LazyImage
console.log('2. Test composants LazyImage...');
const lazyImages = document.querySelectorAll('.lazy-image-container');
if (lazyImages.length > 0) {
    console.log(`✅ ${lazyImages.length} composants LazyImage trouvés`);
} else {
    console.log('❌ Aucun composant LazyImage trouvé');
}

// Test 3: Composants LazyIcon
console.log('3. Test composants LazyIcon...');
const lazyIcons = document.querySelectorAll('.lazy-icon-container');
if (lazyIcons.length > 0) {
    console.log(`✅ ${lazyIcons.length} composants LazyIcon trouvés`);
} else {
    console.log('❌ Aucun composant LazyIcon trouvé');
}

// Test 4: Placeholders
console.log('4. Test placeholders...');
const placeholders = document.querySelectorAll('.lazy-image-placeholder, .lazy-icon-placeholder');
if (placeholders.length > 0) {
    console.log(`✅ ${placeholders.length} placeholders trouvés`);
} else {
    console.log('❌ Aucun placeholder trouvé');
}

// Test 5: Performance
console.log('5. Test performance...');
const startTime = performance.now();
setTimeout(() => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    console.log(`✅ Temps de test: ${loadTime.toFixed(2)}ms`);
}, 100);

console.log('🎯 Test rapide terminé!');
