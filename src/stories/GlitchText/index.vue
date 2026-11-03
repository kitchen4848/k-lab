<script setup lang="ts">
import { computed } from 'vue'

const {
  text,
  colorA = '#ff2a6d',
  colorB = '#05d9e8',
  intensity = 1,
  speed = 1,
  hoverOnly = false,
} = defineProps<{
  text: string
  colorA?: string
  colorB?: string
  intensity?: number
  speed?: number
  hoverOnly?: boolean
}>()

const offset = computed(() => `${(3 * intensity).toFixed(2)}px`)
const duration = computed(() => `${(2.6 / Math.max(speed, 0.1)).toFixed(3)}s`)
</script>

<template>
  <span class="glitch" :class="{ 'glitch--hover': hoverOnly }" tabindex="-1">
    <span class="glitch__sr">{{ text }}</span>
    <span class="glitch__base" aria-hidden="true">{{ text }}</span>
    <span class="glitch__slice glitch__slice--a" aria-hidden="true">{{ text }}</span>
    <span class="glitch__slice glitch__slice--b" aria-hidden="true">{{ text }}</span>
  </span>
</template>

<style scoped>
.glitch {
  --offset: v-bind(offset);
  position: relative;
  display: inline-block;
  font-family: 'Courier New', ui-monospace, monospace;
  font-weight: 800;
  font-size: 4rem;
  line-height: 1.1;
  letter-spacing: 0.04em;
  color: #fff;
  white-space: pre;
  text-transform: uppercase;
  cursor: default;
}

.glitch__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.glitch__base {
  position: relative;
  display: block;
  text-shadow: 0 0 18px rgb(255 255 255 / 0.25);
  animation: glitch-jolt v-bind(duration) steps(1, end) infinite;
}

.glitch__slice {
  position: absolute;
  inset: 0;
  display: block;
  mix-blend-mode: screen;
  will-change: transform, clip-path;
}

.glitch__slice--a {
  color: v-bind(colorA);
  animation: glitch-slice-a v-bind(duration) steps(1, end) infinite;
}

.glitch__slice--b {
  color: v-bind(colorB);
  animation: glitch-slice-b v-bind(duration) steps(1, end) infinite;
}

.glitch--hover .glitch__base,
.glitch--hover .glitch__slice {
  animation-play-state: paused;
}

.glitch--hover .glitch__slice {
  opacity: 0;
}

.glitch--hover:hover .glitch__base,
.glitch--hover:hover .glitch__slice {
  animation-play-state: running;
}

.glitch--hover:hover .glitch__slice {
  opacity: 1;
}

@keyframes glitch-jolt {
  0%, 100% { transform: none; }
  8% { transform: translate(calc(var(--offset) * -0.4), 0) skewX(-2deg); }
  9% { transform: none; }
  52% { transform: translate(calc(var(--offset) * 0.5), 0); }
  53% { transform: none; }
  81% { transform: skewX(3deg); }
  82% { transform: none; }
}

@keyframes glitch-slice-a {
  0% { clip-path: inset(10% 0 78% 0); transform: translate(calc(var(--offset) * -1), 0); }
  7% { clip-path: inset(62% 0 12% 0); transform: translate(calc(var(--offset) * 1.6), 0); }
  14% { clip-path: inset(0 0 100% 0); transform: translate(calc(var(--offset) * -0.5), 0); }
  30% { clip-path: inset(40% 0 44% 0); transform: translate(calc(var(--offset) * -2), 0); }
  38% { clip-path: inset(0 0 100% 0); transform: translate(calc(var(--offset) * -1), 0); }
  55% { clip-path: inset(80% 0 4% 0); transform: translate(calc(var(--offset) * 2), 0); }
  62% { clip-path: inset(22% 0 60% 0); transform: translate(calc(var(--offset) * -1.2), 0); }
  70% { clip-path: inset(0 0 100% 0); transform: translate(var(--offset), 0); }
  86% { clip-path: inset(52% 0 30% 0); transform: translate(calc(var(--offset) * 1.4), 0); }
  93% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); }
  100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); }
}

@keyframes glitch-slice-b {
  0% { clip-path: inset(70% 0 8% 0); transform: translate(var(--offset), 0); }
  9% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); }
  21% { clip-path: inset(30% 0 52% 0); transform: translate(calc(var(--offset) * 2), 0); }
  33% { clip-path: inset(88% 0 2% 0); transform: translate(calc(var(--offset) * -1.5), 0); }
  41% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); }
  58% { clip-path: inset(8% 0 74% 0); transform: translate(calc(var(--offset) * -1.8), 0); }
  66% { clip-path: inset(46% 0 38% 0); transform: translate(calc(var(--offset) * 1.1), 0); }
  74% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); }
  90% { clip-path: inset(60% 0 22% 0); transform: translate(calc(var(--offset) * -2), 0); }
  96% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); }
  100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .glitch__base,
  .glitch__slice {
    animation: none !important;
  }

  .glitch__slice {
    clip-path: inset(0 0 100% 0);
  }

  .glitch__slice--a {
    clip-path: none;
    transform: translate(-1px, 0);
    opacity: 0.45;
  }

  .glitch__slice--b {
    clip-path: none;
    transform: translate(1px, 0);
    opacity: 0.45;
  }
}
</style>
