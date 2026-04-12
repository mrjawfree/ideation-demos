import type { StyleGuide, ActiveSection, ComponentDoc } from '../types'

interface Props {
  guide: StyleGuide
  activeSection: ActiveSection
  fullWidth?: boolean
}

function parsePixels(val: string): number {
  const n = parseFloat(val)
  return isNaN(n) ? 0 : n
}

function ComponentPreview({ variant, name }: { variant: ComponentDoc['variant']; name: string }) {
  switch (variant) {
    case 'button':
      return (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="demo-btn-primary">{name.replace(/button\s*[—–-]?\s*/i, '') || 'Button'}</span>
          <span className="demo-btn-ghost">{name.replace(/button\s*[—–-]?\s*/i, '') || 'Button'}</span>
        </div>
      )
    case 'input':
      return (
        <div className="demo-input-wrap">
          <span className="demo-label">Email address</span>
          <input className="demo-input" type="email" defaultValue="hello@example.com" readOnly aria-label="Demo input" />
        </div>
      )
    case 'badge':
      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="demo-badge demo-badge-indigo">Active</span>
          <span className="demo-badge demo-badge-green">Published</span>
          <span className="demo-badge demo-badge-orange">Beta</span>
        </div>
      )
    case 'card':
      return (
        <div className="demo-card" role="article">
          <p className="demo-card-title">Card title</p>
          <p className="demo-card-body">A contained surface for grouping related content with consistent padding and border treatment.</p>
        </div>
      )
    default:
      return (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Custom component — add your preview here
        </span>
      )
  }
}

export function PreviewPanel({ guide, activeSection, fullWidth }: Props) {
  const allSections = fullWidth

  return (
    <section
      className={`preview-panel${fullWidth ? ' full-width' : ''}`}
      aria-label="Style guide preview"
    >
      <header className="preview-guide-header">
        <h1 className="preview-guide-title">{guide.name || 'My Design System'}</h1>
        {guide.description && (
          <p className="preview-guide-desc">{guide.description}</p>
        )}
      </header>

      {/* Colors */}
      {(allSections || activeSection === 'colors') && guide.colors.length > 0 && (
        <section className="preview-section" aria-labelledby="colors-heading">
          <h2 className="preview-section-title" id="colors-heading">Colors</h2>
          <div className="color-grid">
            {guide.colors.map(color => (
              <div key={color.id} className="color-card">
                <div className="color-swatch" style={{ background: color.value }} role="img" aria-label={`${color.name}: ${color.value}`} />
                <div className="color-meta">
                  <p className="color-name">{color.name}</p>
                  <p className="color-value">{color.value}</p>
                  {color.description && <p className="color-desc">{color.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Typography */}
      {(allSections || activeSection === 'typography') && guide.typography.length > 0 && (
        <section className="preview-section" aria-labelledby="type-heading">
          <h2 className="preview-section-title" id="type-heading">Typography</h2>
          <div className="type-list" role="list">
            {guide.typography.map(token => (
              <div key={token.id} className="type-row" role="listitem">
                <div className="type-meta">
                  <span className="type-token-name">{token.name}</span>
                  <span className="type-spec">
                    {token.fontFamily} · {token.fontSize} · {token.fontWeight}<br />
                    line-height {token.lineHeight}
                  </span>
                  {token.description && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {token.description}
                    </span>
                  )}
                </div>
                <div
                  className="type-sample"
                  style={{
                    fontFamily: token.fontFamily,
                    fontSize: token.fontSize,
                    fontWeight: token.fontWeight,
                    lineHeight: token.lineHeight,
                  }}
                  aria-label={`Typography sample for ${token.name}`}
                >
                  The quick brown fox
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Spacing */}
      {(allSections || activeSection === 'spacing') && guide.spacing.length > 0 && (
        <section className="preview-section" aria-labelledby="spacing-heading">
          <h2 className="preview-section-title" id="spacing-heading">Spacing</h2>
          <div className="spacing-list" role="list">
            {guide.spacing.map(token => {
              const px = parsePixels(token.value)
              const maxPx = Math.max(...guide.spacing.map(s => parsePixels(s.value)), 1)
              const barWidth = Math.max(4, Math.round((px / maxPx) * 200))
              return (
                <div key={token.id} className="spacing-row" role="listitem">
                  <span className="spacing-name">{token.name}</span>
                  <span className="spacing-value">{token.value}</span>
                  <div className="spacing-bar-wrap">
                    <div
                      className="spacing-bar"
                      style={{ width: barWidth }}
                      role="img"
                      aria-label={`${token.name}: ${token.value}`}
                    />
                    {token.description && <span className="spacing-desc">{token.description}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Components */}
      {(allSections || activeSection === 'components') && guide.components.length > 0 && (
        <section className="preview-section" aria-labelledby="comp-heading">
          <h2 className="preview-section-title" id="comp-heading">Components</h2>
          <div className="component-list">
            {guide.components.map(comp => (
              <div key={comp.id} className="component-card">
                <div className="component-preview" aria-label={`${comp.name} preview`}>
                  <ComponentPreview variant={comp.variant} name={comp.name} />
                </div>
                <div className="component-info">
                  <p className="component-name">{comp.name}</p>
                  {comp.description && <p className="component-desc">{comp.description}</p>}
                  {comp.usage && (
                    <>
                      <p className="component-usage-label">When to use</p>
                      <p className="component-usage">{comp.usage}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {guide.colors.length === 0 && guide.typography.length === 0 && guide.spacing.length === 0 && guide.components.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>Your style guide is empty</p>
          <p style={{ fontSize: 13 }}>Add colors, typography, spacing, and components in the editor panel.</p>
        </div>
      )}
    </section>
  )
}
