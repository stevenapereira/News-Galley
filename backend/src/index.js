import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import {
  createStore,
  RETAINERS,
  PUBLICATIONS,
  HOSTING_OPTIONS,
  AUTHORITY,
  modeledDa,
  rungForDa
} from './store.js'
import { scanSite } from './dna.js'
import { startWorker } from './worker.js'
import { writerStatus, composeArticle } from './writer.js'

const app = express()
const store = createStore()
startWorker(store)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.replace(/^Bearer\s+/i, '')
  const session = store.sessions.get(token)
  if (!session) return res.status(401).json({ error: 'desk closed' })
  req.user = store.users.find((u) => u.id === session.userId)
  if (!req.user) return res.status(401).json({ error: 'unknown desk' })
  req.org = store.orgs.find((o) => o.id === req.user.orgId)
  next()
}

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    orgId: u.orgId,
    onboardingComplete: Boolean(u.onboardingComplete)
  }
}

function findUserByEmail(email) {
  const needle = String(email || '').trim().toLowerCase()
  return store.users.find((u) => (u.email || '').toLowerCase() === needle)
}

function slugify(value) {
  return String(value || 'desk')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32) || 'desk'
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, floor: 'open', writer: writerStatus(), persisted: true })
})

app.get('/api/public/retainers', (_req, res) => {
  res.json(Object.values(RETAINERS))
})

app.get('/api/public/publications', (_req, res) => {
  res.json(PUBLICATIONS.map((p) => ({
    id: p.id, name: p.name, da: p.da, rung: p.rung, beat: p.beat, landscape: p.landscape, style: p.style
  })))
})

app.get('/api/public/hosting', (_req, res) => {
  res.json(HOSTING_OPTIONS)
})

app.post('/api/public/scan', async (req, res) => {
  const url = (req.body?.url || '').trim()
  if (!url) return res.status(400).json({ error: 'url required' })
  const dna = await scanSite(url)
  res.json(dna)
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const user = findUserByEmail(email)
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'incorrect desk' })
  }
  const token = crypto.randomBytes(18).toString('hex')
  store.sessions.set(token, { userId: user.id, at: store.now() })
  const org = store.orgs.find((o) => o.id === user.orgId)
  res.json({ token, user: publicUser(user), org })
})

