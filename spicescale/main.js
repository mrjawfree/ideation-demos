// ── Pre-loaded Recipes ──
const RECIPES = {
  'bbq-dry-rub': {
    name: 'Classic BBQ Dry Rub',
    ingredients: [
      { name: 'Brown Sugar',    base: 4,    unit: 'tbsp', scaling: 'linear' },
      { name: 'Smoked Paprika', base: 3,    unit: 'tbsp', scaling: 'linear' },
      { name: 'Garlic Powder',  base: 2,    unit: 'tbsp', scaling: 'linear' },
      { name: 'Onion Powder',   base: 1.5,  unit: 'tbsp', scaling: 'linear' },
      { name: 'Black Pepper',   base: 1,    unit: 'tbsp', scaling: 'linear' },
      { name: 'Kosher Salt',    base: 2,    unit: 'tbsp', scaling: 'sublinear' },
      { name: 'Cayenne Pepper', base: 0.5,  unit: 'tsp',  scaling: 'sublinear' },
      { name: 'Dried Chipotle', base: 1,    unit: 'tsp',  scaling: 'sublinear' },
      { name: 'Cumin',          base: 1,    unit: 'tsp',  scaling: 'sublinear' },
      { name: 'Mustard Powder', base: 1,    unit: 'tsp',  scaling: 'linear' },
    ]
  },
  'hot-sauce': {
    name: 'Classic Hot Sauce',
    ingredients: [
      { name: 'Cayenne Pepper', base: 2,   unit: 'tbsp', scaling: 'sublinear' },
      { name: 'White Vinegar',  base: 8,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Garlic Powder',  base: 1,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Kosher Salt',    base: 1,   unit: 'tsp',  scaling: 'sublinear' },
      { name: 'Sugar',          base: 1,   unit: 'tsp',  scaling: 'linear' },
    ]
  },
  'bbq-sauce': {
    name: 'BBQ Sauce',
    ingredients: [
      { name: 'Ketchup',             base: 8,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Brown Sugar',         base: 3,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Apple Cider Vinegar', base: 3,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Molasses',            base: 2,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Worcestershire',      base: 1,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Smoked Paprika',      base: 1,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Garlic Powder',       base: 2,   unit: 'tsp',  scaling: 'linear' },
      { name: 'Black Pepper',        base: 1,   unit: 'tsp',  scaling: 'linear' },
      { name: 'Kosher Salt',         base: 1,   unit: 'tsp',  scaling: 'sublinear' },
      { name: 'Cayenne Pepper',      base: 0.5, unit: 'tsp',  scaling: 'sublinear' },
    ]
  },
  'marinade': {
    name: 'Soy-Ginger Marinade',
    ingredients: [
      { name: 'Soy Sauce',         base: 4,   unit: 'tbsp', scaling: 'sublinear' },
      { name: 'Sesame Oil',        base: 2,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Rice Vinegar',      base: 2,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Brown Sugar',       base: 1,   unit: 'tbsp', scaling: 'linear' },
      { name: 'Garlic Powder',     base: 1,   unit: 'tsp',  scaling: 'linear' },
      { name: 'Ginger Powder',     base: 1.5, unit: 'tsp',  scaling: 'sublinear' },
      { name: 'Red Pepper Flakes', base: 0.5, unit: 'tsp',  scaling: 'sublinear' },
    ]
  }
}

// ── State ──
let activeRecipeId = 'bbq-dry-rub'
let customIngredients = []
let customName = 'My Recipe'

// ── Scaling Math ──
function scaleAmount(base, multiplier, scaling) {
  if (scaling === 'linear') return base * multiplier
  // Sublinear: power curve — at 10x gives ~6.3x for intense ingredients
  return base * Math.pow(multiplier, 0.8)
}

