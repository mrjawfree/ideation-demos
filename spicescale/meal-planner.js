// ── Recipe Database ──
const RECIPES = [
  { name: 'Cajun Blackened Chicken', spices: ['cayenne pepper', 'smoked paprika', 'garlic powder', 'onion powder', 'black pepper', 'thyme'], meal: 'dinner' },
  { name: 'Garlic Butter Shrimp', spices: ['garlic powder', 'black pepper', 'red pepper flakes', 'parsley'], meal: 'dinner' },
  { name: 'Turmeric Rice Bowl', spices: ['turmeric', 'cumin', 'garlic powder', 'black pepper'], meal: 'lunch' },
  { name: 'Chili Lime Tacos', spices: ['chili powder', 'cumin', 'garlic powder', 'smoked paprika', 'cayenne pepper'], meal: 'dinner' },
  { name: 'Cinnamon Oatmeal', spices: ['cinnamon', 'nutmeg'], meal: 'breakfast' },
  { name: 'Spiced Scrambled Eggs', spices: ['black pepper', 'smoked paprika', 'chili powder'], meal: 'breakfast' },
  { name: 'Herb Roasted Vegetables', spices: ['rosemary', 'thyme', 'garlic powder', 'black pepper'], meal: 'lunch' },
  { name: 'Curry Lentil Soup', spices: ['curry powder', 'cumin', 'turmeric', 'garlic powder', 'ginger'], meal: 'lunch' },
  { name: 'BBQ Dry Rub Ribs', spices: ['smoked paprika', 'brown sugar', 'garlic powder', 'onion powder', 'cayenne pepper', 'black pepper', 'cumin'], meal: 'dinner' },
  { name: 'Ginger Soy Stir Fry', spices: ['ginger', 'garlic powder', 'red pepper flakes'], meal: 'dinner' },
  { name: 'Mediterranean Salad', spices: ['oregano', 'garlic powder', 'black pepper'], meal: 'lunch' },
  { name: 'Paprika Baked Salmon', spices: ['smoked paprika', 'garlic powder', 'black pepper', 'dill'], meal: 'dinner' },
  { name: 'Spiced Avocado Toast', spices: ['red pepper flakes', 'black pepper', 'garlic powder'], meal: 'breakfast' },
  { name: 'Moroccan Chickpea Stew', spices: ['cumin', 'cinnamon', 'turmeric', 'smoked paprika', 'ginger'], meal: 'dinner' },
  { name: 'Masala Chai Pancakes', spices: ['cinnamon', 'cardamom', 'ginger', 'nutmeg', 'cloves'], meal: 'breakfast' },
  { name: 'Italian Herb Pasta', spices: ['basil', 'oregano', 'garlic powder', 'red pepper flakes', 'black pepper'], meal: 'lunch' },
  { name: 'Chipotle Black Bean Bowl', spices: ['chipotle', 'cumin', 'garlic powder', 'smoked paprika'], meal: 'lunch' },
  { name: 'Lemon Pepper Chicken', spices: ['black pepper', 'garlic powder', 'onion powder', 'thyme'], meal: 'dinner' },
  { name: 'Cinnamon French Toast', spices: ['cinnamon', 'nutmeg', 'vanilla'], meal: 'breakfast' },
  { name: 'Za\'atar Flatbread', spices: ['za\'atar', 'garlic powder', 'sesame seeds'], meal: 'lunch' },
  { name: 'Korean Gochugaru Wings', spices: ['gochugaru', 'garlic powder', 'ginger', 'black pepper'], meal: 'dinner' },
  { name: 'Golden Milk Smoothie', spices: ['turmeric', 'cinnamon', 'ginger', 'black pepper'], meal: 'breakfast' },
  { name: 'Jerk Chicken', spices: ['allspice', 'thyme', 'garlic powder', 'cayenne pepper', 'black pepper', 'cinnamon', 'nutmeg'], meal: 'dinner' },
  { name: 'Shakshuka', spices: ['cumin', 'smoked paprika', 'cayenne pepper', 'garlic powder'], meal: 'breakfast' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MEALS = ['breakfast', 'lunch', 'dinner']
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' }

// ── State ──
let weekOffset = 0
let activeSlot = null // { day: 0-6, meal: 'breakfast'|'lunch'|'dinner' }

function getWeekKey() {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + weekOffset * 7)
  return monday.toISOString().slice(0, 10)
}

function getWeekDates() {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + weekOffset * 7)
  return DAYS.map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

// ── Persistence ──
function loadSpices() {
  return JSON.parse(localStorage.getItem('spicescale_my_spices') || '[]')
}

function saveSpices(spices) {
  localStorage.setItem('spicescale_my_spices', JSON.stringify(spices))
}

function loadMealPlan(weekKey) {
  const plans = JSON.parse(localStorage.getItem('spicescale_meal_plans') || '{}')
  return plans[weekKey] || {}
}

function saveMealPlan(weekKey, plan) {
  const plans = JSON.parse(localStorage.getItem('spicescale_meal_plans') || '{}')
  plans[weekKey] = plan
  localStorage.setItem('spicescale_meal_plans', JSON.stringify(plans))
}

function getMealKey(dayIndex, meal) {
  return `${dayIndex}-${meal}`
}

// ── Week Label ──
function updateWeekLabel() {
  const dates = getWeekDates()
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const label = weekOffset === 0 ? 'This Week' : `${fmt(dates[0])} — ${fmt(dates[6])}`
  document.getElementById('week-label').textContent = label
}

// ── Spice Inventory Render ──
function renderSpices() {
  const container = document.getElementById('spice-tags')
  const spices = loadSpices()
  if (spices.length === 0) {
    container.innerHTML = '<span class="empty-hint">No spices yet — add some above to get meal suggestions.</span>'
    return
  }
  container.innerHTML = spices.map(s =>
    `<span class="spice-tag">${s}<button class="spice-remove" data-spice="${s}" aria-label="Remove ${s}">&times;</button></span>`
  ).join('')
}

function addSpice() {
  const input = document.getElementById('spice-input')
  const name = input.value.trim().toLowerCase()
  if (!name) return
  const spices = loadSpices()
  if (!spices.includes(name)) {
    spices.push(name)
    spices.sort()
    saveSpices(spices)
  }
  input.value = ''
  renderSpices()
  renderShoppingList()
}

function removeSpice(name) {
  const spices = loadSpices().filter(s => s !== name)
  saveSpices(spices)
  renderSpices()
  renderShoppingList()
}

// ── Meal Grid Render ──
function renderGrid() {
  const grid = document.getElementById('meal-grid')
  const weekKey = getWeekKey()
  const plan = loadMealPlan(weekKey)
  const dates = getWeekDates()

  let html = '<div class="grid-header"><div class="grid-corner"></div>'
  DAYS.forEach((day, i) => {
    const d = dates[i]
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    html += `<div class="grid-day-header"><span class="day-name">${day}</span><span class="day-date">${dateStr}</span></div>`
  })
  html += '</div>'

  MEALS.forEach(meal => {
    html += `<div class="grid-row"><div class="grid-meal-label">${MEAL_LABELS[meal]}</div>`
    DAYS.forEach((_, dayIndex) => {
      const key = getMealKey(dayIndex, meal)
      const entry = plan[key]
      if (entry) {
        html += `<div class="grid-cell filled" data-day="${dayIndex}" data-meal="${meal}">
          <span class="cell-meal-name">${entry.name}</span>
          <button class="cell-remove" data-day="${dayIndex}" data-meal="${meal}" aria-label="Remove meal">&times;</button>
        </div>`
      } else {
        html += `<div class="grid-cell empty" data-day="${dayIndex}" data-meal="${meal}">
          <button class="cell-add" data-day="${dayIndex}" data-meal="${meal}" aria-label="Add meal">+</button>
        </div>`
      }
    })
    html += '</div>'
  })

  grid.innerHTML = html
}

// ── Meal Suggestion ──
function suggestMeal(mealType) {
  const spices = loadSpices()
  if (spices.length === 0) return null

  const matching = RECIPES.filter(r => {
    if (mealType && r.meal !== mealType) return false
    return r.spices.every(s => spices.includes(s))
  })

  if (matching.length === 0) {
    const partial = RECIPES
      .filter(r => !mealType || r.meal === mealType)
      .map(r => ({ ...r, matchCount: r.spices.filter(s => spices.includes(s)).length }))
      .filter(r => r.matchCount > 0)
      .sort((a, b) => b.matchCount / b.spices.length - a.matchCount / a.spices.length)

    return partial[Math.floor(Math.random() * Math.min(3, partial.length))] || null
  }

  return matching[Math.floor(Math.random() * matching.length)]
}

function getFilteredRecipes(query, mealType) {
  const spices = loadSpices()
  const q = query.toLowerCase()
  return RECIPES
    .filter(r => !mealType || r.meal === mealType)
    .filter(r => !q || r.name.toLowerCase().includes(q) || r.spices.some(s => s.includes(q)))
    .map(r => ({
      ...r,
      matchCount: r.spices.filter(s => spices.includes(s)).length,
      missingSpices: r.spices.filter(s => !spices.includes(s))
    }))
    .sort((a, b) => b.matchCount / b.spices.length - a.matchCount / a.spices.length)
}

// ── Shopping List ──
function renderShoppingList() {
  const container = document.getElementById('shopping-list')
  const weekKey = getWeekKey()
  const plan = loadMealPlan(weekKey)
  const spices = loadSpices()

  const missing = new Map()

  Object.values(plan).forEach(entry => {
    if (!entry || !entry.spices) return
    entry.spices.forEach(s => {
      if (!spices.includes(s)) {
        if (!missing.has(s)) missing.set(s, [])
        missing.get(s).push(entry.name)
      }
    })
  })

  if (missing.size === 0) {
    container.innerHTML = '<p class="empty-state">No missing spices — you\'re all set, or plan some meals first.</p>'
    return
  }

  let html = '<ul class="shopping-items">'
  for (const [spice, meals] of missing) {
    html += `<li class="shopping-item"><span class="shopping-spice">${spice}</span><span class="shopping-for">for ${meals.join(', ')}</span></li>`
  }
  html += '</ul>'
  container.innerHTML = html
}

function copyShoppingList() {
  const weekKey = getWeekKey()
  const plan = loadMealPlan(weekKey)
  const spices = loadSpices()
  const missing = new Map()

  Object.values(plan).forEach(entry => {
    if (!entry || !entry.spices) return
    entry.spices.forEach(s => {
      if (!spices.includes(s)) {
        if (!missing.has(s)) missing.set(s, [])
        missing.get(s).push(entry.name)
      }
    })
  })

  if (missing.size === 0) return
  const text = Array.from(missing).map(([s, meals]) => `- ${s} (for ${meals.join(', ')})`).join('\n')
  navigator.clipboard.writeText(`SpiceScale Shopping List\n\n${text}`).then(() => {
    const btn = document.getElementById('copy-list-btn')
    btn.textContent = 'Copied!'
    setTimeout(() => { btn.textContent = 'Copy' }, 2000)
  })
}

// ── Modal ──
function openModal(dayIndex, meal) {
  activeSlot = { day: dayIndex, meal }
  const modal = document.getElementById('meal-modal')
  const search = document.getElementById('meal-search')
  modal.hidden = false
  search.value = ''
  document.getElementById('modal-title').textContent = `${DAYS[dayIndex]} ${MEAL_LABELS[meal]}`
  renderRecipeResults('', meal)
  search.focus()
}

function closeModal() {
  document.getElementById('meal-modal').hidden = true
  activeSlot = null
}

function renderRecipeResults(query, mealType) {
  const container = document.getElementById('recipe-results')
  const results = getFilteredRecipes(query, mealType)
  const spices = loadSpices()

  if (results.length === 0 && !query) {
    container.innerHTML = '<p class="empty-state">Add spices to your rack to see suggestions.</p>'
    return
  }

  let html = ''

  if (query && !results.some(r => r.name.toLowerCase() === query.toLowerCase())) {
    html += `<div class="recipe-card custom-meal" data-custom="${query}">
      <span class="recipe-name">Add "${query}" as custom meal</span>
      <span class="recipe-badge custom">Custom</span>
    </div>`
  }

  results.forEach(r => {
    const allMatch = r.missingSpices.length === 0
    html += `<div class="recipe-card ${allMatch ? 'full-match' : ''}" data-recipe="${r.name}">
      <div class="recipe-info">
        <span class="recipe-name">${r.name}</span>
        <span class="recipe-spices">${r.spices.map(s =>
          `<span class="recipe-spice ${spices.includes(s) ? 'have' : 'missing'}">${s}</span>`
        ).join('')}</span>
      </div>
      ${allMatch ? '<span class="recipe-badge match">All spices!</span>' : `<span class="recipe-badge partial">${r.missingSpices.length} missing</span>`}
    </div>`
  })

  container.innerHTML = html
}

function selectRecipe(recipe) {
  if (!activeSlot) return
  const weekKey = getWeekKey()
  const plan = loadMealPlan(weekKey)
  const key = getMealKey(activeSlot.day, activeSlot.meal)
  plan[key] = { name: recipe.name, spices: recipe.spices || [] }
  saveMealPlan(weekKey, plan)
  closeModal()
  renderGrid()
  renderShoppingList()
}

function removeMeal(dayIndex, meal) {
  const weekKey = getWeekKey()
  const plan = loadMealPlan(weekKey)
  delete plan[getMealKey(dayIndex, meal)]
  saveMealPlan(weekKey, plan)
  renderGrid()
  renderShoppingList()
}

// ── Event Listeners ──

// Spice inventory
document.getElementById('add-spice-btn').addEventListener('click', addSpice)
document.getElementById('spice-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addSpice()
})
document.getElementById('spice-tags').addEventListener('click', (e) => {
  const btn = e.target.closest('.spice-remove')
  if (btn) removeSpice(btn.dataset.spice)
})

