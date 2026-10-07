import { RETAINERS, PUBLICATIONS, pitchBody, rungForDa } from './store.js'
import { composeArticle, composePitch } from './writer.js'

function nextGap(store, orgId) {
  const dna = store.dnaByOrg[orgId]
  const used = new Set(store.articles.filter((a) => a.orgId === orgId).map((a) => a.keyword))
  const gaps = (dna?.keywordGaps || []).filter((g) => g.chosen !== false)
  const pool = gaps.length ? gaps : dna?.keywordGaps || []
  return pool.find((g) => !used.has(g.term)) || pool[store.articles.filter((a) => a.orgId === orgId).length % Math.max(pool.length, 1)]
}

function pubsForRetainer(retainer, landscape) {
  const pool = PUBLICATIONS.filter((p) => p.da >= retainer.daMin && p.da <= retainer.daMax)
  const fit = pool.filter((p) => !landscape || p.landscape === landscape || p.landscape === 'general')
  return fit.length ? fit : pool
}

function unusedPub(store, orgId, retainer, landscape) {
  const used = new Set(
    store.articles.filter((a) => a.orgId === orgId && a.targetPubId).map((a) => a.targetPubId)
  )
  const pool = pubsForRetainer(retainer, landscape)
  return pool.find((p) => !used.has(p.id)) || pool[Math.floor(Math.random() * pool.length)]
}

function monthCount(items, orgId, field = 'createdAt') {
  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  return items.filter((i) => i.orgId === orgId && new Date(i[field] || i.sentAt || 0) >= start).length
}

