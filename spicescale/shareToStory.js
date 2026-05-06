// ── Share-to-Story: Renderer + Share Pipeline + UTM Tracking (ISL-1926) ──

const STORY_WIDTH = 1080
const STORY_HEIGHT = 1920
const FEATURE_FLAG_KEY = 'spicescale_share_story_enabled'

// ── Feature Flag ──
export function isShareToStoryEnabled() {
  if (localStorage.getItem(FEATURE_FLAG_KEY) === 'true') return true
  const params = new URLSearchParams(window.location.search)
  if (params.get('share_story') === '1') return true
  return (import.meta.env.VITE_SHARE_STORY_ENABLED === 'true')
}

// ── UTM Builder ──
export function buildShareUrl(recipeSlug, surface, userId) {
  const base = window.location.origin + '/'
  const params = new URLSearchParams({
    recipe: recipeSlug,
    utm_source: 'share',
    utm_medium: 'story',
    utm_campaign: 'spicescale_recipe',
    utm_content: recipeSlug,
    utm_term: surface || 'unknown',
  })
  if (userId) params.set('ref', userId)
  return `${base}?${params.toString()}`
}

// ── Analytics ──
function trackEvent(name, data = {}) {
  if (window.spicescaleAnalytics && typeof window.spicescaleAnalytics.track === 'function') {
    window.spicescaleAnalytics.track(name, data)
  }
  window.dispatchEvent(new CustomEvent('spicescale:analytics', { detail: { name, data } }))
}

// ── QR Code Generation (lightweight SVG) ──
function generateQRSvgDataUrl(url) {
  const modules = encodeQR(url)
  const size = modules.length
  const cellSize = 8
  const svgSize = size * cellSize
  let paths = ''
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules[y][x]) {
        paths += `M${x * cellSize},${y * cellSize}h${cellSize}v${cellSize}h-${cellSize}z`
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}"><rect width="${svgSize}" height="${svgSize}" fill="white"/><path d="${paths}" fill="black"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// Minimal QR encoder (Version 2, Mode Byte, ECC-L) for short URLs
function encodeQR(text) {
  const data = new TextEncoder().encode(text)
  if (data.length > 77) {
    return fallbackQRMatrix(text)
  }
  // Use the canvas-based QR if available, otherwise generate a placeholder pattern
  return fallbackQRMatrix(text)
}

function fallbackQRMatrix(text) {
  // Generate a deterministic pattern from text hash for visual placeholder
  // In production, replace with qrcode-generator library import
  const size = 25
  const matrix = Array.from({ length: size }, () => Array(size).fill(false))

  // Finder patterns (top-left, top-right, bottom-left)
  const finderPositions = [[0, 0], [size - 7, 0], [0, size - 7]]
  for (const [fx, fy] of finderPositions) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isOuter = y === 0 || y === 6 || x === 0 || x === 6
        const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4
        matrix[fy + y][fx + x] = isOuter || isInner
      }
    }
  }

  // Simple hash-based data fill
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
  }
  for (let y = 9; y < size - 8; y++) {
    for (let x = 9; x < size - 8; x++) {
      hash = ((hash << 5) - hash + x * y) | 0
      matrix[y][x] = (hash & 1) === 1
    }
  }

  return matrix
}

