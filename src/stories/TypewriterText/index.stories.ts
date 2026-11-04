import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TypewriterText from './index.vue'

const meta = {
  title: 'Basic/Typewriter Text',
  component: TypewriterText,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    phrases: { control: 'object' },
    typeSpeed: { control: { type: 'range', min: 10, max: 300, step: 5 } },
    deleteSpeed: { control: { type: 'range', min: 5, max: 200, step: 5 } },
    pause: { control: { type: 'range', min: 200, max: 5000, step: 100 } },
    loop: { control: 'boolean' },
    caret: { control: 'text' },
  },
  args: {
    phrases: ['Design with intention.', 'Animate with restraint.', 'Ship interfaces people love.'],
    typeSpeed: 70,
    deleteSpeed: 35,
    pause: 1600,
    loop: true,
    caret: '|',
  },
  render: (args) => ({
    components: { TypewriterText },
    setup: () => ({ args }),
    template: `
      <div style="min-height:max(100vh, 360px); display:grid; place-items:center; padding:2rem; font-family: system-ui, sans-serif">
        <div style="text-align:center">
          <div style="font-size:.85rem; letter-spacing:.3em; text-transform:uppercase; opacity:.5; margin-bottom:1rem">k-lab is for</div>
          <h1 style="margin:0; font-size:clamp(1.8rem,5vw,3.4rem); font-weight:700; letter-spacing:-0.02em; min-height:1.2em; background:linear-gradient(90deg,#0284c7,#7c3aed,#c026d3); -webkit-background-clip:text; background-clip:text; color:transparent">
            <TypewriterText v-bind="args" />
          </h1>
        </div>
      </div>`,
  }),
} satisfies Meta<typeof TypewriterText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Terminal: Story = {
  args: {
    phrases: ['$ npm install k-lab', '$ npm run storybook', '$ ship it'],
    typeSpeed: 55,
    deleteSpeed: 20,
    pause: 1200,
    caret: '█',
  },
  render: (args) => ({
    components: { TypewriterText },
    setup: () => ({ args }),
    template: `
      <div style="min-height:360px; display:grid; place-items:center; padding:2rem">
        <div style="min-width:min(560px,90vw); padding:1.5rem 1.75rem; border-radius:12px; background:#0b1210; border:1px solid #1d3a2b; box-shadow:0 0 40px rgba(34,197,94,.15); color:#4ade80; font:1.25rem/1.4 ui-monospace, Menlo, monospace">
          <TypewriterText v-bind="args" />
        </div>
      </div>`,
  }),
}
