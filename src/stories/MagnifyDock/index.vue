<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

export interface DockItem {
  label: string
  /** emoji, or an image URL (http(s), /path, data:) */
  icon: string
  /** optional tile background */
  color?: string
}

const {
  items,
  baseSize = 52,
  magnification = 1.9,
  distance = 140,
} = defineProps<{
  items: DockItem[]
  baseSize?: number
  magnification?: number
  distance?: number
}>()

const emit = defineEmits<{
  select: [item: DockItem, index: number]
}>()

const GAP = 10
const buttons = ref<(HTMLButtonElement | null)[]>([])
const scales = ref<number[]>([])
const hovered = ref<number | null>(null)
let probeX: number | null = null
let pointerInside = false
let raf = 0

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isImage(icon: string) {
  return /^(https?:|\/|data:)/.test(icon)
}

watch(
  () => items.length,
  (n) => {
    scales.value = Array.from({ length: n }, () => 1)
  },
  { immediate: true },
)

function targetFor(i: number): number {
  if (probeX === null) return 1
  const el = buttons.value[i]
  if (!el) return 1
  const r = el.getBoundingClientRect()
  const d = Math.abs(probeX - (r.left + r.width / 2))
  if (d >= distance) return 1
  // cosine falloff gives the smooth bell curve of the macOS dock
  const t = Math.cos((d / distance) * (Math.PI / 2))
  return 1 + (magnification - 1) * t * t
}

function tick() {
  let moving = false
  const next = scales.value.slice()
  for (let i = 0; i < next.length; i++) {
    const target = targetFor(i)
    const cur = next[i] ?? 1
    const diff = target - cur
    if (Math.abs(diff) > 0.002) {
      next[i] = reduced() ? target : cur + diff * 0.22
      moving = true
    } else next[i] = target
  }
  scales.value = next
  raf = moving ? requestAnimationFrame(tick) : 0
}

function kick() {
  if (!raf) raf = requestAnimationFrame(tick)
}

function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  pointerInside = true
  probeX = e.clientX
  kick()
}

function release() {
  pointerInside = false
  probeX = null
  hovered.value = null
  kick()
}

function onFocus(i: number) {
  hovered.value = i
  const el = buttons.value[i]
  if (el && probeX === null) {
    const r = el.getBoundingClientRect()
    probeX = r.left + r.width / 2
    kick()
  }
}

function onBlur() {
  // while the pointer drives the magnification, only drop the tooltip
  if (pointerInside) hovered.value = null
  else release()
}

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})

const gap = computed(() => `${GAP}px`)
const maxHeight = computed(() => `${Math.round(baseSize * magnification + 28)}px`)
</script>

<template>
  <div class="dock-wrap" :style="{ height: maxHeight }">
    <div
      class="dock"
      role="toolbar"
      aria-label="Dock"
      @pointermove="onMove"
      @pointerleave="release"
    >
      <button
        v-for="(item, i) in items"
        :key="item.label + i"
        :ref="(el) => (buttons[i] = el as HTMLButtonElement | null)"
        type="button"
        class="dock__item"
        :aria-label="item.label"
        :style="{
          width: `${baseSize * (scales[i] ?? 1)}px`,
          height: `${baseSize * (scales[i] ?? 1)}px`,
          fontSize: `${baseSize * (scales[i] ?? 1) * 0.55}px`,
          background: item.color,
        }"
        @click="emit('select', item, i)"
        @focus="onFocus(i)"
        @blur="onBlur"
      >
        <img v-if="isImage(item.icon)" :src="item.icon" alt="" class="dock__img" draggable="false" />
        <span v-else class="dock__emoji" aria-hidden="true">{{ item.icon }}</span>
        <span class="dock__tip" :class="{ 'dock__tip--on': hovered === i }" aria-hidden="true">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.dock-wrap {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.dock {
  display: inline-flex;
  align-items: flex-end;
  gap: v-bind(gap);
  padding: 10px 14px;
  border-radius: 24px;
  background: rgb(255 255 255 / 0.12);
  backdrop-filter: blur(18px) saturate(1.6);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2), 0 20px 40px -12px rgb(0 0 0 / 0.6);
  touch-action: manipulation;
}

.dock__item {
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 22%;
  background: linear-gradient(160deg, rgb(255 255 255 / 0.28), rgb(255 255 255 / 0.08));
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.18), 0 6px 14px -6px rgb(0 0 0 / 0.5);
  cursor: pointer;
  line-height: 1;
}

.dock__item:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

.dock__item:active {
  filter: brightness(0.85);
}

.dock__emoji {
  pointer-events: none;
  user-select: none;
}

.dock__img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  pointer-events: none;
}

.dock__tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgb(15 23 42 / 0.92);
  color: #fff;
  font: 500 12px/1.2 system-ui, sans-serif;
  white-space: nowrap;
  opacity: 0;
  transform: translate(-50%, 4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
  pointer-events: none;
}

.dock__item:hover .dock__tip,
.dock__tip--on {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
