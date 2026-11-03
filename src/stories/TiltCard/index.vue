<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const {
  maxTilt = 14,
  scale = 1.04,
  perspective = 900,
  glareOpacity = 0.35,
} = defineProps<{
  maxTilt?: number
  scale?: number
  perspective?: number
  glareOpacity?: number
}>()

const root = ref<HTMLDivElement | null>(null)
const rx = ref(0)
const ry = ref(0)
const gx = ref(50)
const gy = ref(50)
const active = ref(false)
let raf = 0
let pending: PointerEvent | null = null

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function apply() {
  raf = 0
  const e = pending
  const el = root.value
  if (!e || !el) return
  const r = el.getBoundingClientRect()
  const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1)
  const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1)
  ry.value = (px - 0.5) * 2 * maxTilt
  rx.value = (0.5 - py) * 2 * maxTilt
  gx.value = px * 100
  gy.value = py * 100
}

function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch' || reduced()) return
  active.value = true
  pending = e
  if (!raf) raf = requestAnimationFrame(apply)
}

function onLeave() {
  active.value = false
  pending = null
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  rx.value = 0
  ry.value = 0
  gx.value = 50
  gy.value = 50
}

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})

const transform = computed(
  () => `rotateX(${rx.value}deg) rotateY(${ry.value}deg) scale(${active.value ? scale : 1})`,
)
const persp = computed(() => `${perspective}px`)
const glareAlpha = computed(() => (active.value ? glareOpacity : 0))
</script>

<template>
  <div class="tilt" @pointermove="onMove" @pointerleave="onLeave" @pointercancel="onLeave">
    <div ref="root" class="tilt__card" :class="{ 'tilt__card--active': active }">
      <div class="tilt__content">
        <slot />
      </div>
      <div class="tilt__glare" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.tilt {
  display: inline-block;
  perspective: v-bind(persp);
}

.tilt__card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(145deg, #1e1b4b, #0f172a);
  box-shadow: 0 20px 50px -20px rgb(0 0 0 / 0.7), inset 0 0 0 1px rgb(255 255 255 / 0.08);
  transform: v-bind(transform);
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.22, 1.4, 0.36, 1);
  will-change: transform;
}

.tilt__card--active {
  transition: transform 0.12s ease-out;
}

.tilt__content {
  position: relative;
}

.tilt__glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: v-bind(glareAlpha);
  background: radial-gradient(circle at calc(v-bind(gx) * 1%) calc(v-bind(gy) * 1%), #fff 0%, rgb(255 255 255 / 0) 55%);
  mix-blend-mode: overlay;
  transition: opacity 0.4s ease;
}

@media (prefers-reduced-motion: reduce) {
  .tilt__card,
  .tilt__card--active {
    transition: none;
    transform: none;
  }
}
</style>
