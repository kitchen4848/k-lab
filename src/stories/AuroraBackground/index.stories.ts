import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AuroraBackground from './index.vue'

const meta = {
  title: 'Basic/Aurora Background',
  component: AuroraBackground,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    colors: { control: 'object' },
    speed: { control: { type: 'range', min: 0.2, max: 4, step: 0.1 } },
    blur: { control: { type: 'range', min: 0, max: 140, step: 2 } },
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
  args: {
    colors: ['#22d3ee', '#34d399', '#818cf8', '#c084fc'],
    speed: 1,
    blur: 60,
    intensity: 0.7,
  },
  render: (args) => ({
    components: { AuroraBackground },
    setup: () => ({ args }),
    template: `
      <AuroraBackground v-bind="args" style="height: 100vh; min-height: 420px">
        <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; padding:24px; font-family: system-ui, sans-serif">
          <h1 style="margin:0; font-size:clamp(2.5rem,7vw,5rem); font-weight:700; letter-spacing:-0.03em">Northern Lights</h1>
          <p style="margin:0; opacity:.7; font-size:1.1rem">Drifting, blurred colour bands behind any content.</p>
        </div>
      </AuroraBackground>`,
  }),
} satisfies Meta<typeof AuroraBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SunsetEmbers: Story = {
  args: {
    colors: ['#f97316', '#ef4444', '#ec4899', '#facc15'],
    speed: 1.6,
    blur: 80,
    intensity: 0.8,
  },
}
