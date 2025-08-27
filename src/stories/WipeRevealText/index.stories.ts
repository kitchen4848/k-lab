import type { Meta, StoryObj } from '@storybook/vue3-vite'
import WipeRevealText from './index.vue'

const meta = {
  title: 'Basic/Wipe Reveal Text',
  component: WipeRevealText,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    duration: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
    color: { control: 'color' },
  },
  args: {
    text: 'Wipe Reveal Text',
    duration: 2,
    color: '#7f27d7',
  },
} satisfies Meta<typeof WipeRevealText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Wipe Reveal Text',
    duration: 2,
    color: '#7f27d7',
  },
}
