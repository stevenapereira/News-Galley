import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api.js'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Overview({ me }) {
  const [floor, setFloor] = useState(null)
  const [err, setErr] = useState('')

  async function load() {
    try {
      setFloor(await api('/api/floor'))
    } catch (e) {
      setErr(e.message)
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 4000)
    return () => clearInterval(t)
  }, [])

  if (err) return <p className="err">{err}</p>
  if (!floor) return <p>Opening the floor…</p>

  const chart = [
    { name: 'High', n: floor.counts.rungs.high || 0 },
    { name: 'Mid', n: floor.counts.rungs.mid || 0 },
    { name: 'Unfash.', n: floor.counts.rungs.unfashionable || 0 }
  ]

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">Live floor</div>
          <h2 style={{ margin: 0 }}>{floor.org.name}</h2>
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
          writer: {floor.writer.mode} · tick {floor.ticks[0]?.ms || 0}ms
        </div>
      </header>

      <div className="ticker">
        Last tick — {(floor.ticks[0]?.notes || ['quiet']).join(' · ') || 'quiet'}
      </div>

      <div className="stat-row">
        <div className="stat"><b>{floor.counts.articles}</b>articles</div>
        <div className="stat"><b>{floor.counts.review}</b>in review</div>
        <div className="stat"><b>{floor.counts.pitches}</b>pitches</div>
        <div className="stat"><b>{floor.counts.placed}</b>placed</div>
      </div>

      <h3>Tier timeline · {floor.plan.name}</h3>
      <p style={{ color: 'var(--muted)' }}>{floor.plan.tickHint}</p>
      <div className="timeline">
        {(floor.timeline || []).map((t) => (
          <Link className="tl" key={t.id} to={`/floor/queue/${t.id}`}>
            <b>Slot {t.slot}/{t.of}</b>
            {t.title}
            <div><span className={`pill ${t.status}`}>{t.status}</span></div>
          </Link>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 22 }}>
        <div className="card">
          <h4>Ladder mix</h4>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid stroke="rgba(120,190,255,0.15)" vertical={false} />
                <XAxis dataKey="name" stroke="#93a7c7" />
                <YAxis allowDecimals={false} stroke="#93a7c7" />
                <Tooltip />
                <Bar dataKey="n" fill="#5ce1ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h4>Retainer & host</h4>
          <p className="price">${floor.plan.price}<small>/mo {floor.plan.name}</small></p>
          <p>
            Review window {floor.plan.reviewHours}h · {floor.plan.articles} articles · {floor.plan.pitches} pitches
          </p>
          <p className="mono" style={{ fontSize: 12 }}>
            {floor.hosting?.kind || 'galley_subdomain'} · {floor.hosting?.publicUrl || 'pending'}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Signed in as {me?.user?.email}. {floor.writer.configured ? 'LLM writer armed.' : 'House template writer until USER_LLM_API_KEY is set in backend/.env.'}
          </p>
        </div>
      </div>

      <h3 style={{ marginTop: 28 }}>Recent copy</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Keyword</th>
            <th>Rung</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {floor.recentArticles.map((a) => (
            <tr key={a.id}>
              <td><Link to={`/floor/queue/${a.id}`}>{a.title}</Link></td>
              <td className="mono">{a.keyword}</td>
              <td><span className={`pill ${a.rung}`}>{a.rung}</span></td>
              <td><span className={`pill ${a.status}`}>{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
