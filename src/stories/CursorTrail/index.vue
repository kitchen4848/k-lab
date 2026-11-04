<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const {
  color = ['#22d3ee', '#a78bfa', '#f472b6'],
  width = 16,
  length = 40,
  fadeSpeed = 1,
  idleDemo = true,
} = defineProps<{
  /** A single colour or a list of colours forming a gradient along the ribbon. */
  color?: string | string[]
  /** Ribbon width in px at the head. */
  width?: number
  /** Maximum number of points in the ribbon. */
  length?: number
  /** Multiplier on how quickly the ribbon fades (higher = shorter-lived). */
  fadeSpeed?: number
  /** Draw a gentle automatic path until a real pointer enters. */
  idleDemo?: boolean
}>()

interface Point {
  x: number
  y: number
  t: number
}

const root = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let points: Point[] = []
let w = 0
let h = 0
let raf = 0
let visible = true
let reduced = false
let hovering = false
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let motionQuery: MediaQueryList | null = null

const LIFE = 700

function life() {
  return LIFE / Math.max(0.1, fadeSpeed)
}

function colors() {
  const c = Array.isArray(color) ? color : [color]
  return c.length ? c : ['#fff']
}

function resize() {
  const el = canvas.value
  const host = root.value
  if (!el || !host) return
  const dpr = window.devicePixelRatio || 1
  w = host.clientWidth
  h = host.clientHeight
  el.width = Math.max(1, Math.floor(w * dpr))
  el.height = Math.max(1, Math.floor(h * dpr))
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  points = []
}

function push(x: number, y: number, now: number) {
  const prev = points[points.length - 1]
  if (prev && Math.hypot(prev.x - x, prev.y - y) < 1.5) return
  points.push({ x, y, t: now })
  const max = Math.max(2, Math.round(length))
  if (points.length > max) points.splice(0, points.length - max)
  schedule()
}

function draw(now: number) {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  const l = life()
  points = points.filter((p) => now - p.t < l)
  const n = points.length
  if (n < 2) return
  const head = points[n - 1]!
  const tail = points[0]!
  const cs = colors()
  const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y)
  cs.forEach((c, i) => grad.addColorStop(cs.length === 1 ? 0 : i / (cs.length - 1), c))
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = grad
  ctx.shadowColor = cs[0]!
  ctx.shadowBlur = Math.max(8, width * 1.2)
  ctx.globalCompositeOperation = 'lighter'
  // Midpoint-smoothed quadratic segments; width and alpha follow age.
  for (let i = 1; i < n; i++) {
    const p0 = points[i - 1]!
    const p1 = points[i]!
    const p2 = points[i + 1] ?? p1
    const age = 1 - (now - p1.t) / l
    const taper = (i / (n - 1)) * Math.max(0, age)
    ctx.globalAlpha = Math.max(0, Math.min(1, age)) * 0.95
    ctx.lineWidth = Math.max(0.5, width * taper)
    ctx.beginPath()
    ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2)
    ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
  ctx.shadowBlur = 0
}

function frame(now: number) {
  raf = 0
  if (idleDemo && !hovering && !reduced) {
    const t = now / 1000
    push(
      w / 2 + Math.sin(t * 1.3) * w * 0.32 + Math.sin(t * 3.1) * w * 0.05,
      h / 2 + Math.sin(t * 1.9 + 1) * h * 0.3,
      now,
    )
  }
  draw(now)
  // Keep looping while there is something to draw or a demo to run.
  if (points.length || (idleDemo && !hovering)) schedule()
}

function schedule() {
  if (raf || !visible || reduced) return
  raf = requestAnimationFrame(frame)
}

function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

function onMove(e: PointerEvent) {
  if (reduced) return
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return
  hovering = true
  push(e.clientX - rect.left, e.clientY - rect.top, performance.now())
}

function onMotionChange() {
  reduced = !!motionQuery?.matches
  if (reduced) {
    stop()
    points = []
    ctx?.clearRect(0, 0, w, h)
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
  // Listen on window so slotted content never has to receive or forward events.
  window.addEventListener('pointermove', onWindowMove, { passive: true })
  schedule()
})

function onWindowMove(e: PointerEvent) {
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return
  const inside =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  if (inside) onMove(e)
  else if (hovering) {
    hovering = false
    schedule()
  }
}

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('pointermove', onWindowMove)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  motionQuery?.removeEventListener('change', onMotionChange)
})

watch(
  () => idleDemo,
  () => schedule(),
)
</script>

<template>
  <div ref="root" class="cursor-trail">
    <div class="cursor-trail__content">
      <slot />
    </div>
    <canvas ref="canvas" class="cursor-trail__canvas" aria-hidden="true" />
  </div>
</template>

<style scoped>
.cursor-trail {
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, #12122a 0%, #05050e 80%);
  color: #fff;
}

.cursor-trail__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* Painted above the content but never intercepts the pointer. */
.cursor-trail__canvas {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
