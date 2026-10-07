import { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Admin() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    api('/api/admin/floor').then(setData).catch((e) => setErr(e.message))
  }, [])

  if (err) return <p className="err">{err}</p>
  if (!data) return <p>House desk…</p>

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">House only</div>
          <h2 style={{ margin: 0 }}>Galley Review desk</h2>
        </div>
      </header>
      <div className="stat-row">
        <div className="stat"><b>{data.orgs.length}</b>orgs</div>
        <div className="stat"><b>{data.articles}</b>articles</div>
        <div className="stat"><b>{data.pitches}</b>pitches</div>
        <div className="stat"><b>{data.ledger}</b>stamps</div>
      </div>
      <h3>Orgs</h3>
      <ul>
        {data.orgs.map((o) => (
          <li key={o.id}>{o.name} · {o.domain} · {o.retainer}</li>
        ))}
      </ul>
      <h3>Ticks</h3>
      <ul>
        {data.ticks.map((t) => (
          <li key={t.at} className="mono">{t.at} · {t.ms}ms · {(t.notes || []).join(', ') || 'quiet'}</li>
        ))}
      </ul>
    </div>
  )
}
