import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TiltedCard from './index.vue'

const meta = {
  title: 'Basic/Tilted Card',
  component: TiltedCard,
  tags: ['autodocs'],
  argTypes: {
    maxTilt: { control: { type: 'range', min: 0, max: 45, step: 1 } },
    scaleOnHover: { control: { type: 'range', min: 0.8, max: 1.5, step: 0.01 } },
    perspective: { control: { type: 'range', min: 200, max: 2000, step: 50 } },
    transitionDuration: { control: { type: 'range', min: 0, max: 1000, step: 10 } },
    disabled: { control: 'boolean' },
  },
  args: {
    maxTilt: 12,
    scaleOnHover: 1.05,
    perspective: 800,
    transitionDuration: 200,
    disabled: false,
  },
  render: (args) => ({
    components: { TiltedCard },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; align-items: center; justify-content: center; height: 320px; background-color: #111; border-radius: 1rem;">
        <TiltedCard v-bind="args">
          <div style="width: 220px; padding: 1.5rem; color: #fff; background: linear-gradient(135deg, #7f27d7, #2a6df4); border-radius: 1rem;">
            <h3 style="margin: 0 0 0.5rem;">Tilted Card</h3>
            <p style="margin: 0 0 1rem; font-size: 0.9rem;">Move your cursor over the card.</p>
            <button type="button" style="padding: 0.4rem 0.9rem; border: 0; border-radius: 999px; cursor: pointer;">Still clickable</button>
          </div>
        </TiltedCard>
      </div>
    `,
  }),
} satisfies Meta<typeof TiltedCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Subtle: Story = {
  args: { maxTilt: 5, scaleOnHover: 1.02, transitionDuration: 300 },
}

export const Dramatic: Story = {
  args: { maxTilt: 30, scaleOnHover: 1.15, perspective: 500, transitionDuration: 120 },
}

export const Disabled: Story = {
  args: { disabled: true },
}