function formatAmount(amount) {
  if (amount >= 10) return Math.round(amount).toString()
  if (amount >= 1) return (Math.round(amount * 4) / 4).toFixed(2).replace(/\.?0+$/, '')
  return (Math.round(amount * 100) / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

// ── Active Recipe ──
function getActiveIngredients() {
  if (activeRecipeId === 'custom') return customIngredients
  return RECIPES[activeRecipeId].ingredients
}

function getActiveRecipeName() {
  if (activeRecipeId === 'custom') return customName || 'My Recipe'
  return RECIPES[activeRecipeId].name
}

// ── Render Ingredients Table ──
function renderIngredients(multiplier) {
  const list = document.getElementById('ingredients-list')
  const ingredients = getActiveIngredients()

  if (ingredients.length === 0) {
    list.innerHTML = '<div class="empty-recipe">Add ingredients above to see scaling.</div>'
    return
  }

  const validIngredients = ingredients.filter(item => item.name && item.base > 0)
  if (validIngredients.length === 0) {
    list.innerHTML = '<div class="empty-recipe">Fill in ingredient names and amounts above.</div>'
    return
  }

  list.innerHTML = ''
  validIngredients.forEach(item => {
    const naive = item.base * multiplier
    const smart = scaleAmount(item.base, multiplier, item.scaling)
    const isSublinear = item.scaling === 'sublinear' && multiplier > 1
    const reduction = isSublinear ? Math.round((1 - smart / naive) * 100) : 0

    const row = document.createElement('div')
    row.className = `ingredient-row ${item.scaling}`
    row.setAttribute('role', 'listitem')
    row.innerHTML = `
      <div class="ing-name">
        <span class="ing-dot ${item.scaling}" aria-hidden="true"></span>
        ${item.name}
      </div>
      <div class="ing-base">${formatAmount(item.base)} ${item.unit}</div>
      <div class="ing-naive">${formatAmount(naive)} ${item.unit}</div>
      <div class="ing-smart">
        ${formatAmount(smart)} ${item.unit}
        ${isSublinear && reduction > 0 ? `<span class="reduction">-${reduction}%</span>` : ''}
      </div>
    `
    list.appendChild(row)
  })
}

// ── Recipe Switcher ──
function setActiveRecipe(recipeId) {
  activeRecipeId = recipeId

  document.querySelectorAll('.recipe-tab').forEach(btn => {
    const isActive = btn.dataset.recipe === recipeId
    btn.classList.toggle('active', isActive)
    btn.setAttribute('aria-selected', isActive)
  })

  const builder = document.getElementById('custom-builder')
  builder.hidden = (recipeId !== 'custom')

  document.getElementById('recipe-title').textContent = getActiveRecipeName()

  const slider = document.getElementById('scale-slider')
  renderIngredients(parseFloat(slider.value))
}

// ── Custom Recipe Builder ──
function renderCustomRows() {
  const container = document.getElementById('custom-ingredients-list')
  container.innerHTML = ''

  if (customIngredients.length === 0) {
    container.innerHTML = '<div class="custom-empty">No ingredients yet. Click &ldquo;+ Add Ingredient&rdquo; to start.</div>'
    return
  }

  const units = ['tsp', 'tbsp', 'cup', 'oz', 'g', 'ml']

  customIngredients.forEach((ing, idx) => {
    const row = document.createElement('div')
    row.className = 'custom-row'
    row.innerHTML = `
      <input
        type="text"
        class="ing-name-input"
        placeholder="Ingredient name"
        value="${ing.name}"
        data-idx="${idx}"
        data-field="name"
        aria-label="Ingredient name"
      />
      <input
        type="number"
        class="ing-amount-input"
        placeholder="1"
        min="0"
        step="0.25"
        value="${ing.base || ''}"
        data-idx="${idx}"
        data-field="base"
        aria-label="Amount"
      />
      <select class="ing-unit-select" data-idx="${idx}" data-field="unit" aria-label="Unit">
        ${units.map(u => `<option value="${u}"${ing.unit === u ? ' selected' : ''}>${u}</option>`).join('')}
      </select>
      <div class="type-toggle" role="group" aria-label="Scaling type">
        <button
          type="button"
          class="${ing.scaling === 'linear' ? 'active-base' : ''}"
          data-idx="${idx}"
          data-scaling="linear"
          aria-pressed="${ing.scaling === 'linear'}"
        >Base</button>
        <button
          type="button"
          class="${ing.scaling === 'sublinear' ? 'active-intense' : ''}"
          data-idx="${idx}"
          data-scaling="sublinear"
          aria-pressed="${ing.scaling === 'sublinear'}"
        >Intense</button>
      </div>
      <button type="button" class="remove-row-btn" data-idx="${idx}" aria-label="Remove ingredient">×</button>
    `
    container.appendChild(row)
  })
}

function addIngredient() {
  customIngredients.push({ name: '', base: 1, unit: 'tbsp', scaling: 'linear' })
  renderCustomRows()
  const inputs = document.querySelectorAll('.ing-name-input')
  if (inputs.length) inputs[inputs.length - 1].focus()
  updateCustomPreview()
}

function removeIngredient(idx) {
  customIngredients.splice(idx, 1)
  renderCustomRows()
  updateCustomPreview()
}

function updateIngredient(idx, field, value) {
  if (field === 'base') {
    customIngredients[idx][field] = parseFloat(value) || 0
  } else {
    customIngredients[idx][field] = value
  }
  updateCustomPreview()
}

function setIngredientScaling(idx, scaling) {
  customIngredients[idx].scaling = scaling
  renderCustomRows()
  updateCustomPreview()
}

function updateCustomPreview() {
  const slider = document.getElementById('scale-slider')
  renderIngredients(parseFloat(slider.value))
}

// ── Custom builder event delegation ──
function initCustomBuilder() {
  const container = document.getElementById('custom-ingredients-list')

  container.addEventListener('input', (e) => {
    const idx = parseInt(e.target.dataset.idx)
    const field = e.target.dataset.field
    if (isNaN(idx) || !field) return
    updateIngredient(idx, field, e.target.value)
  })

  container.addEventListener('change', (e) => {
    const idx = parseInt(e.target.dataset.idx)
    const field = e.target.dataset.field
    if (isNaN(idx) || !field) return
    updateIngredient(idx, field, e.target.value)
  })

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-row-btn')) {
      const idx = parseInt(e.target.dataset.idx)
      if (!isNaN(idx)) removeIngredient(idx)
      return
    }
    const scaling = e.target.dataset.scaling
    if (scaling) {
      const idx = parseInt(e.target.dataset.idx)
      if (!isNaN(idx)) setIngredientScaling(idx, scaling)
    }
  })

  document.getElementById('add-ingredient-btn').addEventListener('click', addIngredient)

  document.getElementById('custom-name').addEventListener('input', (e) => {
    customName = e.target.value
    document.getElementById('recipe-title').textContent = customName || 'My Recipe'
  })
}

