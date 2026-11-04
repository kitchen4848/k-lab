import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InfiniteMarquee from './index.vue'

const meta = {
  title: 'Basic/Infinite Marquee',
  component: InfiniteMarquee,
  tags: ['autodocs'],
  argTypes: {
    speed: { control: { type: 'range', min: 10, max: 300, step: 5 } },
    direction: { control: 'inline-radio', options: ['left', 'right'] },
    gap: { control: { type: 'range', min: 0, max: 100, step: 2 } },
    pauseOnHover: { control: 'boolean' },
    fadeWidth: { control: { type: 'range', min: 0, max: 240, step: 5 } },
  },
  args: {
    speed: 60,
    direction: 'left',
    gap: 32,
    pauseOnHover: true,
    fadeWidth: 100,
  },
  render: (args) => ({
    components: { InfiniteMarquee },
    setup: () => ({
      args,
      tags: ['Vue 3', 'TypeScript', 'Storybook', 'Vite', 'Canvas', 'CSS Houdini', 'Playwright', 'ESLint', 'Oxlint', 'Pinia'],
    }),
    template: `
      <div style="min-height:300px; display:grid; align-content:center; padding:40px 0; color:#312e81; font-family:system-ui,sans-serif">
        <InfiniteMarquee v-bind="args">
          <span v-for="t in tags" :key="t" style="padding:10px 22px; border-radius:999px; background:linear-gradient(135deg, rgb(99 102 241 / .35), rgb(236 72 153 / .25)); box-shadow:inset 0 0 0 1px rgb(99 102 241 / .25); white-space:nowrap; font-weight:600">{{ t }}</span>
        </InfiniteMarquee>
      </div>`,
  }),
} satisfies Meta<typeof InfiniteMarquee>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ReverseCards: Story = {
  args: { speed: 120, direction: 'right', gap: 16, pauseOnHover: false, fadeWidth: 160 },
  render: (args) => ({
    components: { InfiniteMarquee },
    setup: () => ({ args, emojis: ['🚀', '🌈', '🔥', '🎧', '🧪', '🌊', '🍉', '⚡'] }),
    template: `
      <div style="min-height:300px; display:grid; align-content:center; padding:40px 0">
        <InfiniteMarquee v-bind="args">
          <div v-for="e in emojis" :key="e" style="width:120px; height:120px; display:grid; place-items:center; font-size:3rem; border-radius:24px; background:linear-gradient(160deg,#27272a,#18181b); box-shadow:inset 0 0 0 1px #3f3f46">{{ e }}</div>
        </InfiniteMarquee>
      </div>`,
  }),
}
