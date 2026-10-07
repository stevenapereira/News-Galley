import { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Pitches() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    const load = () => api('/api/pitches').then(setRows).catch(() => {})
    load()
    const t = setInterval(load, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">Written to the desk, not blasted</div>
          <h2 style={{ margin: 0 }}>Pitch router</h2>
        </div>
      </header>
      {rows.map((p) => (
        <article className="card" key={p.id} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <h4 style={{ margin: 0 }}>{p.subject}</h4>
            <span className="pill live">{p.status}</span>
          </div>
          <p className="mono" style={{ fontSize: 12 }}>
            {p.pub?.name} · {p.style} · {p.article?.title}
          </p>
          <pre className="article-body" style={{ fontFamily: 'inherit', fontSize: 15 }}>{p.body}</pre>
        </article>
      ))}
    </div>
  )
}
