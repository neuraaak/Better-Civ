<template>
  <div 
    class="loading-spinner-container"
    :class="{ 'overlay': overlay, 'inline': !overlay }"
  >
    <div class="spinner-wrapper">
      <div 
        class="spinner"
        :class="[`spinner-${size}`, `spinner-${variant}`]"
      ></div>
      <div v-if="text" class="spinner-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  text?: string
  overlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  text: '',
  overlay: false
})
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner-container.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.loading-spinner-container.inline {
  padding: 1rem;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  border-radius: 50%;
  border: 2px solid transparent;
  animation: spin 1s linear infinite;
}

/* Tailles */
.spinner-sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.spinner-md {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

.spinner-lg {
  width: 32px;
  height: 32px;
  border-width: 4px;
}

/* Variantes de couleur */
.spinner-primary {
  border-top-color: #007bff;
  border-right-color: #007bff;
}

.spinner-secondary {
  border-top-color: #6c757d;
  border-right-color: #6c757d;
}

.spinner-success {
  border-top-color: #28a745;
  border-right-color: #28a745;
}

.spinner-warning {
  border-top-color: #ffc107;
  border-right-color: #ffc107;
}

.spinner-error {
  border-top-color: #dc3545;
  border-right-color: #dc3545;
}

.spinner-text {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .spinner-lg {
    width: 28px;
    height: 28px;
  }
  
  .spinner-md {
    width: 20px;
    height: 20px;
  }
}
</style> 