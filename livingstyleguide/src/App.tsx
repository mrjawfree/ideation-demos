import { useState, useEffect, useCallback } from 'react'
import type { StyleGuide, ActiveSection } from './types'
import { DEFAULT_GUIDE } from './defaults'
import { EditorPanel } from './components/EditorPanel'
import { PreviewPanel } from './components/PreviewPanel'
import './App.css'

const STORAGE_KEY = 'styleguide_v1'

function loadGuide(): StyleGuide {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as StyleGuide
  } catch {
    /* ignore */
  }
  return DEFAULT_GUIDE
}

export default function App() {
  const [guide, setGuide] = useState<StyleGuide>(loadGuide)
  const [activeSection, setActiveSection] = useState<ActiveSection>('colors')
  const [previewMode, setPreviewMode] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = useCallback((g: StyleGuide) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(g))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save(guide)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [guide, save])

  const update = (g: StyleGuide) => {
    setGuide(g)
    save(g)
  }

  return (
    <div className="app-shell">
      <header className="app-header no-print" role="banner">
        <div className="header-left">
          <span className="header-logo" aria-label="StyleGuide">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#6366f1"/>
              <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#818cf8" opacity="0.6"/>
              <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#818cf8" opacity="0.6"/>
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#6366f1" opacity="0.35"/>
            </svg>
          </span>
          <input
            className="guide-name-input"
            value={guide.name}
            onChange={e => update({ ...guide, name: e.target.value })}
            aria-label="Style guide name"
            placeholder="My Design System"
          />
        </div>
        <div className="header-right">
          {saved && <span className="save-indicator" role="status" aria-live="polite">Saved</span>}
          <button
            className={`btn ${previewMode ? 'btn-primary' : 'btn-ghost'} no-print`}
            onClick={() => setPreviewMode(v => !v)}
            aria-pressed={previewMode}
          >
            {previewMode ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.3"/></svg>
                Preview
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.3"/></svg>
                Preview
              </>
            )}
          </button>
          <button
            className="btn btn-ghost no-print"
            onClick={() => window.print()}
            aria-label="Print or export style guide"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="4" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M4 4V2h6v2" stroke="currentColor" strokeWidth="1.3"/><rect x="3.5" y="7" width="7" height="1" rx="0.5" fill="currentColor"/><rect x="3.5" y="9.5" width="5" height="1" rx="0.5" fill="currentColor"/></svg>
            Print / PDF
          </button>
          <button
            className="btn btn-ghost no-print"
            onClick={() => {
              if (confirm('Reset to default style guide? Your changes will be lost.')) {
                setGuide(DEFAULT_GUIDE)
                localStorage.removeItem(STORAGE_KEY)
              }
            }}
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
            onChange={update}
          />
        )}
        <PreviewPanel guide={guide} activeSection={activeSection} fullWidth={previewMode} />
      </main>
    </div>
  )
}
