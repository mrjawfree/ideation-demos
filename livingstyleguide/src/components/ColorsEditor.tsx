import type { ColorToken } from '../types'

function uid() { return Math.random().toString(36).slice(2) }

interface Props {
  colors: ColorToken[]
  onChange: (colors: ColorToken[]) => void
}

export function ColorsEditor({ colors, onChange }: Props) {
  const update = (id: string, patch: Partial<ColorToken>) => {
    onChange(colors.map(c => c.id === id ? { ...c, ...patch } : c))
  }
  const remove = (id: string) => onChange(colors.filter(c => c.id !== id))
  const add = () => {
    onChange([...colors, { id: uid(), name: 'New Color', value: '#6366f1', description: '' }])
  }

  return (
    <div className="token-list">
      {colors.map(color => (
        <div key={color.id} className="token-row">
          <div className="token-row-header">
            <div className="color-swatch-btn" style={{ background: color.value }} aria-label={`Color swatch: ${color.value}`}>
              <input
                type="color"
                value={color.value}
                onChange={e => update(color.id, { value: e.target.value })}
                aria-label={`Change color value for ${color.name}`}
              />
            </div>
            <input
              value={color.value}
              onChange={e => update(color.id, { value: e.target.value })}
              placeholder="#000000"
              style={{ fontFamily: 'var(--font-mono)', width: '90px', flexShrink: 0 }}
              aria-label="Hex value"
            />
            <input
              value={color.name}
              onChange={e => update(color.id, { name: e.target.value })}
              placeholder="Token name"
              aria-label="Token name"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button
              className="btn-icon remove-btn"
              onClick={() => remove(color.id)}
              aria-label={`Remove ${color.name}`}
              title="Remove"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <input
            value={color.description}
            onChange={e => update(color.id, { description: e.target.value })}
            placeholder="Describe usage…"
            aria-label={`Description for ${color.name}`}
          />
        </div>
      ))}
      <button className="add-token-btn" onClick={add} aria-label="Add color token">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add color
      </button>
    </div>
  )
}
