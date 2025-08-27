import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ShinyText from './index.vue'

const meta = {
  title: 'Basic/Shiny Text',
  component: ShinyText,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    duration: { control: { type: 'range', min: 0.5, max: 10, step: 0.1 } },
    color: { control: 'color' },
  },
  args: {
    text: 'Shiny Text',
    duration: 5,
    color: 'red',
  },
} satisfies Meta<typeof ShinyText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Shiny Text',
    duration: 5,
    color: 'red',
  },
}
