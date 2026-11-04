<script setup lang="ts">
import { computed } from 'vue'

const {
  count = 18,
  color = '#8ec5ff',
  angle = 35,
  speedMin = 2,
  speedMax = 5,
  tailLength = 160,
} = defineProps<{
  count?: number
  color?: string
  /** Travel direction in degrees below the horizontal (0 = right, 90 = straight down). */
  angle?: number
  /** Fastest crossing time is `speedMin` seconds, slowest is `speedMax` seconds. */
  speedMin?: number
  speedMax?: number
  tailLength?: number
}>()

interface Meteor {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  scale: number
}

// Cheap seeded PRNG so a given prop set always yields the same layout.
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const meteors = computed<Meteor[]>(() => {
  const rand = rng(1337)
  const n = Math.max(0, Math.round(count))
  const lo = Math.max(0.2, Math.min(speedMin, speedMax))
  const hi = Math.max(lo, speedMin, speedMax)
  const rad = (angle * Math.PI) / 180
  // Spawn upstream of the travel direction: along the edge(s) the meteors enter from.
  const fromLeft = Math.cos(rad) >= 0
  const fromTop = Math.sin(rad) >= 0
  return Array.from({ length: n }, (_, id) => {
    const along = rand()
    const useSideEdge = rand() < 0.35
    let left = along * 120 - 10
    let top = -12 - rand() * 10
    if (useSideEdge) {
      left = -12 - rand() * 10
      top = rand() * 70
    }
    if (!fromLeft) left = 100 - left
    if (!fromTop) top = 100 - top
    const duration = lo + rand() * (hi - lo)
    return {
      id,
      left,
      top,
      delay: -rand() * (hi + 4),
      duration,
      scale: 0.6 + rand() * 0.8,
    }
  })
})

const rotate = computed(() => `${angle}deg`)
const tail = computed(() => `${Math.max(20, tailLength)}px`)
</script>

<template>
  <div class="meteor-shower">
    <div class="meteor-shower__sky" aria-hidden="true">
      <span
        v-for="m in meteors"
        :key="m.id"
        class="meteor-shower__meteor"
        :style="{
          left: m.left + '%',
          top: m.top + '%',
          animationDuration: m.duration + 's',
          animationDelay: m.delay + 's',
          '--ms-scale': m.scale,
        }"
      />
    </div>
    <div class="meteor-shower__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.meteor-shower {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: radial-gradient(ellipse at 30% 0%, #101a3a 0%, #060914 70%);
  color: #fff;
}

.meteor-shower__sky {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.meteor-shower__meteor {
  position: absolute;
  width: v-bind(tail);
  height: calc(2px * var(--ms-scale, 1));
  border-radius: 999px;
  transform-origin: 100% 50%;
  background: linear-gradient(90deg, transparent 0%, v-bind(color) 100%);
  filter: drop-shadow(0 0 6px v-bind(color));
  opacity: 0;
  will-change: transform, opacity;
  animation-name: meteor-shower-fly;
  animation-timing-function: cubic-bezier(0.3, 0.1, 0.9, 0.7);
  animation-iteration-count: infinite;
}

/* Bright head */
.meteor-shower__meteor::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: calc(5px * var(--ms-scale, 1));
  height: calc(5px * var(--ms-scale, 1));
  border-radius: 50%;
  transform: translate(50%, -50%);
  background: #fff;
  box-shadow:
    0 0 8px 2px v-bind(color),
    0 0 18px 4px v-bind(color);
}

.meteor-shower__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

@keyframes meteor-shower-fly {
  0% {
    transform: rotate(v-bind(rotate)) translateX(0);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(v-bind(rotate)) translateX(1500px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .meteor-shower__meteor {
    animation: none;
    opacity: 0.35;
    transform: rotate(v-bind(rotate));
  }
}
</style>
