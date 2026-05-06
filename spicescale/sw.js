const CACHE_NAME = 'spicescale-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('push', (event) => {
  let data = { title: 'SpiceScale', body: 'Time to cook something!', recipeId: null }
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
    } catch {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    tag: 'spicescale-reminder',
    renotify: true,
    data: { recipeId: data.recipeId, url: data.url || '/' }
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  const recipeId = event.notification.data?.recipeId
  const targetUrl = recipeId ? `/?recipe=${recipeId}` : url

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin)) {
          client.focus()
          client.navigate(targetUrl)
          return
        }
      }
      return clients.openWindow(targetUrl)
    })
  )
})
