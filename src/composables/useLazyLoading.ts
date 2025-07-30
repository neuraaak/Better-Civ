import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export interface LazyLoadingOptions {
  threshold?: number
  rootMargin?: string
  root?: Element | null
}

export function useLazyLoading(options: LazyLoadingOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    root = null
  } = options

  const target = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  const hasLoaded = ref(false)

  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !hasLoaded.value) {
        isVisible.value = true
        hasLoaded.value = true
        stop()
      }
    },
    {
      threshold,
      rootMargin,
      root
    }
  )

  onUnmounted(() => {
    stop()
  })

  return {
    target,
    isVisible,
    hasLoaded
  }
}

export function useLazyImage(src: string, alt: string = '') {
  const { target, isVisible, hasLoaded } = useLazyLoading()
  const imageSrc = ref('')
  const imageAlt = ref(alt)
  const isLoading = ref(true)
  const hasError = ref(false)

  const loadImage = () => {
    if (isVisible.value && !hasLoaded.value) {
      const img = new Image()
      img.onload = () => {
        imageSrc.value = src
        isLoading.value = false
        hasLoaded.value = true
      }
      img.onerror = () => {
        hasError.value = true
        isLoading.value = false
      }
      img.src = src
    }
  }

  watch(isVisible, (visible) => {
    if (visible) {
      loadImage()
    }
  })

  return {
    target,
    imageSrc,
    imageAlt,
    isLoading,
    hasError,
    isVisible
  }
}

export function useLazyComponent() {
  const { target, isVisible } = useLazyLoading()
  const shouldLoad = ref(false)

  watch(isVisible, (visible) => {
    if (visible && !shouldLoad.value) {
      shouldLoad.value = true
    }
  })

  return {
    target,
    shouldLoad,
    isVisible
  }
} 