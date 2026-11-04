import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MeteorShower from './index.vue'

const meta = {
  title: 'Basic/Meteor Shower',
  component: MeteorShower,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    count: { control: { type: 'range', min: 0, max: 60, step: 1 } },
    color: { control: 'color' },
    angle: { control: { type: 'range', min: -180, max: 180, step: 1 } },
    speedMin: { control: { type: 'range', min: 0.5, max: 10, step: 0.1 } },
    speedMax: { control: { type: 'range', min: 0.5, max: 12, step: 0.1 } },
    tailLength: { control: { type: 'range', min: 40, max: 400, step: 5 } },
  },
  args: {
    count: 18,
    color: '#8ec5ff',
    angle: 35,
    speedMin: 2,
    speedMax: 5,
    tailLength: 160,
  },
  render: (args) => ({
    components: { MeteorShower },
    setup: () => ({ args }),
    template: `
      <MeteorShower v-bind="args" style="height: 100vh; min-height: 420px">
        <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center; font-family: system-ui, sans-serif">
          <h1 style="margin:0; font-size:clamp(2.5rem,7vw,5rem); font-weight:700; letter-spacing:-0.03em; text-shadow:0 0 40px rgba(142,197,255,.45)">Make a wish</h1>
          <p style="margin:0; opacity:.65">Meteors streak behind your content.</p>
        </div>
      </MeteorShower>`,
  }),
} satisfies Meta<typeof MeteorShower>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CrimsonStorm: Story = {
  args: {
    count: 36,
    color: '#ff5a7a',
    angle: 125,
    speedMin: 1,
    speedMax: 3,
    tailLength: 260,
  },
}
