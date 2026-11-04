<script setup lang="ts">
import { computed, ref } from 'vue'

const {
  orientation = 'horizontal',
  step = 1,
  label = 'Comparison slider',
} = defineProps<{
  orientation?: 'horizontal' | 'vertical'
  /** Keyboard step in percent (Shift/PageUp/PageDown move 10×). */
  step?: number
  label?: string
}>()

/** Divider position as a percentage (0–100) of the "before" side. */
const position = defineModel<number>('position', { default: 50 })

const root = ref<HTMLDivElement | null>(null)
const dragging = ref(false)
const vertical = computed(() => orientation === 'vertical')

const clamped = computed(() => Math.min(100, Math.max(0, position.value)))
const clip = computed(() =>
  vertical.value ? `inset(0 0 ${100 - clamped.value}% 0)` : `inset(0 ${100 - clamped.value}% 0 0)`,
)

function setFromPointer(e: PointerEvent) {
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return
  const ratio = vertical.value
    ? (e.clientY - rect.top) / (rect.height || 1)
    : (e.clientX - rect.left) / (rect.width || 1)
  position.value = Math.round(Math.min(1, Math.max(0, ratio)) * 1000) / 10
}

function onDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  setFromPointer(e)
}

function onMove(e: PointerEvent) {
  if (dragging.value) setFromPointer(e)
}

function onUp() {
  dragging.value = false
}

function onKey(e: KeyboardEvent) {
  const big = e.shiftKey ? 10 : 1
  const inc = vertical.value ? 'ArrowDown' : 'ArrowRight'
  const dec = vertical.value ? 'ArrowUp' : 'ArrowLeft'
  let next: number | null = null
  if (e.key === inc || e.key === (vertical.value ? 'ArrowRight' : 'ArrowDown'))
    next = clamped.value + step * big
  else if (e.key === dec || e.key === (vertical.value ? 'ArrowLeft' : 'ArrowUp'))
    next = clamped.value - step * big
  else if (e.key === 'PageUp') next = clamped.value - 10
  else if (e.key === 'PageDown') next = clamped.value + 10
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = 100
  if (next === null) return
  e.preventDefault()
  position.value = Math.min(100, Math.max(0, Math.round(next * 100) / 100))
}
</script>

<template>
  <div
    ref="root"
    class="compare"
    :class="[`is-${orientation}`, { 'is-dragging': dragging }]"
    :style="{ '--pos': clamped + '%' }"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
  >
    <div class="compare__layer compare__after">
      <slot name="after" />
    </div>
    <div class="compare__layer compare__before" :style="{ clipPath: clip }">
      <slot name="before" />
    </div>
    <div
      class="compare__handle"
      role="slider"
      tabindex="0"
      :aria-label="label"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(clamped)"
      :aria-valuetext="`${Math.round(clamped)}% before`"
      :aria-orientation="orientation"
      @keydown="onKey"
    >
      <span class="compare__line" aria-hidden="true" />
      <span class="compare__knob" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
        </svg>
      </span>
    </div>
  </div>
</template>

<style scoped>
.compare {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 160px;
  border-radius: 16px;
  user-select: none;
  background: #000;
}

.compare.is-horizontal {
  touch-action: pan-y;
  cursor: ew-resize;
}

.compare.is-vertical {
  touch-action: pan-x;
  cursor: ns-resize;
}

.compare__layer {
  position: absolute;
  inset: 0;
}

.compare__layer > :deep(*) {
  width: 100%;
  height: 100%;
}

.compare__handle {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.is-horizontal .compare__handle {
  top: 0;
  bottom: 0;
  left: var(--pos);
  width: 44px;
  transform: translateX(-50%);
}

.is-vertical .compare__handle {
  left: 0;
  right: 0;
  top: var(--pos);
  height: 44px;
  transform: translateY(-50%);
}

.compare__line {
  position: absolute;
  background: #fff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.7);
}

.is-horizontal .compare__line {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
}

.is-vertical .compare__line {
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
}

.compare__knob {
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(15, 15, 30, 0.75);
  backdrop-filter: blur(6px);
  border: 2px solid #fff;
  color: #fff;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.is-vertical .compare__knob svg {
  transform: rotate(90deg);
}

.compare__handle:hover .compare__knob,
.is-dragging .compare__knob {
  transform: scale(1.12);
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.5),
    0 0 0 6px rgba(255, 255, 255, 0.18);
}

.compare__handle:focus-visible .compare__knob {
  outline: 3px solid #7dd3fc;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .compare__knob {
    transition: none;
  }
}
</style>
