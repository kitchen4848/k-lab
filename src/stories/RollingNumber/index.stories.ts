import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import RollingNumber from './index.vue'

const meta = {
  title: 'Basic/Rolling Number',
  component: RollingNumber,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
    duration: { control: { type: 'range', min: 100, max: 3000, step: 50 } },
    decimals: { control: { type: 'range', min: 0, max: 4, step: 1 } },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
  },
  args: {
    value: 12847,
    duration: 1200,
    decimals: 0,
    prefix: '$',
    suffix: '',
  },
  render: (args) => ({
    components: { RollingNumber },
    setup() {
      const local = ref<number | null>(null)
      watch(() => args.value, () => (local.value = null))
      return { args, local }
    },
    template: `
      <div style="min-height:320px; display:flex; flex-direction:column; gap:28px; align-items:center; justify-content:center; padding:40px; color:#111827; font-family:system-ui,sans-serif">
        <RollingNumber v-bind="args" :value="local ?? args.value" style="font-size:clamp(3rem,10vw,6rem); font-weight:800; letter-spacing:-0.02em" />
        <button type="button" @click="local = Math.round(Math.random() * 99999)"
          style="padding:10px 20px; border-radius:999px; border:1px solid #374151; background:#1f2937; color:#fff; cursor:pointer; font-size:1rem">
          Roll to a random value
        </button>
      </div>`,
  }),
} satisfies Meta<typeof RollingNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Percentage: Story = {
  args: {
    value: 98.6,
    decimals: 1,
    prefix: '',
    suffix: '%',
    duration: 1800,
  },
}
