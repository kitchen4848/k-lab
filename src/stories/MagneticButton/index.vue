<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

defineOptions({ inheritAttrs: false })

const { strength = 0.35, radius = 120 } = defineProps<{
  strength?: number
  radius?: number
}>()

const button = ref<HTMLButtonElement | null>(null)
const x = ref(0)
const y = ref(0)
const near = ref(false)
let raf = 0
let target = { x: 0, y: 0 }

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function flush() {
  raf = 0
  x.value = target.x
  y.value = target.y
}

function queue(nx: number, ny: number) {
  target = { x: nx, y: ny }
  if (!raf) raf = requestAnimationFrame(flush)
}

function reset() {
  near.value = false
  queue(0, 0)
}

function onWindowMove(e: PointerEvent) {
  const el = button.value
  if (!el || e.pointerType === 'touch' || reduced()) return
  const r = el.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  // distance from the cursor to the button edge (0 when inside)
  const edgeX = Math.max(Math.abs(dx) - r.width / 2, 0)
  const edgeY = Math.max(Math.abs(dy) - r.height / 2, 0)
  if (Math.hypot(edgeX, edgeY) <= radius) {
    near.value = true
    queue(dx * strength, dy * strength)
  } else if (near.value) {
    reset()
  }
}

onMounted(() => {
  window.addEventListener('pointermove', onWindowMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', reset)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onWindowMove)
  document.documentElement.removeEventListener('pointerleave', reset)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <button
    ref="button"
    type="button"
    v-bind="$attrs"
    class="magnetic"
    :class="{ 'magnetic--near': near }"
    :style="{ '--mx': `${x}px`, '--my': `${y}px` }"
  >
    <span class="magnetic__inner">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.magnetic {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 34px;
  border: 0;
  border-radius: 999px;
  font: 600 1.05rem/1 system-ui, sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  box-shadow: 0 10px 30px -10px rgb(236 72 153 / 0.7);
  cursor: pointer;
  transform: translate3d(var(--mx, 0), var(--my, 0), 0);
  transition: transform 0.7s cubic-bezier(0.22, 1.6, 0.36, 1), box-shadow 0.3s ease;
  will-change: transform;
}

.magnetic--near {
  transition: transform 0.18s ease-out, box-shadow 0.3s ease;
  box-shadow: 0 18px 40px -10px rgb(236 72 153 / 0.85);
}

.magnetic:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 4px;
}

.magnetic__inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  /* extra offset on top of the button's own movement gives parallax depth */
  transform: translate3d(calc(var(--mx, 0px) * 0.45), calc(var(--my, 0px) * 0.45), 0);
  transition: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .magnetic,
  .magnetic__inner {
    transition: none;
    transform: none;
  }
}
</style>
