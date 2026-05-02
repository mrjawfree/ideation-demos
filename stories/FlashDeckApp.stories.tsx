import type { Meta, StoryObj } from '@storybook/react'
import { useState, useMemo, useCallback } from 'react'

interface Card {
  term: string
  definition: string
}

type GridLayout = '2x3' | '3x4'

const CARDS_PER_PAGE: Record<GridLayout, number> = { '2x3': 6, '3x4': 12 }
const GRID_COLS: Record<GridLayout, number> = { '2x3': 2, '3x4': 3 }

const SAMPLE_DATA = `Photosynthesis\tProcess by which plants convert sunlight into glucose
Mitosis\tCell division producing two identical daughter cells
Osmosis\tMovement of water through a semi-permeable membrane
ATP\tAdenosine triphosphate — the cell's energy currency
Meiosis\tCell division that produces four haploid gamete cells
DNA\tDeoxyribonucleic acid — the molecule carrying genetic info`

function parseCards(raw: string): { cards: Card[]; error: string | null } {
  if (!raw.trim()) return { cards: [], error: null }
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const cards: Card[] = []
  const badLines: number[] = []
  lines.forEach((line, i) => {
    const tabIdx = line.indexOf('\t')
    const commaIdx = line.indexOf(',')
    const sep = tabIdx !== -1 ? tabIdx : commaIdx !== -1 ? commaIdx : -1
    if (sep === -1) { badLines.push(i + 1); return }
    const term = line.slice(0, sep).trim()
    const definition = line.slice(sep + 1).trim()
    if (!term || !definition) { badLines.push(i + 1); return }
    cards.push({ term, definition })
  })
  return {
    cards,
    error: badLines.length > 0 ? `Line${badLines.length > 1 ? 's' : ''} ${badLines.join(', ')}: needs a tab or comma between term and definition` : null,
  }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

export interface FlashDeckProps {
  initialData?: string
  layout?: GridLayout
  autoGenerate?: boolean
}

function FlashDeck({ initialData = '', layout: initialLayout = '2x3', autoGenerate = false }: FlashDeckProps) {
  const [raw, setRaw] = useState(initialData)
  const [layout, setLayout] = useState<GridLayout>(initialLayout)
  const [submitted, setSubmitted] = useState(autoGenerate && initialData.length > 0)

  const { cards, error } = useMemo(() => parseCards(raw), [raw])
  const perPage = CARDS_PER_PAGE[layout]
  const cols = GRID_COLS[layout]
  const pages = chunkArray(cards, perPage)

  const handleGenerate = useCallback(() => { if (cards.length > 0) setSubmitted(true) }, [cards])
  const handleReset = useCallback(() => setSubmitted(false), [])

  const styles = {
    root: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", background: '#f5f4f0', color: '#1a1a1a', padding: 24, borderRadius: 12, maxWidth: 800, fontSize: 15, lineHeight: 1.5 } as const,
    header: { marginBottom: 20 } as const,
    h1: { fontSize: 22, fontWeight: 700 as const, marginBottom: 4 },
    sub: { fontSize: 14, color: '#6b6b6b' },
    panel: { background: '#fff', border: '1px solid #e0ddd5', borderRadius: 8, padding: 20 } as const,
    textarea: { width: '100%', minHeight: 120, padding: 12, border: '1px solid #e0ddd5', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, resize: 'vertical' as const } as const,
    hint: { fontSize: 12, color: '#6b6b6b', marginTop: 6 },
    error: { fontSize: 13, color: '#d9534f', marginTop: 8 },
    controls: { display: 'flex', gap: 10, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' as const },
    btn: { padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500 as const, fontSize: 14 },
    btnPrimary: { background: '#2563eb', color: '#fff' },
    btnSecondary: { background: '#e0ddd5', color: '#1a1a1a' },
    cardGrid: { display: 'grid', gap: 10, marginTop: 12 } as const,
    flashcard: { background: '#fff', border: '1px solid #d1cfc8', borderRadius: 8, padding: 14 } as const,
    term: { fontWeight: 600 as const, fontSize: 14, marginBottom: 6 },
    def: { fontSize: 13, color: '#6b6b6b' },
  }

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 style={styles.h1}>FlashDeck</h1>
        <p style={styles.sub}>Paste your terms and definitions — get a print-ready flashcard sheet in seconds.</p>
      </div>

      {!submitted ? (
        <div style={styles.panel}>
          <h2 style={{ fontSize: 16, marginBottom: 10 }}>Your Data</h2>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="Paste tab-separated or comma-separated data..."
            style={styles.textarea}
            aria-label="Flashcard data input"
          />
          <p style={styles.hint}>One card per line. Separate term and definition with a tab or comma.</p>
          {error && <div style={styles.error} role="alert">{error}</div>}
          <div style={styles.controls}>
            <label style={{ fontSize: 13 }}>
              Layout:{' '}
              <select value={layout} onChange={(e) => setLayout(e.target.value as GridLayout)}>
                <option value="2x3">2 cols x 3 rows</option>
                <option value="3x4">3 cols x 4 rows</option>
              </select>
            </label>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleGenerate} disabled={cards.length === 0}>
              Generate
            </button>
            {cards.length > 0 && <span style={{ fontSize: 12, color: '#6b6b6b' }}>{cards.length} cards parsed</span>}
          </div>
        </div>
      ) : (
        <div style={styles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16 }}>Preview — {cards.length} cards · {pages.length} pages</h2>
            <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={handleReset}>Edit</button>
          </div>
          {pages.map((page, pi) => (
            <div key={pi}>
              {pages.length > 1 && <p style={{ fontSize: 11, color: '#6b6b6b', marginBottom: 6 }}>Page {pi + 1}</p>}
              <div style={{ ...styles.cardGrid, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {page.map((card, ci) => (
                  <div key={ci} style={styles.flashcard}>
                    <div style={styles.term}>{card.term}</div>
                    <div style={styles.def}>{card.definition}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const meta: Meta<typeof FlashDeck> = {
  title: 'FlashDeck/App',
  component: FlashDeck,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'surface' },
    docs: {
      description: {
        component: 'Paste tab- or comma-separated terms and definitions to generate a print-ready flashcard sheet. Supports 2x3 and 3x4 grid layouts.',
      },
    },
  },
  argTypes: {
    initialData: {
      control: 'text',
      description: 'Tab-separated term/definition input data',
    },
    layout: {
      control: 'select',
      options: ['2x3', '3x4'],
      description: 'Card grid layout',
    },
    autoGenerate: {
      control: 'boolean',
      description: 'Auto-generate cards on mount (skip input step)',
    },
  },
}

export default meta
type Story = StoryObj<typeof FlashDeck>

export const Default: Story = {
  args: {
    initialData: '',
    layout: '2x3',
    autoGenerate: false,
  },
}

export const WithSampleData: Story = {
  name: 'Pre-loaded Sample',
  args: {
    initialData: SAMPLE_DATA,
    layout: '2x3',
    autoGenerate: true,
  },
}

export const ThreeColumnLayout: Story = {
  name: '3x4 Grid Layout',
  args: {
    initialData: SAMPLE_DATA,
    layout: '3x4',
    autoGenerate: true,
  },
}
