import { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Ladder() {
  const [data, setData] = useState(null)
  const [url, setUrl] = useState('https://stevep.uk')
  const [model, setModel] = useState(null)

  useEffect(() => {
    api('/api/ladder').then(setData).catch(() => {})
  }, [])

  async function run(e) {
    e.preventDefault()
    setModel(await api('/api/da/model', { method: 'POST', body: { url } }))
  }

  if (!data) return <p>Modeling rungs…</p>

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">High-quality links. Not comment spam.</div>
          <h2 style={{ margin: 0 }}>DA ladder</h2>
        </div>
      </header>
      <p style={{ color: 'var(--muted)' }}>{data.modeledNote}</p>
      <form className="card" onSubmit={run} style={{ marginBottom: 22 }}>
        <label>Model a URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} />
        <button className="btn ghost" type="submit">Score</button>
        {model ? <p className="mono">DA {model.da} · {model.rung}</p> : null}
      </form>
      {(data.authorities || []).length ? (
        <div className="card" style={{ marginBottom: 22 }}>
          <h4>Landscape authorities for this desk</h4>
          <ul>
            {data.authorities.map((a) => (
              <li key={a.url}><strong>{a.name}</strong> — {a.note}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {data.rungs.map((r) => (
        <section key={r.rung} className="section" style={{ paddingTop: 12 }}>
          <h3><span className={`pill ${r.rung}`}>{r.rung}</span></h3>
          <div className="grid-2">
            <div>
              <h4>Desks</h4>
              <ul>
                {r.pubs.map((p) => (
                  <li key={p.id}>{p.name} · DA {p.da} · {p.style}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Matter</h4>
              <ul>
                {r.articles.length === 0 ? <li>None on this rung yet.</li> : r.articles.map((a) => (
                  <li key={a.id}>{a.title} — {a.status}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
