<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const {
  color = '#00ff7f',
  fontSize = 16,
  speed = 1,
  density = 0.9,
  characters = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789',
} = defineProps<{
  color?: string
  fontSize?: number
  /** Multiplier on fall speed. */
  speed?: number
  /** Fraction (0–1) of columns that carry a stream. */
  density?: number
  characters?: string
}>()

interface Column {
  y: number
  v: number
  active: boolean
  lastRow: number
  lastChar: string
}

const root = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let cols: Column[] = []
let width = 0
let height = 0
let rows = 0
let raf = 0
let last = 0
let visible = true
let reduced = false
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let motionQuery: MediaQueryList | null = null

function glyphs() {
  const list = Array.from(characters)
  return list.length ? list : ['0', '1']
}

function randomChar() {
  const g = glyphs()
  return g[Math.floor(Math.random() * g.length)]!
}

function seed() {
  const size = Math.max(6, fontSize)
  const n = Math.max(1, Math.floor(width / size))
  rows = Math.ceil(height / size)
  cols = Array.from({ length: n }, () => ({
    y: -Math.random() * rows * 1.5,
    v: 6 + Math.random() * 14,
    active: Math.random() < density,
    lastRow: -1,
    lastChar: '',
  }))
}

function setFont() {
  if (!ctx) return
  ctx.font = `${Math.max(6, fontSize)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
}

function cell(i: number, row: number, ch: string, fill: string, glow: boolean) {
  if (!ctx) return
  const size = Math.max(6, fontSize)
  const x = i * size + size / 2
  const y = row * size
  ctx.clearRect(i * size, y, size, size)
  ctx.fillStyle = fill
  ctx.shadowColor = color
  ctx.shadowBlur = glow ? size * 0.9 : 0
  ctx.fillText(ch, x, y)
}

function step(dt: number) {
  if (!ctx) return
  // Fade existing glyphs (keeps canvas transparent so slotted backdrops show through).
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = `rgba(0,0,0,${Math.min(1, 1 - Math.pow(0.1, dt * 0.9))})`
  ctx.shadowBlur = 0
  ctx.fillRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'

  cols.forEach((c, i) => {
    if (!c.active) return
    c.y += c.v * speed * dt
    const row = Math.floor(c.y)
    if (row === c.lastRow) return
    // Settle previous head into the trail colour.
    if (c.lastRow >= 0 && c.lastRow < rows) cell(i, c.lastRow, c.lastChar, color, false)
    if (row >= 0 && row < rows) {
      c.lastChar = randomChar()
      cell(i, row, c.lastChar, '#eafff2', true)
    }
    c.lastRow = row
    if (row > rows + 6 && Math.random() > 0.96) {
      c.y = -Math.random() * rows * 0.5
      c.v = 6 + Math.random() * 14
      c.lastRow = -1
      c.active = Math.random() < Math.min(1, density + 0.1)
    }
  })
  ctx.shadowBlur = 0
}

function warmUp(frames: number) {
  for (let i = 0; i < frames; i++) step(1 / 30)
}

function resize() {
  const el = canvas.value
  const host = root.value
  if (!el || !host) return
  const dpr = window.devicePixelRatio || 1
  width = host.clientWidth
  height = host.clientHeight
  el.width = Math.max(1, Math.floor(width * dpr))
  el.height = Math.max(1, Math.floor(height * dpr))
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  setFont()
  seed()
  warmUp(reduced ? 140 : 90)
}

function frame(t: number) {
  raf = 0
  const dt = Math.min((t - last) / 1000, 0.05)
  last = t
  step(dt)
  schedule()
}

function schedule() {
  if (raf || !visible || reduced) return
  raf = requestAnimationFrame((t) => {
    if (!last) last = t
    frame(t)
  })
}

function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  last = 0
}

function onMotionChange() {
  reduced = !!motionQuery?.matches
  if (reduced) stop()
  else schedule()
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

watch(
  () => [color, fontSize, density, characters],
  () => {
    ctx?.clearRect(0, 0, width, height)
    setFont()
    seed()
    warmUp(reduced ? 140 : 90)
  },
)
</script>

<template>
  <div ref="root" class="matrix-rain">
    <canvas ref="canvas" class="matrix-rain__canvas" aria-hidden="true" />
    <div class="matrix-rain__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.matrix-rain {
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 100%, #03170d 0%, #010503 80%);
  color: #fff;
}

.matrix-rain__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.matrix-rain__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
