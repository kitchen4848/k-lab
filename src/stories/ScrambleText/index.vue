<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const {
  text,
  trigger = 'mount',
  duration = 1200,
  chars = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
} = defineProps<{
  text: string
  trigger?: 'mount' | 'hover' | 'visible'
  duration?: number
  chars?: string
}>()

const root = ref<HTMLElement | null>(null)
const display = ref(text)
let raf = 0
let observer: IntersectionObserver | null = null

function isReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

function randomChar() {
  return chars.charAt(Math.floor(Math.random() * chars.length)) || '#'
}

function run() {
  stop()
  if (isReduced() || !chars) {
    display.value = text
    return
  }
  const target = text
  const n = target.length
  // each character resolves at a staggered moment within the duration
  const resolveAt = Array.from({ length: n }, (_, i) => (i / Math.max(n, 1)) * 0.65 + Math.random() * 0.35)
  const start = performance.now()
  let lastSwap = 0

  const tick = (now: number) => {
    const p = Math.min((now - start) / Math.max(duration, 1), 1)
    if (now - lastSwap > 45 || p >= 1) {
      lastSwap = now
      let out = ''
      for (let i = 0; i < n; i++) {
        const ch = target[i]!
        out += ch === ' ' || p >= resolveAt[i]! ? ch : randomChar()
      }
      display.value = out
    }
    raf = p < 1 ? requestAnimationFrame(tick) : 0
  }
  raf = requestAnimationFrame(tick)
}

function onEnter() {
  if (trigger === 'hover') run()
}

onMounted(() => {
  if (trigger === 'mount') run()
  else if (trigger === 'visible' && root.value) {
    display.value = isReduced() ? text : scrambled()
    observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        run()
        observer?.disconnect()
        observer = null
      }
    }, { threshold: 0.4 })
    observer.observe(root.value)
  }
})

function scrambled() {
  return Array.from(text, (c) => (c === ' ' ? c : randomChar())).join('')
}

watch(() => text, () => {
  if (trigger === 'mount') run()
  else display.value = text
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
})
</script>

<template>
  <span
    ref="root"
    class="scramble"
    tabindex="0"
    @pointerenter="onEnter"
    @focus="onEnter"
  >
    <span class="scramble__sr">{{ text }}</span>
    <span class="scramble__visual" aria-hidden="true">{{ display }}</span>
  </span>
</template>

<style scoped>
.scramble {
  position: relative;
  display: inline-block;
  font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
  white-space: pre-wrap;
  border-radius: 4px;
}

.scramble:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}

.scramble__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.scramble__visual {
  display: inline-block;
  font-variant-ligatures: none;
}
</style>
