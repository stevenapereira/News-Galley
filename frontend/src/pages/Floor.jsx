import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, setToken } from '../api.js'
import Overview from './floor/Overview.jsx'
import Dna from './floor/Dna.jsx'
import Queue from './floor/Queue.jsx'
import Article from './floor/Article.jsx'
import Pitches from './floor/Pitches.jsx'
import Ladder from './floor/Ladder.jsx'
import Mesh from './floor/Mesh.jsx'
import Ledger from './floor/Ledger.jsx'
import Admin from './floor/Admin.jsx'
import Onboarding from './floor/Onboarding.jsx'

export default function Floor() {
  const nav = useNavigate()
  const [me, setMe] = useState(null)

  useEffect(() => {
    api('/api/me').then(setMe).catch(() => {
      setToken('')
      nav('/login')
    })
  }, [nav])

  function logout() {
    setToken('')
    nav('/')
  }

  const links = [
    ['/floor', 'Floor', true],
    ['/floor/dna', 'Site DNA', false],
    ['/floor/queue', 'Queue', false],
    ['/floor/pitches', 'Pitches', false],
    ['/floor/ladder', 'DA ladder', false],
    ['/floor/mesh', 'Host & mesh', false],
    ['/floor/ledger', 'Ledger', false]
  ]

  if (me && me.user && !me.user.onboardingComplete) {
    return <Onboarding me={me} onDone={setMe} />
  }

  return (
    <div className="floor-shell">
      <aside className="rail">
        <div className="brand">News<br />Galley</div>
        <div className="mono" style={{ fontSize: 11, opacity: 0.7 }}>
          {me?.org?.name || '…'} · {me?.retainer?.name || ''}
        </div>
        <nav>
          {links.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
          {me?.user?.role === 'admin' ? (
            <NavLink to="/floor/admin" className={({ isActive }) => (isActive ? 'active' : '')}>House</NavLink>
          ) : null}
        </nav>
        <div style={{ marginTop: 28 }}>
          <button className="btn ghost" onClick={logout}>Close desk</button>
        </div>
      </aside>
      <div className="floor-main">
        <Routes>
          <Route index element={<Overview me={me} />} />
          <Route path="dna" element={<Dna />} />
          <Route path="queue" element={<Queue />} />
          <Route path="queue/:id" element={<Article />} />
          <Route path="pitches" element={<Pitches />} />
          <Route path="ladder" element={<Ladder />} />
          <Route path="mesh" element={<Mesh />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  )
}
