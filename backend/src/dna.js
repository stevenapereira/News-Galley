import { modeledDa, rungForDa, AUTHORITY } from './store.js'

const VOICES = [
  'Calm operator prose. Short sentences. Treats software as craft.',
  'Newsroom English. Ink, not growth-speak. The floor is a desk.',
  'Warm founder letter. Direct, slightly dry, allergic to slogans.',
  'Trade-press clipped. Facts first, then the implication.',
  'Civic weekly. Plain words, local stakes, no TED cadence.'
]

const AUDIENCES = [
  'Founders who ship quietly and still read long pieces.',
  'Agency principals who buy retainers instead of headcount.',
  'Ops leads who care about canonical URLs more than likes.',
  'Editors who will take a frozen draft if the beat is right.',
  'Casting directors and commercial producers who retrieve packs, not biographies.'
]

function pick(list, seed) {
  return list[Math.abs(seed) % list.length]
}

function seedFrom(url) {
  let n = 0
  for (const ch of url || '') n = (n * 33 + ch.charCodeAt(0)) >>> 0
  return n
}

function hostFrom(url) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return (url || 'site').replace(/^https?:\/\//, '').split('/')[0]
  }
}

function titleCase(host) {
  const stem = host.split('.')[0].replace(/[-_]/g, ' ')
  return stem.replace(/\b\w/g, (c) => c.toUpperCase())
}

function detectLandscape(host, title, excerpt) {
  const blob = `${host} ${title} ${excerpt}`.toLowerCase()
  if (/actor|casting|spotlight|equity|headshot|showreel|commercials/.test(blob) || host.includes('stevep')) return 'acting'
  if (/cloud|cyber|architect|saas|devops|infra/.test(blob)) return 'tech'
  return 'general'
}

export async function scanSite(rawUrl) {
  const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
  const host = hostFrom(url)
  const seed = seedFrom(url)
  const da = modeledDa(url)

  let title = titleCase(host)
  let excerpt = ''
  let html = ''
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'NewsGalley-DNA/1.0' }
    })
    clearTimeout(t)
    if (res.ok) {
      html = (await res.text()).slice(0, 120000)
      const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      if (m) title = m[1].replace(/\s+/g, ' ').trim().slice(0, 90)
      const p = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
      if (p) excerpt = p[1].slice(0, 240)
    }
  } catch {
    excerpt = ''
  }

  const landscape = detectLandscape(host, title, excerpt + html.slice(0, 4000))
  const brand = titleCase(host)
  const stems = landscape === 'acting'
    ? [
        'UK commercial acting casting',
        'British Indian screen actor commercials',
        'Spotlight profile that books',
        'Equity member commercial usage',
        'casting director commercial brief',
        `${brand.toLowerCase()} showreel`
      ]
    : [
        'imprint operating system',
        'publication-ready draft workflow',
        'domain authority ladder pr',
        'mesh syndication canonical',
        'weekly pr cadence retainer',
        `${brand.toLowerCase()} editorial voice`
      ]

  const intents = ['category', 'how-to', 'comparison', 'technical', 'commercial', 'brand']
  const keywordGaps = stems.slice(0, 6).map((term, i) => ({
    term,
    intent: intents[i % intents.length],
    volume: 120 + ((seed >> (i * 3)) % 900),
    chosen: i < 2
  }))

  const authorities = AUTHORITY[landscape] || AUTHORITY.general
  const backlinks = [
    { label: host, url },
    ...authorities.slice(0, 2).map((a) => ({ label: a.name, url: a.url }))
  ]
  if (landscape === 'acting') {
    backlinks.splice(1, 0, { label: 'Spotlight', url: 'https://www.spotlight.com' })
  }

  return {
    url,
    title,
    host,
    voice: landscape === 'acting' ? VOICES[3] : pick(VOICES, seed),
    audience: landscape === 'acting' ? AUDIENCES[4] : pick(AUDIENCES, seed >> 3),
    landscape,
    competitors: landscape === 'acting'
      ? ['casting directory blogs', 'generic actor SEO mills', 'agency newsletters']
      : ['generic AI writers', 'HARO desks', 'boutique PR shops'],
    keywordGaps,
    backlinks,
    authorities,
    modeledDa: da,
    modeledRung: rungForDa(da),
    excerpt,
    scannedAt: new Date().toISOString(),
    frozen: false,
    notes: excerpt
      ? 'Live fetch used for title and description. Voice and gaps assessed in-house. Articles follow chosen keywords, not a biography.'
      : 'Live fetch timed out or blocked. Voice, audience, and gaps modeled from the URL.'
  }
}
