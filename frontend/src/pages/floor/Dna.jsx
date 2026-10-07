import { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Dna() {
  const [url, setUrl] = useState('https://stevep.uk')
  const [dna, setDna] = useState(null)
  const [chosen, setChosen] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    api('/api/floor').then((f) => {
      if (f.dna) {
        setDna(f.dna)
        setUrl(f.dna.url)
        setChosen((f.dna.keywordGaps || []).filter((g) => g.chosen !== false).map((g) => g.term))
      }
    }).catch(() => {})
  }, [])

  async function scan(e) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const d = await api('/api/dna/scan', { method: 'POST', body: { url } })
      setDna(d)
      setChosen((d.keywordGaps || []).filter((g) => g.chosen).map((g) => g.term))
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }

  async function freeze() {
    setBusy(true)
    try {
      setDna(await api('/api/dna/freeze', { method: 'POST', body: { keywords: chosen } }))
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }

  function toggle(term) {
    setChosen((prev) => prev.includes(term) ? prev.filter((k) => k !== term) : [...prev, term])
  }

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">Keywords first. Not a biography.</div>
          <h2 style={{ margin: 0 }}>Site DNA</h2>
        </div>
      </header>
      <form onSubmit={scan} className="card" style={{ marginBottom: 22 }}>
        <label>Paste a URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
        {err ? <div className="err">{err}</div> : null}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" disabled={busy} type="submit">{busy ? 'Scanning…' : 'Assess DNA'}</button>
          <button className="btn ghost" type="button" disabled={busy || !dna} onClick={freeze}>Freeze voice & keywords</button>
        </div>
      </form>
      {dna ? (
        <div className="grid-2">
          <article className="card">
            <h4>{dna.title}</h4>
            <p className="mono" style={{ fontSize: 12 }}>{dna.url} · {dna.landscape}</p>
            {dna.frozen ? <span className="pill live">frozen</span> : <span className="pill">draft DNA</span>}
            <p><strong>Voice.</strong> {dna.voice}</p>
            <p><strong>Audience.</strong> {dna.audience}</p>
            <p><strong>Competitors.</strong> {(dna.competitors || []).join(' · ')}</p>
            <p style={{ color: 'var(--muted)' }}>{dna.notes}</p>
          </article>
          <article className="card">
            <h4>Keyword gaps — pick what we write</h4>
            <div className="chip-row">
              {(dna.keywordGaps || []).map((g) => (
                <button type="button" key={g.term} className={`chip ${chosen.includes(g.term) ? 'on' : ''}`} onClick={() => toggle(g.term)}>
                  {g.term}
                </button>
              ))}
            </div>
            <table>
              <thead>
                <tr><th>Term</th><th>Intent</th><th>Vol</th></tr>
              </thead>
              <tbody>
                {(dna.keywordGaps || []).map((g) => (
                  <tr key={g.term}>
                    <td>{g.term}</td>
                    <td>{g.intent}</td>
                    <td className="mono">{g.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </div>
      ) : null}
    </div>
  )
}
