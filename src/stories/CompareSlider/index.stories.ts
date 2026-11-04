import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import CompareSlider from './index.vue'

const meta = {
  title: 'Basic/Compare Slider',
  component: CompareSlider,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    position: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    step: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
    label: { control: 'text' },
  },
  args: {
    position: 50,
    orientation: 'horizontal',
    step: 1,
    label: 'Compare wireframe and final design',
  },
  render: (args) => ({
    components: { CompareSlider },
    setup() {
      const pos = ref(args.position)
      return { args, pos }
    },
    template: `
      <div style="min-height:max(100vh, 480px); display:grid; place-items:center; padding:2rem; box-sizing:border-box; background:radial-gradient(ellipse at 50% 0%, #1d1b3a 0%, #090a16 75%); font-family: system-ui, sans-serif; color:#fff">
        <div style="width:min(760px,92vw); aspect-ratio:16/10">
          <CompareSlider v-bind="args" v-model:position="pos">
            <template #before>
              <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" style="display:block; background:#e5e7eb">
                <defs><pattern id="cs-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="#9ca3af" stroke-width=".6"/></pattern></defs>
                <rect width="160" height="100" fill="#f3f4f6"/>
                <circle cx="124" cy="24" r="10" fill="none" stroke="#6b7280" stroke-width="1" stroke-dasharray="2 2"/>
                <path d="M0 70 L30 42 L52 60 L84 28 L120 62 L142 48 L160 60 V100 H0Z" fill="url(#cs-hatch)" stroke="#6b7280" stroke-width="1"/>
                <rect x="0" y="76" width="160" height="24" fill="none" stroke="#6b7280" stroke-width="1"/>
                <text x="6" y="10" font-size="6" font-family="monospace" fill="#6b7280">WIREFRAME</text>
              </svg>
            </template>
            <template #after>
              <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" style="display:block">
                <defs>
                  <linearGradient id="cs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1b4b"/><stop offset=".55" stop-color="#c026d3"/><stop offset="1" stop-color="#fb923c"/></linearGradient>
                  <linearGradient id="cs-m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c1d95"/><stop offset="1" stop-color="#1e1b4b"/></linearGradient>
                  <radialGradient id="cs-sun"><stop offset="0" stop-color="#fef08a"/><stop offset="1" stop-color="#fb923c" stop-opacity="0"/></radialGradient>
                </defs>
                <rect width="160" height="100" fill="url(#cs-sky)"/>
                <circle cx="124" cy="46" r="22" fill="url(#cs-sun)"/>
                <circle cx="124" cy="46" r="9" fill="#fef9c3"/>
                <path d="M0 70 L30 42 L52 60 L84 28 L120 62 L142 48 L160 60 V100 H0Z" fill="url(#cs-m1)"/>
                <path d="M0 84 L40 62 L80 82 L120 60 L160 80 V100 H0Z" fill="#0f0a2e"/>
                <text x="154" y="10" text-anchor="end" font-size="6" font-family="system-ui" font-weight="700" fill="#fff">FINAL</text>
              </svg>
            </template>
          </CompareSlider>
        </div>
      </div>`,
  }),
} satisfies Meta<typeof CompareSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const VerticalDayNight: Story = {
  args: {
    position: 40,
    orientation: 'vertical',
    label: 'Compare day and night',
  },
  render: (args) => ({
    components: { CompareSlider },
    setup() {
      const pos = ref(args.position)
      return { args, pos }
    },
    template: `
      <div style="min-height:520px; display:grid; place-items:center; padding:2rem; box-sizing:border-box; background:#0a0c14; font-family: system-ui, sans-serif">
        <div style="width:min(420px,90vw); height:420px">
          <CompareSlider v-bind="args" v-model:position="pos">
            <template #before>
              <div style="display:grid; place-items:center; background:linear-gradient(#38bdf8,#e0f2fe); color:#0c4a6e; font:800 2rem system-ui">☀️ DAY</div>
            </template>
            <template #after>
              <div style="display:grid; place-items:center; background:linear-gradient(#0b1026,#312e81); color:#c7d2fe; font:800 2rem system-ui">🌙 NIGHT</div>
            </template>
          </CompareSlider>
        </div>
      </div>`,
  }),
}
