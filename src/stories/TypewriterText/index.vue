<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const {
  phrases = ['Build something delightful.'],
  typeSpeed = 70,
  deleteSpeed = 35,
  pause = 1600,
  loop = true,
  caret = '|',
} = defineProps<{
  phrases?: string[]
  /** Milliseconds per typed character. */
  typeSpeed?: number
  /** Milliseconds per deleted character. */
  deleteSpeed?: number
  /** Milliseconds to hold a finished phrase. */
  pause?: number
  loop?: boolean
  caret?: string
}>()

const shown = ref('')
const typing = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
let phraseIndex = 0
let charIndex = 0
let deleting = false
let reduced = false
let motionQuery: MediaQueryList | null = null
let mounted = false

// Screen readers get the complete, stable text instead of every keystroke.
const accessibleText = computed(() => phrases.join('. '))

function clear() {
  if (timer) clearTimeout(timer)
  timer = null
}

function later(fn: () => void, ms: number) {
  clear()
  timer = setTimeout(fn, Math.max(0, ms))
}

function tick() {
  const list = phrases.filter((p) => p.length)
  if (!list.length) {
    shown.value = ''
    return
  }
  phraseIndex %= list.length
  const phrase = Array.from(list[phraseIndex]!)
  if (!deleting) {
    typing.value = true
    charIndex++
    shown.value = phrase.slice(0, charIndex).join('')
    if (charIndex >= phrase.length) {
      typing.value = false
      const lastPhrase = phraseIndex === list.length - 1
      if (lastPhrase && !loop) return
      deleting = true
      later(tick, pause)
    } else later(tick, typeSpeed * (0.6 + Math.random() * 0.8))
  } else {
    typing.value = true
    charIndex--
    shown.value = phrase.slice(0, Math.max(0, charIndex)).join('')
    if (charIndex <= 0) {
      deleting = false
      phraseIndex = (phraseIndex + 1) % list.length
      typing.value = false
      later(tick, Math.max(300, typeSpeed * 3))
    } else later(tick, deleteSpeed)
  }
}

function start() {
  clear()
  phraseIndex = 0
  charIndex = 0
  deleting = false
  shown.value = ''
  if (reduced) {
    shown.value = phrases[0] ?? ''
    return
  }
  later(tick, 400)
}

function onMotionChange() {
  reduced = !!motionQuery?.matches
  start()
}

onMounted(() => {
  mounted = true
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced = motionQuery.matches
  motionQuery.addEventListener('change', onMotionChange)
  start()
})

onBeforeUnmount(() => {
  clear()
  motionQuery?.removeEventListener('change', onMotionChange)
})

watch(
  () => [phrases, loop],
  () => {
    if (mounted) start()
  },
  { deep: true },
)
</script>

<template>
  <span class="typewriter">
    <span class="typewriter__sr">{{ accessibleText }}</span>
    <span class="typewriter__text" aria-hidden="true">{{ shown }}</span>
    <span class="typewriter__caret" :class="{ 'is-typing': typing }" aria-hidden="true">{{
      caret
    }}</span>
  </span>
</template>

<style scoped>
.typewriter {
  display: inline-block;
  white-space: pre-wrap;
}

.typewriter__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.typewriter__caret {
  display: inline-block;
  margin-left: 0.08em;
  font-weight: 300;
  animation: typewriter-blink 1.05s steps(1, end) infinite;
}

.typewriter__caret.is-typing {
  animation: none;
  opacity: 1;
}

@keyframes typewriter-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .typewriter__caret {
    animation: none;
    opacity: 1;
  }
}
</style>
