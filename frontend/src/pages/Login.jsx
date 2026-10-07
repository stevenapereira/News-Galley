import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api, setToken } from '../api.js'

export default function Login() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const start = params.get('start') === '1'
  const scanUrl = useMemo(() => sessionStorage.getItem('galley.scanUrl') || 'https://stevep.uk', [])
  const [mode, setMode] = useState(start ? 'register' : 'login')
  const [email, setEmail] = useState(start ? '' : 'steve@stevep.uk')
  const [password, setPassword] = useState(start ? '' : 'stevep1234')
  const [name, setName] = useState('')
  const [url, setUrl] = useState(scanUrl)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const path = mode === 'register' ? '/api/auth/register' : '/api/auth/login'
      const body = mode === 'register' ? { email, password, name, url } : { email, password }
      const data = await api(path, { method: 'POST', body })
      setToken(data.token)
      nav('/floor')
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={onSubmit}>
        <div className="kicker">{mode === 'register' ? 'Open a desk' : 'Desk pass'}</div>
        <h2 className="mast" style={{ marginTop: 6 }}>News Galley</h2>
        <p style={{ color: 'var(--muted)' }}>Email match is case-insensitive. Steve’s desk is the live demo.</p>
        {err ? <div className="err">{err}</div> : null}
        {mode === 'register' ? (
          <>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <label>Site URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} />
          </>
        ) : null}
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <button className="btn" disabled={busy} type="submit">{busy ? 'Opening…' : mode === 'register' ? 'Create desk' : 'Open the floor'}</button>
        <p className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
          steve@stevep.uk / stevep1234<br />
          alex@northwind.studio / demo1234<br />
          desk@newsgalley.com / desk1234
        </p>
        <button
          type="button"
          className="btn ghost"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need a new desk?' : 'Already have a desk?'}
        </button>
        <p><Link to="/">Back to the masthead</Link></p>
      </form>
    </div>
  )
}
