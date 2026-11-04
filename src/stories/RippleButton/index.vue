<script setup lang="ts">
import { ref } from 'vue'

const {
  rippleColor = '#a78bfa',
  duration = 800,
  glow = 24,
} = defineProps<{
  rippleColor?: string
  /** Ripple duration in milliseconds. */
  duration?: number
  /** Blur radius (px) of the ripple's glow. */
  glow?: number
}>()

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

const button = ref<HTMLButtonElement | null>(null)
const ripples = ref<Ripple[]>([])
let nextId = 0
let lastPointerDown = 0

function spawn(x: number, y: number) {
  const el = button.value
  if (!el) return
  const w = el.clientWidth
  const h = el.clientHeight
  // Radius needed to reach the farthest corner from the press point.
  const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y))
  ripples.value.push({ id: nextId++, x, y, size: r * 2 })
}

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  lastPointerDown = e.timeStamp
  spawn(e.clientX - rect.left, e.clientY - rect.top)
}

function onClick(e: MouseEvent) {
  // Keyboard (and programmatic) activation reports detail === 0 → ripple from the centre.
  if (e.detail !== 0 || e.timeStamp - lastPointerDown < 50) return
  const el = e.currentTarget as HTMLElement
  spawn(el.clientWidth / 2, el.clientHeight / 2)
}

function remove(id: number) {
  ripples.value = ripples.value.filter((r) => r.id !== id)
}
</script>

<template>
  <button
    ref="button"
    type="button"
    class="ripple-button"
    @pointerdown="onPointerDown"
    @click="onClick"
  >
    <span class="ripple-button__layer" aria-hidden="true">
      <span
        v-for="r in ripples"
        :key="r.id"
        class="ripple-button__ripple"
        :style="{
          left: r.x + 'px',
          top: r.y + 'px',
          width: r.size + 'px',
          height: r.size + 'px',
        }"
        @animationend="remove(r.id)"
      />
    </span>
    <span class="ripple-button__label"><slot>Press me</slot></span>
  </button>
</template>

<style scoped>
.ripple-button {
  --rb-color: v-bind(rippleColor);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.95em 2.2em;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: linear-gradient(180deg, #1c1a33 0%, #11101f 100%);
  color: #fff;
  font:
    600 1.05rem/1 system-ui,
    sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition:
    box-shadow 0.25s ease,
    transform 0.15s ease;
  box-shadow:
    0 0 0 1px rgba(167, 139, 250, 0.15),
    0 10px 30px -10px rgba(0, 0, 0, 0.7);
}

.ripple-button:hover:not(:disabled) {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--rb-color) 55%, transparent),
    0 10px 36px -8px color-mix(in srgb, var(--rb-color) 55%, transparent);
}

.ripple-button:active:not(:disabled) {
  transform: scale(0.97);
}

.ripple-button:focus-visible {
  outline: 3px solid #7dd3fc;
  outline-offset: 3px;
}

.ripple-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ripple-button__label {
  position: relative;
  z-index: 1;
}

.ripple-button__layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.ripple-button__ripple {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--rb-color) 95%, #fff) 0%,
    var(--rb-color) 35%,
    transparent 70%
  );
  filter: blur(calc(v-bind(glow) * 0.25px));
  box-shadow: 0 0 calc(v-bind(glow) * 1px) var(--rb-color);
  opacity: 0.85;
  will-change: transform, opacity;
  animation: ripple-button-spread calc(v-bind(duration) * 1ms) cubic-bezier(0.2, 0.7, 0.2, 1)
    forwards;
}

@keyframes ripple-button-spread {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ripple-button__ripple {
    transform: translate(-50%, -50%) scale(1);
    animation: ripple-button-flash 0.25s linear forwards;
  }

  @keyframes ripple-button-flash {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
