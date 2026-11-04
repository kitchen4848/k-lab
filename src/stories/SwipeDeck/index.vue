<script setup lang="ts" generic="T">
import { computed, onBeforeUnmount, ref } from 'vue'

const {
  items,
  threshold = 120,
  depth = 3,
} = defineProps<{
  items: T[]
  /** Horizontal distance in px past which a release throws the card away. */
  threshold?: number
  /** How many cards are visible in the stack. */
  depth?: number
}>()

const emit = defineEmits<{
  swipe: [direction: 'left' | 'right', item: T]
}>()

defineSlots<{
  default(props: { item: T; index: number }): unknown
  empty(props: { reset: () => void }): unknown
}>()

const index = ref(0)
const dx = ref(0)
const dy = ref(0)
const dragging = ref(false)
const flying = ref(false)
const status = ref('')

let startX = 0
let startY = 0
let pointerId = -1
let timer: ReturnType<typeof setTimeout> | null = null

const visible = computed(() =>
  items
    .slice(index.value, index.value + Math.max(1, depth))
    .map((item, i) => ({ item, i, key: index.value + i })),
)
const remaining = computed(() => Math.max(0, items.length - index.value))
const progress = computed(() => Math.max(-1, Math.min(1, dx.value / threshold)))

function cardStyle(i: number) {
  if (i === 0) {
    const rot = dx.value / 18
    return {
      transform: `translate3d(${dx.value}px, ${dy.value}px, 0) rotate(${rot}deg)`,
      opacity: flying.value ? 0 : 1,
    }
  }
  // Cards underneath ease forward as the top card is dragged away.
  const p = Math.abs(progress.value)
  const eff = Math.max(0, i - p)
  return {
    transform: `translate3d(0, ${eff * 14}px, 0) scale(${1 - eff * 0.05})`,
    opacity: 1 - eff * 0.12,
  }
}

function dismiss(direction: 'left' | 'right') {
  if (flying.value || index.value >= items.length) return
  const item = items[index.value] as T
  flying.value = true
  dragging.value = false
  const sign = direction === 'right' ? 1 : -1
  dx.value = sign * (window.innerWidth || 800)
  timer = setTimeout(() => {
    emit('swipe', direction, item)
    status.value = `Card ${index.value + 1} of ${items.length} swiped ${direction}. ${
      items.length - index.value - 1
    } remaining.`
    index.value++
    dx.value = 0
    dy.value = 0
    flying.value = false
    timer = null
  }, 320)
}

