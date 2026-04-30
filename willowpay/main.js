// WillowPay — Waitlist form handler

const form = document.getElementById('waitlist-form')
const emailInput = document.getElementById('email-input')
const successMsg = document.getElementById('waitlist-success')
const submitBtn = form.querySelector('button[type="submit"]')

// Set via VITE_FORMSPREE_ENDPOINT in Vercel dashboard (Settings → Environment Variables)
// Create a free form at https://formspree.io → copy the endpoint URL
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = emailInput.value.trim()
  if (!email) return

  if (!FORMSPREE_ENDPOINT) {
    console.error('WillowPay: VITE_FORMSPREE_ENDPOINT is not set. Set it in Vercel environment variables.')
    showError('Waitlist is temporarily unavailable. Please try again soon.')
    return
  }

  submitBtn.disabled = true
  submitBtn.textContent = 'Joining…'

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      showSuccess()
    } else {
      const data = await res.json().catch(() => ({}))
      console.error('Formspree error:', data)
      showError('Something went wrong. Please try again or email us directly.')
    }
  } catch (err) {
    console.error('Submission failed:', err)
    showError('Something went wrong. Please try again or email us directly.')
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = 'Get Early Access'
  }
})

function showSuccess() {
  form.hidden = true
  document.querySelector('.form-note').hidden = true
  successMsg.hidden = false
}

function showError(message) {
  const existing = form.querySelector('.form-error')
  if (existing) {
    existing.textContent = message
    return
  }
  const msg = document.createElement('p')
  msg.className = 'form-error'
  msg.textContent = message
  form.after(msg)
}

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