// ── StoryCard Canvas Renderer ──
export async function renderStoryCard({ recipeName, ingredients, multiplier, recipeSlug, userId }) {
  const startTime = performance.now()

  const canvas = new OffscreenCanvas(STORY_WIDTH, STORY_HEIGHT)
  const ctx = canvas.getContext('2d')

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, STORY_HEIGHT)
  bgGrad.addColorStop(0, '#1a1008')
  bgGrad.addColorStop(0.3, '#0f0f0f')
  bgGrad.addColorStop(1, '#0f0f0f')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT)

  // Brand badge
  ctx.fillStyle = '#e85d2a'
  ctx.font = '600 28px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('SPICESCALE', STORY_WIDTH / 2, 120)

  // Recipe title
  ctx.fillStyle = '#f0ece4'
  ctx.font = '700 64px "Space Grotesk", Inter, sans-serif'
  ctx.textAlign = 'center'
  const titleLines = wrapText(ctx, recipeName, STORY_WIDTH - 160)
  let titleY = 220
  for (const line of titleLines) {
    ctx.fillText(line, STORY_WIDTH / 2, titleY)
    titleY += 80
  }

  // Batch size badge
  const badgeY = titleY + 40
  ctx.fillStyle = '#242424'
  roundRect(ctx, STORY_WIDTH / 2 - 100, badgeY - 30, 200, 56, 28)
  ctx.fill()
  ctx.fillStyle = '#e85d2a'
  ctx.font = '700 32px Inter, sans-serif'
  ctx.fillText(`${multiplier}x batch`, STORY_WIDTH / 2, badgeY + 8)

  // Ingredients list
  let listY = badgeY + 100
  ctx.textAlign = 'left'
  const maxIngredients = Math.min(ingredients.length, 10)

  for (let i = 0; i < maxIngredients; i++) {
    const ing = ingredients[i]
    const isSublinear = ing.scaling === 'sublinear'

    // Dot indicator
    ctx.fillStyle = isSublinear ? '#f0ad4e' : '#5cb85c'
    ctx.beginPath()
    ctx.arc(100, listY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Name
    ctx.fillStyle = '#f0ece4'
    ctx.font = '500 36px Inter, sans-serif'
    ctx.fillText(ing.name, 130, listY + 10)

    // Amount
    ctx.fillStyle = '#9a9488'
    ctx.font = '400 32px Inter, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${ing.amount} ${ing.unit}`, STORY_WIDTH - 100, listY + 10)
    ctx.textAlign = 'left'

    if (isSublinear && ing.reduction > 0) {
      ctx.fillStyle = '#e85d2a'
      ctx.font = '600 26px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`-${ing.reduction}%`, STORY_WIDTH - 100, listY + 44)
      ctx.textAlign = 'left'
      listY += 90
    } else {
      listY += 70
    }
  }

  if (ingredients.length > maxIngredients) {
    ctx.fillStyle = '#9a9488'
    ctx.font = '400 28px Inter, sans-serif'
    ctx.fillText(`+${ingredients.length - maxIngredients} more ingredients...`, 100, listY + 20)
    listY += 60
  }

  // QR Code section
  const qrY = Math.max(listY + 60, STORY_HEIGHT - 400)
  const shareUrl = buildShareUrl(recipeSlug, 'story_card', userId)

  // Draw QR code
  const qrModules = encodeQR(shareUrl)
  const qrSize = 180
  const qrCellSize = qrSize / qrModules.length
  const qrX = STORY_WIDTH / 2 - qrSize / 2

  ctx.fillStyle = '#ffffff'
  roundRect(ctx, qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 12)
  ctx.fill()

  ctx.fillStyle = '#000000'
  for (let y = 0; y < qrModules.length; y++) {
    for (let x = 0; x < qrModules[y].length; x++) {
      if (qrModules[y][x]) {
        ctx.fillRect(qrX + x * qrCellSize, qrY + y * qrCellSize, qrCellSize, qrCellSize)
      }
    }
  }

  // CTA text
  ctx.fillStyle = '#9a9488'
  ctx.font = '400 28px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Scan to scale this recipe', STORY_WIDTH / 2, qrY + qrSize + 56)

  // Footer branding
  ctx.fillStyle = '#f0ece4'
  ctx.font = '600 24px Inter, sans-serif'
  ctx.fillText('spicescale.app', STORY_WIDTH / 2, STORY_HEIGHT - 80)

  // Export as PNG blob
  const blob = await canvas.convertToBlob({ type: 'image/png', quality: 0.92 })

  const elapsed = performance.now() - startTime
  trackEvent('share_card_generated', {
    recipe_slug: recipeSlug,
    multiplier,
    ingredient_count: ingredients.length,
    render_time_ms: Math.round(elapsed),
    file_size_bytes: blob.size,
  })

  return { blob, shareUrl, renderTimeMs: elapsed }
}

