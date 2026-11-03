<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const {
  speed = 60,
  direction = 'left',
  gap = 32,
  pauseOnHover = true,
  fadeWidth = 80,
} = defineProps<{
  /** pixels per second */
  speed?: number
  direction?: 'left' | 'right'
  gap?: number
  pauseOnHover?: boolean
  fadeWidth?: number
}>()

const root = ref<HTMLDivElement | null>(null)
const group = ref<HTMLDivElement | null>(null)
const groupWidth = ref(0)
const rootWidth = ref(0)
let observer: ResizeObserver | null = null

function measure() {
  groupWidth.value = group.value?.getBoundingClientRect().width ?? 0
  rootWidth.value = root.value?.clientWidth ?? 0
}

onMounted(() => {
  measure()
  observer = new ResizeObserver(measure)
  if (root.value) observer.observe(root.value)
  if (group.value) observer.observe(group.value)
})

onBeforeUnmount(() => observer?.disconnect())

// enough copies that the track always covers the viewport, plus one spare
// that scrolls in while the first copy leaves.
const copies = computed(() =>
  groupWidth.value > 0 ? Math.max(2, Math.ceil(rootWidth.value / groupWidth.value) + 1) : 2,
)
const duration = computed(() =>
  groupWidth.value > 0 ? `${groupWidth.value / Math.max(speed, 1)}s` : '0s',
)
const shift = computed(() => `${-groupWidth.value}px`)
const gapPx = computed(() => `${gap}px`)
const mask = computed(() => {
  const f = Math.max(fadeWidth, 0)
  return f > 0
    ? `linear-gradient(90deg, transparent 0, #000 ${f}px, #000 calc(100% - ${f}px), transparent 100%)`
    : 'none'
})
</script>

<template>
  <div
    ref="root"
    class="marquee"
    :class="{ 'marquee--pause': pauseOnHover, 'marquee--reverse': direction === 'right' }"
  >
    <div class="marquee__track">
      <div
        v-for="n in copies"
        :key="n"
        :ref="(el) => { if (n === 1) group = el as HTMLDivElement | null }"
        class="marquee__group"
        :aria-hidden="n > 1 ? 'true' : undefined"
        :inert="n > 1 ? true : undefined"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  position: relative;
  overflow: hidden;
  -webkit-mask-image: v-bind(mask);
  mask-image: v-bind(mask);
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee-scroll v-bind(duration) linear infinite;
  will-change: transform;
}

.marquee--reverse .marquee__track {
  animation-direction: reverse;
}

.marquee--pause:hover .marquee__track,
.marquee--pause:focus-within .marquee__track {
  animation-play-state: paused;
}

.marquee__group {
  display: flex;
  flex: none;
  align-items: center;
  gap: v-bind(gapPx);
  /* trailing gap keeps spacing identical across the seam */
  padding-right: v-bind(gapPx);
}

@keyframes marquee-scroll {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(v-bind(shift), 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    overflow-x: auto;
  }

  .marquee__track {
    animation: none;
  }
}
</style>
