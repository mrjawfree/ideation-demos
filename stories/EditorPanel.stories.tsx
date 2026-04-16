import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EditorPanel } from '../livingstyleguide/src/components/EditorPanel'
import { DEFAULT_GUIDE } from '../livingstyleguide/src/defaults'
import type { ActiveSection } from '../livingstyleguide/src/types'

const meta: Meta<typeof EditorPanel> = {
  title: 'LivingStyleGuide/EditorPanel',
  component: EditorPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Tabbed editor panel for managing color, typography, spacing, and component tokens. Renders as the left sidebar of the style guide app.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof EditorPanel>

export const ColorsTab: Story = {
  name: 'Colors tab',
  render: () => {
    const [guide, setGuide] = useState(DEFAULT_GUIDE)
    const [activeSection, setActiveSection] = useState<ActiveSection>('colors')
    return (
      <div style={{ width: 340, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <EditorPanel
          guide={guide}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onChange={setGuide}
        />
      </div>
    )
  },
}

export const TypographyTab: Story = {
  name: 'Typography tab',
  render: () => {
    const [guide, setGuide] = useState(DEFAULT_GUIDE)
    const [activeSection, setActiveSection] = useState<ActiveSection>('typography')
    return (
      <div style={{ width: 340, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <EditorPanel
          guide={guide}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onChange={setGuide}
        />
      </div>
    )
  },
}

export const SpacingTab: Story = {
  name: 'Spacing tab',
  render: () => {
    const [guide, setGuide] = useState(DEFAULT_GUIDE)
    const [activeSection, setActiveSection] = useState<ActiveSection>('spacing')
    return (
      <div style={{ width: 340, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <EditorPanel
          guide={guide}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onChange={setGuide}
        />
      </div>
    )
  },
}

export const ComponentsTab: Story = {
  name: 'Components tab',
  render: () => {
    const [guide, setGuide] = useState(DEFAULT_GUIDE)
    const [activeSection, setActiveSection] = useState<ActiveSection>('components')
    return (
      <div style={{ width: 340, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <EditorPanel
          guide={guide}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onChange={setGuide}
        />
      </div>
    )
  },
}
