import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ConstellationField from './index.vue'

const meta = {
  title: 'Basic/Constellation Field',
  component: ConstellationField,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    count: { control: { type: 'range', min: 10, max: 300, step: 5 } },
    colors: { control: 'object' },
    linkDistance: { control: { type: 'range', min: 40, max: 300, step: 5 } },
    speed: { control: { type: 'range', min: 0, max: 2, step: 0.05 } },
    cursorRadius: { control: { type: 'range', min: 0, max: 400, step: 10 } },
  },
  args: {
    count: 90,
    colors: ['#7dd3fc', '#a5b4fc', '#f0abfc'],
    linkDistance: 130,
    speed: 0.4,
    cursorRadius: 160,
  },
  render: (args) => ({
    components: { ConstellationField },
    setup: () => ({ args }),
    template: `
      <ConstellationField v-bind="args" style="height: 100vh; min-height: 420px">
        <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center; font-family: system-ui, sans-serif">
          <h1 style="margin:0; font-size:clamp(2.5rem,7vw,5rem); font-weight:700; letter-spacing:-0.03em">Constellation</h1>
          <p style="margin:0; opacity:.65">Move your cursor through the stars.</p>
        </div>
      </ConstellationField>`,
  }),
} satisfies Meta<typeof ConstellationField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EmberSwarm: Story = {
  args: {
    count: 160,
    colors: ['#fb923c', '#f43f5e', '#fde047'],
    linkDistance: 100,
    speed: 0.8,
    cursorRadius: 220,
  },
}
