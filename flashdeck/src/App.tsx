import { useState, useMemo, useCallback } from 'react'
import './index.css'

interface Card {
  term: string
  definition: string
}

type GridLayout = '2x3' | '3x4'

const CARDS_PER_PAGE: Record<GridLayout, number> = {
  '2x3': 6,
  '3x4': 12,
}

const GRID_COLS: Record<GridLayout, string> = {
  '2x3': 'cols-2',
  '3x4': 'cols-3',
}

const SAMPLE_DATA = `Photosynthesis\tProcess by which plants convert sunlight into glucose
Mitosis\tCell division producing two identical daughter cells
Osmosis\tMovement of water through a semi-permeable membrane
ATP\tAdenosine triphosphate — the cell's energy currency
Meiosis\tCell division that produces four haploid gamete cells
DNA\tDeoxyribonucleic acid — the molecule carrying genetic info`

function parseCards(raw: string): { cards: Card[]; error: string | null } {
  if (!raw.trim()) return { cards: [], error: null }

  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)

  const cards: Card[] = []
  const badLines: number[] = []

  lines.forEach((line, i) => {
    // Support tab or comma as delimiter
    const tabIdx = line.indexOf('\t')
    const commaIdx = line.indexOf(',')
    const sep = tabIdx !== -1 ? tabIdx : commaIdx !== -1 ? commaIdx : -1

    if (sep === -1) {
      badLines.push(i + 1)
      return
    }

    const term = line.slice(0, sep).trim()
    const definition = line.slice(sep + 1).trim()

    if (!term || !definition) {
      badLines.push(i + 1)
      return
    }

    cards.push({ term, definition })
  })

  if (badLines.length > 0) {
    return {
      cards,
      error: `Line${badLines.length > 1 ? 's' : ''} ${badLines.join(', ')}: needs a tab or comma between term and definition`,
    }
  }

  return { cards, error: null }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export default function App() {
  const [raw, setRaw] = useState('')
  const [layout, setLayout] = useState<GridLayout>('2x3')
  const [submitted, setSubmitted] = useState(false)

  const { cards, error } = useMemo(() => parseCards(raw), [raw])

  const handleGenerate = useCallback(() => {
    if (cards.length > 0) setSubmitted(true)
  }, [cards])

  const handleReset = useCallback(() => {
    setSubmitted(false)
  }, [])

  const handleLoadSample = useCallback(() => {
    setRaw(SAMPLE_DATA)
    setSubmitted(false)
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const perPage = CARDS_PER_PAGE[layout]
  const colClass = GRID_COLS[layout]
  const pages = chunkArray(cards, perPage)

  return (
    <>
      {/* ── SCREEN UI ── */}
      <div className="app no-print">
        <div className="header">
          <h1>FlashDeck</h1>
          <p>Paste your terms and definitions — get a print-ready flashcard sheet in seconds.</p>
        </div>

        {!submitted ? (
          <div className="panel">
            <h2>Your Data</h2>
            <textarea
              value={raw}
              onChange={e => setRaw(e.target.value)}
              placeholder={`Paste tab-separated or comma-separated data:\nPhotosynthesis\tConverts sunlight into glucose\nMitosis\tCell division producing two identical cells`}
              aria-label="Flashcard data input"
            />
            <p className="hint">One card per line. Separate term and definition with a tab or comma.</p>
            {error && <div className="error" role="alert">{error}</div>}

            <div className="controls">
              <label htmlFor="layout-select">
                Layout:
                <select
                  id="layout-select"
                  value={layout}
                  onChange={e => setLayout(e.target.value as GridLayout)}
                >
                  <option value="2x3">2 columns × 3 rows (6/page)</option>
                  <option value="3x4">3 columns × 4 rows (12/page)</option>
                </select>
              </label>

              <button
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={cards.length === 0}
                aria-label="Generate flashcards"
              >
                Generate →
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleLoadSample}
                aria-label="Load sample data"
              >
                Load sample
              </button>

              {cards.length > 0 && (
                <span className="card-count">{cards.length} card{cards.length !== 1 ? 's' : ''} parsed</span>
              )}
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="preview-header">
              <h2>Preview — {cards.length} card{cards.length !== 1 ? 's' : ''} · {pages.length} page{pages.length !== 1 ? 's' : ''}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={handleReset} aria-label="Edit data">
                  ← Edit
                </button>
                <button className="btn btn-print" onClick={handlePrint} aria-label="Print flashcards">
                  Print
                </button>
              </div>
            </div>

            {cards.length === 0 ? (
              <div className="empty-state">No cards to display. Go back and add some data.</div>
            ) : (
              pages.map((page, pi) => (
                <div key={pi} style={{ marginBottom: 24 }}>
                  {pages.length > 1 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                      Page {pi + 1}
                    </p>
                  )}
                  <div className={`card-grid ${colClass}`}>
                    {page.map((card, ci) => (
                      <div key={ci} className="flashcard">
                        <div className="flashcard-term" title={card.term}>{card.term}</div>
                        <div className="flashcard-def">{card.definition}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── PRINT-ONLY DOM ── */}
      {submitted && cards.length > 0 && (
        <div className="print-area">
          {pages.map((page, pi) => (
            <div key={pi} className="print-page">
              <p className="print-page-title">FlashDeck — Page {pi + 1} of {pages.length}</p>
              <div className={`print-grid ${colClass}`}>
                {page.map((card, ci) => (
                  <div key={ci} className="print-card">
                    <div className="print-card-term">{card.term}</div>
                    <div className="print-card-def">{card.definition}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
