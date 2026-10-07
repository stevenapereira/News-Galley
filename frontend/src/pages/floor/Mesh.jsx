import { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Mesh() {
  const [data, setData] = useState(null)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [kind, setKind] = useState('galley_subdomain')
  const [slug, setSlug] = useState('')
  const [err, setErr] = useState('')

  async function load() {
    setData(await api('/api/mesh'))
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [])

  async function handshake(e) {
    e.preventDefault()
    setErr('')
    try {
      await api('/api/mesh/handshake', { method: 'POST', body: { name, url } })
      setName('')
      setUrl('')
      await load()
    } catch (ex) {
      setErr(ex.message)
    }
  }

  async function saveHost(e) {
    e.preventDefault()
    setErr('')
    try {
      await api('/api/hosting', { method: 'POST', body: { kind, slug, blogUrl: url } })
      await load()
    } catch (ex) {
      setErr(ex.message)
    }
  }

  if (!data) return <p>Handshaking…</p>
  const dns = data.hosting?.dns || {}

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">No blog? We host. Have a blog? Handshake.</div>
          <h2 style={{ margin: 0 }}>Host & mesh</h2>
        </div>
      </header>
      <p className="mono">Org token {data.token} · seats {data.hosts.length}/{data.seats}</p>
      {err ? <div className="err">{err}</div> : null}

      <form className="card" onSubmit={saveHost} style={{ marginBottom: 22 }}>
        <h4>Publishing home</h4>
        <label>Option</label>
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          {(data.options || []).map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
        <label>Slug / host</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="stevep" />
        <button className="btn" type="submit">Set host</button>
        {data.hosting ? (
          <p className="mono" style={{ fontSize: 12 }}>
            {data.hosting.kind} · {data.hosting.publicUrl} · {dns.status}
            {dns.cname?.target ? ` · CNAME ${dns.cname.host} → ${dns.cname.target}` : ''}
            {dns.a?.target ? ` · A ${dns.a.host} → ${dns.a.target}` : ''}
          </p>
        ) : null}
      </form>

      <form className="card" onSubmit={handshake} style={{ marginBottom: 22 }}>
        <h4>Mesh handshake</h4>
        <div className="grid-2">
          <div>
            <label>Host name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} required />
          </div>
        </div>
        <button className="btn ghost" type="submit">Handshake</button>
      </form>

      <h3>Hosts</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>URL</th><th>Status</th></tr>
        </thead>
        <tbody>
          {data.hosts.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td className="mono">{h.url}</td>
              <td><span className="pill live">{h.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Copies</h3>
      <table>
        <thead>
          <tr><th>Article</th><th>Copy URL</th><th>Canonical</th></tr>
        </thead>
        <tbody>
          {data.copies.map((c) => (
            <tr key={c.id}>
              <td>{c.article?.title}</td>
              <td className="mono">{c.url}</td>
              <td className="mono">{c.canonical}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
