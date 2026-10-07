import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api.js'

export default function Queue() {
  const [rows, setRows] = useState([])
  const [pubs, setPubs] = useState([])
  const [title, setTitle] = useState('')
  const [keyword, setKeyword] = useState('')
  const [pubId, setPubId] = useState('campaign')
  const [err, setErr] = useState('')

  async function load() {
    const [a, p] = await Promise.all([api('/api/articles'), api('/api/publications')])
    setRows(a)
    setPubs(p)
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message))
    const t = setInterval(() => load().catch(() => {}), 4000)
    return () => clearInterval(t)
  }, [])

  async function brief(e) {
    e.preventDefault()
    setErr('')
    try {
      await api('/api/articles', { method: 'POST', body: { title, keyword, pubId } })
      setTitle('')
      setKeyword('')
      await load()
    } catch (ex) {
      setErr(ex.message)
    }
  }

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">Edit and regenerate before publish</div>
          <h2 style={{ margin: 0 }}>Queue</h2>
        </div>
      </header>
      <form className="card" onSubmit={brief} style={{ marginBottom: 22 }}>
        <div className="grid-3">
          <div>
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Keyword the client chose</label>
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} required />
          </div>
          <div>
            <label>Target desk</label>
            <select value={pubId} onChange={(e) => setPubId(e.target.value)}>
              {pubs.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (DA {p.da})</option>
              ))}
            </select>
          </div>
        </div>
        {err ? <div className="err">{err}</div> : null}
        <button className="btn" type="submit">Brief the floor</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Keyword</th>
            <th>Rung</th>
            <th>Words</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id}>
              <td><Link to={`/floor/queue/${a.id}`}>{a.title}</Link></td>
              <td className="mono">{a.keyword}</td>
              <td><span className={`pill ${a.rung}`}>{a.rung}</span></td>
              <td>{a.wordCount || '—'}</td>
              <td><span className={`pill ${a.status}`}>{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
