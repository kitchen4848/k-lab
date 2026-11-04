import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CursorTrail from './index.vue'

const meta = {
  title: 'Basic/Cursor Trail',
  component: CursorTrail,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    color: { control: 'object' },
    width: { control: { type: 'range', min: 2, max: 60, step: 1 } },
    length: { control: { type: 'range', min: 5, max: 120, step: 1 } },
    fadeSpeed: { control: { type: 'range', min: 0.2, max: 4, step: 0.1 } },
    idleDemo: { control: 'boolean' },
  },
  args: {
    color: ['#22d3ee', '#a78bfa', '#f472b6'],
    width: 16,
    length: 40,
    fadeSpeed: 1,
    idleDemo: true,
  },
  render: (args) => ({
    components: { CursorTrail },
    setup: () => ({ args }),
    template: `
      <CursorTrail v-bind="args" style="height: 100vh; min-height: 420px">
        <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; text-align:center; font-family: system-ui, sans-serif">
          <h1 style="margin:0; font-size:clamp(2.5rem,7vw,5rem); font-weight:700; letter-spacing:-0.03em">Leave a trail</h1>
          <p style="margin:0; opacity:.65">Move your cursor (or finger) anywhere.</p>
          <button type="button" style="padding:.7em 1.4em; border-radius:999px; border:1px solid rgba(255,255,255,.3); background:rgba(255,255,255,.08); color:#fff; font:600 1rem system-ui; cursor:pointer" onclick="this.textContent='Clicked — still works!'">Still clickable</button>
        </div>
      </CursorTrail>`,
  }),
} satisfies Meta<typeof CursorTrail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const GoldThread: Story = {
  args: {
    color: '#fbbf24',
    width: 6,
    length: 80,
    fadeSpeed: 0.5,
  },
}