// ── Slider ──
const slider = document.getElementById('scale-slider')
const scaleDisplay = document.getElementById('scale-value')

function updateScale() {
  const val = parseFloat(slider.value)
  scaleDisplay.textContent = `${val}x batch`
  const pct = ((val - 1) / 9) * 100
  slider.style.setProperty('--fill', `${pct}%`)
  renderIngredients(val)
}

slider.addEventListener('input', updateScale)

// ── Recipe tabs ──
document.querySelectorAll('.recipe-tab').forEach(btn => {
  btn.addEventListener('click', () => setActiveRecipe(btn.dataset.recipe))
})

// ── Init ──
initCustomBuilder()
setActiveRecipe('bbq-dry-rub')
updateScale()

// ── Email capture — stores in localStorage for demo (no backend) ──
const form = document.getElementById('signup-form')
const successMsg = document.getElementById('signup-success')
const emailInput = document.getElementById('email-input')

if (localStorage.getItem('spicescale_email')) {
  form.hidden = true
  successMsg.hidden = false
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = emailInput.value.trim()
  if (!email) return
  localStorage.setItem('spicescale_email', email)
  const signups = JSON.parse(localStorage.getItem('spicescale_signups') || '[]')
  signups.push({ email, timestamp: new Date().toISOString() })
  localStorage.setItem('spicescale_signups', JSON.stringify(signups))
  form.hidden = true
  successMsg.hidden = false
})
