import { draftBody, AUTHORITY } from './store.js'

function envKey() {
  return (process.env.USER_LLM_API_KEY || '').trim()
}

export function writerStatus() {
  const key = envKey()
  return {
    mode: key ? 'llm' : 'house-template',
    model: process.env.USER_LLM_MODEL || 'grok-4',
    baseUrl: process.env.USER_LLM_BASE_URL || 'https://api.x.ai/v1',
    configured: Boolean(key)
  }
}

function authorityBlock(dna) {
  const list = AUTHORITY[dna?.landscape] || AUTHORITY.general
  return list.map((a) => `${a.name} — ${a.url} (${a.note})`).join('\n')
}

export async function composeArticle({ title, keyword, dna, pub, instruction }) {
  const key = envKey()
  const fallback = () => {
    const body = draftBody(title, keyword, dna)
    return { body, source: 'house-template', wordCount: body.split(/\s+/).filter(Boolean).length }
  }

  if (!key) return fallback()

  const base = (process.env.USER_LLM_BASE_URL || 'https://api.x.ai/v1').replace(/\/$/, '')
  const model = process.env.USER_LLM_MODEL || 'grok-4'
  const system = [
    'You are a staff writer on News Galley, a newsroom floor.',
    'Write publication-ready prose. No hype. No emoji. No markdown headings.',
    'Short paragraphs. 850 to 1250 words.',
    'The article is about the KEYWORD and the landscape, not a biography of the client.',
    'Mention the client only when the beat earns it, then link once to their site or Spotlight/Equity as relevant.',
    'Use the high-authority sources provided. Do not invent publications.',
    'Do not mention that you are a model.'
  ].join(' ')

  const user = [
    `Title: ${title}`,
    `Keyword the client chose: ${keyword}`,
    `Site voice: ${dna?.voice || 'trade-press clipped'}`,
    `Audience: ${dna?.audience || 'operators'}`,
    `Landscape: ${dna?.landscape || 'general'}`,
    `Target desk: ${pub?.name || 'house journal'} (${pub?.style || 'outline-first'}, ${pub?.beat || 'general'})`,
    `Client site: ${dna?.url || ''}`,
    `Allowed client links:\n${(dna?.backlinks || []).map((b) => `${b.label} ${b.url}`).join('\n') || 'none'}`,
    `High-authority landscape:\n${authorityBlock(dna)}`,
    instruction ? `Operator note: ${instruction}` : '',
    'Write the article body only.'
  ].filter(Boolean).join('\n')

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    })
    if (!res.ok) return { ...fallback(), fallback: res.status }
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content?.trim()
    if (!text) return fallback()
    return { body: text, source: 'llm', wordCount: text.split(/\s+/).filter(Boolean).length }
  } catch {
    return { ...fallback(), fallback: 'network' }
  }
}

export async function composePitch({ article, pub, dna }) {
  const key = envKey()
  const fallback = {
    subject: `${pub.style === 'embargo' ? 'Embargo' : pub.style === 'founder letter' ? 'Founder note' : 'Outline'}: ${article.title}`,
    body: [
      `Desk style: ${pub.style}.`,
      `Beat: ${pub.beat}.`,
      `Working title: ${article.title}.`,
      `Keyword: ${article.keyword}.`,
      'Frozen draft, not a pitch deck. Reply if the desk wants it.'
    ].join('\n'),
    source: 'house-template'
  }
  if (!key) return fallback

  const base = (process.env.USER_LLM_BASE_URL || 'https://api.x.ai/v1').replace(/\/$/, '')
  const model = process.env.USER_LLM_MODEL || 'grok-4'
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content: `Write one short pitch in the desk style "${pub.style}". No emoji. Under 140 words. Keyword-first, not a biography.`
          },
          {
            role: 'user',
            content: `Publication: ${pub.name}\nArticle: ${article.title}\nKeyword: ${article.keyword}\nVoice: ${dna?.voice}`
          }
        ]
      })
    })
    if (!res.ok) return fallback
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content?.trim()
    if (!text) return fallback
    return { subject: fallback.subject, body: text, source: 'llm' }
  } catch {
    return fallback
  }
}
