<template>
  <div
    ref="target"
    class="lazy-image-container"
    :class="{ 'is-loading': isLoading, 'has-error': hasError }"
  >
    <!-- Placeholder pendant le chargement -->
    <div v-if="isLoading && !isVisible" class="lazy-image-placeholder">
      <div class="placeholder-content">
        <div class="placeholder-icon">📷</div>
        <div class="placeholder-text">Chargement...</div>
      </div>
    </div>

    <!-- Image chargée -->
    <img
      v-if="imageSrc && !hasError"
      :src="imageSrc"
      :alt="imageAlt"
      class="lazy-image"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- État d'erreur -->
    <div v-if="hasError" class="lazy-image-error">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <div class="error-text">Erreur de chargement</div>
      </div>
    </div>

    <!-- Spinner de chargement -->
    <div v-if="isLoading && isVisible" class="lazy-image-spinner">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLazyImage } from '@/composables/useLazyLoading'

interface Props {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: 'auto',
  height: 'auto',
  placeholder: ''
})

const {
  target,
  imageSrc,
  imageAlt,
  isLoading,
  hasError,
  isVisible
} = useLazyImage(props.src, props.alt)

const onImageLoad = () => {
  // Image chargée avec succès
}

const onImageError = () => {
  // Gestion d'erreur déjà gérée dans le composable
}
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
}

.lazy-image-placeholder,
.lazy-image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
}

.placeholder-content,
.error-content {
  text-align: center;
  color: #6c757d;
}

.placeholder-icon,
.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.placeholder-text,
.error-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.lazy-image-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.is-loading {
  opacity: 0.7;
}

.has-error {
  border-color: #dc3545;
}
</style> 