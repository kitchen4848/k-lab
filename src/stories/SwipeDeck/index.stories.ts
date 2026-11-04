import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { DefineComponent } from 'vue'
import SwipeDeckGeneric from './index.vue'

interface Place {
  name: string
  tag: string
  from: string
  to: string
  emoji: string
}

const places: Place[] = [
  { name: 'Kyoto', tag: 'Temples & tea', from: '#f472b6', to: '#7c3aed', emoji: '⛩️' },
  { name: 'Reykjavík', tag: 'Aurora season', from: '#22d3ee', to: '#4338ca', emoji: '🌌' },
  { name: 'Marrakech', tag: 'Spice markets', from: '#fb923c', to: '#be123c', emoji: '🕌' },
  { name: 'Patagonia', tag: 'Wild trails', from: '#4ade80', to: '#0e7490', emoji: '🏔️' },
  { name: 'Lisbon', tag: 'Golden trams', from: '#fde047', to: '#ea580c', emoji: '🚋' },
  { name: 'Hokkaido', tag: 'Powder days', from: '#bae6fd', to: '#6366f1', emoji: '❄️' },
]

// Storybook's Meta can't infer generic SFCs, so expose a Place-typed view of the component.
const SwipeDeck = SwipeDeckGeneric as unknown as DefineComponent<{
  items: Place[]
  threshold?: number
  depth?: number
  onSwipe?: (direction: 'left' | 'right', item: Place) => void
}>

const meta = {
  title: 'Basic/Swipe Deck',
  component: SwipeDeck,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    items: { control: 'object' },
    threshold: { control: { type: 'range', min: 40, max: 300, step: 5 } },
    depth: { control: { type: 'range', min: 1, max: 5, step: 1 } },
    onSwipe: { action: 'swipe' },
  },
  args: {
    items: places,
    threshold: 120,
    depth: 3,
  },
  render: (args) => ({
    components: { SwipeDeck },
    setup: () => ({ args }),
    template: `
      <div style="min-height:max(100vh, 620px); display:grid; place-items:center; padding:2rem; background:radial-gradient(ellipse at 50% 0%, #241a3d 0%, #0a0812 75%); font-family: system-ui, sans-serif; color:#fff">
        <SwipeDeck v-bind="args">
          <template #default="{ item }">
            <div :style="{ height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'1.5rem', boxSizing:'border-box', background:'linear-gradient(160deg,' + item.from + ',' + item.to + ')' }">
              <div style="font-size:5.5rem; line-height:1; margin-bottom:auto; padding-top:2.5rem; text-align:center; filter:drop-shadow(0 8px 16px rgba(0,0,0,.35))">{{ item.emoji }}</div>
              <h2 style="margin:0; font-size:2rem; text-shadow:0 2px 12px rgba(0,0,0,.35)">{{ item.name }}</h2>
              <p style="margin:.25rem 0 0; opacity:.9">{{ item.tag }}</p>
            </div>
          </template>
        </SwipeDeck>
      </div>`,
  }),
} satisfies Meta<typeof SwipeDeck>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TightStack: Story = {
  args: {
    items: [...places].reverse(),
    threshold: 80,
    depth: 5,
  },
}
