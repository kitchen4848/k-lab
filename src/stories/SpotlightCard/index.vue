<script setup lang="ts">
import { computed, ref } from 'vue';

const { spotlightColor = 'rgba(255, 255, 255, 0.25)', size = 400 } = defineProps<{
  spotlightColor?: string
  size?: number
}>();

const cardRef = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const opacity = ref(0);

const spotlightSize = computed(() => `${size}px`);
const spotlightX = computed(() => `${position.value.x}px`);
const spotlightY = computed(() => `${position.value.y}px`);

const handlePointerMove = (e: PointerEvent) => {
  if (!cardRef.value) return;
  const rect = cardRef.value.getBoundingClientRect();
  position.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

// Keyboard users get the spotlight centered on the card while it has focus
const handleFocus = () => {
  if (!cardRef.value) return;
  position.value = { x: cardRef.value.offsetWidth / 2, y: cardRef.value.offsetHeight / 2 };
  opacity.value = 1;
};
</script>

<template>
  <div
    ref="cardRef"
    class="card"
    tabindex="0"
    @pointermove="handlePointerMove"
    @pointerenter="opacity = 1"
    @pointerleave="opacity = 0"
    @focus="handleFocus"
    @blur="opacity = 0"
  >
    <div class="spotlight" :style="{ opacity }" aria-hidden="true" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  border: 1px solid #222;
  background-color: #111;
  padding: 2rem;
  color: #fff;
  outline: none;
  transition: border-color 0.3s ease;
}

.card:hover,
.card:focus-visible {
  border-color: #444;
}

.card:focus-visible {
  box-shadow: 0 0 0 2px v-bind(spotlightColor);
}

.spotlight {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle v-bind(spotlightSize) at v-bind(spotlightX) v-bind(spotlightY),
    v-bind(spotlightColor),
    transparent 80%
  );
  transition: opacity 0.5s ease-in-out;
}

.content {
  position: relative;
}

@media (prefers-reduced-motion: reduce) {
  .spotlight {
    transition: none;
  }
}
</style>
