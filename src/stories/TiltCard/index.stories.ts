import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TiltCard from './index.vue'

const meta = {
  title: 'Basic/Tilt Card',
  component: TiltCard,
  tags: ['autodocs'],
  argTypes: {
    maxTilt: { control: { type: 'range', min: 0, max: 40, step: 1 } },
    scale: { control: { type: 'range', min: 1, max: 1.3, step: 0.01 } },
    perspective: { control: { type: 'range', min: 300, max: 2000, step: 50 } },
    glareOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
  args: {
    maxTilt: 14,
    scale: 1.04,
    perspective: 900,
    glareOpacity: 0.35,
  },
  render: (args) => ({
    components: { TiltCard },
    setup: () => ({ args }),
    template: `
      <div style="min-height:520px; display:grid; place-items:center; padding:48px">
        <TiltCard v-bind="args">
          <div style="width:300px; padding:32px; color:#fff; font-family:system-ui,sans-serif">
            <div style="height:150px; border-radius:14px; background:linear-gradient(135deg,#f472b6,#818cf8 55%,#22d3ee); margin-bottom:24px; box-shadow:0 12px 30px -10px #818cf8"></div>
            <h3 style="margin:0 0 6px; font-size:1.4rem">Holographic Pass</h3>
            <p style="margin:0; opacity:.65; line-height:1.5">Move your cursor across the card and watch it follow.</p>
          </div>
        </TiltCard>
      </div>`,
  }),
} satisfies Meta<typeof TiltCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const GoldExtreme: Story = {
  args: { maxTilt: 28, scale: 1.1, perspective: 600, glareOpacity: 0.6 },
  render: (args) => ({
    components: { TiltCard },
    setup: () => ({ args }),
    template: `
      <div style="min-height:520px; display:grid; place-items:center; padding:48px">
        <TiltCard v-bind="args">
          <div style="width:260px; height:340px; padding:28px; display:flex; flex-direction:column; justify-content:flex-end; color:#422006; font-family:Georgia,serif; background:linear-gradient(145deg,#fde68a,#f59e0b 55%,#b45309)">
            <div style="font-size:4rem; line-height:1">&#9733;</div>
            <h3 style="margin:8px 0 0; font-size:1.6rem">Gold Member</h3>
            <p style="margin:4px 0 0; opacity:.75">Tilt me hard.</p>
          </div>
        </TiltCard>
      </div>`,
  }),
}
