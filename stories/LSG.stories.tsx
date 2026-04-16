import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EditorPanel } from '../livingstyleguide/src/components/EditorPanel'
import { PreviewPanel } from '../livingstyleguide/src/components/PreviewPanel'
import { DEFAULT_GUIDE } from '../livingstyleguide/src/defaults'
import type { ActiveSection, StyleGuide } from '../livingstyleguide/src/types'

// ── Full app shell ─────────────────────────────────────────────────────────
function LSGAppShell({ initialSection = 'colors' as ActiveSection }) {
  const [guide, setGuide] = useState<StyleGuide>(DEFAULT_GUIDE)
  const [activeSection, setActiveSection] = useState<ActiveSection>(initialSection)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '340px 1fr',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg, #0f0f11)',
    }}>
      <EditorPanel
        guide={guide}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onChange={setGuide}
      />
      <PreviewPanel
        guide={guide}
        activeSection={activeSection}
        fullWidth={false}
      />
    </div>
  )
}

// ── Meta ───────────────────────────────────────────────────────────────────
const meta: Meta = {
  title: 'LivingStyleGuide/AppShell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Full LSG app — editor panel and preview panel side by side. Edit tokens on the left; preview updates live on the right.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const ColorsView: Story = {
  name: 'Full app — Colors view',
  render: () => <LSGAppShell initialSection="colors" />,
}

export const TypographyView: Story = {
  name: 'Full app — Typography view',
  render: () => <LSGAppShell initialSection="typography" />,
}

export const SpacingView: Story = {
  name: 'Full app — Spacing view',
  render: () => <LSGAppShell initialSection="spacing" />,
}

export const ComponentsView: Story = {
  name: 'Full app — Components view',
  render: () => <LSGAppShell initialSection="components" />,
}

export const PreviewOnly: Story = {
  name: 'Preview panel — all sections',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ height: '100vh', overflow: 'auto', background: 'var(--bg, #0f0f11)' }}>
      <PreviewPanel
        guide={DEFAULT_GUIDE}
        activeSection="colors"
        fullWidth={true}
      />
    </div>
  ),
}
