<script setup lang="ts">
import { computed } from 'vue'

const {
  colorFrom = '#22d3ee',
  colorTo = '#a855f7',
  beamWidth = 2,
  speed = 4,
  radius = 20,
} = defineProps<{
  colorFrom?: string
  colorTo?: string
  beamWidth?: number
  speed?: number
  radius?: number
}>()

const duration = computed(() => `${speed}s`)
const width = computed(() => `${beamWidth}px`)
const rad = computed(() => `${radius}px`)
</script>

<template>
  <div class="beam-card">
    <span class="beam-card__beam" aria-hidden="true" />
    <div class="beam-card__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@property --beam-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.beam-card {
  position: relative;
  display: inline-block;
  border-radius: v-bind(rad);
  background: #0b0f1a;
  color: #fff;
  box-shadow: 0 20px 60px -30px rgb(0 0 0 / 0.8);
}

.beam-card__body {
  position: relative;
  z-index: 1;
  border-radius: inherit;
  background: #0b0f1a;
  /* inset the body so only the border ring shows the beam */
  margin: 1px;
}

.beam-card__beam {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: v-bind(width);
  background: conic-gradient(
    from var(--beam-angle),
    transparent 0deg,
    transparent 250deg,
    v-bind(colorFrom) 310deg,
    v-bind(colorTo) 350deg,
    transparent 360deg
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  animation: beam-spin v-bind(duration) linear infinite;
  filter: drop-shadow(0 0 6px v-bind(colorTo));
  pointer-events: none;
}

.beam-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1);
  pointer-events: none;
  z-index: 2;
}

@keyframes beam-spin {
  to {
    --beam-angle: 360deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .beam-card__beam {
    animation: none;
    --beam-angle: 40deg;
  }
}
</style>
