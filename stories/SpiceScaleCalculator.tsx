import { useState, useMemo } from 'react'

interface Ingredient {
  name: string
  base: number
  unit: string
  scaling: 'linear' | 'sublinear'
}

interface Recipe {
  name: string
  ingredients: Ingredient[]
}

const RECIPES: Record<string, Recipe> = {
  'bbq-dry-rub': {
    name: 'Classic BBQ Dry Rub',
    ingredients: [
      { name: 'Brown Sugar', base: 4, unit: 'tbsp', scaling: 'linear' },
      { name: 'Smoked Paprika', base: 3, unit: 'tbsp', scaling: 'linear' },
      { name: 'Garlic Powder', base: 2, unit: 'tbsp', scaling: 'linear' },
      { name: 'Onion Powder', base: 1.5, unit: 'tbsp', scaling: 'linear' },
      { name: 'Black Pepper', base: 1, unit: 'tbsp', scaling: 'linear' },
      { name: 'Kosher Salt', base: 2, unit: 'tbsp', scaling: 'sublinear' },
      { name: 'Cayenne Pepper', base: 0.5, unit: 'tsp', scaling: 'sublinear' },
      { name: 'Dried Chipotle', base: 1, unit: 'tsp', scaling: 'sublinear' },
      { name: 'Cumin', base: 1, unit: 'tsp', scaling: 'sublinear' },
      { name: 'Mustard Powder', base: 1, unit: 'tsp', scaling: 'linear' },
    ],
  },
  'hot-sauce': {
    name: 'Classic Hot Sauce',
    ingredients: [
      { name: 'Cayenne Pepper', base: 2, unit: 'tbsp', scaling: 'sublinear' },
      { name: 'White Vinegar', base: 8, unit: 'tbsp', scaling: 'linear' },
      { name: 'Garlic Powder', base: 1, unit: 'tbsp', scaling: 'linear' },
      { name: 'Kosher Salt', base: 1, unit: 'tsp', scaling: 'sublinear' },
      { name: 'Sugar', base: 1, unit: 'tsp', scaling: 'linear' },
    ],
  },
  'bbq-sauce': {
    name: 'BBQ Sauce',
    ingredients: [
      { name: 'Ketchup', base: 8, unit: 'tbsp', scaling: 'linear' },
      { name: 'Brown Sugar', base: 3, unit: 'tbsp', scaling: 'linear' },
      { name: 'Apple Cider Vinegar', base: 3, unit: 'tbsp', scaling: 'linear' },
      { name: 'Molasses', base: 2, unit: 'tbsp', scaling: 'linear' },
      { name: 'Worcestershire', base: 1, unit: 'tbsp', scaling: 'linear' },
      { name: 'Smoked Paprika', base: 1, unit: 'tbsp', scaling: 'linear' },
      { name: 'Garlic Powder', base: 2, unit: 'tsp', scaling: 'linear' },
      { name: 'Black Pepper', base: 1, unit: 'tsp', scaling: 'linear' },
      { name: 'Kosher Salt', base: 1, unit: 'tsp', scaling: 'sublinear' },
      { name: 'Cayenne Pepper', base: 0.5, unit: 'tsp', scaling: 'sublinear' },
    ],
  },
}

function scaleAmount(base: number, multiplier: number, scaling: string): number {
  if (scaling === 'linear') return base * multiplier
  return base * Math.pow(multiplier, 0.8)
}

function formatAmount(amount: number): string {
  if (amount >= 10) return Math.round(amount).toString()
  if (amount >= 1)
    return (Math.round(amount * 4) / 4)
      .toFixed(2)
      .replace(/\.?0+$/, '')
  return (Math.round(amount * 100) / 100)
    .toFixed(2)
    .replace(/0+$/, '')
    .replace(/\.$/, '')
}

export interface SpiceScaleCalculatorProps {
  recipeId?: string
  multiplier?: number
  ingredients?: Ingredient[]
}

export function SpiceScaleCalculator({
  recipeId: initialRecipeId = 'bbq-dry-rub',
  multiplier: initialMultiplier = 1,
  ingredients: customIngredients,
}: SpiceScaleCalculatorProps) {
  const [recipeId, setRecipeId] = useState(initialRecipeId)
  const [multiplier, setMultiplier] = useState(initialMultiplier)

  const recipe = RECIPES[recipeId]
  const ingredients = customIngredients ?? recipe?.ingredients ?? []
  const recipeName = recipe?.name ?? 'Custom Recipe'

  const scaled = useMemo(
    () =>
      ingredients.map((ing) => {
        const naive = ing.base * multiplier
        const smart = scaleAmount(ing.base, multiplier, ing.scaling)
        const reduction =
          ing.scaling === 'sublinear' && multiplier > 1
            ? Math.round((1 - smart / naive) * 100)
            : 0
        return { ...ing, naive, smart, reduction }
      }),
    [ingredients, multiplier],
  )

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        background: '#0f0f0f',
        color: '#f0ece4',
        padding: 24,
        borderRadius: 12,
        maxWidth: 700,
      }}
    >
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>{recipeName}</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(RECIPES).map(([id, r]) => (
          <button
            key={id}
            onClick={() => setRecipeId(id)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              background: recipeId === id ? '#e85d2a' : '#242424',
              color: recipeId === id ? '#fff' : '#9a9488',
            }}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, color: '#9a9488', marginBottom: 6 }}>
          Batch multiplier: {multiplier}x
        </label>
        <input
          type="range"
          min={1}
          max={10}
          step={0.5}
          value={multiplier}
          onChange={(e) => setMultiplier(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '8px 12px',
          fontSize: 13,
        }}
      >
        <div style={{ fontWeight: 600, color: '#9a9488', paddingBottom: 4 }}>Ingredient</div>
        <div style={{ fontWeight: 600, color: '#9a9488', paddingBottom: 4 }}>Base</div>
        <div style={{ fontWeight: 600, color: '#9a9488', paddingBottom: 4 }}>Naive</div>
        <div style={{ fontWeight: 600, color: '#9a9488', paddingBottom: 4 }}>Smart</div>
        {scaled.map((row, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: row.scaling === 'sublinear' ? '#e85d2a' : '#5cb85c',
                  flexShrink: 0,
                }}
              />
              {row.name}
            </div>
            <div>
              {formatAmount(row.base)} {row.unit}
            </div>
            <div style={{ color: '#9a9488' }}>
              {formatAmount(row.naive)} {row.unit}
            </div>
            <div>
              {formatAmount(row.smart)} {row.unit}
              {row.reduction > 0 && (
                <span style={{ color: '#5cb85c', marginLeft: 4, fontSize: 11 }}>
                  -{row.reduction}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
