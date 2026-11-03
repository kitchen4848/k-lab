<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const {
  count = 90,
  colors = ['#7dd3fc', '#a5b4fc', '#f0abfc'],
  linkDistance = 130,
  speed = 0.4,
  cursorRadius = 160,
} = defineProps<{
  count?: number
  colors?: string[]
  linkDistance?: number
  speed?: number
  cursorRadius?: number
}>()

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
}

const root = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let width = 0
let height = 0
let dpr = 1
let raf = 0
let last = 0
let visible = true
let reduced = false
const pointer = { x: -9999, y: -9999, active: false }
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let motionQuery: MediaQueryList | null = null

function makeParticle(): Particle {
  const angle = Math.random() * Math.PI * 2
  const v = (0.3 + Math.random() * 0.7) * speed
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * v * 60,
    vy: Math.sin(angle) * v * 60,
    r: 1 + Math.random() * 1.6,
    color: colors[Math.floor(Math.random() * colors.length)] ?? '#fff',
  }
}

function seed() {
  particles = Array.from({ length: Math.max(0, Math.round(count)) }, makeParticle)
}

function resize() {
  const el = canvas.value
  const host = root.value
  if (!el || !host) return
  dpr = window.devicePixelRatio || 1
  width = host.clientWidth
  height = host.clientHeight
  el.width = Math.max(1, Math.floor(width * dpr))
  el.height = Math.max(1, Math.floor(height * dpr))
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  seed()
  draw()
}

function step(dt: number) {
  for (const p of particles) {
    p.x += p.vx * dt
    p.y += p.vy * dt
    if (p.x < 0 || p.x > width) {
      p.vx *= -1
      p.x = Math.min(Math.max(p.x, 0), width)
    }
    if (p.y < 0 || p.y > height) {
      p.vy *= -1
      p.y = Math.min(Math.max(p.y, 0), height)
    }
    if (pointer.active) {
      const dx = p.x - pointer.x
      const dy = p.y - pointer.y
      const d = Math.hypot(dx, dy)
      if (d < cursorRadius && d > 0.01) {
        const push = (1 - d / cursorRadius) * 90 * dt
        p.x += (dx / d) * push
        p.y += (dy / d) * push
      }
    }
  }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  const maxD2 = linkDistance * linkDistance
  ctx.lineWidth = 1
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]!
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]!
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      if (d2 < maxD2) {
        ctx.globalAlpha = (1 - d2 / maxD2) * 0.55
        ctx.strokeStyle = a.color
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
    if (pointer.active) {
      const dx = a.x - pointer.x
      const dy = a.y - pointer.y
      const d = Math.hypot(dx, dy)
      if (d < cursorRadius) {
        ctx.globalAlpha = (1 - d / cursorRadius) * 0.9
        ctx.strokeStyle = '#ffffff'
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(pointer.x, pointer.y)
        ctx.stroke()
      }
    }
  }
  for (const p of particles) {
    ctx.globalAlpha = 1
    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.shadowBlur = 0
  ctx.globalAlpha = 1
}

function frame(t: number) {
  raf = 0
  const dt = Math.min((t - last) / 1000, 0.05)
  last = t
  step(dt)
  draw()
  schedule()
}

function schedule() {
  if (!raf && visible && !reduced) raf = requestAnimationFrame((t) => {
    if (!last) last = t
    frame(t)
  })
}

function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  last = 0
}

function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return
  pointer.x = e.clientX - rect.left
  pointer.y = e.clientY - rect.top
  pointer.active = true
  if (reduced) draw()
}

function onLeave() {
  pointer.active = false
  pointer.x = pointer.y = -9999
  if (reduced) draw()
}

function onMotionChange() {
  reduced = !!motionQuery?.matches
  if (reduced) {
    stop()
    draw()
  } else schedule()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced = motionQuery.matches
  motionQuery.addEventListener('change', onMotionChange)
  resize()
  resizeObserver = new ResizeObserver(resize)
  if (root.value) resizeObserver.observe(root.value)
  intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    if (visible) schedule()
    else stop()
  })
  if (root.value) intersectionObserver.observe(root.value)
  schedule()
})

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  motionQuery?.removeEventListener('change', onMotionChange)
})

watch(() => [count, colors, speed], () => {
  seed()
  if (reduced) draw()
}, { deep: true })
</script>

<template>
  <div ref="root" class="constellation" @pointermove="onMove" @pointerleave="onLeave">
    <canvas ref="canvas" class="constellation__canvas" aria-hidden="true" />
    <div class="constellation__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.constellation {
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 0%, #121a3a 0%, #060814 75%);
  color: #fff;
}

.constellation__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.constellation__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.constellation__content > :deep(*) {
  pointer-events: auto;
}
</style>
