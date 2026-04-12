// BBQ Dry Rub base recipe (1x batch, in tablespoons unless noted)
const recipe = [
  { name: 'Brown Sugar',    base: 4,    unit: 'tbsp', scaling: 'linear',     category: 'base' },
  { name: 'Smoked Paprika', base: 3,    unit: 'tbsp', scaling: 'linear',     category: 'base' },
  { name: 'Garlic Powder',  base: 2,    unit: 'tbsp', scaling: 'linear',     category: 'base' },
  { name: 'Onion Powder',   base: 1.5,  unit: 'tbsp', scaling: 'linear',     category: 'base' },
  { name: 'Black Pepper',   base: 1,    unit: 'tbsp', scaling: 'linear',     category: 'base' },
  { name: 'Kosher Salt',    base: 2,    unit: 'tbsp', scaling: 'sublinear',  category: 'intense' },
  { name: 'Cayenne Pepper', base: 0.5,  unit: 'tsp',  scaling: 'sublinear',  category: 'intense' },
  { name: 'Dried Chipotle', base: 1,    unit: 'tsp',  scaling: 'sublinear',  category: 'intense' },
  { name: 'Cumin',          base: 1,    unit: 'tsp',  scaling: 'sublinear',  category: 'intense' },
  { name: 'Mustard Powder', base: 1,    unit: 'tsp',  scaling: 'linear',     category: 'base' },
]

// Non-linear scaling: power curve with exponent < 1 for intense ingredients
// At 10x: linear gives 10x, sublinear gives ~6.3x (exponent 0.8)
function scaleAmount(base, multiplier, scaling) {
  if (scaling === 'linear') return base * multiplier
  // Sublinear: base * multiplier^0.8
  return base * Math.pow(multiplier, 0.8)
}

function formatAmount(amount) {
  if (amount >= 10) return Math.round(amount).toString()
  if (amount >= 1) return (Math.round(amount * 4) / 4).toFixed(2).replace(/\.?0+$/, '')
  // Small amounts: show to 2 decimal places
  return (Math.round(amount * 100) / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

function renderIngredients(multiplier) {
  const list = document.getElementById('ingredients-list')
  list.innerHTML = ''

  recipe.forEach(item => {
    const naive = item.base * multiplier
    const smart = scaleAmount(item.base, multiplier, item.scaling)
    const diff = item.scaling === 'sublinear' && multiplier > 1
    const reduction = diff ? Math.round((1 - smart / naive) * 100) : 0

    const row = document.createElement('div')
    row.className = `ingredient-row ${item.scaling}`
    row.innerHTML = `
      <div class="ing-name">
        <span class="ing-dot ${item.scaling}"></span>
        ${item.name}
      </div>
      <div class="ing-base">${formatAmount(item.base)} ${item.unit}</div>
      <div class="ing-naive">${formatAmount(naive)} ${item.unit}</div>
      <div class="ing-smart">
        ${formatAmount(smart)} ${item.unit}
        ${diff && reduction > 0 ? `<span class="reduction">-${reduction}%</span>` : ''}
      </div>
    `
    list.appendChild(row)
  })
}

// Slider interaction
const slider = document.getElementById('scale-slider')
const scaleDisplay = document.getElementById('scale-value')

function updateScale() {
  const val = parseFloat(slider.value)
  scaleDisplay.textContent = `${val}x batch`

  // Update CSS custom property for slider fill
  const pct = ((val - 1) / 9) * 100
  slider.style.setProperty('--fill', `${pct}%`)

  renderIngredients(val)
}

slider.addEventListener('input', updateScale)
updateScale()

// Email capture — stores in localStorage for demo (no backend)
const form = document.getElementById('signup-form')
const successMsg = document.getElementById('signup-success')
const emailInput = document.getElementById('email-input')

// Check if already signed up
if (localStorage.getItem('spicescale_email')) {
  form.hidden = true
  successMsg.hidden = false
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = emailInput.value.trim()
  if (!email) return

  // Store locally (production: send to backend/API)
  localStorage.setItem('spicescale_email', email)

  // Collect in a simple array for demo export
  const signups = JSON.parse(localStorage.getItem('spicescale_signups') || '[]')
  signups.push({ email, timestamp: new Date().toISOString() })
  localStorage.setItem('spicescale_signups', JSON.stringify(signups))

  form.hidden = true
  successMsg.hidden = false
})