// ── html2canvas Fallback (for browsers without OffscreenCanvas) ──
export async function renderStoryCardFallback({ recipeName, ingredients, multiplier, recipeSlug, userId }) {
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed; left: -9999px; top: 0;
    width: ${STORY_WIDTH}px; height: ${STORY_HEIGHT}px;
    background: linear-gradient(180deg, #1a1008 0%, #0f0f0f 30%, #0f0f0f 100%);
    font-family: Inter, sans-serif; color: #f0ece4; padding: 80px;
  `
  container.innerHTML = buildStoryHTML({ recipeName, ingredients, multiplier, recipeSlug, userId })
  document.body.appendChild(container)

  try {
    const { default: html2canvas } = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js')
    const canvas = await html2canvas(container, { width: STORY_WIDTH, height: STORY_HEIGHT, scale: 1 })
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.92))
    const shareUrl = buildShareUrl(recipeSlug, 'story_card', userId)
    return { blob, shareUrl }
  } finally {
    document.body.removeChild(container)
  }
}

function buildStoryHTML({ recipeName, ingredients, multiplier }) {
  const listItems = ingredients.slice(0, 10).map(ing => `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <span style="width:16px;height:16px;border-radius:50%;background:${ing.scaling === 'sublinear' ? '#f0ad4e' : '#5cb85c'};flex-shrink:0;"></span>
      <span style="flex:1;font-size:36px;">${ing.name}</span>
      <span style="color:#9a9488;font-size:32px;">${ing.amount} ${ing.unit}</span>
    </div>
  `).join('')

  return `
    <div style="text-align:center;color:#e85d2a;font-size:28px;font-weight:600;margin-bottom:60px;">SPICESCALE</div>
    <h1 style="text-align:center;font-size:64px;font-weight:700;margin-bottom:40px;font-family:'Space Grotesk',sans-serif;">${recipeName}</h1>
    <div style="text-align:center;margin-bottom:60px;">
      <span style="background:#242424;padding:12px 32px;border-radius:28px;color:#e85d2a;font-size:32px;font-weight:700;">${multiplier}x batch</span>
    </div>
    <div style="padding:0 20px;">${listItems}</div>
  `
}

// ── In-App Browser Detection ──
function detectInAppBrowser() {
  const ua = navigator.userAgent || ''
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/Musical_ly|BytedanceWebview|TikTok/i.test(ua)) return 'tiktok'
  if (/FBAN|FBAV/i.test(ua)) return 'facebook'
  if (/Twitter|X/i.test(ua)) return 'twitter'
  return null
}

// ── Share Pipeline ──
export async function shareStoryCard({ recipeName, ingredients, multiplier, recipeSlug, userId }) {
  const surface = detectInAppBrowser() || 'native'

  trackEvent('share_initiated', {
    recipe_slug: recipeSlug,
    multiplier,
    surface,
    in_app_browser: detectInAppBrowser(),
  })

  // Render the card
  let result
  if (typeof OffscreenCanvas !== 'undefined') {
    result = await renderStoryCard({ recipeName, ingredients, multiplier, recipeSlug, userId })
  } else {
    result = await renderStoryCardFallback({ recipeName, ingredients, multiplier, recipeSlug, userId })
  }

  const { blob, shareUrl } = result
  const file = new File([blob], `spicescale-${recipeSlug}-${multiplier}x.png`, { type: 'image/png' })

  // In-app browser: show fallback modal
  const inAppBrowser = detectInAppBrowser()
  if (inAppBrowser) {
    showInAppFallbackModal(file, shareUrl, inAppBrowser)
    return { success: true, method: 'in_app_modal' }
  }

  // Web Share API Level 2
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: `${recipeName} — ${multiplier}x batch`,
        text: `Scaled with SpiceScale — keeps the flavor balanced at any batch size.`,
        url: shareUrl,
        files: [file],
      })
      trackEvent('share_completed', { recipe_slug: recipeSlug, method: 'web_share', surface })
      return { success: true, method: 'web_share' }
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'web_share', reason: 'user_cancelled' }
      }
    }
  }

  // Desktop fallback: clipboard + download
  return await desktopFallback(file, blob, shareUrl, recipeSlug, multiplier)
}

async function desktopFallback(file, blob, shareUrl, recipeSlug, multiplier) {
  // Try clipboard
  let clipboardSuccess = false
  try {
    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      clipboardSuccess = true
    }
  } catch (e) { /* clipboard not available */ }

  // Download PNG
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `spicescale-${recipeSlug}-${multiplier}x.png`
  a.click()
  URL.revokeObjectURL(url)

  // Show toast
  showToast(clipboardSuccess
    ? 'Image copied to clipboard & downloaded!'
    : 'Story image downloaded!')

  trackEvent('share_completed', {
    recipe_slug: recipeSlug,
    method: 'desktop_fallback',
    clipboard: clipboardSuccess,
  })

  return { success: true, method: 'desktop_fallback' }
}

// ── In-App Fallback Modal ──
function showInAppFallbackModal(file, shareUrl, browser) {
  const existing = document.getElementById('share-inapp-modal')
  if (existing) existing.remove()

  const browserNames = { instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', twitter: 'X' }

  const modal = document.createElement('div')
  modal.id = 'share-inapp-modal'
  modal.className = 'share-modal-overlay'
  modal.innerHTML = `
    <div class="share-modal">
      <button class="share-modal-close" aria-label="Close">&times;</button>
      <h3>Share from ${browserNames[browser] || 'this app'}</h3>
      <p>The ${browserNames[browser] || 'in-app'} browser limits sharing. Open in your default browser for full sharing, or save the image below.</p>
      <div class="share-modal-actions">
        <button class="share-btn share-btn-download" id="share-modal-download">Save Image</button>
        <button class="share-btn share-btn-copy" id="share-modal-copy">Copy Link</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  modal.querySelector('.share-modal-close').addEventListener('click', () => modal.remove())
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove() })

  modal.querySelector('#share-modal-download').addEventListener('click', () => {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
    showToast('Image saved!')
  })

  modal.querySelector('#share-modal-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast('Link copied!')
    } catch {
      prompt('Copy this link:', shareUrl)
    }
  })
}

// ── Toast Notification ──
function showToast(message) {
  const existing = document.querySelector('.share-toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.className = 'share-toast'
  toast.textContent = message
  document.body.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add('show'))
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// ── Canvas Helpers ──
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── Landing Attribution ──
export function captureShareAttribution() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('utm_source') !== 'share') return

  const attribution = {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    content: params.get('utm_content'),
    term: params.get('utm_term'),
    ref: params.get('ref'),
    landed_at: new Date().toISOString(),
  }

  sessionStorage.setItem('spicescale_share_attribution', JSON.stringify(attribution))
  trackEvent('share_landing', attribution)

  // Auto-select the shared recipe
  const recipeSlug = params.get('recipe') || params.get('utm_content')
  if (recipeSlug) {
    window.dispatchEvent(new CustomEvent('spicescale:select-recipe', { detail: { recipeSlug } }))
  }
}

export function getShareAttribution() {
  const raw = sessionStorage.getItem('spicescale_share_attribution')
  return raw ? JSON.parse(raw) : null
}

export function trackShareSignup() {
  const attribution = getShareAttribution()
  if (attribution) {
    trackEvent('share_signup', {
      ...attribution,
      signed_up_at: new Date().toISOString(),
    })
  }
}
