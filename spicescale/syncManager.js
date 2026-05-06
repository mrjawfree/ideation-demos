import { getPendingWrites, markWriteSynced, clearSyncedWrites } from './offlineStore.js'

let isSyncing = false
const listeners = new Set()

export function onSyncStatusChange(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function notifyListeners(status) {
  for (const cb of listeners) cb(status)
}

export function isOnline() {
  return navigator.onLine
}

export async function flushWriteQueue() {
  if (isSyncing || !navigator.onLine) return
  isSyncing = true
  notifyListeners('syncing')

  try {
    const pending = await getPendingWrites()
    if (pending.length === 0) {
      notifyListeners('synced')
      isSyncing = false
      return
    }

    for (const entry of pending) {
      try {
        await processWrite(entry)
        await markWriteSynced(entry.queueId)
      } catch (err) {
        console.warn('Sync failed for entry:', entry.queueId, err)
        notifyListeners('error')
        isSyncing = false
        return
      }
    }

    await clearSyncedWrites()
    notifyListeners('synced')
  } catch (err) {
    console.error('Write queue flush failed:', err)
    notifyListeners('error')
  } finally {
    isSyncing = false
  }
}

async function processWrite(entry) {
  switch (entry.type) {
    case 'save_recipe':
    case 'update_recipe':
    case 'delete_recipe':
    case 'cook_log':
      // Future: POST/PUT/DELETE to API endpoint
      // For now, localStorage acts as the "server" for custom recipes
      syncToLocalStorage(entry)
      break
    default:
      console.warn('Unknown write type:', entry.type)
  }
}

function syncToLocalStorage(entry) {
  const key = 'spicescale_custom_recipes'
  const recipes = JSON.parse(localStorage.getItem(key) || '[]')

  switch (entry.type) {
    case 'save_recipe':
    case 'update_recipe': {
      const idx = recipes.findIndex(r => r.id === entry.data.id)
      if (idx >= 0) recipes[idx] = entry.data
      else recipes.push(entry.data)
      break
    }
    case 'delete_recipe': {
      const idx = recipes.findIndex(r => r.id === entry.data.id)
      if (idx >= 0) recipes.splice(idx, 1)
      break
    }
    case 'cook_log': {
      const logs = JSON.parse(localStorage.getItem('spicescale_cook_logs') || '[]')
      logs.push(entry.data)
      localStorage.setItem('spicescale_cook_logs', JSON.stringify(logs))
      return
    }
  }

  localStorage.setItem(key, JSON.stringify(recipes))
}

export function initSyncManager() {
  window.addEventListener('online', () => {
    notifyListeners('online')
    flushWriteQueue()
  })

  window.addEventListener('offline', () => {
    notifyListeners('offline')
  })

  if (navigator.onLine) {
    flushWriteQueue()
  }
}
