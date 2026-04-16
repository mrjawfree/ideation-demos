import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import '../flashdeck/src/index.css'

// ── Types ──────────────────────────────────────────────────────────────────
interface FlashcardProps {
  term: string
  definition: string
  revealed?: boolean
}

// ── Flashcard component (extracted from FlashDeck app) ─────────────────────
function Flashcard({ term, definition, revealed = false }: FlashcardProps) {
  return (
    <div className="flashcard" role="article" aria-label={`Flashcard: ${term}`}>
      <div className="flashcard-term">{term}</div>
      {revealed && <div className="flashcard-def">{definition}</div>}
    </div>
  )
}

// ── Flip card (interactive variant) ───────────────────────────────────────
function FlipCard({ term, definition }: { term: string; definition: string }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        className="flashcard"
        role="button"
        tabIndex={0}
        aria-label={flipped ? `Definition: ${definition}` : `Term: ${term} — click to reveal`}
        onClick={() => setFlipped(f => !f)}
        onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? setFlipped(f => !f) : undefined}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {flipped ? (
          <>
            <div className="flashcard-term" style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>{term}</div>
            <div className="flashcard-def">{definition}</div>
          </>
        ) : (
          <div className="flashcard-term">{term}</div>
        )}
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted, #6b6b6b)' }}>
        {flipped ? 'Click to flip back' : 'Click (or Enter) to reveal definition'}
      </p>
    </div>
  )
}

// ── Card Grid (multi-card layout, mirrors print sheet) ─────────────────────
interface CardGridProps {
  cards: Array<{ term: string; definition: string }>
  layout: '2x3' | '3x4'
}

function CardGrid({ cards, layout }: CardGridProps) {
  const cols = layout === '2x3' ? 'cols-2' : 'cols-3'
  return (
    <div className={`card-grid ${cols}`}>
      {cards.map((card, i) => (
        <div key={i} className="flashcard">
          <div className="flashcard-term">{card.term}</div>
          <div className="flashcard-def">{card.definition}</div>
        </div>
      ))}
    </div>
  )
}

// ── Meta ───────────────────────────────────────────────────────────────────
const meta: Meta<typeof Flashcard> = {
  title: 'FlashDeck/Flashcard',
  component: Flashcard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f4f0' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        component: 'A single flashcard with a term and optional definition reveal. FlashDeck generates print-ready sheets from tab- or comma-separated data.',
      },
    },
  },
  argTypes: {
    term: { control: 'text' },
    definition: { control: 'text' },
    revealed: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Flashcard>

const SCIENCE_CARDS = [
  { term: 'Photosynthesis', definition: 'Process by which plants convert sunlight into glucose' },
  { term: 'Mitosis', definition: 'Cell division producing two identical daughter cells' },
  { term: 'Osmosis', definition: 'Movement of water through a semi-permeable membrane' },
  { term: 'ATP', definition: "Adenosine triphosphate — the cell's energy currency" },
  { term: 'Meiosis', definition: 'Cell division that produces four haploid gamete cells' },
  { term: 'DNA', definition: 'Deoxyribonucleic acid — the molecule carrying genetic info' },
]

export const TermOnly: Story = {
  name: 'Term only (definition hidden)',
  args: {
    term: 'Photosynthesis',
    definition: 'Process by which plants convert sunlight into glucose',
    revealed: false,
  },
}

export const Revealed: Story = {
  name: 'Term + definition revealed',
  args: {
    term: 'Photosynthesis',
    definition: 'Process by which plants convert sunlight into glucose',
    revealed: true,
  },
}

export const FlipInteraction: Story = {
  name: 'Interactive flip (click to reveal)',
  render: () => (
    <FlipCard
      term="Mitosis"
      definition="Cell division producing two identical daughter cells"
    />
  ),
}

export const Grid2x3: Story = {
  name: 'Card grid — 2×3 layout',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24, background: '#f5f4f0' }}>
      <p style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 12 }}>2 columns × 3 rows</p>
      <CardGrid cards={SCIENCE_CARDS} layout="2x3" />
    </div>
  ),
}

export const Grid3x4: Story = {
  name: 'Card grid — 3×4 layout',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24, background: '#f5f4f0' }}>
      <p style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 12 }}>3 columns × 4 rows</p>
      <CardGrid cards={SCIENCE_CARDS} layout="3x4" />
    </div>
  ),
}