app.post('/api/auth/register', (req, res) => {
  const email = String(req.body?.email || '').trim()
  const password = String(req.body?.password || '')
  const name = String(req.body?.name || email.split('@')[0] || 'Desk')
  const url = String(req.body?.url || '').trim()
  const retainer = RETAINERS[req.body?.retainer] ? req.body.retainer : 'signal'
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  if (findUserByEmail(email)) return res.status(409).json({ error: 'desk already open' })
  const orgId = store.id('org')
  const slug = slugify(url || email)
  const org = {
    id: orgId,
    name,
    domain: url.replace(/^https?:\/\//, '').split('/')[0] || '',
    retainer,
    retainerActive: true,
    meshToken: 'mesh_' + crypto.randomBytes(6).toString('hex'),
    slug,
    createdAt: store.now()
  }
  const user = {
    id: store.id('usr'),
    email,
    password,
    name,
    role: 'desk',
    orgId,
    onboardingComplete: false
  }
  store.orgs.push(org)
  store.users.push(user)
  store.hosting.push({
    id: store.id('host'),
    orgId,
    kind: 'galley_subdomain',
    slug,
    publicUrl: `https://${slug}.newsgalley.com`,
    dns: { cname: `${slug}.newsgalley.com`, a: null, status: 'pending' },
    createdAt: store.now()
  })
  store.stamp(orgId, 'retainer.clear', orgId, RETAINERS[retainer].name)
  store.persist?.()
  const token = crypto.randomBytes(18).toString('hex')
  store.sessions.set(token, { userId: user.id, at: store.now() })
  res.status(201).json({ token, user: publicUser(user), org })
})

app.get('/api/me', auth, (req, res) => {
  res.json({
    user: publicUser(req.user),
    org: req.org,
    writer: writerStatus(),
    retainer: RETAINERS[req.org.retainer],
    hosting: HOSTING_OPTIONS
  })
})

app.post('/api/onboarding', auth, async (req, res) => {
  const { url, keywords, retainer, hostingKind, slug } = req.body || {}
  if (retainer && RETAINERS[retainer]) {
    req.org.retainer = retainer
    req.org.retainerActive = true
  }
  let dna = store.dnaByOrg[req.org.id]
  if (url) {
    dna = await scanSite(url)
    req.org.domain = dna.host
    if (!req.org.name || req.org.name === req.user.email) req.org.name = dna.title
  }
  if (Array.isArray(keywords) && dna) {
    const chosen = new Set(keywords.map((k) => String(k).toLowerCase()))
    dna.keywordGaps = (dna.keywordGaps || []).map((g) => ({
      ...g,
      chosen: chosen.has(String(g.term).toLowerCase())
    }))
    keywords.filter((k) => !(dna.keywordGaps || []).some((g) => g.term === k)).forEach((term) => {
      dna.keywordGaps.push({ term, intent: 'custom', volume: 0, chosen: true })
    })
  }
  if (dna) {
    dna.frozen = true
    dna.frozenAt = store.now()
    store.dnaByOrg[req.org.id] = dna
    store.stamp(req.org.id, 'dna.freeze', req.org.id, dna.url)
  }
  if (hostingKind) {
    const kind = HOSTING_OPTIONS.find((h) => h.id === hostingKind)?.id || 'galley_subdomain'
    const useSlug = slugify(slug || req.org.slug || req.org.domain || req.user.email)
    req.org.slug = useSlug
    const existing = store.hosting.find((h) => h.orgId === req.org.id)
    const record = existing || {
      id: store.id('host'),
      orgId: req.org.id,
      createdAt: store.now()
    }
    record.kind = kind
    record.slug = useSlug
    if (kind === 'galley_subdomain') {
      record.publicUrl = `https://${useSlug}.newsgalley.com`
      record.dns = { cname: null, a: null, status: 'live' }
    } else if (kind === 'cname') {
      record.publicUrl = `https://blog.${req.org.domain || useSlug}`
      record.dns = {
        cname: { host: `blog.${req.org.domain || useSlug}`, target: 'hosts.newsgalley.com' },
        a: { host: '@', target: '203.0.113.17' },
        status: 'waiting'
      }
    } else {
      record.publicUrl = req.body?.blogUrl || dna?.url || ''
      record.dns = { cname: null, a: null, status: 'own' }
    }
    if (!existing) store.hosting.push(record)
  }
  req.user.onboardingComplete = true
  store.persist?.()
  res.json({
    user: publicUser(req.user),
    org: req.org,
    dna: store.dnaByOrg[req.org.id] || null,
    hosting: store.hosting.find((h) => h.orgId === req.org.id) || null
  })
})

app.get('/api/floor', auth, (req, res) => {
  const orgId = req.org.id
  const articles = store.articles.filter((a) => a.orgId === orgId)
  const pitches = store.pitches.filter((p) => p.orgId === orgId)
  const ledger = store.ledger.filter((l) => l.orgId === orgId)
  const meshHosts = store.meshHosts.filter((h) => h.orgId === orgId)
  const meshCopies = store.meshCopies.filter((c) => c.orgId === orgId)
  const prTouches = store.prTouches.filter((p) => p.orgId === orgId)
  const plan = RETAINERS[req.org.retainer]
  const byStatus = articles.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {})
  const rungCounts = { high: 0, mid: 0, unfashionable: 0 }
  articles.forEach((a) => {
    rungCounts[a.rung] = (rungCounts[a.rung] || 0) + 1
  })
  const timeline = articles
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((a, i) => ({
      id: a.id,
      title: a.title,
      status: a.status,
      due: plan.reviewHours,
      slot: i + 1,
      of: plan.articles
    }))
  res.json({
    org: req.org,
    plan,
    dna: store.dnaByOrg[orgId] || null,
    hosting: store.hosting.find((h) => h.orgId === orgId) || null,
    counts: {
      articles: articles.length,
      pitches: pitches.length,
      placed: articles.filter((a) => a.status === 'placed').length,
      review: articles.filter((a) => a.status === 'review').length,
      mesh: meshCopies.length,
      ledger: ledger.length,
      byStatus,
      rungs: rungCounts
    },
    ticks: store.tickLog.slice(0, 8),
    writer: writerStatus(),
    recentLedger: ledger.slice(-8).reverse(),
    recentPitches: pitches.slice(-6).reverse(),
    recentArticles: articles.slice(-8).reverse(),
    prTouches: prTouches.slice(-4).reverse(),
    meshHosts,
    meshCopies,
    timeline
  })
})

