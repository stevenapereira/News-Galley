import { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Ledger() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    const load = () => api('/api/ledger').then(setRows).catch(() => {})
    load()
    const t = setInterval(load, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <header className="floor-head">
        <div>
          <div className="kicker">Chain of custody</div>
          <h2 style={{ margin: 0 }}>Proof ledger</h2>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>When</th>
            <th>Kind</th>
            <th>Detail</th>
            <th>Hash</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="mono">{r.at.replace('T', ' ').slice(0, 19)}</td>
              <td>{r.kind}</td>
              <td>{r.detail}</td>
              <td className="hash">{r.hash.slice(0, 16)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
