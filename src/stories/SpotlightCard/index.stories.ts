import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SpotlightCard from './index.vue'

const meta = {
  title: 'Basic/Spotlight Card',
  component: SpotlightCard,
  tags: ['autodocs'],
  argTypes: {
    spotlightColor: { control: 'color' },
    size: { control: { type: 'range', min: 100, max: 800, step: 10 } },
  },
  args: {
    spotlightColor: 'rgba(0, 229, 255, 0.2)',
    size: 400,
  },
  render: (args) => ({
    components: { SpotlightCard },
    setup: () => ({ args }),
    template: `
      <SpotlightCard v-bind="args" style="max-width: 360px;">
        <h3 style="margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 600;">Spotlight Card</h3>
        <p style="margin: 0; color: #a1a1aa; line-height: 1.5;">
          Move your cursor over the card, or Tab to it, to see the spotlight.
        </p>
      </SpotlightCard>
    `,
  }),
} satisfies Meta<typeof SpotlightCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Purple: Story = {
  args: {
    spotlightColor: 'rgba(127, 39, 215, 0.35)',
    size: 300,
  },
}
