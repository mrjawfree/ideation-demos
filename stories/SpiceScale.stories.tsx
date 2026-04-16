import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
interface Ingredient {
  name: string
  base: number
  unit: string
  scaling: 'linear' | 'sublinear'
}

interface SpiceScaleProps {
  recipeName: string
  ingredients: Ingredient[]
  defaultMultiplier?: number
}

// ── Scaling math (mirrors spicescale/main.js) ──────────────────────────────
function scaleAmount(base: number, multiplier: number, scaling: 'linear' | 'sublinear'): number {
  if (scaling === 'linear') return base * multiplier
  return base * Math.pow(multiplier, 0.8)
}

function formatAmount(amount: number): string {
  if (amount >= 10) return Math.round(amount).toString()
  if (amount >= 1) return (Math.round(amount * 4) / 4).toFixed(2).replace(/\.?0+$/, '')
  return (Math.round(amount * 100) / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

// ── Component ──────────────────────────────────────────────────────────────
function SpiceScaleCalculator({ recipeName, ingredients, defaultMultiplier = 1 }: SpiceScaleProps) {
  const [multiplier, setMultiplier] = useState(defaultMultiplier)

  return (
    <div style={{
      fontFamily: 'var(--font-sans, -apple-system, sans-serif)',
      background: 'var(--bg-surface, #18181b)',
      border: '1px solid var(--border, #2e2e36)',
      borderRadius: 12,
      padding: 24,
      maxWidth: 480,
      color: 'var(--text-primary, #f4f4f5)',
    }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{recipeName}</h2>
      <p style={{ fontSize: 12, color: 'var(--text-secondary, #a1a1aa)', marginBottom: 20 }}>
        Spice scaling calculator
      </p>

      {/* Batch multiplier control */}
      <div style={{ marginBottom: 24 }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 13,
          color: 'var(--text-secondary, #a1a1aa)',
          marginBottom: 8,
        }}>
          <span>Batch multiplier</span>
          <span style={{
            background: 'var(--accent-light, rgba(99,102,241,0.12))',
            color: 'var(--accent, #6366f1)',
            padding: '2px 10px',
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 14,
          }}>
            {multiplier}×
          </span>
        </label>
        <input
          type="range"
          min={0.25}
          max={10}
          step={0.25}
          value={multiplier}
          onChange={e => setMultiplier(parseFloat(e.target.value))}
          aria-label="Batch multiplier"
          style={{ width: '100%', accentColor: 'var(--accent, #6366f1)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted, #52525b)', marginTop: 4 }}>
          <span>0.25× (small batch)</span>
          <span>10× (large batch)</span>
        </div>
      </div>

      {/* Ingredients table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--text-muted, #52525b)', fontWeight: 500, borderBottom: '1px solid var(--border, #2e2e36)' }}>
              Ingredient
            </th>
            <th style={{ textAlign: 'right', padding: '6px 0', color: 'var(--text-muted, #52525b)', fontWeight: 500, borderBottom: '1px solid var(--border, #2e2e36)', width: 80 }}>
              Base
            </th>
            <th style={{ textAlign: 'right', padding: '6px 0', color: 'var(--accent, #6366f1)', fontWeight: 600, borderBottom: '1px solid var(--border, #2e2e36)', width: 100 }}>
              Scaled
            </th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ing, i) => {
            const scaled = scaleAmount(ing.base, multiplier, ing.scaling)
            const changed = Math.abs(scaled - ing.base) > 0.01
            return (
              <tr key={i} style={{ borderBottom: '1px solid var(--border, #2e2e36)' }}>
                <td style={{ padding: '8px 0' }}>
                  {ing.name}
                  {ing.scaling === 'sublinear' && (
                    <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--text-muted, #52525b)', background: 'var(--bg-elevated, #1f1f23)', padding: '1px 5px', borderRadius: 3 }}>
                      sublinear
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right', padding: '8px 0', color: 'var(--text-secondary, #a1a1aa)' }}>
                  {ing.base} {ing.unit}
                </td>
                <td style={{
                  textAlign: 'right',
                  padding: '8px 0',
                  fontWeight: changed ? 600 : 400,
                  color: changed ? 'var(--text-primary, #f4f4f5)' : 'var(--text-secondary, #a1a1aa)',
                }}>
                  {formatAmount(scaled)} {ing.unit}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Meta ───────────────────────────────────────────────────────────────────
const meta: Meta<typeof SpiceScaleCalculator> = {
  title: 'SpiceScale/Calculator',
  component: SpiceScaleCalculator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Spice scaling calculator with non-linear scaling for intense ingredients. Adjust the batch multiplier to see linear vs sublinear ingredient scaling.',
      },
    },
  },
  argTypes: {
    recipeName: { control: 'text' },
    defaultMultiplier: {
      control: { type: 'range', min: 0.25, max: 10, step: 0.25 },
    },
  },
}

export default meta
type Story = StoryObj<typeof SpiceScaleCalculator>

const BBQ_RUB: Ingredient[] = [
  { name: 'Brown Sugar',    base: 4,   unit: 'tbsp', scaling: 'linear' },
  { name: 'Smoked Paprika', base: 3,   unit: 'tbsp', scaling: 'linear' },
  { name: 'Garlic Powder',  base: 2,   unit: 'tbsp', scaling: 'linear' },
  { name: 'Onion Powder',   base: 1.5, unit: 'tbsp', scaling: 'linear' },
  { name: 'Black Pepper',   base: 1,   unit: 'tbsp', scaling: 'linear' },
  { name: 'Kosher Salt',    base: 2,   unit: 'tbsp', scaling: 'sublinear' },
  { name: 'Cayenne Pepper', base: 0.5, unit: 'tsp',  scaling: 'sublinear' },
  { name: 'Cumin',          base: 1,   unit: 'tsp',  scaling: 'sublinear' },
]

const HOT_SAUCE: Ingredient[] = [
  { name: 'Cayenne Pepper', base: 2, unit: 'tbsp', scaling: 'sublinear' },
  { name: 'White Vinegar',  base: 8, unit: 'tbsp', scaling: 'linear' },
  { name: 'Garlic Powder',  base: 1, unit: 'tbsp', scaling: 'linear' },
  { name: 'Kosher Salt',    base: 1, unit: 'tsp',  scaling: 'sublinear' },
  { name: 'Sugar',          base: 1, unit: 'tsp',  scaling: 'linear' },
]

export const BBQDryRubSingleBatch: Story = {
  name: 'BBQ Dry Rub — 1× batch',
  args: {
    recipeName: 'Classic BBQ Dry Rub',
    ingredients: BBQ_RUB,
    defaultMultiplier: 1,
  },
}

export const BBQDryRubLargeBatch: Story = {
  name: 'BBQ Dry Rub — 5× large batch',
  args: {
    recipeName: 'Classic BBQ Dry Rub',
    ingredients: BBQ_RUB,
    defaultMultiplier: 5,
  },
}

export const HotSauce: Story = {
  name: 'Hot Sauce',
  args: {
    recipeName: 'Classic Hot Sauce',
    ingredients: HOT_SAUCE,
    defaultMultiplier: 1,
  },
}

export const Interactive: Story = {
  name: 'Interactive (use the slider)',
  render: () => (
    <SpiceScaleCalculator
      recipeName="Classic BBQ Dry Rub"
      ingredients={BBQ_RUB}
      defaultMultiplier={1}
    />
  ),
}
