import crypto from 'crypto'
import { loadSnapshot, attachPersist } from './persist.js'

export const RETAINERS = {
  signal: {
    id: 'signal',
    name: 'Signal',
    price: 149,
    articles: 4,
    pitches: 8,
    daMin: 28,
    daMax: 61,
    meshSeats: 2,
    prCadence: false,
    exclusives: false,
    slaHours: null,
    reviewHours: 72,
    tickHint: 'Four publication-ready pieces a month. You approve every draft before it leaves review.'
  },
  constellation: {
    id: 'constellation',
    name: 'Constellation',
    price: 449,
    articles: 12,
    pitches: 30,
    daMin: 18,
    daMax: 92,
    meshSeats: 8,
    prCadence: true,
    exclusives: false,
    slaHours: null,
    reviewHours: 24,
    tickHint: 'Twelve pieces, full mid/high ladder, weekly public touch. Drafts still stop in review for you.'
  },
  sovereign: {
    id: 'sovereign',
    name: 'Sovereign',
    price: 1290,
    articles: 40,
    pitches: 120,
    daMin: 12,
    daMax: 96,
    meshSeats: 24,
    prCadence: true,
    exclusives: true,
    slaHours: 4,
    reviewHours: 4,
    tickHint: 'Forty pieces, exclusives, private mesh. Empty-queue SLA of four hours. You still approve copy.'
  }
}

export const PUBLICATIONS = [
  { id: 'the-stage', name: 'The Stage', da: 86, rung: 'high', style: 'outline-first', beat: 'UK theatre & screen', landscape: 'acting' },
  { id: 'backstage', name: 'Backstage', da: 88, rung: 'high', style: 'outline-first', beat: 'casting & commercials', landscape: 'acting' },
  { id: 'equity-journal', name: 'Equity Journal', da: 79, rung: 'high', style: 'embargo', beat: 'performer rights', landscape: 'acting' },
  { id: 'spotlight-notes', name: 'Spotlight Casting Notes', da: 74, rung: 'mid', style: 'outline-first', beat: 'UK casting', landscape: 'acting' },
  { id: 'broadcast', name: 'Broadcast', da: 82, rung: 'high', style: 'embargo', beat: 'UK TV', landscape: 'acting' },
  { id: 'campaign', name: 'Campaign', da: 90, rung: 'high', style: 'founder letter', beat: 'advertising', landscape: 'acting' },
  { id: 'ft-desk', name: 'Financial Times — Tech Desk', da: 94, rung: 'high', style: 'embargo', beat: 'markets & infrastructure', landscape: 'tech' },
  { id: 'wired', name: 'Wired Business', da: 93, rung: 'high', style: 'outline-first', beat: 'systems & culture', landscape: 'tech' },
  { id: 'techcrunch', name: 'TechCrunch Extra Crunch', da: 91, rung: 'high', style: 'founder letter', beat: 'startups', landscape: 'tech' },
  { id: 'protocol', name: 'Protocol', da: 78, rung: 'high', style: 'embargo', beat: 'policy & power', landscape: 'tech' },
  { id: 'rest-of-world', name: 'Rest of World', da: 72, rung: 'mid', style: 'outline-first', beat: 'global tech', landscape: 'tech' },
  { id: 'fast-company', name: 'Fast Company', da: 88, rung: 'high', style: 'founder letter', beat: 'operators', landscape: 'tech' },
  { id: 'venturebeat', name: 'VentureBeat', da: 91, rung: 'high', style: 'outline-first', beat: 'enterprise', landscape: 'tech' },
  { id: 'indie-hackers', name: 'Indie Hackers Journal', da: 64, rung: 'mid', style: 'founder letter', beat: 'builders', landscape: 'tech' },
  { id: 'the-markup', name: 'The Markup', da: 69, rung: 'mid', style: 'outline-first', beat: 'accountability', landscape: 'tech' },
  { id: 'morning-brew', name: 'Morning Brew Extra', da: 76, rung: 'mid', style: 'founder letter', beat: 'daily brief', landscape: 'general' },
  { id: 'substack-ops', name: 'Operator Notes', da: 51, rung: 'mid', style: 'founder letter', beat: 'craft', landscape: 'general' },
  { id: 'local-ledger', name: 'Harbor City Ledger', da: 34, rung: 'unfashionable', style: 'outline-first', beat: 'civic', landscape: 'general' },
  { id: 'trade-press', name: 'Freight & Fiber Weekly', da: 29, rung: 'unfashionable', style: 'embargo', beat: 'trade', landscape: 'general' },
  { id: 'alumni-mag', name: 'North Shore Review', da: 22, rung: 'unfashionable', style: 'founder letter', beat: 'alumni', landscape: 'general' },
  { id: 'galley-review', name: 'Galley Review', da: 41, rung: 'mid', style: 'outline-first', beat: 'house journal', landscape: 'general' }
]

