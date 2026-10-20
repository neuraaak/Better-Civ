<template>
    <svg
        class="ph"
        :class="`ph-${name}`"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path :d="phosphorPaths[name]" />
    </svg>
</template>

<script setup lang="ts">
    import { phosphorPaths, type PhosphorIconName } from './phosphorIcons';

    defineProps<{ name: PhosphorIconName }>();
</script>
