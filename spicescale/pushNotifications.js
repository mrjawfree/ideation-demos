const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function getPermissionState() {
  if (!isPushSupported()) return 'unsupported'
  return Notification.permission
}

export async function getCurrentSubscription() {
  const reg = await navigator.serviceWorker.ready
  return reg.pushManager.getSubscription()
}

export async function subscribeToPush() {
  if (!VAPID_PUBLIC_KEY) {
    console.warn('VAPID public key not configured')
    return null
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const reg = await navigator.serviceWorker.ready
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  })

  await saveSubscriptionToServer(subscription)
  localStorage.setItem('spicescale_push_enabled', 'true')
  return subscription
}

export async function unsubscribeFromPush() {
  const subscription = await getCurrentSubscription()
  if (subscription) {
    await removeSubscriptionFromServer(subscription)
    await subscription.unsubscribe()
  }
  localStorage.setItem('spicescale_push_enabled', 'false')
}

export function isOptedIn() {
  return localStorage.getItem('spicescale_push_enabled') === 'true'
}

async function saveSubscriptionToServer(subscription) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return

  const keys = subscription.toJSON()
  const userId = localStorage.getItem('spicescale_email') || 'anonymous'

  await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      user_id: userId,
      endpoint: keys.endpoint,
      p256dh: keys.keys.p256dh,
      auth: keys.keys.auth
    })
  })
}

async function removeSubscriptionFromServer(subscription) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return

  const endpoint = subscription.endpoint
  await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  })
}