// Week navigation
document.getElementById('prev-week').addEventListener('click', () => {
  weekOffset--
  updateWeekLabel()
  renderGrid()
  renderShoppingList()
})
document.getElementById('next-week').addEventListener('click', () => {
  weekOffset++
  updateWeekLabel()
  renderGrid()
  renderShoppingList()
})

// Grid clicks
document.getElementById('meal-grid').addEventListener('click', (e) => {
  const addBtn = e.target.closest('.cell-add')
  if (addBtn) {
    openModal(parseInt(addBtn.dataset.day), addBtn.dataset.meal)
    return
  }
  const removeBtn = e.target.closest('.cell-remove')
  if (removeBtn) {
    removeMeal(parseInt(removeBtn.dataset.day), removeBtn.dataset.meal)
    return
  }
  const cell = e.target.closest('.grid-cell.filled')
  if (cell) {
    openModal(parseInt(cell.dataset.day), cell.dataset.meal)
  }
})

// Modal
document.getElementById('modal-close').addEventListener('click', closeModal)
document.getElementById('meal-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal()
})
document.getElementById('meal-search').addEventListener('input', (e) => {
  if (activeSlot) renderRecipeResults(e.target.value, activeSlot.meal)
})
document.getElementById('suggest-btn').addEventListener('click', () => {
  if (!activeSlot) return
  const recipe = suggestMeal(activeSlot.meal)
  if (recipe) {
    selectRecipe(recipe)
  } else {
    const container = document.getElementById('recipe-results')
    container.innerHTML = '<p class="empty-state">No matching recipes found. Add more spices to your rack!</p>'
  }
})
document.getElementById('recipe-results').addEventListener('click', (e) => {
  const customCard = e.target.closest('.custom-meal')
  if (customCard) {
    selectRecipe({ name: customCard.dataset.custom, spices: [] })
    return
  }
  const card = e.target.closest('.recipe-card[data-recipe]')
  if (card) {
    const recipe = RECIPES.find(r => r.name === card.dataset.recipe)
    if (recipe) selectRecipe(recipe)
  }
})

// Shopping list copy
document.getElementById('copy-list-btn').addEventListener('click', copyShoppingList)

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal()
})

// ── Init ──
updateWeekLabel()
renderSpices()
renderGrid()
renderShoppingList()
