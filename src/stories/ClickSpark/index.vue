<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Easing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'

const {
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
} = defineProps<{
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  easing?: Easing
  extraScale?: number
}>();

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

let sparks: Spark[] = [];
let frameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

const ease = (t: number) => {
  switch (easing) {
    case 'linear':
      return t;
    case 'ease-in':
      return t * t;
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t * (2 - t);
  }
};

// Match the canvas backing store to its displayed size so lines stay crisp on HiDPI screens
const resizeCanvas = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;
  const { width, height } = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const draw = (now: number) => {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sparks = sparks.filter((spark) => {
    const elapsed = now - spark.startTime;
    if (elapsed >= duration) return false;

    const eased = ease(elapsed / duration);
    const distance = eased * sparkRadius * extraScale;
    const lineLength = sparkSize * (1 - eased);

    const x1 = spark.x + distance * Math.cos(spark.angle);
    const y1 = spark.y + distance * Math.sin(spark.angle);
    const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
    const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

    ctx.strokeStyle = sparkColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return true;
  });

  // Only keep the loop running while sparks are on screen
  frameId = sparks.length ? requestAnimationFrame(draw) : null;
};

const handleClick = (e: MouseEvent) => {
  if (!containerRef.value) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rect = containerRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const now = performance.now();

  for (let i = 0; i < sparkCount; i++) {
    sparks.push({ x, y, angle: (2 * Math.PI * i) / sparkCount, startTime: now });
  }

  if (frameId === null) frameId = requestAnimationFrame(draw);
};

onMounted(() => {
  resizeCanvas();
  resizeObserver = new ResizeObserver(resizeCanvas);
  if (containerRef.value) resizeObserver.observe(containerRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (frameId !== null) cancelAnimationFrame(frameId);
});
</script>

<template>
  <div ref="containerRef" class="container" @click="handleClick">
    <canvas ref="canvasRef" class="canvas" aria-hidden="true" />
    <slot />
  </div>
</template>

<style scoped>
.container {
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
