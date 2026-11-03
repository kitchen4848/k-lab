<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const {
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
} = defineProps<{
  padding?: number
  disabled?: boolean
  magnetStrength?: number
  activeTransition?: string
  inactiveTransition?: string
}>();

// The outer wrapper never moves, so measuring it avoids feedback jitter
const wrapperRef = ref<HTMLElement | null>(null);
const isActive = ref(false);
const position = ref({ x: 0, y: 0 });

let frameId: number | null = null;

const cancelFrame = () => {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
};

const reset = () => {
  isActive.value = false;
  position.value = { x: 0, y: 0 };
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const update = (clientX: number, clientY: number) => {
  if (!wrapperRef.value) return;
  const { left, top, width, height } = wrapperRef.value.getBoundingClientRect();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  const inside =
    Math.abs(clientX - centerX) < width / 2 + padding &&
    Math.abs(clientY - centerY) < height / 2 + padding;

  if (inside) {
    isActive.value = true;
    position.value = {
      x: (clientX - centerX) / magnetStrength,
      y: (clientY - centerY) / magnetStrength,
    };
  } else {
    reset();
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (disabled || prefersReducedMotion()) {
    cancelFrame();
    if (isActive.value) reset();
    return;
  }
  const { clientX, clientY } = e;
  cancelFrame();
  frameId = requestAnimationFrame(() => {
    frameId = null;
    update(clientX, clientY);
  });
};

watch(() => disabled, (isDisabled) => {
  if (isDisabled) {
    cancelFrame();
    reset();
  }
});

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  cancelFrame();
});
</script>

<template>
  <div ref="wrapperRef" class="magnet-wrapper">
    <div
      class="magnet-inner"
      :style="{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isActive ? activeTransition : inactiveTransition,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.magnet-wrapper {
  display: inline-block;
}

.magnet-inner {
  will-change: transform;
}
</style>
