import { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Onboarding({ me, onDone }) {
  const scan = (() => {
    try { return JSON.parse(sessionStorage.getItem('galley.scan') || 'null') } catch { return null }
  })()
  const [url, setUrl] = useState(sessionStorage.getItem('galley.scanUrl') || me?.org?.domain || 'https://stevep.uk')
  const [dna, setDna] = useState(scan)
  const [keywords, setKeywords] = useState((scan?.keywordGaps || []).filter((g) => g.chosen).map((g) => g.term))
  const [retainer, setRetainer] = useState(me?.org?.retainer || 'constellation')
  const [hostingKind, setHostingKind] = useState('galley_subdomain')
  const [plans, setPlans] = useState([])
  const [hosting, setHosting] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    api('/api/public/retainers').then(setPlans).catch(() => {})
    api('/api/public/hosting').then(setHosting).catch(() => {})
  }, [])

  async function scanNow(e) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const d = await api('/api/dna/scan', { method: 'POST', body: { url } })
      setDna(d)
      setKeywords((d.keywordGaps || []).filter((g) => g.chosen).map((g) => g.term))
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }

  function toggle(term) {
    setKeywords((prev) => prev.includes(term) ? prev.filter((k) => k !== term) : [...prev, term])
  }

  async function finish() {
    setBusy(true)
    setErr('')
    try {
      const data = await api('/api/onboarding', {
        method: 'POST',
        body: { url, keywords, retainer, hostingKind }
      })
      onDone({
        ...me,
        user: data.user,
        org: data.org,
        retainer: plans.find((p) => p.id === retainer) || me.retainer
      })
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <div className="card" style={{ width: 'min(720px, 94vw)' }}>
        <div className="kicker">Onboarding · 1 2 3</div>
        <h2 style={{ marginTop: 6 }}>Tell the floor what to write</h2>
        <p style={{ color: 'var(--muted)' }}>Scan first. Pick keywords. Choose a retainer and a host. Copy still stops in review.</p>
        {err ? <div className="err">{err}</div> : null}
        <form onSubmit={scanNow}>
          <label>Site URL</label>
          <div className="scan-row">
            <input value={url} onChange={(e) => setUrl(e.target.value)} />
            <button className="btn" disabled={busy} type="submit">{busy ? 'Scanning…' : 'Scan'}</button>
          </div>
        </form>
        {dna ? (
          <>
            <p><strong>{dna.title}</strong> · {dna.landscape}</p>
            <p style={{ color: 'var(--muted)' }}>{dna.voice}</p>
            <label>Keywords the writer will follow</label>
            <div className="chip-row">
              {(dna.keywordGaps || []).map((g) => (
                <button type="button" key={g.term} className={`chip ${keywords.includes(g.term) ? 'on' : ''}`} onClick={() => toggle(g.term)}>
                  {g.term}
                </button>
              ))}
            </div>
          </>
        ) : null}
        <label>Retainer</label>
        <div className="grid-3">
          {plans.map((p) => (
            <button type="button" key={p.id} className={`card ${retainer === p.id ? 'chip on' : ''}`} onClick={() => setRetainer(p.id)} style={{ textAlign: 'left' }}>
              <b>{p.name}</b>
              <div>${p.price}/mo · {p.articles} articles</div>
            </button>
          ))}
        </div>
        <label>If you have nowhere to publish</label>
        <div className="grid-2">
          {hosting.map((h) => (
            <button type="button" key={h.id} className={`card ${hostingKind === h.id ? 'chip on' : ''}`} onClick={() => setHostingKind(h.id)} style={{ textAlign: 'left' }}>
              <b>{h.name}</b>
              <p>{h.blurb}</p>
            </button>
          ))}
        </div>
        <button className="btn" disabled={busy} type="button" onClick={finish}>Open the floor</button>
      </div>
    </div>
  )
}
