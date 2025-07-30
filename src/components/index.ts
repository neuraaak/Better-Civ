// Composants avec lazy loading
import { defineAsyncComponent } from 'vue'

// Composants de layout
export const HeaderComponent = defineAsyncComponent(() => 
  import('./layout/HeaderComponent.vue')
)

export const ContentComponent = defineAsyncComponent(() => 
  import('./layout/ContentComponent.vue')
)

// Composants lazy loading
export const LazyImage = defineAsyncComponent(() => 
  import('./LazyImage.vue')
)

export const LazyIcon = defineAsyncComponent(() => 
  import('./LazyIcon.vue')
)

// Composants utilitaires avec lazy loading
export const LoadingSpinner = defineAsyncComponent(() => 
  import('./LoadingSpinner.vue')
)

export const NotificationSystem = defineAsyncComponent(() => 
  import('./NotificationSystem.vue')
)

export const LazyLoadingDemo = defineAsyncComponent(() => 
  import('./LazyLoadingDemo.vue')
)

// Export par défaut pour faciliter l'import
export default {
  HeaderComponent,
  ContentComponent,
  LazyImage,
  LazyIcon,
  LoadingSpinner,
  NotificationSystem,
  LazyLoadingDemo
} 