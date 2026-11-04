<script setup lang="ts">
import { computed } from 'vue'

const {
  trigger = 'hover',
  direction = 'horizontal',
  duration = 700,
  label = 'Flip card',
} = defineProps<{
  trigger?: 'hover' | 'click'
  direction?: 'horizontal' | 'vertical'
  /** Flip duration in milliseconds. */
  duration?: number
  /** Accessible name for the card in click mode. */
  label?: string
}>()

const flipped = defineModel<boolean>('flipped', { default: false })

const axis = computed(() => (direction === 'vertical' ? 'X' : 'Y'))
const speed = computed(() => `${duration}ms`)
const isClick = computed(() => trigger === 'click')

function toggle() {
  flipped.value = !flipped.value
}

function onEnter(e: PointerEvent) {
  if (trigger === 'hover' && e.pointerType !== 'touch') flipped.value = true
}

function onLeave(e: PointerEvent) {
  if (trigger === 'hover' && e.pointerType !== 'touch') flipped.value = false
}

function onPointerUp(e: PointerEvent) {
  // Touch has no hover; a tap toggles in hover mode too.
  if (trigger === 'hover' && e.pointerType === 'touch') toggle()
}

function onFocusIn() {
  if (trigger === 'hover') flipped.value = true
}

function onFocusOut(e: FocusEvent) {
  const host = e.currentTarget as HTMLElement
  if (trigger === 'hover' && !host.contains(e.relatedTarget as Node | null)) flipped.value = false
}

function onClick(e: MouseEvent) {
  if (!isClick.value) return
  // Don't hijack clicks meant for controls inside the faces.
  if ((e.target as HTMLElement).closest('a,button,input,select,textarea')) return
  toggle()
}

function onKey(e: KeyboardEvent) {
  if (!isClick.value || e.target !== e.currentTarget) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle()
  }
}
</script>

<template>
  <div
    class="flip-card"
    :class="[`is-${direction}`, { 'is-flipped': flipped, 'is-click': isClick }]"
    :role="isClick ? 'button' : 'group'"
    :aria-pressed="isClick ? flipped : undefined"
    :aria-label="label"
    tabindex="0"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
    @pointerup="onPointerUp"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @click="onClick"
    @keydown="onKey"
  >
    <div class="flip-card__inner">
      <div class="flip-card__face flip-card__front" :aria-hidden="flipped" :inert="flipped">
        <slot name="front" />
      </div>
      <div class="flip-card__face flip-card__back" :aria-hidden="!flipped" :inert="!flipped">
        <slot name="back" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  --flip-axis: v-bind(axis);
  position: relative;
  display: block;
  width: 280px;
  height: 380px;
  perspective: 1200px;
  border-radius: 20px;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.flip-card.is-click {
  cursor: pointer;
}

.flip-card:focus-visible {
  outline: 3px solid #7dd3fc;
  outline-offset: 4px;
}

.flip-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform v-bind(speed) cubic-bezier(0.3, 1.25, 0.5, 1);
  will-change: transform;
}

.flip-card.is-horizontal.is-flipped .flip-card__inner {
  transform: rotateY(180deg);
}

.flip-card.is-vertical.is-flipped .flip-card__inner {
  transform: rotateX(180deg);
}

.flip-card__face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card.is-horizontal .flip-card__back {
  transform: rotateY(180deg);
}

.flip-card.is-vertical .flip-card__back {
  transform: rotateX(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .flip-card__inner {
    transition: none;
    transform: none !important;
  }

  .flip-card__face {
    backface-visibility: visible;
    transform: none !important;
    transition: opacity 0.2s linear;
  }

  .flip-card__back,
  .flip-card.is-flipped .flip-card__front {
    opacity: 0;
    pointer-events: none;
  }

  .flip-card.is-flipped .flip-card__back {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
