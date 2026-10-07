import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api.js'

export default function Article() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [body, setBody] = useState('')
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const d = await api(`/api/articles/${id}`)
    setData(d)
    setBody(d.article.body || '')
    setTitle(d.article.title || '')
  }

  useEffect(() => {
    let live = true
    load().catch((e) => { if (live) setErr(e.message) })
    const t = setInterval(() => load().catch(() => {}), 4000)
    return () => {
      live = false
      clearInterval(t)
    }
  }, [id])

  async function save() {
    setBusy(true)
    try {
      await api(`/api/articles/${id}`, { method: 'PUT', body: { title, body } })
      await load()
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function regen() {
    setBusy(true)
    try {
      await api(`/api/articles/${id}/regenerate`, { method: 'POST', body: { note } })
      await load()
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function approve() {
    setBusy(true)
    try {
      await api(`/api/articles/${id}/approve`, { method: 'POST', body: {} })
      await load()
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (err) return <p className="err">{err}</p>
  if (!data) return <p>Pulling copy…</p>
  const a = data.article

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">{a.keyword}</div>
          <h2 style={{ margin: 0 }}>{a.title}</h2>
        </div>
        <span className={`pill ${a.status}`}>{a.status} · {a.wordCount} words</span>
      </header>
      <p style={{ color: 'var(--muted)' }}>{a.dek}</p>
      <p className="mono" style={{ fontSize: 12 }}>
        {data.pub ? `${data.pub.name} · ${data.pub.style}` : 'unassigned'}
        {a.canonicalUrl ? ` · canonical ${a.canonicalUrl}` : ''}
      </p>
      {err ? <div className="err">{err}</div> : null}
      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Body — edit before approve</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ minHeight: 320 }} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <button className="btn ghost" disabled={busy} onClick={save}>Save edits</button>
        <button className="btn" disabled={busy || a.status === 'placed'} onClick={approve}>Approve for pitch</button>
      </div>
      <div className="card" style={{ marginBottom: 18 }}>
        <label>Regenerate note</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Keep the keyword. Do not write a biography." />
        <button className="btn ghost" disabled={busy} onClick={regen}>Regenerate</button>
      </div>
      {data.authorities?.length ? (
        <div className="card" style={{ marginBottom: 18 }}>
          <h4>Landscape authorities</h4>
          <ul>
            {data.authorities.map((x) => (
              <li key={x.url}>{x.name} — {x.note}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <h3>Pitches</h3>
      {data.pitches.length === 0 ? <p>None yet. Approve first.</p> : (
        <ul>
          {data.pitches.map((p) => (
            <li key={p.id}>{p.status} — {p.subject}</li>
          ))}
        </ul>
      )}
      <p><Link to="/floor/queue">Back to queue</Link></p>
    </div>
  )
}