export const AUTHORITY = {
  acting: [
    { name: 'Spotlight', url: 'https://www.spotlight.com', da: 84, note: 'UK casting directory. Canonical for working actors.' },
    { name: 'Equity UK', url: 'https://www.equity.org.uk', da: 80, note: 'Performers’ union. High-trust welfare and rights links.' },
    { name: 'The Stage', url: 'https://www.thestage.co.uk', da: 86, note: 'Trade paper. Casting and industry news.' },
    { name: 'Backstage', url: 'https://www.backstage.com', da: 88, note: 'Commercial and screen breakdowns.' },
    { name: 'IMDbPro', url: 'https://pro.imdb.com', da: 95, note: 'Credit graph. Use sparingly; noindex copies never outrank it.' }
  ],
  tech: [
    { name: 'NIST', url: 'https://www.nist.gov', da: 93, note: 'Standards, not blogs.' },
    { name: 'NCSC', url: 'https://www.ncsc.gov.uk', da: 90, note: 'UK cyber authority.' },
    { name: 'Fast Company', url: 'https://www.fastcompany.com', da: 88, note: 'Operator desk.' }
  ],
  general: [
    { name: 'Galley Review', url: 'https://newsgalley.com/review', da: 41, note: 'House journal.' }
  ]
}

export const HOSTING_OPTIONS = [
  {
    id: 'galley_subdomain',
    name: 'Galley hosts it',
    blurb: 'We publish on client.newsgalley.com. No DNS. Live in minutes. Canonical can move later.'
  },
  {
    id: 'cname',
    name: 'Your domain, our host',
    blurb: 'Point a CNAME (blog.yoursite.com → hosts.newsgalley.com) or an A record. SSL issued after the handshake.'
  },
  {
    id: 'own_blog',
    name: 'Your existing blog',
    blurb: 'WordPress, Ghost, or a custom host. Paste a webhook or mesh token. Canonical stays on your URL.'
  },
  {
    id: 'mesh',
    name: 'Publisher mesh',
    blurb: 'Other people’s blogs handshake with a token. Copies flow both ways. Mesh copies noindex.'
  }
]

const now = () => new Date().toISOString()

