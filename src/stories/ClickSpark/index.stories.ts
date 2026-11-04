import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ClickSpark from './index.vue'

const meta = {
  title: 'Basic/Click Spark',
  component: ClickSpark,
  tags: ['autodocs'],
  argTypes: {
    sparkColor: { control: 'color' },
    sparkSize: { control: { type: 'range', min: 2, max: 40, step: 1 } },
    sparkRadius: { control: { type: 'range', min: 5, max: 100, step: 1 } },
    sparkCount: { control: { type: 'range', min: 1, max: 24, step: 1 } },
    duration: { control: { type: 'range', min: 100, max: 2000, step: 50 } },
    easing: { control: 'select', options: ['linear', 'ease-in', 'ease-out', 'ease-in-out'] },
    extraScale: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
  },
  args: {
    sparkColor: '#fff',
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400,
    easing: 'ease-out',
    extraScale: 1,
  },
  render: (args) => ({
    components: { ClickSpark },
    setup: () => ({ args }),
    template: `
      <div style="height: 320px; border-radius: 1rem; background-color: #111; overflow: hidden;">
        <ClickSpark v-bind="args">
          <div style="display: grid; place-items: center; height: 100%; color: #a1a1aa; user-select: none;">
            Click anywhere in this area
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
    sparkColor: '#ffb703',
    sparkSize: 16,
    sparkRadius: 40,
    sparkCount: 16,
    duration: 700,
    extraScale: 1.5,
  },
}
