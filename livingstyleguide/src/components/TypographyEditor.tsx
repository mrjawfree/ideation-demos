import type { TypographyToken } from '../types'

function uid() { return Math.random().toString(36).slice(2) }

const WEIGHTS = ['100', '200', '300', '400', '500', '600', '700', '800', '900']

interface Props {
  tokens: TypographyToken[]
  onChange: (tokens: TypographyToken[]) => void
}

export function TypographyEditor({ tokens, onChange }: Props) {
  const update = (id: string, patch: Partial<TypographyToken>) => {
    onChange(tokens.map(t => t.id === id ? { ...t, ...patch } : t))
  }
  const remove = (id: string) => onChange(tokens.filter(t => t.id !== id))
  const add = () => {
    onChange([...tokens, { id: uid(), name: 'New Style', fontFamily: 'Inter', fontSize: '16px', fontWeight: '400', lineHeight: '1.5', description: '' }])
  }

  return (
    <div className="token-list">
      {tokens.map(token => (
        <div key={token.id} className="token-row">
          <div className="token-row-header">
            <input
              value={token.name}
              onChange={e => update(token.id, { name: e.target.value })}
              placeholder="Style name"
              style={{ flex: 1, fontWeight: 600 }}
              aria-label="Style name"
            />
            <button
              className="btn-icon"
              onClick={() => remove(token.id)}
              aria-label={`Remove ${token.name}`}
              title="Remove"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="token-row-fields" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label htmlFor={`ff-${token.id}`}>Font Family</label>
              <input
                id={`ff-${token.id}`}
                value={token.fontFamily}
                onChange={e => update(token.id, { fontFamily: e.target.value })}
                placeholder="Inter"
              />
            </div>
            <div>
              <label htmlFor={`fs-${token.id}`}>Size</label>
              <input
                id={`fs-${token.id}`}
                value={token.fontSize}
                onChange={e => update(token.id, { fontSize: e.target.value })}
                placeholder="16px"
              />
            </div>
            <div>
              <label htmlFor={`fw-${token.id}`}>Weight</label>
              <select
                id={`fw-${token.id}`}
                value={token.fontWeight}
                onChange={e => update(token.id, { fontWeight: e.target.value })}
              >
                {WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`lh-${token.id}`}>Line Height</label>
              <input
                id={`lh-${token.id}`}
                value={token.lineHeight}
                onChange={e => update(token.id, { lineHeight: e.target.value })}
                placeholder="1.5"
              />
            </div>
          </div>
          <input
            value={token.description}
            onChange={e => update(token.id, { description: e.target.value })}
            placeholder="Usage notes…"
            aria-label={`Description for ${token.name}`}
            style={{ marginTop: 4 }}
          />
        </div>
      ))}
      <button className="add-token-btn" onClick={add} aria-label="Add typography style">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add style
      </button>
    </div>
  )
}
