import { useEffect } from 'react'
import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom'
import Marketing from './pages/Marketing.jsx'
import Login from './pages/Login.jsx'
import Floor from './pages/Floor.jsx'
import { getToken } from './api.js'

function Guard({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const loc = useLocation()
  const onFloor = loc.pathname.startsWith('/floor')
  useEffect(() => {
    const look = localStorage.getItem('galley.look') || 'crew'
    document.documentElement.dataset.look = look
  }, [])
  return (
    <Routes>
      <Route path="/" element={<Marketing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/floor/*"
        element={
          <Guard>
            <Floor />
          </Guard>
        }
      />
      <Route path="*" element={onFloor ? <Navigate to="/floor" /> : <p className="site-wrap">Page not set. <Link to="/">Home</Link></p>} />
    </Routes>
  )
}
