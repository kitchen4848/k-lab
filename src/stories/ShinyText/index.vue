<script setup lang="ts">
import { computed } from 'vue';

const { text, duration = 5, color = '#b5b5b5' } = defineProps<{
  text: string
  duration?: number
  color?: string
}>();

const animationDuration = computed(() => `${duration}s`);

</script>

<template>
  <div class="container animate-shine">
    {{ text }}
  </div>
</template>

<style scoped>
.container {
  background-color: v-bind(color);
  background-image: linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%);
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
