import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../data')
const DATA_FILE = path.join(DATA_DIR, 'desk.json')

export function dataFile() {
  return DATA_FILE
}

export function loadSnapshot() {
  try {
    if (!fs.existsSync(DATA_FILE)) return null
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveSnapshot(store) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  const snap = {
    savedAt: new Date().toISOString(),
    users: store.users,
    orgs: store.orgs,
    dnaByOrg: store.dnaByOrg,
    articles: store.articles,
    pitches: store.pitches,
    meshHosts: store.meshHosts,
    meshCopies: store.meshCopies,
    ledger: store.ledger,
    prTouches: store.prTouches,
    hosting: store.hosting
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(snap, null, 2))
}

export function attachPersist(store) {
  let timer = null
  const flush = () => {
    timer = null
    try {
      saveSnapshot(store)
    } catch (err) {
      console.error('desk persist failed', err.message)
    }
  }
  store.persist = () => {
    if (timer) return
    timer = setTimeout(flush, 40)
  }
  store.persistNow = flush
  return store
}
