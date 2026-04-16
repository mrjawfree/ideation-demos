import type { Meta, StoryObj } from '@storybook/react'
import { PreviewPanel } from '../livingstyleguide/src/components/PreviewPanel'
import { DEFAULT_GUIDE } from '../livingstyleguide/src/defaults'

const meta: Meta<typeof PreviewPanel> = {
  title: 'LivingStyleGuide/PreviewPanel',
  component: PreviewPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Read-only style guide preview. Renders colors, typography, spacing, and components from a StyleGuide object. Supports print mode.',
      },
    },
  },
  argTypes: {
    activeSection: {
      control: 'select',
      options: ['colors', 'typography', 'spacing', 'components'],
    },
    fullWidth: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof PreviewPanel>

export const AllSections: Story = {
  name: 'All sections (full width)',
  args: {
    guide: DEFAULT_GUIDE,
    activeSection: 'colors',
    fullWidth: true,
  },
}

export const ColorsSection: Story = {
  name: 'Colors section',
  args: {
    guide: DEFAULT_GUIDE,
    activeSection: 'colors',
    fullWidth: false,
  },
}

export const TypographySection: Story = {
  name: 'Typography section',
  args: {
    guide: DEFAULT_GUIDE,
    activeSection: 'typography',
    fullWidth: false,
  },
}

export const SpacingSection: Story = {
  name: 'Spacing section',
  args: {
    guide: DEFAULT_GUIDE,
    activeSection: 'spacing',
    fullWidth: false,
  },
}

export const ComponentsSection: Story = {
  name: 'Components section',
  args: {
    guide: DEFAULT_GUIDE,
    activeSection: 'components',
    fullWidth: false,
  },
}

export const EmptyGuide: Story = {
  name: 'Empty style guide',
  args: {
    guide: {
      name: 'Empty Design System',
      description: '',
      colors: [],
      typography: [],
      spacing: [],
      components: [],
    },
    activeSection: 'colors',
    fullWidth: true,
  },
}
