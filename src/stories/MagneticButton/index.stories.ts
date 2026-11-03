import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MagneticButton from './index.vue'

const meta = {
  title: 'Basic/Magnetic Button',
  component: MagneticButton,
  tags: ['autodocs'],
  argTypes: {
    strength: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    radius: { control: { type: 'range', min: 0, max: 300, step: 10 } },
  },
  args: {
    strength: 0.35,
    radius: 120,
  },
  render: (args) => ({
    components: { MagneticButton },
    setup: () => ({ args }),
    template: `
      <div style="min-height:380px; display:grid; place-items:center; padding:64px; background:radial-gradient(circle at 50% 50%, #1e1b4b, #020617 75%)">
        <MagneticButton v-bind="args" aria-label="Get started">Get started &rarr;</MagneticButton>
      </div>`,
  }),
} satisfies Meta<typeof MagneticButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const StrongPullOutline: Story = {
  args: { strength: 0.7, radius: 220 },
  render: (args) => ({
    components: { MagneticButton },
    setup: () => ({ args }),
    template: `
      <div style="min-height:380px; display:grid; place-items:center; padding:64px; background:#09090b">
        <MagneticButton v-bind="args" style="background:transparent; box-shadow:inset 0 0 0 2px #a3e635, 0 0 40px -10px #a3e635; color:#a3e635; padding:22px 48px; font-size:1.2rem">&#9889; Pull me in</MagneticButton>
      </div>`,
  }),
}
