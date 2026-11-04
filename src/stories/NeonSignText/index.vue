<script setup lang="ts">
import { computed } from 'vue'

const {
  text = 'OPEN',
  color = '#ff2bd6',
  intensity = 1,
  flicker = true,
  fontSize = 72,
} = defineProps<{
  text?: string
  color?: string
  /** Glow strength multiplier (0–2). */
  intensity?: number
  /** Play the power-on flicker and occasional glitches. */
  flicker?: boolean
  /** Font size in px. */
  fontSize?: number
}>()

const size = computed(() => `${fontSize}px`)
const glow = computed(() => Math.max(0, intensity))
const blurNear = computed(() => `${(fontSize * 0.07 * glow.value).toFixed(1)}px`)
const blurFar = computed(() => `${(fontSize * 0.28 * glow.value).toFixed(1)}px`)
const nearOpacity = computed(() => Math.min(1, 0.55 + glow.value * 0.35))
const farOpacity = computed(() => Math.min(1, glow.value * 0.75))
// Restart the one-shot flicker whenever the sign is re-keyed.
const signKey = computed(() => `${text}|${flicker}`)
</script>

<template>
  <span :key="signKey" class="neon-sign" :class="{ 'is-flicker': flicker }">
    <span class="neon-sign__sr">{{ text }}</span>
    <span class="neon-sign__layer neon-sign__far" aria-hidden="true">{{ text }}</span>
    <span class="neon-sign__layer neon-sign__near" aria-hidden="true">{{ text }}</span>
    <span class="neon-sign__layer neon-sign__tube" aria-hidden="true">{{ text }}</span>
  </span>
</template>

<style scoped>
.neon-sign {
  position: relative;
  display: inline-block;
  font-family: 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', cursive;
  font-size: v-bind(size);
  line-height: 1.2;
  padding: 0.1em 0.2em;
  letter-spacing: 0.04em;
  white-space: nowrap;
  user-select: none;
}

.neon-sign__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.neon-sign__layer {
  display: block;
}

.neon-sign__far,
.neon-sign__near {
  position: absolute;
  inset: 0.1em 0.2em;
  color: v-bind(color);
  pointer-events: none;
}

.neon-sign__far {
  filter: blur(v-bind(blurFar));
  opacity: v-bind(farOpacity);
}

.neon-sign__near {
  filter: blur(v-bind(blurNear));
  opacity: v-bind(nearOpacity);
}

/* The glass tube: hot white core tinted by the gas colour */
.neon-sign__tube {
  position: relative;
  color: color-mix(in srgb, v-bind(color) 25%, #fff);
  -webkit-text-stroke: 0.02em color-mix(in srgb, v-bind(color) 60%, #fff);
  text-shadow: 0 0 0.05em color-mix(in srgb, v-bind(color) 70%, #fff);
}

.is-flicker .neon-sign__tube {
  animation:
    neon-sign-power 1.9s linear both,
    neon-sign-hum 3.1s ease-in-out 1.9s infinite;
}

.is-flicker .neon-sign__near {
  animation:
    neon-sign-power 1.9s linear both,
    neon-sign-hum 3.1s ease-in-out 1.9s infinite;
}

.is-flicker .neon-sign__far {
  animation:
    neon-sign-power 1.9s linear both,
    neon-sign-hum-far 4.3s ease-in-out 1.9s infinite;
}

@keyframes neon-sign-power {
  0% {
    opacity: 0.04;
  }
  6% {
    opacity: 0.04;
  }
  7% {
    opacity: 1;
  }
  9% {
    opacity: 0.1;
  }
  16% {
    opacity: 0.1;
  }
  17% {
    opacity: 0.9;
  }
  20% {
    opacity: 0.2;
  }
  32% {
    opacity: 0.2;
  }
  33% {
    opacity: 1;
  }
  36% {
    opacity: 0.35;
  }
  38% {
    opacity: 1;
  }
  52% {
    opacity: 1;
  }
  53% {
    opacity: 0.5;
  }
  55% {
    opacity: 1;
  }
  78% {
    opacity: 1;
  }
  79% {
    opacity: 0.7;
  }
  82% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

@keyframes neon-sign-hum {
  0%,
  100% {
    opacity: 1;
  }
  18% {
    opacity: 0.96;
  }
  34% {
    opacity: 1;
  }
  52% {
    opacity: 0.93;
  }
  54% {
    opacity: 1;
  }
  77% {
    opacity: 0.97;
  }
  91% {
    opacity: 0.99;
  }
}

@keyframes neon-sign-hum-far {
  0%,
  100% {
    opacity: v-bind(farOpacity);
  }
  40% {
    opacity: calc(v-bind(farOpacity) * 0.85);
  }
  70% {
    opacity: calc(v-bind(farOpacity) * 0.95);
  }
}

@media (prefers-reduced-motion: reduce) {
  .is-flicker .neon-sign__tube,
  .is-flicker .neon-sign__near,
  .is-flicker .neon-sign__far {
    animation: none;
  }
}
</style>
