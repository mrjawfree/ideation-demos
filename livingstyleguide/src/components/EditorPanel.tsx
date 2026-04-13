import type { StyleGuide, ActiveSection } from '../types'
import { ColorsEditor } from './ColorsEditor'
import { TypographyEditor } from './TypographyEditor'
import { SpacingEditor } from './SpacingEditor'
import { ComponentsEditor } from './ComponentsEditor'

interface Props {
  guide: StyleGuide
  activeSection: ActiveSection
  onSectionChange: (s: ActiveSection) => void
  onChange: (g: StyleGuide) => void
}

const SECTIONS: { id: ActiveSection; label: string }[] = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Type' },
  { id: 'spacing', label: 'Space' },
  { id: 'components', label: 'Comp.' },
]

export function EditorPanel({ guide, activeSection, onSectionChange, onChange }: Props) {
  return (
    <aside className="editor-panel no-print" aria-label="Style guide editor">
      <nav className="editor-nav" role="tablist" aria-label="Editor sections">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            role="tab"
            aria-selected={activeSection === s.id}
            aria-controls={`panel-${s.id}`}
            className={`editor-nav-btn ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => onSectionChange(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="editor-body" id={`panel-${activeSection}`} role="tabpanel">
        {activeSection === 'colors' && (
          <>
            <p className="section-label">Color Tokens</p>
            <ColorsEditor
              colors={guide.colors}
              onChange={colors => onChange({ ...guide, colors })}
            />
          </>
        )}
        {activeSection === 'typography' && (
          <>
            <p className="section-label">Typography Scale</p>
            <TypographyEditor
              tokens={guide.typography}
              onChange={typography => onChange({ ...guide, typography })}
            />
          </>
        )}
        {activeSection === 'spacing' && (
          <>
            <p className="section-label">Spacing Scale</p>
            <SpacingEditor
              tokens={guide.spacing}
              onChange={spacing => onChange({ ...guide, spacing })}
            />
          </>
        )}
        {activeSection === 'components' && (
          <>
            <p className="section-label">Components</p>
            <ComponentsEditor
              components={guide.components}
              onChange={components => onChange({ ...guide, components })}
            />
          </>
        )}
      </div>
    </aside>
  )
}