app.post('/api/dna/scan', auth, async (req, res) => {
  const url = (req.body?.url || '').trim()
  if (!url) return res.status(400).json({ error: 'url required' })
  const dna = await scanSite(url)
  store.dnaByOrg[req.org.id] = dna
  req.org.domain = dna.host
  store.stamp(req.org.id, 'dna.scan', req.org.id, dna.url)
  store.persist?.()
  res.json(dna)
})

app.post('/api/dna/freeze', auth, (req, res) => {
  const dna = store.dnaByOrg[req.org.id]
  if (!dna) return res.status(400).json({ error: 'scan first' })
  if (Array.isArray(req.body?.keywords)) {
    const chosen = new Set(req.body.keywords.map((k) => String(k).toLowerCase()))
    dna.keywordGaps = (dna.keywordGaps || []).map((g) => ({
      ...g,
      chosen: chosen.has(String(g.term).toLowerCase())
    }))
  }
  dna.frozen = true
  dna.frozenAt = store.now()
  store.stamp(req.org.id, 'dna.freeze', req.org.id, dna.url)
  store.persist?.()
  res.json(dna)
})

app.get('/api/articles', auth, (req, res) => {
  res.json(store.articles.filter((a) => a.orgId === req.org.id).slice().reverse())
})

app.get('/api/articles/:id', auth, (req, res) => {
  const art = store.articles.find((a) => a.id === req.params.id && a.orgId === req.org.id)
  if (!art) return res.status(404).json({ error: 'not on the floor' })
  const pitches = store.pitches.filter((p) => p.articleId === art.id)
  const copies = store.meshCopies.filter((c) => c.articleId === art.id)
  res.json({
    article: art,
    pitches,
    copies,
    pub: PUBLICATIONS.find((p) => p.id === art.targetPubId),
    authorities: AUTHORITY[store.dnaByOrg[req.org.id]?.landscape] || AUTHORITY.general
  })
})

app.post('/api/articles', auth, (req, res) => {
  const { title, keyword, pubId } = req.body || {}
  const dna = store.dnaByOrg[req.org.id]
  const pub = PUBLICATIONS.find((p) => p.id === pubId)
    || PUBLICATIONS.find((p) => p.landscape === dna?.landscape)
    || PUBLICATIONS.find((p) => p.id === 'galley-review')
  const art = {
    id: store.id('art'),
    orgId: req.org.id,
    title: title || keyword || 'Untitled brief',
    keyword: keyword || title || 'imprint',
    rung: pub ? (pub.da >= 75 ? 'high' : pub.da >= 40 ? 'mid' : 'unfashionable') : 'mid',
    status: 'drafting',
    body: '',
    dek: req.body?.dek || '',
    wordCount: 0,
    targetPubId: pub.id,
    canonicalUrl: null,
    createdAt: store.now(),
    updatedAt: store.now()
  }
  store.articles.push(art)
  store.stamp(req.org.id, 'queue.brief', art.id, art.title)
  store.persist?.()
  res.status(201).json(art)
})

