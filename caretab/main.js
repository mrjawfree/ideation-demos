// CareTab — Waitlist form handler

const form = document.getElementById('waitlist-form')
const emailInput = document.getElementById('email-input')
const successMsg = document.getElementById('waitlist-success')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = emailInput.value.trim()
  if (!email) return

  // Store locally (swap for real API when backend is ready)
  const waitlist = JSON.parse(localStorage.getItem('caretab_waitlist') || '[]')
  if (!waitlist.includes(email)) {
    waitlist.push(email)
    localStorage.setItem('caretab_waitlist', JSON.stringify(waitlist))
  }

  // Show success state
  form.hidden = true
  document.querySelector('.form-note').hidden = true
  successMsg.hidden = false
})

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'))
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})
