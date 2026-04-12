import type { SpacingToken } from '../types'

function uid() { return Math.random().toString(36).slice(2) }

interface Props {
  tokens: SpacingToken[]
  onChange: (tokens: SpacingToken[]) => void
}

export function SpacingEditor({ tokens, onChange }: Props) {
  const update = (id: string, patch: Partial<SpacingToken>) => {
    onChange(tokens.map(t => t.id === id ? { ...t, ...patch } : t))
  }
  const remove = (id: string) => onChange(tokens.filter(t => t.id !== id))
  const add = () => {
    onChange([...tokens, { id: uid(), name: 'custom', value: '20px', description: '' }])
  }

  return (
    <div className="token-list">
      {tokens.map(token => (
        <div key={token.id} className="token-row">
          <div className="token-row-header">
            <input
              value={token.name}
              onChange={e => update(token.id, { name: e.target.value })}
              placeholder="xs, sm, md…"
              style={{ width: '80px', fontFamily: 'var(--font-mono)', flexShrink: 0 }}
              aria-label="Spacing name"
            />
            <input
              value={token.value}
              onChange={e => update(token.id, { value: e.target.value })}
              placeholder="16px"
              style={{ width: '80px', fontFamily: 'var(--font-mono)', flexShrink: 0 }}
              aria-label="Spacing value"
            />
            <input
              value={token.description}
              onChange={e => update(token.id, { description: e.target.value })}
              placeholder="Usage…"
              style={{ flex: 1 }}
              aria-label={`Description for ${token.name}`}
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
        </div>
      ))}
      <button className="add-token-btn" onClick={add} aria-label="Add spacing token">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add spacing
      </button>
    </div>
  )
}
