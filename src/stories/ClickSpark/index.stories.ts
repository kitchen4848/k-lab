import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ClickSpark from './index.vue'

const meta = {
  title: 'Basic/Click Spark',
  component: ClickSpark,
  tags: ['autodocs'],
  argTypes: {
    sparkColor: { control: 'color' },
    sparkSize: { control: { type: 'range', min: 4, max: 40, step: 1 } },
    sparkRadius: { control: { type: 'range', min: 5, max: 80, step: 1 } },
    sparkCount: { control: { type: 'range', min: 3, max: 24, step: 1 } },
    duration: { control: { type: 'range', min: 100, max: 1500, step: 50 } },
  },
  args: {
    sparkColor: '#111',
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400,
  },
  render: (args) => ({
    components: { ClickSpark },
    setup: () => ({ args }),
    template: `
      <div style="height: 320px;">
        <ClickSpark v-bind="args">
          <div style="display: flex; height: 100%; align-items: center; justify-content: center; color: #52525b;">
            Click anywhere
          </div>
        </ClickSpark>
      </div>
    `,
  }),
} satisfies Meta<typeof ClickSpark>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Firework: Story = {
  args: {
    sparkColor: '#f97316',
    sparkSize: 16,
    sparkRadius: 40,
    sparkCount: 16,
    duration: 700,
  },
}
