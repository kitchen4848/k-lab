import type { Meta, StoryObj } from '@storybook/vue3-vite'
import GlitchText from './index.vue'

const meta = {
  title: 'Basic/Glitch Text',
  component: GlitchText,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    colorA: { control: 'color' },
    colorB: { control: 'color' },
    intensity: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    speed: { control: { type: 'range', min: 0.2, max: 5, step: 0.1 } },
    hoverOnly: { control: 'boolean' },
  },
  args: {
    text: 'Cyber Glitch',
    colorA: '#ff2a6d',
    colorB: '#05d9e8',
    intensity: 1,
    speed: 1,
    hoverOnly: false,
  },
  render: (args) => ({
    components: { GlitchText },
    setup: () => ({ args }),
    template: `
      <div style="min-height:320px; display:grid; place-items:center; padding:48px; background:
        repeating-linear-gradient(0deg, rgb(255 255 255 / .03) 0 1px, transparent 1px 3px), #07060d">
        <GlitchText v-bind="args" />
      </div>`,
  }),
} satisfies Meta<typeof GlitchText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const HoverOnlyAcid: Story = {
  args: {
    text: 'Hover Me',
    colorA: '#a3ff12',
    colorB: '#ff00e5',
    intensity: 2,
    speed: 2,
    hoverOnly: true,
  },
}
