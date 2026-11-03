import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { action } from 'storybook/actions'
import MagnifyDock from './index.vue'
import type { DockItem } from './index.vue'

const apps: DockItem[] = [
  { label: 'Finder', icon: '😀', color: 'linear-gradient(160deg,#38bdf8,#2563eb)' },
  { label: 'Messages', icon: '💬', color: 'linear-gradient(160deg,#4ade80,#16a34a)' },
  { label: 'Photos', icon: '🌸', color: 'linear-gradient(160deg,#fda4af,#f472b6)' },
  { label: 'Music', icon: '🎵', color: 'linear-gradient(160deg,#fb7185,#e11d48)' },
  { label: 'Maps', icon: '🗺️', color: 'linear-gradient(160deg,#a3e635,#0ea5e9)' },
  { label: 'Notes', icon: '📝', color: 'linear-gradient(160deg,#fde047,#f59e0b)' },
  { label: 'Terminal', icon: '⌨️', color: 'linear-gradient(160deg,#475569,#0f172a)' },
  { label: 'Settings', icon: '⚙️', color: 'linear-gradient(160deg,#cbd5e1,#64748b)' },
]

const meta = {
  title: 'Basic/Magnify Dock',
  component: MagnifyDock,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    baseSize: { control: { type: 'range', min: 32, max: 80, step: 2 } },
    magnification: { control: { type: 'range', min: 1, max: 3, step: 0.05 } },
    distance: { control: { type: 'range', min: 60, max: 400, step: 10 } },
    onSelect: { action: 'select' },
  },
  args: {
    items: apps,
    baseSize: 52,
    magnification: 1.9,
    distance: 140,
    onSelect: action('select'),
  },
  render: (args) => ({
    components: { MagnifyDock },
    setup: () => ({ args }),
    template: `
      <div style="min-height:420px; display:flex; align-items:flex-end; justify-content:center; padding:40px; background:radial-gradient(circle at 30% 20%, #7c3aed, transparent 50%), radial-gradient(circle at 80% 70%, #0ea5e9, transparent 50%), #0b1020">
        <MagnifyDock v-bind="args" />
      </div>`,
  }),
} satisfies Meta<typeof MagnifyDock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CompactSubtle: Story = {
  args: {
    items: apps.slice(0, 5),
    baseSize: 40,
    magnification: 1.5,
    distance: 90,
  },
}
