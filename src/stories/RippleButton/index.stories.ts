import type { Meta, StoryObj } from '@storybook/vue3-vite'
import RippleButton from './index.vue'

const meta = {
  title: 'Basic/Ripple Button',
  component: RippleButton,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    rippleColor: { control: 'color' },
    duration: { control: { type: 'range', min: 200, max: 2500, step: 50 } },
    glow: { control: { type: 'range', min: 0, max: 60, step: 1 } },
  },
  args: {
    rippleColor: '#a78bfa',
    duration: 800,
    glow: 24,
  },
  render: (args) => ({
    components: { RippleButton },
    setup: () => ({ args }),
    template: `
      <div style="min-height:max(100vh, 320px); display:grid; place-items:center; padding:2rem; background:radial-gradient(ellipse at 50% 30%, #1b1740 0%, #08070f 75%)">
        <RippleButton v-bind="args">Press anywhere</RippleButton>
      </div>`,
  }),
} satisfies Meta<typeof RippleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EmberLarge: Story = {
  args: {
    rippleColor: '#fb923c',
    duration: 1400,
    glow: 40,
  },
  render: (args) => ({
    components: { RippleButton },
    setup: () => ({ args }),
    template: `
      <div style="min-height:320px; display:grid; place-items:center; padding:2rem; background:radial-gradient(ellipse at 50% 30%, #3a1608 0%, #0b0604 75%)">
        <RippleButton v-bind="args" style="font-size:1.6rem; padding:1.2em 4em; border-radius:20px" aria-label="Ignite">Ignite</RippleButton>
      </div>`,
  }),
}
