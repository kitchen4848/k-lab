import type { Meta, StoryObj } from '@storybook/vue3-vite'
import NeonSignText from './index.vue'

const meta = {
  title: 'Basic/Neon Sign Text',
  component: NeonSignText,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    text: { control: 'text' },
    color: { control: 'color' },
    intensity: { control: { type: 'range', min: 0, max: 2, step: 0.05 } },
    flicker: { control: 'boolean' },
    fontSize: { control: { type: 'range', min: 24, max: 200, step: 2 } },
  },
  args: {
    text: 'Open All Night',
    color: '#ff2bd6',
    intensity: 1,
    flicker: true,
    fontSize: 84,
  },
  render: (args) => ({
    components: { NeonSignText },
    setup: () => ({ args }),
    template: `
      <div style="min-height:max(100vh, 360px); display:grid; place-items:center; padding:2rem; background:
          repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 2px, transparent 2px 64px),
          repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 2px, transparent 2px 32px),
          radial-gradient(ellipse at 50% 50%, #1a1024 0%, #08050d 80%)">
        <NeonSignText v-bind="args" />
      </div>`,
  }),
} satisfies Meta<typeof NeonSignText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CyanDiner: Story = {
  args: {
    text: 'DINER',
    color: '#22e4ff',
    intensity: 1.3,
    fontSize: 120,
  },
  render: (args) => ({
    components: { NeonSignText },
    setup: () => ({ args }),
    template: `
      <div style="min-height:360px; display:grid; place-items:center; padding:2rem; background:#050b12">
        <div style="padding:1rem 2.5rem; border:3px solid #123; border-radius:24px; box-shadow:inset 0 0 60px rgba(34,228,255,.08)">
          <NeonSignText v-bind="args" style="font-family: 'Arial Black', Impact, sans-serif; font-weight:900" />
        </div>
      </div>`,
  }),
}
