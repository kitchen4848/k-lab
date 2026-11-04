import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ScrambleText from './index.vue'

const meta = {
  title: 'Basic/Scramble Text',
  component: ScrambleText,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    trigger: { control: 'inline-radio', options: ['mount', 'hover', 'visible'] },
    duration: { control: { type: 'range', min: 200, max: 5000, step: 100 } },
    chars: { control: 'text' },
  },
  args: {
    text: 'DECRYPTING THE SIGNAL',
    trigger: 'mount',
    duration: 1600,
    chars: '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  },
  render: (args) => ({
    components: { ScrambleText },
    setup: () => ({ args }),
    // key forces a remount whenever the trigger changes so it can be previewed
    template: `
      <div style="min-height:300px; display:grid; place-items:center; padding:40px; color:#15803d">
        <ScrambleText :key="args.trigger + args.text" v-bind="args" style="font-size:clamp(1.4rem,4vw,2.6rem); font-weight:700; letter-spacing:.06em; text-shadow:0 0 14px rgb(22 163 74 / .35)" />
      </div>`,
  }),
} satisfies Meta<typeof ScrambleText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const HoverBinary: Story = {
  args: {
    text: 'HOVER TO DECODE',
    trigger: 'hover',
    duration: 1000,
    chars: '01',
  },
}
