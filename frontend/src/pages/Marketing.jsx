import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function Marketing() {
  const nav = useNavigate()
  const [retainers, setRetainers] = useState([])
  const [pubs, setPubs] = useState([])
  const [hosting, setHosting] = useState([])
  const [url, setUrl] = useState('https://stevep.uk')
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    api('/api/public/retainers').then(setRetainers).catch(() => {})
    api('/api/public/publications').then(setPubs).catch(() => {})
    api('/api/public/hosting').then(setHosting).catch(() => {})
  }, [])

  async function scan(e) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const dna = await api('/api/public/scan', { method: 'POST', body: { url } })
      setPreview(dna)
      sessionStorage.setItem('galley.scanUrl', url)
      sessionStorage.setItem('galley.scan', JSON.stringify(dna))
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <header className="masthead">
        <div className="site-wrap">
          <div className="masthead-top">
            <span>Aurora floor</span>
            <span>newsgalley.com</span>
            <span>Scan · Write · Pitch</span>
          </div>
          <h1 className="mast">News Galley</h1>
          <p className="deck">Publication-ready articles. Real desks. Hosted if you have nowhere to publish.</p>
          <nav className="nav">
            <a href="#how">1 2 3</a>
            <a href="#scan">Scan</a>
            <a href="#retainers">Retainers</a>
            <a href="#host">Host</a>
            <Link to="/login">Desk login</Link>
          </nav>
        </div>
      </header>

      <main className="site-wrap">
        <section className="hero" id="scan">
          <div>
            <div className="kicker">Paste a domain. See the brief before you pay.</div>
            <h2>We scan the site, write the keyword, pitch the desk.</h2>
            <p className="lede">
              Enter your URL and the floor reads voice, audience, and keyword gaps. You choose the keywords.
              We write publication-ready copy, stop it in review for you, then pitch real desks and host the
              canonical URL if you do not have a blog.
            </p>
          </div>
          <form className="scan-box" onSubmit={scan}>
            <h3>What you get from a scan</h3>
            <p style={{ color: 'var(--muted)', marginTop: 0 }}>
              Voice lock, landscape authorities, and the keyword list the writer will actually follow — not a biography of you.
            </p>
            <label>Your domain</label>
            <div className="scan-row">
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yoursite.com" />
              <button className="btn" disabled={busy} type="submit">{busy ? 'Scanning…' : 'Scan'}</button>
            </div>
            {err ? <div className="err">{err}</div> : null}
            {preview ? (
              <div>
                <p><strong>{preview.title}</strong></p>
                <p style={{ color: 'var(--muted)' }}>{preview.voice}</p>
                <div className="chip-row">
                  {(preview.keywordGaps || []).slice(0, 4).map((g) => (
                    <span className="chip on" key={g.term}>{g.term}</span>
                  ))}
                </div>
                <button className="btn ghost" type="button" onClick={() => nav('/login?start=1')}>
                  Open a desk with this scan
                </button>
              </div>
            ) : null}
          </form>
        </section>

        <section className="section" id="how">
          <h3>Scan, write, pitch</h3>
          <div className="grid-3">
            <article className="card step">
              <div className="num">1</div>
              <h4>Scan</h4>
              <p>Paste a URL. The floor locks voice, audience, competitors, and keyword gaps before a word is drafted.</p>
            </article>
            <article className="card step">
              <div className="num">2</div>
              <h4>Write</h4>
              <p>Articles follow the keywords you chose. Client links land only when the beat earns them. You edit or regenerate in review.</p>
            </article>
            <article className="card step">
              <div className="num">3</div>
              <h4>Pitch</h4>
              <p>Each publication has a desk style. Pitches go to that desk. Mesh copies noindex. Canonical stays on the winning URL.</p>
            </article>
          </div>
        </section>

        <section className="section" id="retainers">
          <h3>Retainers</h3>
          <div className="grid-3">
            {(retainers.length ? retainers : []).map((r) => (
              <article className="card" key={r.id}>
                <div className="kicker">{r.id}</div>
                <h4>{r.name}</h4>
                <div className="price">${r.price}<small>/mo</small></div>
                <p>
                  {r.articles} articles · {r.pitches} pitches<br />
                  Review window {r.reviewHours}h · {r.meshSeats} mesh seats
                  {r.prCadence ? ' · weekly PR' : ''}
                  {r.slaHours ? ` · ${r.slaHours}h empty-queue SLA` : ''}
                </p>
                <p style={{ color: 'var(--muted)' }}>{r.tickHint}</p>
                <Link className="btn" to="/login">Clear retainer</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h3>What else sits on the floor</h3>
          <div className="grid-3">
            {[
              ['DA ladder', 'High, mid, and unfashionable rungs. Scores modeled in-house so the desk is not blocked on Moz.'],
              ['Publisher mesh', 'Other blogs handshake with a token. Copies flow both ways. Mesh copies noindex.'],
              ['Proof ledger', 'Every freeze, edit, approve, pitch, and mesh copy is hashed.'],
              ['No blog? Host it', 'Galley subdomain, or CNAME / A record on your domain. Canonical can move later.'],
              ['PR cadence', 'A public touch every week on Constellation and Sovereign so the program never goes silent.'],
              ['Autofill queue', 'Empty queues brief the next chosen keyword. Operators monitor. They do not manufacture copy.']
            ].map(([t, d]) => (
              <article className="card" key={t}>
                <h4>{t}</h4>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="host">
          <h3>If they have nowhere to publish</h3>
          <div className="grid-4">
            {hosting.map((h) => (
              <article className="card" key={h.id}>
                <h4>{h.name}</h4>
                <p>{h.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h3>Desks on the ladder</h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Desk</th>
                  <th>DA</th>
                  <th>Rung</th>
                  <th>Beat</th>
                </tr>
              </thead>
              <tbody>
                {pubs.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="mono">{p.da}</td>
                    <td><span className={`pill ${p.rung}`}>{p.rung}</span></td>
                    <td>{p.beat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer">
          <span>News Galley · your project, your floor</span>
          <span>Demo steve@stevep.uk / stevep1234</span>
        </footer>
      </main>
    </div>
  )
}
