import type { ComponentDoc } from '../types'

function uid() { return Math.random().toString(36).slice(2) }

const VARIANTS: ComponentDoc['variant'][] = ['button', 'input', 'badge', 'card', 'custom']

interface Props {
  components: ComponentDoc[]
  onChange: (components: ComponentDoc[]) => void
}

export function ComponentsEditor({ components, onChange }: Props) {
  const update = (id: string, patch: Partial<ComponentDoc>) => {
    onChange(components.map(c => c.id === id ? { ...c, ...patch } : c))
  }
  const remove = (id: string) => onChange(components.filter(c => c.id !== id))
  const add = () => {
    onChange([...components, { id: uid(), name: 'New Component', description: '', usage: '', variant: 'custom' }])
  }

  return (
    <div className="token-list">
      {components.map(comp => (
        <div key={comp.id} className="token-row">
          <div className="token-row-header">
            <input
              value={comp.name}
              onChange={e => update(comp.id, { name: e.target.value })}
              placeholder="Component name"
              style={{ flex: 1, fontWeight: 600 }}
              aria-label="Component name"
            />
            <button
              className="btn-icon"
              onClick={() => remove(comp.id)}
              aria-label={`Remove ${comp.name}`}
              title="Remove"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="token-row-fields">
            <div>
              <label htmlFor={`variant-${comp.id}`}>Preview type</label>
              <select
                id={`variant-${comp.id}`}
                value={comp.variant}
                onChange={e => update(comp.id, { variant: e.target.value as ComponentDoc['variant'] })}
              >
                {VARIANTS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`desc-${comp.id}`}>Description</label>
              <textarea
                id={`desc-${comp.id}`}
                value={comp.description}
                onChange={e => update(comp.id, { description: e.target.value })}
                placeholder="What it does and when to use it…"
                style={{ resize: 'vertical', minHeight: '56px' }}
              />
            </div>
            <div>
              <label htmlFor={`usage-${comp.id}`}>Usage examples</label>
              <input
                id={`usage-${comp.id}`}
                value={comp.usage}
                onChange={e => update(comp.id, { usage: e.target.value })}
                placeholder='"Save changes", "Submit form"'
              />
            </div>
          </div>
        </div>
      ))}
      <button className="add-token-btn" onClick={add} aria-label="Add component">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add component
      </button>
    </div>
  )
}