export function startWorker(store) {
  const tick = async () => {
    const t0 = Date.now()
    const notes = []

    for (const org of store.orgs) {
      if (!org.retainerActive) continue
      const plan = RETAINERS[org.retainer] || RETAINERS.signal
      const dna = store.dnaByOrg[org.id]
      const orgArticles = store.articles.filter((a) => a.orgId === org.id)
      const drafting = orgArticles.filter((a) => a.status === 'drafting')

      for (const art of drafting) {
        const pub = PUBLICATIONS.find((p) => p.id === art.targetPubId)
        const composed = await composeArticle({
          title: art.title,
          keyword: art.keyword,
          dna,
          pub,
          instruction: art.regenNote || ''
        })
        art.body = composed.body
        art.wordCount = composed.wordCount
        art.source = composed.source
        art.status = 'review'
        art.updatedAt = store.now()
        store.stamp(org.id, 'article.review', art.id, art.title)
        notes.push(`review ${art.title}`)
        store.persist?.()
      }

      const approved = orgArticles.filter((a) => a.status === 'approved')
      for (const art of approved) {
        if (monthCount(store.pitches, org.id, 'sentAt') >= plan.pitches) break
        const pub = PUBLICATIONS.find((p) => p.id === art.targetPubId) || unusedPub(store, org.id, plan, dna?.landscape)
        const composed = await composePitch({ article: art, pub, dna })
        const pitch = {
          id: store.id('pit'),
          orgId: org.id,
          articleId: art.id,
          pubId: pub.id,
          style: pub.style,
          status: 'sent',
          subject: composed.subject,
          body: composed.body || pitchBody(art, pub),
          sentAt: store.now(),
          updatedAt: store.now()
        }
        store.pitches.push(pitch)
        art.status = 'pitched'
        art.targetPubId = pub.id
        art.updatedAt = store.now()
        store.stamp(org.id, 'pitch.send', pitch.id, `${pub.name} · ${art.title}`)
        notes.push(`pitched ${pub.name}`)
        store.persist?.()
      }

      const pitched = orgArticles.filter((a) => a.status === 'pitched')
      for (const art of pitched) {
        const pitch = store.pitches.find((p) => p.articleId === art.id && p.status === 'sent')
        if (!pitch) continue
        const pub = PUBLICATIONS.find((p) => p.id === pitch.pubId)
        const accept = (art.id.charCodeAt(art.id.length - 1) + Date.now() / 8000) % 5 > 1.6
        if (!accept) continue
        pitch.status = 'accepted'
        pitch.updatedAt = store.now()
        art.status = 'placed'
        const host = store.hosting.find((h) => h.orgId === org.id) || store.meshHosts.find((h) => h.orgId === org.id)
        art.canonicalUrl = host?.publicUrl
          ? `${host.publicUrl.replace(/\/$/, '')}/${art.id}`
          : `https://placed.newsgalley.com/${pub?.id || 'desk'}/${art.id}`
        art.updatedAt = store.now()
        store.stamp(org.id, 'pitch.accept', pitch.id, pub?.name || pitch.pubId)
        const mesh = store.meshHosts.find((h) => h.orgId === org.id && h.status === 'live' && h.kind !== 'galley_subdomain')
        if (mesh) {
          const copy = {
            id: store.id('copy'),
            orgId: org.id,
            articleId: art.id,
            hostId: mesh.id,
            url: `${mesh.url.replace(/\/$/, '')}/${art.id}`,
            noindex: true,
            canonical: art.canonicalUrl,
            createdAt: store.now()
          }
          store.meshCopies.push(copy)
          store.stamp(org.id, 'mesh.copy', copy.id, copy.url)
        }
        notes.push(`placed ${art.title}`)
        store.persist?.()
      }

      const liveCount = monthCount(orgArticles, org.id)
      const waiting = orgArticles.filter((a) => ['drafting', 'review', 'approved', 'pitched'].includes(a.status))
      if (liveCount < plan.articles && waiting.length === 0 && dna) {
        const gap = nextGap(store, org.id)
        if (gap) {
          const pub = unusedPub(store, org.id, plan, dna.landscape)
          const title = titleFromGap(gap.term)
          const art = {
            id: store.id('art'),
            orgId: org.id,
            title,
            keyword: gap.term,
            rung: pub ? rungForDa(pub.da) : 'mid',
            status: 'drafting',
            body: '',
            dek: `Autofill from chosen keyword “${gap.term}”.`,
            wordCount: 0,
            targetPubId: pub?.id || 'galley-review',
            canonicalUrl: null,
            hosting: store.hosting.find((h) => h.orgId === org.id)?.kind || 'galley_subdomain',
            createdAt: store.now(),
            updatedAt: store.now()
          }
          store.articles.push(art)
          store.stamp(org.id, 'queue.autofill', art.id, gap.term)
          notes.push(`briefed ${gap.term}`)
          store.persist?.()
        }
      }

      if (plan.prCadence) {
        const weekAgo = Date.now() - 7 * 24 * 3600 * 1000
        const recent = store.prTouches.filter((p) => p.orgId === org.id && new Date(p.publishedAt).getTime() > weekAgo)
        if (recent.length === 0) {
          const touch = {
            id: store.id('pr'),
            orgId: org.id,
            title: `${org.name} weekly public touch`,
            channel: 'Galley Review',
            status: 'published',
            publishedAt: store.now()
          }
          store.prTouches.push(touch)
          store.stamp(org.id, 'pr.cadence', touch.id, touch.title)
          notes.push('pr cadence')
          store.persist?.()
        }
      }
    }

    store.tickLog.unshift({
      at: store.now(),
      ms: Date.now() - t0,
      notes: notes.slice(0, 8)
    })
    store.tickLog.splice(40)
  }

  tick().catch(() => {})
  const handle = setInterval(() => {
    tick().catch(() => {})
  }, 4000)
  return handle
}

function titleFromGap(term) {
  const map = {
    'UK commercial acting casting': 'What UK commercial casting actually retrieves',
    'British Indian screen actor commercials': 'Type, usage, and the commercial still',
    'Spotlight profile that books': 'A Spotlight page is retrieval, not a brochure',
    'Equity member commercial usage': 'Usage windows are where careers leak money',
    'casting director commercial brief': 'The brief is three constraints, not a vibe',
    'imprint operating system': 'The imprint is the operating system',
    'publication-ready draft workflow': 'Publication-ready is a freeze, not a mood',
    'domain authority ladder pr': 'Climb the ladder without renting a score',
    'mesh syndication canonical': 'One canonical, many noindex copies',
    'weekly pr cadence retainer': 'A public touch every week, on purpose',
    'site dna editorial brief': 'Scan the site before you write the desk'
  }
  return map[term] || term.replace(/\b\w/g, (c) => c.toUpperCase())
}