function onDown(e: PointerEvent) {
  if (flying.value) return
  if (e.pointerType === 'mouse' && e.button !== 0) return
  pointerId = e.pointerId
  startX = e.clientX - dx.value
  startY = e.clientY - dy.value
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onMove(e: PointerEvent) {
  if (!dragging.value || e.pointerId !== pointerId) return
  dx.value = e.clientX - startX
  dy.value = (e.clientY - startY) * 0.35
}

function onUp(e: PointerEvent) {
  if (!dragging.value || e.pointerId !== pointerId) return
  dragging.value = false
  pointerId = -1
  if (Math.abs(dx.value) >= threshold) dismiss(dx.value > 0 ? 'right' : 'left')
  else {
    // Spring back
    dx.value = 0
    dy.value = 0
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    dismiss('right')
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    dismiss('left')
  }
}

function reset() {
  if (timer) clearTimeout(timer)
  timer = null
  index.value = 0
  dx.value = 0
  dy.value = 0
  flying.value = false
  dragging.value = false
  status.value = 'Deck reset.'
}

defineExpose({ reset })

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="swipe-deck">
    <div
      class="swipe-deck__stack"
      role="group"
      aria-roledescription="card stack"
      aria-label="Swipe deck. Use left and right arrow keys or the buttons to dismiss cards."
      tabindex="0"
      @keydown="onKey"
    >
      <template v-if="remaining > 0">
        <div
          v-for="entry in [...visible].reverse()"
          :key="entry.key"
          class="swipe-deck__card"
          :class="{
            'is-top': entry.i === 0,
            'is-dragging': entry.i === 0 && dragging,
          }"
          :style="cardStyle(entry.i)"
          :aria-hidden="entry.i !== 0"
          @pointerdown="entry.i === 0 && onDown($event)"
          @pointermove="entry.i === 0 && onMove($event)"
          @pointerup="entry.i === 0 && onUp($event)"
          @pointercancel="entry.i === 0 && onUp($event)"
        >
          <slot :item="entry.item" :index="entry.key" />
          <template v-if="entry.i === 0">
            <span
              class="swipe-deck__stamp swipe-deck__stamp--like"
              aria-hidden="true"
              :style="{ opacity: Math.max(0, progress) }"
              >Like</span
            >
            <span
              class="swipe-deck__stamp swipe-deck__stamp--nope"
              aria-hidden="true"
              :style="{ opacity: Math.max(0, -progress) }"
              >Nope</span
            >
          </template>
        </div>
      </template>
      <div v-else class="swipe-deck__empty">
        <slot name="empty" :reset="reset">
          <p>You're all caught up.</p>
          <button type="button" class="swipe-deck__btn" @click="reset">Start over</button>
        </slot>
      </div>
    </div>

    <div class="swipe-deck__actions">
      <button
        type="button"
        class="swipe-deck__btn swipe-deck__btn--nope"
        aria-label="Swipe left"
        :disabled="remaining === 0 || flying"
        @click="dismiss('left')"
      >
        ✕
      </button>
      <button
        type="button"
        class="swipe-deck__btn swipe-deck__btn--like"
        aria-label="Swipe right"
        :disabled="remaining === 0 || flying"
        @click="dismiss('right')"
      >
        ♥
      </button>
    </div>
    <div class="swipe-deck__status" role="status" aria-live="polite">{{ status }}</div>
  </div>
</template>

<style scoped>
.swipe-deck {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  user-select: none;
}

.swipe-deck__stack {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 24px;
  outline: none;
}

.swipe-deck__stack:focus-visible {
  outline: 3px solid #7dd3fc;
  outline-offset: 8px;
}

.swipe-deck__card {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  overflow: hidden;
  touch-action: pan-y;
  transform-origin: 50% 100%;
  box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.6);
  transition:
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
  will-change: transform;
}

.swipe-deck__card.is-top {
  cursor: grab;
}

.swipe-deck__card.is-dragging {
  cursor: grabbing;
  transition: none;
}

.swipe-deck__stamp {
  position: absolute;
  top: 28px;
  padding: 0.15em 0.6em;
  border: 4px solid currentColor;
  border-radius: 10px;
  font:
    800 1.8rem/1 system-ui,
    sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  pointer-events: none;
}

.swipe-deck__stamp--like {
  left: 24px;
  color: #4ade80;
  transform: rotate(-14deg);
}

.swipe-deck__stamp--nope {
  right: 24px;
  color: #fb7185;
  transform: rotate(14deg);
}

.swipe-deck__empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  color: rgba(255, 255, 255, 0.7);
  font-family: system-ui, sans-serif;
}

.swipe-deck__empty p {
  margin: 0;
}

.swipe-deck__actions {
  display: flex;
  gap: 1.5rem;
}

.swipe-deck__btn {
  min-width: 56px;
  height: 56px;
  padding: 0 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
  font:
    600 1.25rem/1 system-ui,
    sans-serif;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.swipe-deck__btn:hover:not(:disabled) {
  transform: scale(1.08);
  background: rgba(255, 255, 255, 0.14);
}

.swipe-deck__btn:focus-visible {
  outline: 3px solid #7dd3fc;
  outline-offset: 3px;
}

.swipe-deck__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.swipe-deck__btn--like {
  color: #4ade80;
}

.swipe-deck__btn--nope {
  color: #fb7185;
}

.swipe-deck__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

@media (prefers-reduced-motion: reduce) {
  .swipe-deck__card {
    transition: opacity 0.15s linear;
  }
}
</style>
