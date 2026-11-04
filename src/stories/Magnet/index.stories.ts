import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Magnet from './index.vue'

const meta = {
  title: 'Basic/Magnet',
  component: Magnet,
  tags: ['autodocs'],
  argTypes: {
    padding: { control: { type: 'range', min: 0, max: 400, step: 10 } },
    disabled: { control: 'boolean' },
    magnetStrength: { control: { type: 'range', min: 1, max: 10, step: 0.5 } },
    activeTransition: { control: 'text' },
    inactiveTransition: { control: 'text' },
  },
  args: {
    padding: 100,
    disabled: false,
    magnetStrength: 2,
    activeTransition: 'transform 0.3s ease-out',
    inactiveTransition: 'transform 0.5s ease-in-out',
  },
  render: (args) => ({
    components: { Magnet },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 480px;">
        <Magnet v-bind="args">
          <button type="button" style="padding: 0.9rem 1.8rem; font-size: 1rem; font-weight: 600; color: #fff; background: #7f27d7; border: 0; border-radius: 999px; cursor: pointer;">
            Hover near me
          </button>
        </Magnet>
      </div>
    `,
  }),
} satisfies Meta<typeof Magnet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const StrongPull: Story = {
  args: {
    padding: 250,
    magnetStrength: 1.2,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
