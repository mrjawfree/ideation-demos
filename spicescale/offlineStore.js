const DB_NAME = 'spicescale-offline'
const DB_VERSION = 1
const RECIPES_STORE = 'recipes'
const WRITE_QUEUE_STORE = 'writeQueue'

let db = null

function openDB() {
  if (db) return Promise.resolve(db)
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains(RECIPES_STORE)) {
        database.createObjectStore(RECIPES_STORE, { keyPath: 'id' })
      }
      if (!database.objectStoreNames.contains(WRITE_QUEUE_STORE)) {
        const store = database.createObjectStore(WRITE_QUEUE_STORE, { keyPath: 'queueId', autoIncrement: true })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
    request.onsuccess = (event) => {
      db = event.target.result
      resolve(db)
    }
    request.onerror = (event) => reject(event.target.error)
  })
}

export async function saveRecipeOffline(recipe) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(RECIPES_STORE, 'readwrite')
    tx.objectStore(RECIPES_STORE).put(recipe)
    tx.oncomplete = () => resolve()
    tx.onerror = (event) => reject(event.target.error)
  })
}

export async function getAllRecipesOffline() {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(RECIPES_STORE, 'readonly')
    const request = tx.objectStore(RECIPES_STORE).getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = (event) => reject(event.target.error)
  })
}

export async function getRecipeOffline(id) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(RECIPES_STORE, 'readonly')
    const request = tx.objectStore(RECIPES_STORE).get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = (event) => reject(event.target.error)
  })
}

export async function deleteRecipeOffline(id) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(RECIPES_STORE, 'readwrite')
    tx.objectStore(RECIPES_STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = (event) => reject(event.target.error)
  })
}

export async function enqueueWrite(action) {
  const database = await openDB()
  const entry = { ...action, timestamp: Date.now(), synced: false }
  return new Promise((resolve, reject) => {
    const tx = database.transaction(WRITE_QUEUE_STORE, 'readwrite')
    tx.objectStore(WRITE_QUEUE_STORE).add(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = (event) => reject(event.target.error)
  })
}

export async function getPendingWrites() {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(WRITE_QUEUE_STORE, 'readonly')
    const request = tx.objectStore(WRITE_QUEUE_STORE).getAll()
    request.onsuccess = () => {
      const pending = request.result.filter(entry => !entry.synced)
      resolve(pending)
    }
    request.onerror = (event) => reject(event.target.error)
  })
}

export async function markWriteSynced(queueId) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(WRITE_QUEUE_STORE, 'readwrite')
    const store = tx.objectStore(WRITE_QUEUE_STORE)
    const request = store.get(queueId)
    request.onsuccess = () => {
      const entry = request.result
      if (entry) {
        entry.synced = true
        store.put(entry)
      }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = (event) => reject(event.target.error)
  })
}

export async function clearSyncedWrites() {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(WRITE_QUEUE_STORE, 'readwrite')
    const store = tx.objectStore(WRITE_QUEUE_STORE)
    const request = store.getAll()
    request.onsuccess = () => {
      for (const entry of request.result) {
        if (entry.synced) store.delete(entry.queueId)
      }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = (event) => reject(event.target.error)
  })
}
