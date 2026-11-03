<script setup lang="ts">
import { computed } from 'vue'

const {
  value,
  duration = 900,
  decimals = 0,
  prefix = '',
  suffix = '',
} = defineProps<{
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}>()

const formatted = computed(() =>
  Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }),
)

interface Cell {
  key: string
  char: string
  isDigit: boolean
}

// keys are counted from the right so a digit column keeps its identity when
// the number grows or shrinks, which lets the CSS transition roll it
const cells = computed<Cell[]>(() => {
  const chars = Array.from(formatted.value)
  const sign = value < 0 ? '-' : ''
  const all = sign ? [sign, ...chars] : chars
  return all.map((char, i) => ({
    key: `c${all.length - i}`,
    char,
    isDigit: char >= '0' && char <= '9',
  }))
})

const digits = Array.from({ length: 10 }, (_, i) => i)
const ms = computed(() => `${duration}ms`)
</script>

<template>
  <span class="rolling" role="img" :aria-label="`${prefix}${value < 0 ? '-' : ''}${formatted}${suffix}`">
    <span v-if="prefix" class="rolling__affix" aria-hidden="true">{{ prefix }}</span>
    <span class="rolling__cells" aria-hidden="true">
      <template v-for="cell in cells" :key="cell.key">
        <span v-if="cell.isDigit" class="rolling__digit">
          <span class="rolling__strip" :style="{ '--n': cell.char }">
            <span v-for="d in digits" :key="d">{{ d }}</span>
          </span>
          <span class="rolling__ghost">8</span>
        </span>
        <span v-else class="rolling__sep">{{ cell.char }}</span>
      </template>
    </span>
    <span v-if="suffix" class="rolling__affix" aria-hidden="true">{{ suffix }}</span>
  </span>
</template>

<style scoped>
.rolling {
  display: inline-flex;
  align-items: baseline;
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
}

.rolling__cells {
  display: inline-flex;
}

.rolling__digit {
  position: relative;
  display: inline-block;
  height: 1.15em;
  overflow: hidden;
  /* soft fade where digits slide in and out */
  mask-image: linear-gradient(transparent 0%, #000 18%, #000 82%, transparent 100%);
}

.rolling__strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  transform: translateY(calc(var(--n) * -1.15em));
  transition: transform v-bind(ms) cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.rolling__strip > span {
  display: block;
  height: 1.15em;
  text-align: center;
}

.rolling__ghost {
  visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .rolling__strip {
    transition: none;
  }
}
</style>
