<script setup lang="ts">
import { computed } from 'vue';

const { text, duration = 2, color = '#ff0000' } = defineProps<{
  text: string
  duration?: number
  color?: string
}>();

const animationDuration = computed(() => `${duration}s`);

const gradientStyle = computed(() => {
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return `linear-gradient(120deg, ${hexToRgba(color, 1)} 40%, ${hexToRgba(color, 0.8)} 50%, ${hexToRgba(color, 0)} 60%)`;
});
</script>

<template>
  <div class="container animate-shine" :style="{ backgroundImage: gradientStyle }">
    {{ text }}
  </div>
</template>

<style scoped>
.container {
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

@keyframes shine {
  0% {
    background-position: 100%;
  }

  100% {
    background-position: -100%;
  }
}

.animate-shine {
  animation-name: shine;
  animation-duration: v-bind(animationDuration);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
