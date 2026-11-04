import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MatrixRain from './index.vue'

const meta = {
  title: 'Basic/Matrix Rain',
  component: MatrixRain,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    color: { control: 'color' },
    fontSize: { control: { type: 'range', min: 8, max: 40, step: 1 } },
    speed: { control: { type: 'range', min: 0.2, max: 4, step: 0.1 } },
    density: { control: { type: 'range', min: 0.1, max: 1, step: 0.05 } },
    characters: { control: 'text' },
  },
  args: {
    color: '#00ff7f',
    fontSize: 16,
    speed: 1,
    density: 0.9,
    characters: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789',
  },
  render: (args) => ({
    components: { MatrixRain },
    setup: () => ({ args }),
    template: `
      <MatrixRain v-bind="args" style="height: 100vh; min-height: 420px">
        <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center; font-family: ui-monospace, Menlo, monospace">
          <h1 style="margin:0; padding:.2em .5em; font-size:clamp(2rem,6vw,4.5rem); letter-spacing:.08em; background:rgba(0,0,0,.55); border:1px solid rgba(0,255,127,.4); border-radius:8px; text-shadow:0 0 18px rgba(0,255,127,.8)">WAKE UP, NEO</h1>
          <p style="margin:0; opacity:.7">The Matrix has you.</p>
        </div>
      </MatrixRain>`,
  }),
} satisfies Meta<typeof MatrixRain>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const BinaryCrimson: Story = {
  args: {
    color: '#ff3355',
    fontSize: 20,
    speed: 1.6,
    density: 0.6,
    characters: '01',
  },
}
