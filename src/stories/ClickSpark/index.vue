<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const {
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
} = defineProps<{
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
}>();

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

const container = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
let sparks: Spark[] = [];
let frame = 0;
let resizeObserver: ResizeObserver | undefined;

const resize = () => {
  if (!canvas.value || !container.value) return;
  const { width, height } = container.value.getBoundingClientRect();
  canvas.value.width = width;
  canvas.value.height = height;
};

const draw = (time: number) => {
  const ctx = canvas.value?.getContext('2d');
  if (ctx && canvas.value) {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    sparks = sparks.filter((spark) => {
      const progress = (time - spark.startTime) / duration;
      if (progress >= 1) return false;
      const eased = progress * (2 - progress);
      const distance = eased * sparkRadius;
      const length = sparkSize * (1 - eased);
      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(
        spark.x + distance * Math.cos(spark.angle),
        spark.y + distance * Math.sin(spark.angle),
      );
      ctx.lineTo(
        spark.x + (distance + length) * Math.cos(spark.angle),
        spark.y + (distance + length) * Math.sin(spark.angle),
      );
      ctx.stroke();
      return true;
    });
  }
  frame = requestAnimationFrame(draw);
};

const onClick = (e: MouseEvent) => {
  if (!canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const now = performance.now();
  for (let i = 0; i < sparkCount; i++) {
    sparks.push({ x, y, angle: (2 * Math.PI * i) / sparkCount, startTime: now });
  }
};

onMounted(() => {
  resize();
  resizeObserver = new ResizeObserver(resize);
  if (container.value) resizeObserver.observe(container.value);
  frame = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  resizeObserver?.disconnect();
});
</script>

<template>
  <div ref="container" class="click-spark" @click="onClick">
    <canvas ref="canvas" class="canvas" />
    <slot />
  </div>
</template>

<style scoped>
.click-spark {
  position: relative;
  width: 100%;
  height: 100%;
}

.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
}
</style>