app.put('/api/articles/:id', auth, (req, res) => {
  const art = store.articles.find((a) => a.id === req.params.id && a.orgId === req.org.id)
  if (!art) return res.status(404).json({ error: 'not on the floor' })
  if (typeof req.body?.title === 'string') art.title = req.body.title
  if (typeof req.body?.body === 'string') {
    art.body = req.body.body
    art.wordCount = art.body.split(/\s+/).filter(Boolean).length
  }
  if (typeof req.body?.dek === 'string') art.dek = req.body.dek
  if (typeof req.body?.keyword === 'string') art.keyword = req.body.keyword
  art.updatedAt = store.now()
  store.stamp(req.org.id, 'article.edit', art.id, art.title)
  store.persist?.()
  res.json(art)
})

app.post('/api/articles/:id/regenerate', auth, async (req, res) => {
  const art = store.articles.find((a) => a.id === req.params.id && a.orgId === req.org.id)
  if (!art) return res.status(404).json({ error: 'not on the floor' })
  art.status = 'drafting'
  art.regenNote = String(req.body?.note || 'Regenerate against the same keyword. Do not turn this into a biography.')
  art.updatedAt = store.now()
  store.stamp(req.org.id, 'article.regen', art.id, art.regenNote)
  const dna = store.dnaByOrg[req.org.id]
  const pub = PUBLICATIONS.find((p) => p.id === art.targetPubId)
  const composed = await composeArticle({
    title: art.title,
    keyword: art.keyword,
    dna,
    pub,
    instruction: art.regenNote
  })
  art.body = composed.body
  art.wordCount = composed.wordCount
  art.source = composed.source
  art.status = 'review'
  art.updatedAt = store.now()
  store.persist?.()
  res.json(art)
})

app.post('/api/articles/:id/approve', auth, (req, res) => {
  const art = store.articles.find((a) => a.id === req.params.id && a.orgId === req.org.id)
  if (!art) return res.status(404).json({ error: 'not on the floor' })
  if (!art.body) return res.status(400).json({ error: 'nothing to approve' })
  art.status = 'approved'
  art.updatedAt = store.now()
  store.stamp(req.org.id, 'article.approve', art.id, art.title)
  store.persist?.()
  res.json(art)
})

app.get('/api/pitches', auth, (req, res) => {
  const rows = store.pitches
    .filter((p) => p.orgId === req.org.id)
    .slice()
    .reverse()
    .map((p) => ({
      ...p,
      pub: PUBLICATIONS.find((x) => x.id === p.pubId),
      article: store.articles.find((a) => a.id === p.articleId)
    }))
  res.json(rows)
})

app.get('/api/publications', auth, (_req, res) => {
  res.json(PUBLICATIONS)
})

app.get('/api/mesh', auth, (req, res) => {
  res.json({
    token: req.org.meshToken,
    hosts: store.meshHosts.filter((h) => h.orgId === req.org.id),
    copies: store.meshCopies.filter((c) => c.orgId === req.org.id).map((c) => ({
      ...c,
      host: store.meshHosts.find((h) => h.id === c.hostId),
      article: store.articles.find((a) => a.id === c.articleId)
    })),
    seats: RETAINERS[req.org.retainer].meshSeats,
    hosting: store.hosting.find((h) => h.orgId === req.org.id) || null,
    options: HOSTING_OPTIONS
  })
})

app.post('/api/mesh/handshake', auth, (req, res) => {
  const { name, url } = req.body || {}
  if (!name || !url) return res.status(400).json({ error: 'name and url required' })
  const plan = RETAINERS[req.org.retainer]
  const used = store.meshHosts.filter((h) => h.orgId === req.org.id).length
  if (used >= plan.meshSeats) return res.status(403).json({ error: 'mesh seats full' })
  const host = {
    id: store.id('mesh'),
    orgId: req.org.id,
    name,
    url,
    token: 'hs_' + crypto.randomBytes(4).toString('hex'),
    status: 'live',
    kind: 'mesh',
    seatsUsed: 1,
    lastHandshake: store.now()
  }
  store.meshHosts.push(host)
  store.stamp(req.org.id, 'mesh.handshake', host.id, url)
  store.persist?.()
  res.status(201).json(host)
})