function hash(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(5).toString('hex')}`
}

export function modeledDa(url) {
  const raw = crypto.createHash('sha1').update(url || '').digest('hex')
  const n = parseInt(raw.slice(0, 8), 16)
  return 18 + (n % 78)
}

export function rungForDa(da) {
  if (da >= 75) return 'high'
  if (da >= 40) return 'mid'
  return 'unfashionable'
}

export function steveDna() {
  return {
    url: 'https://stevep.uk',
    host: 'stevep.uk',
    title: 'Steve Pereira — British-Indian screen actor',
    voice: 'Trade-press clipped. Facts first, then the implication. Never a biography dump.',
    audience: 'Casting directors, commercial producers, and actors who already keep a Spotlight page.',
    landscape: 'acting',
    competitors: ['casting directory blogs', 'generic actor SEO mills', 'agency newsletters'],
    keywordGaps: [
      { term: 'UK commercial acting casting', intent: 'how-to', volume: 920, chosen: true },
      { term: 'British Indian screen actor commercials', intent: 'category', volume: 410, chosen: true },
      { term: 'Spotlight profile that books', intent: 'how-to', volume: 640, chosen: false },
      { term: 'Equity member commercial usage', intent: 'commercial', volume: 280, chosen: false },
      { term: 'casting director commercial brief', intent: 'how-to', volume: 510, chosen: false }
    ],
    backlinks: [
      { label: 'Spotlight PIN 9339-8945-6183', url: 'https://app.spotlight.com/9339-8945-6183' },
      { label: 'Equity UK', url: 'https://www.equity.org.uk' },
      { label: 'stevep.uk', url: 'https://stevep.uk' }
    ],
    excerpt: 'London-based British-Indian screen actor. Spotlight verified. Equity member. Commercials, television, combat certs.',
    scannedAt: now(),
    frozen: true,
    frozenAt: now(),
    notes: 'Keyword-first. Mention the client only when the beat earns it. Authority links: Spotlight, Equity, The Stage.'
  }
}

export function commercialActorDraft() {
  return [
    'UK commercial acting is not a personality contest. It is a brief, a usage window, and a face that holds under a 6K still. The desks that book commercials do not read origin stories. They retrieve packs.',
    '',
    'Casting directors on commercials work from three constraints: the brand’s usage (UK, Europe, world), the body that fits the board, and whether the performer can be found tomorrow morning. That last point is why directories still matter. A working Spotlight page is not vanity. It is how the desk retrieves you when the call time moves two hours and the second choice has already gone to another set.',
    '',
    'What actually books is narrower than most actor blogs admit. Commercials want a readable type that can take direction on the first take. Combat certs, dialect range, and a clean stills pack help. A novel-length origin story on the personal site does not. The site should answer the brief: playing age, height, Spotlight PIN, agency, showreels. Then get out of the way. Everything else is noise the casting assistant will not open on a phone in a corridor.',
    '',
    'The commercial brief is a board, not a character arc. The board says: this age band, this energy, this wardrobe, this market. If the stills do not match the board in three seconds, the rest of the CV is unread. That is not cruelty. That is how a day’s casting actually runs. High-quality SEO for this landscape has to respect that retrieval behaviour. Rank for the search the assistant would type. Do not rank for the memoir the actor wants to tell.',
    '',
    'High-authority landscape for this beat is small on purpose. Spotlight holds the directory graph. Equity holds the usage and welfare line. The Stage and Backstage hold the trade conversation. Campaign holds the advertising desk. Those are the links that should appear in a publication-ready piece — not a spray of lifestyle magazines, not a comment on a forum, not a guest post on a DA-12 blog that will be deindexed next quarter. Mesh copies of this article noindex. The canonical URL is the one that wins the pitch.',
    '',
    'Backlinks that help this keyword are the ones a casting professional already trusts. A citation from The Stage on commercial casting practice. A pointer to Equity’s commercial agreements when the copy talks usage. A live Spotlight PIN when the copy talks findability. Those are not “link inserts.” They are how the sentence earns the click. Negative SEO in this world looks like paid profile farms, directory spam, and articles that exist only to mention a name twelve times. That pattern is easy to spot and easy to discount.',
    '',
    'When a British-Indian commercial actor is the right type for the board, the desk still has to find the pack. Steve Pereira keeps that pack at stevep.uk, with a live Spotlight PIN (9339-8945-6183) and Equity membership listed in the same breath as the stills. That is the correct moment to link the client: after the brief, not instead of it. The article is about commercial casting. The actor is evidence. The showreel and the standing slate are what the assistant actually downloads.',
    '',
    'Type is not a slur in this market. It is a scheduling tool. Boards still sort by look, age, and energy before they sort by credits. A British-Indian commercial actor who also holds screen-combat and tactical-firearms tickets is a different retrieve from a generic “diverse hire” line in a treatment. The copy should say the work: commercials, television, combat certs. It should not say the life story. The life story belongs on the about page, behind the pack.',
    '',
    'Usage is where careers leak money. World usage on a snack brand is a different contract from a UK-only cutdown. A 12-month digital burst is not a three-year above-the-line buyout. Equity’s commercial agreements exist so the performer does not discover the difference on YouTube six months later. Link the union when you talk usage. Link Spotlight when you talk findability. Link the personal site when you need the stills and the reel. That is the whole backlink plan. Anything else is decoration.',
    '',
    'Agencies still sit in the middle of the retrieve. The Central Line and Face Management are how a lot of UK commercial desks actually place the call. A publication-ready piece can name the structure without turning into an advertorial: the performer is represented, the PIN is live, the pack is current. If the article cannot say those three facts in one paragraph, it is not ready for Campaign or Broadcast. It is a blog post pretending to be a brief.',
    '',
    'PR cadence matters because commercial casting is seasonal and then suddenly not. A silent quarter is a dead retrieve. A weekly public touch — a still, a credit, a note on usage — keeps the pack in the room without spamming the desk. That is why a retainer with a PR cadence is not a vanity add-on. It is how the program avoids going quiet between the pieces that actually pitch.',
    '',
    'If the performer has no blog, host the canonical on a Galley subdomain and move it later with a CNAME. If they have a site, keep canonical there and let mesh copies noindex. The worst outcome is two indexed versions of the same article competing with each other. The floor’s job is one winning URL and a ledger stamp for every freeze, edit, approve, and pitch.',
    '',
    'For operators running an imprint, the lesson is the same as the newsroom rule: pick the keyword the client chose, write the landscape, then place the client where a casting director would actually click. Do not write a biography and hope Google is kind. The ladder still applies. High desks get the embargo. Mid desks get the outline. Unfashionable desks still get a letter, because silence is worse than an unfashionable URL.'
  ].join('\n')
}

function seedSteveArticle(orgId) {
  const body = commercialActorDraft()
  return {
    id: 'art_steve_commercial',
    orgId,
    title: 'What UK commercial casting actually retrieves',
    keyword: 'UK commercial acting casting',
    rung: 'high',
    status: 'review',
    body,
    dek: 'A keyword-first piece on commercial casting. Client linked once the brief earns it. Spotlight and Equity sit on the authority rung.',
    wordCount: body.split(/\s+/).filter(Boolean).length,
    targetPubId: 'campaign',
    canonicalUrl: null,
    hosting: 'galley_subdomain',
    createdAt: now(),
    updatedAt: now()
  }
}

function applySnapshot(store, snap) {
  if (!snap) return
  if (Array.isArray(snap.users)) store.users = snap.users
  if (Array.isArray(snap.orgs)) store.orgs = snap.orgs
  if (snap.dnaByOrg) store.dnaByOrg = snap.dnaByOrg
  if (Array.isArray(snap.articles)) store.articles = snap.articles
  if (Array.isArray(snap.pitches)) store.pitches = snap.pitches
  if (Array.isArray(snap.meshHosts)) store.meshHosts = snap.meshHosts
  if (Array.isArray(snap.meshCopies)) store.meshCopies = snap.meshCopies
  if (Array.isArray(snap.ledger)) store.ledger = snap.ledger
  if (Array.isArray(snap.prTouches)) store.prTouches = snap.prTouches
  if (Array.isArray(snap.hosting)) store.hosting = snap.hosting
}

export function createStore() {
  const steveOrg = {
    id: 'org_stevep',
    name: 'Steve Pereira',
    domain: 'stevep.uk',
    retainer: 'constellation',
    retainerActive: true,
    meshToken: 'mesh_sp_' + crypto.randomBytes(6).toString('hex'),
    slug: 'stevep',
    createdAt: now()
  }
  const northwind = {
    id: 'org_northwind',
    name: 'Northwind Studio',
    domain: 'northwind.studio',
    retainer: 'constellation',
    retainerActive: true,
    meshToken: 'mesh_nw_' + crypto.randomBytes(6).toString('hex'),
    slug: 'northwind',
    createdAt: now()
  }
  const house = {
    id: 'org_galley',
    name: 'News Galley',
    domain: 'newsgalley.com',
    retainer: 'sovereign',
    retainerActive: true,
    meshToken: 'mesh_house_' + crypto.randomBytes(6).toString('hex'),
    slug: 'galley',
    createdAt: now()
  }

  const users = [
    {
      id: 'usr_steve',
      email: 'steve@stevep.uk',
      password: 'stevep1234',
      name: 'Steve Pereira',
      role: 'desk',
      orgId: steveOrg.id,
      onboardingComplete: true
    },
    {
      id: 'usr_alex',
      email: 'alex@northwind.studio',
      password: 'demo1234',
      name: 'Alex Chen',
      role: 'desk',
      orgId: northwind.id,
      onboardingComplete: true
    },
    {
      id: 'usr_desk',
      email: 'desk@newsgalley.com',
      password: 'desk1234',
      name: 'House Desk',
      role: 'admin',
      orgId: house.id,
      onboardingComplete: true
    }
  ]

  const store = {
    users,
    sessions: new Map(),
    orgs: [steveOrg, northwind, house],
    dnaByOrg: {
      [steveOrg.id]: steveDna(),
      [northwind.id]: {
        url: 'https://northwind.studio',
        host: 'northwind.studio',
        title: 'Northwind Studio',
        voice: 'Calm operator prose. Short sentences. No hype.',
        audience: 'Founders who ship quietly.',
        landscape: 'tech',
        competitors: ['Linear', 'boutique product studios'],
        keywordGaps: [
          { term: 'imprint operating system', intent: 'category', volume: 420, chosen: true },
          { term: 'publication-ready draft workflow', intent: 'how-to', volume: 880, chosen: true }
        ],
        backlinks: [{ label: 'northwind.studio', url: 'https://northwind.studio' }],
        scannedAt: now(),
        frozen: true,
        notes: 'Demo imprint.'
      },
      [house.id]: {
        url: 'https://newsgalley.com',
        host: 'newsgalley.com',
        title: 'News Galley',
        voice: 'Newsroom English. Ink, not growth-speak.',
        audience: 'Retainers who want placements without a writing staff.',
        landscape: 'general',
        competitors: ['HARO desks', 'generic AI writers'],
        keywordGaps: [{ term: 'autonomous imprint os', intent: 'category', volume: 210, chosen: true }],
        backlinks: [{ label: 'newsgalley.com', url: 'https://newsgalley.com' }],
        scannedAt: now(),
        frozen: true,
        notes: 'House DNA.'
      }
    },
    articles: [seedSteveArticle(steveOrg.id)],
    pitches: [],
    meshHosts: [
      {
        id: id('mesh'),
        orgId: steveOrg.id,
        name: 'Galley host · stevep',
        url: 'https://stevep.newsgalley.com',
        token: 'gh_' + crypto.randomBytes(4).toString('hex'),
        status: 'live',
        kind: 'galley_subdomain',
        seatsUsed: 1,
        lastHandshake: now()
      }
    ],
    meshCopies: [],
    ledger: [],
    prTouches: [],
    hosting: [
      {
        id: id('host'),
        orgId: steveOrg.id,
        kind: 'galley_subdomain',
        slug: 'stevep',
        publicUrl: 'https://stevep.newsgalley.com',
        dns: { cname: null, a: null, status: 'live' },
        createdAt: now()
      }
    ],
    tickLog: [],
    stamp(orgId, kind, ref, detail) {
      const entry = {
        id: id('led'),
        orgId,
        kind,
        ref,
        detail,
        at: now(),
        prev: store.ledger.length ? store.ledger[store.ledger.length - 1].hash : 'genesis'
      }
      entry.hash = hash({ kind, ref, detail, at: entry.at, prev: entry.prev })
      store.ledger.push(entry)
      store.persist?.()
      return entry
    },
    id,
    now,
    hash
  }

  const snap = loadSnapshot()
  applySnapshot(store, snap)
  attachPersist(store)

  if (!store.users.some((u) => (u.email || '').toLowerCase() === 'steve@stevep.uk')) {
    store.users.push(users[0])
    if (!store.orgs.some((o) => o.id === steveOrg.id)) store.orgs.push(steveOrg)
    if (!store.dnaByOrg[steveOrg.id]) store.dnaByOrg[steveOrg.id] = steveDna()
    if (!store.articles.some((a) => a.id === 'art_steve_commercial')) {
      store.articles.push(seedSteveArticle(steveOrg.id))
    }
  }

  if (!store.ledger.length) {
    store.stamp(steveOrg.id, 'retainer.clear', steveOrg.id, 'Constellation retainer cleared')
    store.stamp(steveOrg.id, 'dna.freeze', steveOrg.id, 'Site DNA locked for stevep.uk')
    store.stamp(steveOrg.id, 'article.review', 'art_steve_commercial', 'Commercial-actor draft in review')
  }

  store.persistNow()
  return store
}

export function pitchBody(article, pub) {
  const style = pub?.style || 'outline-first'
  if (style === 'embargo') {
    return `Desk — embargo until the freeze stamp lands.\n\nWorking title: ${article.title}\nKeyword: ${article.keyword}\nRung: ${article.rung}\n\nFirst look, not a blast. Reply if the beat wants it.`
  }
  if (style === 'founder letter') {
    return `Hello ${pub?.name || 'desk'},\n\nFrozen draft: “${article.title}”. Keyword “${article.keyword}”. Aimed at your ${pub?.beat || 'beat'}. Publication-ready, not a pitch deck.\n\nIf it is not a fit, say so.`
  }
  return `Outline first.\n\n1. ${article.title}\n2. Why this desk: ${pub?.beat || 'general'}\n3. What is new: landscape + one earned client link\n4. Ask: a slot, not a rewrite`
}

export function draftBody(title, keyword, dna) {
  const landscape = AUTHORITY[dna?.landscape] || AUTHORITY.general
  const authorities = landscape.slice(0, 3).map((a) => `${a.name} (${a.url})`).join('; ')
  const client = (dna?.backlinks || [])[0]
  const clientLine = client
    ? `When the brief earns it, the working example is ${client.label}: ${client.url}. That is a mention, not the subject.`
    : 'Do not invent a client mention.'
  return [
    `${title}.`,
    '',
    `This piece is written against the keyword “${keyword}”. It is not a biography. Voice: ${dna?.voice || 'trade-press clipped.'}`,
    '',
    `Audience: ${dna?.audience || 'operators'}. High-authority landscape for this beat: ${authorities}. Those are the links that belong here.`,
    '',
    clientLine,
    '',
    'A newsroom that waits for Moz is a bottleneck. Authority is a modeled rung. High desks get the embargo. Mid desks get the outline. Unfashionable desks still get a letter.',
    '',
    'Canonical stays on the winning URL. Mesh copies noindex. Proof is hashed. Operators watch the queue. They do not manufacture copy.'
  ].join('\n')
}
