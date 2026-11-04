import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DayNightToggle from './index.vue'

const meta = {
  title: 'Basic/Day Night Toggle',
  component: DayNightToggle,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    modelValue: { control: 'boolean' },
    size: { control: { type: 'range', min: 20, max: 140, step: 2 } },
    label: { control: 'text' },
  },
  args: {
    modelValue: false,
    size: 72,
    label: '',
  },
  render: (args) => ({
    components: { DayNightToggle },
    setup() {
      const night = ref(args.modelValue)
      return { args, night }
    },
    template: `
      <div :style="{ minHeight:'max(100vh, 320px)', display:'grid', placeItems:'center', padding:'2rem', transition:'background .6s ease, color .6s ease', fontFamily:'system-ui, sans-serif', background: night ? 'radial-gradient(ellipse at 50% 0%, #1b2150 0%, #070916 80%)' : 'radial-gradient(ellipse at 50% 0%, #e0f2fe 0%, #7dc4ff 90%)', color: night ? '#e6ebf7' : '#0b2a4a' }">
        <div style="display:flex; flex-direction:column; align-items:center; gap:1.5rem">
          <DayNightToggle v-bind="args" v-model="night" />
          <p style="margin:0; font-size:1.1rem">{{ night ? 'Good night 🌙' : 'Good morning ☀️' }}</p>
        </div>
      </div>`,
  }),
} satisfies Meta<typeof DayNightToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LabelledNight: Story = {
  args: {
    modelValue: true,
    size: 48,
    label: 'Dark mode',
  },
}