app.post('/api/hosting', auth, (req, res) => {
  const kind = HOSTING_OPTIONS.find((h) => h.id === req.body?.kind)?.id || 'galley_subdomain'
  const useSlug = slugify(req.body?.slug || req.org.slug || req.org.domain)
  req.org.slug = useSlug
  let record = store.hosting.find((h) => h.orgId === req.org.id)
  if (!record) {
    record = { id: store.id('host'), orgId: req.org.id, createdAt: store.now() }
    store.hosting.push(record)
  }
  record.kind = kind
  record.slug = useSlug
  if (kind === 'galley_subdomain') {
    record.publicUrl = `https://${useSlug}.newsgalley.com`
    record.dns = { cname: null, a: null, status: 'live' }
  } else if (kind === 'cname') {
    record.publicUrl = `https://${req.body?.host || 'blog.' + (req.org.domain || useSlug)}`
    record.dns = {
      cname: { host: req.body?.host || `blog.${req.org.domain || useSlug}`, target: 'hosts.newsgalley.com' },
      a: { host: '@', target: '203.0.113.17' },
      status: 'waiting'
    }
  } else {
    record.publicUrl = req.body?.blogUrl || ''
    record.dns = { status: 'own' }
  }
  store.stamp(req.org.id, 'hosting.set', record.id, kind)
  store.persist?.()
  res.json(record)
})

app.get('/api/ledger', auth, (req, res) => {
  res.json(store.ledger.filter((l) => l.orgId === req.org.id).slice().reverse())
})

app.get('/api/ladder', auth, (req, res) => {
  const articles = store.articles.filter((a) => a.orgId === req.org.id)
  const plan = RETAINERS[req.org.retainer]
  const dna = store.dnaByOrg[req.org.id]
  const rungs = ['high', 'mid', 'unfashionable'].map((rung) => ({
    rung,
    pubs: PUBLICATIONS.filter((p) => p.rung === rung && p.da >= plan.daMin && p.da <= plan.daMax),
    articles: articles.filter((a) => a.rung === rung)
  }))
  res.json({
    plan,
    rungs,
    authorities: AUTHORITY[dna?.landscape] || AUTHORITY.general,
    modeledNote: 'Authority scores are modeled in-house. A live Moz/Ahrefs feed can be connected later. High-quality backlinks come from the landscape list, not from comment spam.'
  })
})

app.post('/api/da/model', auth, (req, res) => {
  const url = (req.body?.url || '').trim()
  if (!url) return res.status(400).json({ error: 'url required' })
  const da = modeledDa(url)
  res.json({ url, da, rung: rungForDa(da) })
})

app.post('/api/retainer', auth, (req, res) => {
  const id = req.body?.id
  if (!RETAINERS[id]) return res.status(400).json({ error: 'unknown desk' })
  req.org.retainer = id
  req.org.retainerActive = true
  store.stamp(req.org.id, 'retainer.clear', req.org.id, RETAINERS[id].name)
  store.persist?.()
  res.json({ org: req.org, plan: RETAINERS[id] })
})

app.get('/api/admin/floor', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'house desk only' })
  res.json({
    orgs: store.orgs,
    users: store.users.map(publicUser),
    articles: store.articles.length,
    pitches: store.pitches.length,
    ledger: store.ledger.length,
    ticks: store.tickLog.slice(0, 12),
    writer: writerStatus()
  })
})

const port = Number(process.env.PORT || 3001)
app.listen(port, '127.0.0.1', () => {
  console.log(`News Galley floor on :${port}`)
})
