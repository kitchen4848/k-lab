import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BorderBeamCard from './index.vue'

const meta = {
  title: 'Basic/Border Beam Card',
  component: BorderBeamCard,
  tags: ['autodocs'],
  argTypes: {
    colorFrom: { control: 'color' },
    colorTo: { control: 'color' },
    beamWidth: { control: { type: 'range', min: 1, max: 8, step: 0.5 } },
    speed: { control: { type: 'range', min: 1, max: 12, step: 0.5 } },
    radius: { control: { type: 'range', min: 0, max: 48, step: 1 } },
  },
  args: {
    colorFrom: '#22d3ee',
    colorTo: '#a855f7',
    beamWidth: 2,
    speed: 4,
    radius: 20,
  },
  render: (args) => ({
    components: { BorderBeamCard },
    setup: () => ({ args }),
    template: `
      <div style="min-height:420px; display:grid; place-items:center; padding:48px">
        <BorderBeamCard v-bind="args">
          <div style="width:320px; padding:32px; font-family:system-ui,sans-serif; border-radius:inherit">
            <div style="font-size:.75rem; letter-spacing:.2em; text-transform:uppercase; opacity:.5">Pro plan</div>
            <div style="font-size:3rem; font-weight:800; margin:8px 0">$24<span style="font-size:1rem; opacity:.5">/mo</span></div>
            <p style="margin:0 0 20px; opacity:.65; line-height:1.5">Unlimited projects, priority support and a beam that never stops.</p>
            <div style="display:grid; gap:8px; opacity:.85"><span>&#10003; Unlimited projects</span><span>&#10003; Priority support</span><span>&#10003; Custom domains</span></div>
          </div>
        </BorderBeamCard>
      </div>`,
  }),
} satisfies Meta<typeof BorderBeamCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FireRing: Story = {
  args: { colorFrom: '#facc15', colorTo: '#ef4444', beamWidth: 3, speed: 2.5, radius: 36 },
}
