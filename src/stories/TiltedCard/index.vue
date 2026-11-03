<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const {
  maxTilt = 12,
  scaleOnHover = 1.05,
  perspective = 800,
  transitionDuration = 200,
  disabled = false,
} = defineProps<{
  maxTilt?: number
  scaleOnHover?: number
  perspective?: number
  transitionDuration?: number
  disabled?: boolean
}>();

const wrapperRef = ref<HTMLElement | null>(null);
const rotateX = ref(0);
const rotateY = ref(0);
const scale = ref(1);
const reducedMotion = ref(false);

let frame = 0;
let pending: { x: number, y: number } | null = null;
let mediaQuery: MediaQueryList | null = null;

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

const onMediaChange = (event: MediaQueryListEvent) => {
  reducedMotion.value = event.matches;
  if (event.matches) reset();
};

const cancelFrame = () => {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  pending = null;
};

const reset = () => {
  cancelFrame();
  rotateX.value = 0;
  rotateY.value = 0;
  scale.value = 1;
};

const applyPointer = () => {
  frame = 0;
  const wrapper = wrapperRef.value;
  if (!pending || !wrapper) return;
  const rect = wrapper.getBoundingClientRect();
  const { x, y } = pending;
  pending = null;
  if (!rect.width || !rect.height) return;
  const offsetX = (x - (rect.left + rect.width / 2)) / (rect.width / 2);
  const offsetY = (y - (rect.top + rect.height / 2)) / (rect.height / 2);
  rotateY.value = clamp(offsetX, 1) * maxTilt;
  rotateX.value = -clamp(offsetY, 1) * maxTilt;
  scale.value = scaleOnHover;
};

const onPointerMove = (event: PointerEvent) => {
  if (disabled || reducedMotion.value) return;
  pending = { x: event.clientX, y: event.clientY };
  if (!frame) frame = requestAnimationFrame(applyPointer);
};

const onPointerLeave = () => reset();

watch(() => disabled, (value) => {
  if (value) reset();
});

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', onMediaChange);
});

onBeforeUnmount(() => {
  cancelFrame();
  mediaQuery?.removeEventListener('change', onMediaChange);
});

const wrapperStyle = computed(() => ({ perspective: `${perspective}px` }));

const cardStyle = computed(() => {
  if (reducedMotion.value) return {};
  return {
    transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale(${scale.value})`,
    transition: `transform ${transitionDuration}ms ease-out`,
  };
});
</script>

<template>
  <div
    ref="wrapperRef"
    class="tilted-card-wrapper"
    :style="wrapperStyle"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @pointercancel="onPointerLeave"
  >
    <div class="tilted-card" :style="cardStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tilted-card-wrapper {
  display: inline-block;
}

.tilted-card {
  transform-style: preserve-3d;
  will-change: transform;
}
</style>
