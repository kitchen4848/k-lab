import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FlipCard from './index.vue'

const meta = {
  title: 'Basic/Flip Card',
  component: FlipCard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    trigger: { control: 'inline-radio', options: ['hover', 'click'] },
    direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    duration: { control: { type: 'range', min: 100, max: 2000, step: 50 } },
    flipped: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    trigger: 'hover',
    direction: 'horizontal',
    duration: 700,
    flipped: false,
    label: 'Flip card',
  },
  render: (args) => ({
    components: { FlipCard },
    setup: () => ({ args }),
    template: `
      <div style="min-height:max(100vh, 520px); display:grid; place-items:center; padding:2rem; font-family: system-ui, sans-serif; color:#fff">
        <FlipCard v-bind="args" v-model:flipped="args.flipped">
          <template #front>
            <div style="height:100%; display:flex; flex-direction:column; justify-content:flex-end; padding:1.75rem; background:radial-gradient(circle at 30% 20%, #8b5cf6 0%, transparent 55%), radial-gradient(circle at 80% 80%, #06b6d4 0%, transparent 55%), #14122b; border:1px solid rgba(255,255,255,.15); border-radius:inherit; box-sizing:border-box">
              <div style="font-size:4rem; line-height:1">✦</div>
              <h2 style="margin:.5rem 0 .25rem; font-size:1.8rem">Nebula</h2>
              <p style="margin:0; opacity:.75">{{ args.trigger === 'hover' ? 'Hover or focus to reveal' : 'Click, tap or press Enter' }}</p>
            </div>
          </template>
          <template #back>
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; gap:.75rem; padding:1.75rem; background:linear-gradient(160deg, #0f172a, #1e1b4b); border:1px solid rgba(125,211,252,.4); border-radius:inherit; box-sizing:border-box; box-shadow:inset 0 0 60px rgba(125,211,252,.12)">
              <h3 style="margin:0; font-size:1.4rem; color:#7dd3fc">Behind the glow</h3>
              <p style="margin:0; opacity:.8; line-height:1.5">A 3D flip with real perspective. Only the visible side is focusable and readable by assistive tech.</p>
              <a href="#flip" style="color:#f0abfc; font-weight:600">Learn more →</a>
            </div>
          </template>
        </FlipCard>
      </div>`,
  }),
} satisfies Meta<typeof FlipCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ClickVertical: Story = {
  args: {
    trigger: 'click',
    direction: 'vertical',
    duration: 900,
    label: 'Flip the nebula card',
  },
}
