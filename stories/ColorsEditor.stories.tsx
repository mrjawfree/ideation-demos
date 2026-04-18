import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { ColorsEditor } from '../livingstyleguide/src/components/ColorsEditor'
import type { ColorToken } from '../livingstyleguide/src/types'

const meta: Meta<typeof ColorsEditor> = {
  title: 'LivingStyleGuide/ColorsEditor',
  component: ColorsEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Color token editor. Add, remove, and update named color tokens with hex values and usage descriptions.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'onChange' },
  },
}

export default meta
type Story = StoryObj<typeof ColorsEditor>

const SAMPLE_COLORS: ColorToken[] = [
  { id: 'c1', name: 'Primary', value: '#6366f1', description: 'Brand primary — CTAs, links, focus rings' },
  { id: 'c2', name: 'Primary Light', value: '#818cf8', description: 'Hover states, highlights' },
  { id: 'c3', name: 'Background', value: '#0f0f11', description: 'App background' },
  { id: 'c4', name: 'Surface', value: '#18181b', description: 'Cards, panels' },
  { id: 'c5', name: 'Success', value: '#22c55e', description: 'Positive states' },
  { id: 'c6', name: 'Danger', value: '#ef4444', description: 'Errors, destructive actions' },
]

export const Default: Story = {
  render: () => {
    const [colors, setColors] = useState<ColorToken[]>(SAMPLE_COLORS)
    return <ColorsEditor colors={colors} onChange={setColors} />
  },
}

export const Empty: Story = {
  render: () => {
    const [colors, setColors] = useState<ColorToken[]>([])
    return <ColorsEditor colors={colors} onChange={setColors} />
  },
}

export const SingleToken: Story = {
  render: () => {
    const [colors, setColors] = useState<ColorToken[]>([
      { id: 'c1', name: 'Brand', value: '#6366f1', description: 'Primary brand color' },
    ])
    return <ColorsEditor colors={colors} onChange={setColors} />
  },
}

export const ReadOnly: Story = {
  name: 'Non-interactive (action logged)',
  args: {
    colors: SAMPLE_COLORS,
    onChange: fn(),
  },
}
