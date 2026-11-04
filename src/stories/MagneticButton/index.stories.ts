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
      <div style="min-height:380px; display:grid; place-items:center; padding:64px">
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
      <div style="min-height:380px; display:grid; place-items:center; padding:64px">
        <MagneticButton v-bind="args" style="background:transparent; box-shadow:inset 0 0 0 2px #65a30d, 0 0 40px -10px #65a30d; color:#4d7c0f; padding:22px 48px; font-size:1.2rem">&#9889; Pull me in</MagneticButton>
      </div>`,
  }),
}
