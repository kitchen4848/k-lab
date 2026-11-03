<script setup lang="ts">
import { computed } from 'vue'

const {
  colors = ['#22d3ee', '#34d399', '#818cf8', '#c084fc'],
  speed = 1,
  blur = 60,
  intensity = 0.7,
} = defineProps<{
  colors?: string[]
  speed?: number
  blur?: number
  intensity?: number
}>()

const bands = computed(() =>
  colors.map((color, i) => ({
    color,
    style: {
      '--band-color': color,
      '--band-top': `${-20 + (i * 70) / Math.max(colors.length, 1)}%`,
      '--band-delay': `${-i * 3.7}s`,
      '--band-duration': `${(14 + i * 4) / Math.max(speed, 0.05)}s`,
    },
  })),
)
const blurPx = computed(() => `${blur}px`)
</script>

<template>
  <div class="aurora">
    <div class="aurora__layer" aria-hidden="true">
      <span v-for="(band, i) in bands" :key="i + band.color" class="aurora__band" :style="band.style" />
    </div>
    <div class="aurora__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.aurora {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 120%, #0b1026 0%, #05070f 70%);
  color: #fff;
}

.aurora__layer {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  filter: blur(v-bind(blurPx)) saturate(1.3);
  opacity: v-bind(intensity);
  pointer-events: none;
}

.aurora__band {
  position: absolute;
  top: var(--band-top);
  left: -30%;
  width: 160%;
  height: 45%;
  border-radius: 50%;
  background: linear-gradient(90deg, transparent 0%, var(--band-color) 30%, var(--band-color) 70%, transparent 100%);
  mix-blend-mode: screen;
  opacity: 0.85;
  will-change: transform;
  animation: aurora-drift var(--band-duration) ease-in-out var(--band-delay) infinite alternate;
}

.aurora__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

@keyframes aurora-drift {
  0% {
    transform: translate3d(-12%, 0, 0) rotate(-8deg) scaleY(0.8);
  }

  50% {
    transform: translate3d(6%, 18%, 0) rotate(4deg) scaleY(1.25);
  }

  100% {
    transform: translate3d(14%, -10%, 0) rotate(10deg) scaleY(0.9);
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora__band {
    animation: none;
  }
}
</style>
