import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import type { StyleGuide, ActiveSection } from '../livingstyleguide/src/types'
import { DEFAULT_GUIDE } from '../livingstyleguide/src/defaults'
import { EditorPanel } from '../livingstyleguide/src/components/EditorPanel'
import { PreviewPanel } from '../livingstyleguide/src/components/PreviewPanel'

interface LSGAppProps {
  initialGuide?: StyleGuide
  initialSection?: ActiveSection
  previewOnly?: boolean
}

function LSGApp({
  initialGuide = DEFAULT_GUIDE,
  initialSection = 'colors',
  previewOnly = false,
}: LSGAppProps) {
  const [guide, setGuide] = useState<StyleGuide>(initialGuide)
  const [activeSection, setActiveSection] = useState<ActiveSection>(initialSection)
  const [previewMode, setPreviewMode] = useState(previewOnly)

  return (
    <div className="app-shell">
      <header className="app-header" role="banner">
        <div className="header-left">
          <span className="header-logo" aria-label="StyleGuide">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#6366f1" />
              <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#818cf8" opacity="0.6" />
              <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#818cf8" opacity="0.6" />
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#6366f1" opacity="0.35" />
            </svg>
          </span>
          <input
            className="guide-name-input"
            value={guide.name}
            onChange={(e) => setGuide({ ...guide, name: e.target.value })}
            aria-label="Style guide name"
            placeholder="My Design System"
          />
        </div>
        <div className="header-right">
          <button
            className={`btn ${previewMode ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setPreviewMode((v) => !v)}
            aria-pressed={previewMode}
          >
            Preview
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setGuide(DEFAULT_GUIDE)}
            aria-label="Reset to defaults"
          >
            Reset
          </button>
        </div>
      </header>

      <main className={`app-main ${previewMode ? 'preview-only' : ''}`}>
        {!previewMode && (
          <EditorPanel
            guide={guide}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onChange={setGuide}
          />
        )}
        <PreviewPanel guide={guide} activeSection={activeSection} fullWidth={previewMode} />
      </main>
    </div>
  )
}

const meta: Meta<typeof LSGApp> = {
  title: 'LSG/StyleGuideApp',
  component: LSGApp,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Living Style Guide — a full design-system editor with live preview. Edit colors, typography, spacing, and components with instant visual feedback.',
      },
    },
  },
  argTypes: {
    initialSection: {
      control: 'select',
      options: ['colors', 'typography', 'spacing', 'components'],
      description: 'Default editor section to show',
    },
    previewOnly: {
      control: 'boolean',
      description: 'Start in preview-only mode (hides editor panel)',
    },
  },
}

export default meta
type Story = StoryObj<typeof LSGApp>

export const Default: Story = {
  args: {
    initialSection: 'colors',
    previewOnly: false,
  },
}

export const TypographySection: Story = {
  name: 'Typography Editor',
  args: {
    initialSection: 'typography',
    previewOnly: false,
  },
}

export const PreviewOnly: Story = {
  name: 'Preview Mode',
  args: {
    previewOnly: true,
  },
}
